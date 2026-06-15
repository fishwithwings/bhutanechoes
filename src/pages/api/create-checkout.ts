import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';
import { stripeClient, envVar } from '../../lib/stripe';
import { computeBookingTotals } from '../../lib/format';

export const prerender = false;

const VALID_TIERS = ['basic', 'classic', 'luxury'] as const;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  let body: any;
  try { body = await request.json(); } catch { return bad('Invalid request.'); }

  const tourSlug  = String(body.tour_slug  ?? '');
  const guideSlug = String(body.guide_slug ?? '');
  const tierKey   = String(body.tier_key   ?? '');
  const guestName  = String(body.guest_name  ?? '').trim();
  const guestEmail = String(body.guest_email ?? '').trim();
  const guestPhone = String(body.guest_phone ?? '').trim() || null;
  const notes      = String(body.notes      ?? '').trim() || null;
  const tourDate   = String(body.tour_date  ?? '');
  const groupSize  = parseInt(String(body.group_size ?? ''), 10);

  // --- Basic validation ---------------------------------------------------
  if (!tourSlug || !guideSlug) return bad('Missing tour or guide.');
  if (!VALID_TIERS.includes(tierKey as any)) return bad('Invalid package tier.');
  if (!guestName || !guestEmail) return bad('Name and email are required.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)) return bad('Invalid email.');
  if (!tourDate || isNaN(Date.parse(tourDate))) return bad('Please choose a valid date.');
  if (new Date(tourDate) < new Date(new Date().toDateString())) return bad('Date must be in the future.');
  if (!Number.isInteger(groupSize) || groupSize < 1) return bad('Invalid group size.');

  let supabase, stripe;
  try {
    supabase = adminClient(env);
    stripe   = stripeClient(env);
  } catch {
    return bad('Payments are not configured yet. Set Supabase + Stripe env vars.', 503);
  }

  // --- Re-fetch authoritative data from DB (never trust client price) ------
  const { data: tour } = await supabase
    .from('tours').select('*').eq('slug', tourSlug).eq('is_active', true).maybeSingle();
  if (!tour) return bad('Tour not found.');

  const { data: guide } = await supabase
    .from('guides').select('*').eq('slug', guideSlug).eq('status', 'approved').maybeSingle();
  if (!guide) return bad('Guide not available.');

  const { data: gt } = await supabase
    .from('guide_tours').select('id')
    .eq('tour_id', tour.id).eq('guide_id', guide.id).eq('is_active', true).maybeSingle();
  if (!gt) return bad('This guide no longer offers this tour.');

  // Tier price is the authoritative all-inclusive unit price
  const { data: tier } = await supabase
    .from('tour_tiers').select('*')
    .eq('tour_id', tour.id).eq('key', tierKey).maybeSingle();
  if (!tier) return bad('Package tier not found for this tour.');

  if (groupSize > tour.max_group_size)
    return bad(`Group size exceeds the maximum of ${tour.max_group_size}.`);

  // --- Check guide availability --------------------------------------------
  const { data: blocked } = await supabase
    .from('guide_availability')
    .select('id')
    .eq('guide_id', guide.id)
    .eq('unavailable_date', tourDate)
    .maybeSingle();
  if (blocked) return bad('This guide is not available on the selected date. Please choose another date.');

  // --- Compute money server-side -------------------------------------------
  const commissionPct = Number(envVar(env, 'PLATFORM_COMMISSION_PCT', '15'));
  const totals = computeBookingTotals(tier.price_cents, groupSize, commissionPct);

  // --- Create pending booking -----------------------------------------------
  const { data: booking, error: insErr } = await supabase
    .from('bookings')
    .insert({
      tour_id: tour.id,
      guide_id: guide.id,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      tour_date: tourDate,
      group_size: groupSize,
      tier_key: tierKey,
      ...totals,
      currency: 'usd',
      status: 'pending',
      notes,
    })
    .select('id')
    .single();
  if (insErr || !booking) return bad('Could not create booking. Please try again.', 500);

  // --- Stripe Checkout Session ----------------------------------------------
  const siteUrl    = envVar(env, 'PUBLIC_SITE_URL', new URL(request.url).origin);
  const canTransfer = !!guide.stripe_account_id && guide.stripe_onboarding_done;
  const tierLabel = { basic: 'Essential', classic: 'Classic', luxury: 'Luxury' }[tierKey] ?? tierKey;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: guestEmail,
      line_items: [{
        quantity: groupSize,
        price_data: {
          currency: 'usd',
          unit_amount: tier.price_cents,
          product_data: {
            name: `${tour.name} — ${tierLabel} package with ${guide.name}`,
            description: `${tourDate} · ${groupSize} ${groupSize === 1 ? 'person' : 'people'} · All-inclusive`,
          },
        },
      }],
      payment_intent_data: canTransfer
        ? {
            application_fee_amount: totals.commission_cents,
            transfer_data: { destination: guide.stripe_account_id! },
            metadata: { booking_id: booking.id },
          }
        : { metadata: { booking_id: booking.id } },
      metadata: { booking_id: booking.id },
      success_url: `${siteUrl}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/book?tour=${tourSlug}&guide=${guideSlug}&tier=${tierKey}`,
    });

    await supabase.from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    await supabase.from('bookings').delete().eq('id', booking.id);
    return bad(e?.message ?? 'Payment provider error.', 502);
  }
};
