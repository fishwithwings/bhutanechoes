import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';

export const prerender = false;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Guest submits a review via their unique review_token (sent in the post-tour
 * email). No auth required — security comes from the unguessable UUID token.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  let body: any;
  try { body = await request.json(); } catch { return bad('Invalid request.'); }

  const token   = String(body.token   ?? '').trim();
  const rating  = parseInt(String(body.rating ?? ''), 10);
  const comment = String(body.comment ?? '').trim() || null;
  const authorName = String(body.author_name ?? '').trim();

  if (!token) return bad('Missing review token.');
  if (!authorName) return bad('Name is required.');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return bad('Rating must be 1–5.');

  let supabase;
  try { supabase = adminClient(env); }
  catch { return bad('Server not configured.', 503); }

  // Look up the booking by token
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, guide_id, status, review_submitted_at, guest_name, tour_date')
    .eq('review_token', token)
    .maybeSingle();

  if (!booking) return bad('Invalid or expired review link.');
  if (booking.review_submitted_at) return bad('You have already submitted a review for this booking.');
  if (!['paid', 'completed'].includes(booking.status)) return bad('Reviews can only be submitted for completed bookings.');

  // Only allow reviews after the tour date has passed
  if (new Date(booking.tour_date) > new Date()) return bad('You can submit a review after your tour date.');

  // Insert the review
  const { error: revErr } = await supabase.from('reviews').insert({
    guide_id: booking.guide_id,
    booking_id: booking.id,
    author_name: authorName || booking.guest_name,
    rating,
    comment,
    is_published: true,
  });
  if (revErr) return bad('Could not save review. Please try again.', 500);

  // Mark as reviewed so they can't submit twice
  await supabase.from('bookings')
    .update({ review_submitted_at: new Date().toISOString() })
    .eq('id', booking.id);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
