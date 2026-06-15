import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';
import { stripeClient, envVar } from '../../lib/stripe';
import { sendBookingEmails } from '../../lib/email';

export const prerender = false;

/**
 * Stripe webhook. The source of truth for marking a booking paid — we do NOT
 * trust the browser redirect. Verifies the signature, then on
 * checkout.session.completed flips the booking to 'paid' and sends emails.
 *
 * Configure the endpoint in Stripe to POST here and set STRIPE_WEBHOOK_SECRET.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const sig = request.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  let stripe, secret;
  try {
    stripe = stripeClient(env);
    secret = envVar(env, 'STRIPE_WEBHOOK_SECRET');
  } catch {
    return new Response('Stripe not configured', { status: 503 });
  }

  const payload = await request.text();
  let event;
  try {
    // async variant required on Workers (SubtleCrypto)
    event = await stripe.webhooks.constructEventAsync(payload, sig, secret);
  } catch (e: any) {
    return new Response(`Webhook signature verification failed: ${e.message}`, { status: 400 });
  }

  const supabase = adminClient(env);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.booking_id;
    if (!bookingId) return new Response('ok', { status: 200 });

    // Mark paid (idempotent: only update if still pending)
    const { data: booking } = await supabase
      .from('bookings')
      .update({
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent ?? null,
      })
      .eq('id', bookingId)
      .eq('status', 'pending')
      .select('*, tour:tours(name), guide:guides(name, email), review_token')
      .maybeSingle();

    // Only send emails if we actually transitioned it (avoids duplicates on retries)
    if (booking) {
      try {
        const siteUrl = env?.PUBLIC_SITE_URL ?? '';
        const reviewUrl = booking.review_token ? `${siteUrl}/review/${booking.review_token}` : undefined;
        await sendBookingEmails(env, {
          guestName: booking.guest_name,
          guestEmail: booking.guest_email,
          guideName: (booking as any).guide?.name ?? 'your guide',
          guideEmail: (booking as any).guide?.email ?? null,
          tourName: (booking as any).tour?.name ?? 'your tour',
          tourDate: booking.tour_date,
          groupSize: booking.group_size,
          totalCents: booking.total_price_cents,
          payoutCents: booking.guide_payout_cents,
          reviewUrl,
        });
      } catch (e) {
        console.error('[webhook] email error', e);
      }
    }
  }

  // Connect onboarding progress — flip the guide's onboarding flag once their
  // account can actually receive transfers.
  if (event.type === 'account.updated') {
    const account = event.data.object as any;
    const done = !!(account.payouts_enabled && account.details_submitted);
    await supabase
      .from('guides')
      .update({ stripe_onboarding_done: done })
      .eq('stripe_account_id', account.id);
  }

  return new Response('ok', { status: 200 });
};
