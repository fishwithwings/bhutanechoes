import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';

export const prerender = false;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[char]!);
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  let body: any;
  try { body = await request.json(); } catch { return bad('Invalid request.'); }

  const name    = String(body.name ?? '').trim();
  const email   = String(body.email ?? '').trim().toLowerCase();
  const message = String(body.message ?? '').trim();
  const tourName = String(body.tour_name ?? '').trim();
  const tourSlug = String(body.tour_slug ?? '').trim();
  const travelMonth = String(body.travel_month ?? '').trim();
  const groupSize = String(body.group_size ?? '').trim();
  const packageName = String(body.package_name ?? '').trim();

  if (!name)    return bad('Name is required.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Valid email required.');
  if (!message) return bad('Message is required.');

  let supabase;
  try { supabase = adminClient(env); }
  catch { return bad('Server not configured.', 503); }

  // Configured only in the server environment: never rendered or bundled into
  // the visitor's browser.
  const inquiryEmail = env?.INQUIRY_EMAIL
    ?? process.env?.INQUIRY_EMAIL
    ?? ['wangchukpartners', 'gmail.com'].join('@');

  // Send email via Supabase (uses configured SMTP)
  const subject = `New inquiry: ${tourName || 'a tour'}`;
  const details = [
    travelMonth ? `Travel month: ${travelMonth}` : '',
    groupSize ? `Group size: ${groupSize}` : '',
    packageName ? `Package: ${packageName}` : '',
  ].filter(Boolean);
  const messageWithDetails = details.length ? `${details.join('\n')}\n\n${message}` : message;
  const html = `
    <h2>New tour inquiry</h2>
    <p><strong>Tour:</strong> ${escapeHtml(tourName || 'Help me choose')}</p>
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    ${travelMonth ? `<p><strong>Travel month:</strong> ${escapeHtml(travelMonth)}</p>` : ''}
    ${groupSize ? `<p><strong>Group size:</strong> ${escapeHtml(groupSize)}</p>` : ''}
    ${packageName ? `<p><strong>Package:</strong> ${escapeHtml(packageName)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <blockquote style="border-left:3px solid #C8860A;padding-left:12px;color:#444">${escapeHtml(message).replace(/\n/g, '<br>')}</blockquote>
    <p style="margin-top:16px"><a href="mailto:${escapeHtml(email)}">Reply to ${escapeHtml(name)}</a></p>
    <hr/>
    <p style="font-size:12px;color:#888">Sent via Bhutan Echoes · <a href="https://bhutanechoes.com/${tourSlug ? `tours/${encodeURIComponent(tourSlug)}` : 'plan'}">${tourSlug ? 'View tour' : 'View trip planner'}</a></p>
  `;

  // Use fetch to Resend API directly
  const RESEND_API_KEY = env?.RESEND_API_KEY ?? process.env?.RESEND_API_KEY;
  let deliveryError = '';
  if (!RESEND_API_KEY || !inquiryEmail) {
    deliveryError = 'Email delivery is not configured.';
  } else {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bhutan Echoes <hello@bhutanechoes.com>',
        to: [inquiryEmail],
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!emailResponse.ok) deliveryError = 'Email delivery failed.';
  }

  // Save inquiry to DB
  const { error: saveError } = await supabase.from('inquiries').insert({
    name, email, message: messageWithDetails, tour_slug: tourSlug, tour_name: tourName,
  }).maybeSingle();

  // If Resend is temporarily unavailable, the lead remains recoverable from
  // the inquiries table instead of being lost.
  if (deliveryError && saveError) return bad('Could not send your request. Please try again.', 503);
  if (deliveryError) console.error(`[inquiry] ${deliveryError} Inquiry saved for follow-up.`);

  return new Response(JSON.stringify({ ok: true, emailed: !deliveryError }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
