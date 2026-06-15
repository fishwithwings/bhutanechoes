import { formatMoney, formatDate } from './format';

type Env = Record<string, string | undefined> | undefined;

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  guideName: string;
  guideEmail: string | null;
  tourName: string;
  tourDate: string;
  groupSize: number;
  totalCents: number;
  payoutCents: number;
  reviewUrl?: string;
}

async function send(env: Env, to: string, subject: string, html: string) {
  const apiKey = env?.RESEND_API_KEY;
  const from = env?.FROM_EMAIL ?? 'bookings@bhutanechoes.com';
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email to', to);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: `Bhutan Echoes <${from}>`, to, subject, html }),
  });
  if (!res.ok) console.error('[email] send failed', to, await res.text());
}

const shell = (body: string) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0B3D2E">
    <div style="background:#0B3D2E;padding:24px;text-align:center">
      <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#FAF7F0">Bhutan Echoes</span>
    </div>
    <div style="padding:28px;background:#FAF7F0">${body}</div>
    <div style="padding:18px;text-align:center;font-size:12px;color:#9b9b8e">
      Bhutan Echoes · Travel Bhutan with a licensed local guide
    </div>
  </div>`;

const detailRows = (d: BookingEmailData) => `
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
    <tr><td style="padding:6px 0;color:#5b6b62">Tour</td><td style="text-align:right;font-weight:600">${d.tourName}</td></tr>
    <tr><td style="padding:6px 0;color:#5b6b62">Guide</td><td style="text-align:right;font-weight:600">${d.guideName}</td></tr>
    <tr><td style="padding:6px 0;color:#5b6b62">Date</td><td style="text-align:right;font-weight:600">${formatDate(d.tourDate)}</td></tr>
    <tr><td style="padding:6px 0;color:#5b6b62">Group size</td><td style="text-align:right;font-weight:600">${d.groupSize}</td></tr>
  </table>`;

export async function sendBookingEmails(env: Env, d: BookingEmailData) {
  // Guest confirmation
  await send(env, d.guestEmail, `Your Bhutan tour is confirmed — ${d.tourName}`,
    shell(`
      <h2 style="font-family:Georgia,serif;margin:0 0 8px">You're booked! 🏔️</h2>
      <p style="font-size:14px;line-height:1.6">Hi ${d.guestName}, your tour with <strong>${d.guideName}</strong> is confirmed. They'll be in touch before your trip.</p>
      ${detailRows(d)}
      <div style="border-top:1px solid #e0d9c8;margin-top:16px;padding-top:12px;text-align:right;font-size:16px">
        <strong>Total paid: ${formatMoney(d.totalCents)}</strong>
      </div>
      ${d.reviewUrl ? `<div style="margin-top:20px;padding:16px;background:#fff;border-radius:8px;text-align:center">
        <p style="font-size:13px;color:#5b6b62;margin:0 0 10px">After your tour, share your experience!</p>
        <a href="${d.reviewUrl}" style="display:inline-block;background:#C8860A;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">Leave a review</a>
      </div>` : ''}
    `));

  // Guide notification
  if (d.guideEmail) {
    await send(env, d.guideEmail, `New booking — ${d.tourName}`,
      shell(`
        <h2 style="font-family:Georgia,serif;margin:0 0 8px">You have a new booking! 🎉</h2>
        <p style="font-size:14px;line-height:1.6">Hi ${d.guideName}, <strong>${d.guestName}</strong> just booked you. Reach out to them at <a href="mailto:${d.guestEmail}">${d.guestEmail}</a>.</p>
        ${detailRows(d)}
        <div style="border-top:1px solid #e0d9c8;margin-top:16px;padding-top:12px;text-align:right;font-size:16px">
          <strong>Your payout: ${formatMoney(d.payoutCents)}</strong>
        </div>
      `));
  }
}
