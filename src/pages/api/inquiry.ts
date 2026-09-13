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

  // Route tour-specific requests only to guides who offer that tour.
  let guides: { email: string | null; name: string }[] = [];
  if (tourSlug) {
    const { data: tour } = await supabase.from('tours').select('id').eq('slug', tourSlug).maybeSingle();
    if (tour?.id) {
      const { data: matches } = await supabase
        .from('guide_tours')
        .select('guides!inner(email, name, status)')
        .eq('tour_id', tour.id)
        .eq('is_active', true)
        .eq('guides.status', 'approved');
      guides = (matches ?? []).map((row: any) => row.guides).filter(Boolean);
    }
  } else {
    const { data } = await supabase.from('guides').select('email, name').eq('status', 'approved');
    guides = data ?? [];
  }

  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  // Get admin emails from auth.users
  const adminEmails: string[] = [];
  for (const admin of admins ?? []) {
    const { data: u } = await supabase.auth.admin.getUserById(admin.id);
    if (u?.user?.email) adminEmails.push(u.user.email);
  }

  const guideEmails = guides.map((g: any) => g.email).filter(Boolean);
  const recipients = [...new Set([...guideEmails, ...adminEmails])];

  if (recipients.length === 0) {
    // Store inquiry in DB even if no recipients
  }

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
  if (RESEND_API_KEY && recipients.length > 0) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bhutan Echoes <hello@bhutanechoes.com>',
        to: recipients,
        reply_to: email,
        subject,
        html,
      }),
    });
  }

  // Save inquiry to DB
  await supabase.from('inquiries').insert({
    name, email, message: messageWithDetails, tour_slug: tourSlug, tour_name: tourName,
  }).maybeSingle();

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
