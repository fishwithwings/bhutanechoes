import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';
import { stripeClient } from '../../lib/stripe';
import { getUserFromRequest } from '../../lib/auth';

export const prerender = false;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Cancel a booking and issue a Stripe refund.
 * Guides can cancel their own bookings; admins can cancel any booking.
 * Refund policy: full refund if tour is > 7 days away, 50% otherwise.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  const user = await getUserFromRequest(request, env);
  if (!user) return bad('Unauthorized.', 401);

  let body: any;
  try { body = await request.json(); } catch { return bad('Invalid request.'); }

  const bookingId = String(body.booking_id ?? '').trim();
  const reason    = String(body.reason ?? '').trim() || null;
  if (!bookingId) return bad('Missing booking_id.');

  let supabase;
  try { supabase = adminClient(env); } catch { return bad('Server not configured.', 503); }

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, guide:guides(user_id)')
    .eq('id', bookingId)
    .maybeSingle();

  if (!booking) return bad('Booking not found.');
  if (booking.status === 'cancelled' || booking.status === 'refunded') return bad('Booking is already cancelled.');
  if (!['pending', 'paid', 'completed'].includes(booking.status)) return bad('Cannot cancel this booking.');

  // Auth: guide must own the booking, or user must be admin
  const isAdmin = user.role === 'admin';
  const isGuide = (booking.guide as any)?.user_id === user.id;
  if (!isAdmin && !isGuide) return bad('You do not have permission to cancel this booking.', 403);

  // Refund policy
  const tourDate = new Date(booking.tour_date + 'T00:00:00');
  const daysUntil = Math.ceil((tourDate.getTime() - Date.now()) / 86_400_000);
  const refundPct = daysUntil >= 7 ? 100 : 50;
  const refundCents = Math.round((booking.total_price_cents * refundPct) / 100);

  let stripeRefundId: string | null = null;

  // Issue Stripe refund if a payment intent exists
  if (booking.stripe_payment_intent_id && booking.status === 'paid') {
    try {
      const stripe = stripeClient(env);
      const refund = await stripe.refunds.create({
        payment_intent: booking.stripe_payment_intent_id,
        amount: refundCents,
      });
      stripeRefundId = refund.id;
    } catch (e: any) {
      return bad('Stripe refund failed: ' + e.message, 502);
    }
  }

  await supabase.from('bookings').update({
    status: refundCents > 0 ? 'refunded' : 'cancelled',
    cancelled_at: new Date().toISOString(),
    cancel_reason: reason,
    cancel_requested_by: isAdmin ? 'admin' : 'guide',
    refund_amount_cents: refundCents,
    stripe_refund_id: stripeRefundId,
  }).eq('id', bookingId);

  return new Response(JSON.stringify({ ok: true, refundPct, refundCents }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
