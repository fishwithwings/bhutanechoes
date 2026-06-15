import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';

export const prerender = false;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function slugify(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40) || 'guide';
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  let body: any;
  try { body = await request.json(); } catch { return bad('Invalid request.'); }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const phone = String(body.phone ?? '').trim() || null;
  const bio = String(body.bio ?? '').trim() || null;
  const license = String(body.license_number ?? '').trim() || null;
  const years = parseInt(String(body.years_experience ?? '0'), 10) || 0;
  const languages = Array.isArray(body.languages)
    ? body.languages.map((s: any) => String(s).trim()).filter(Boolean) : [];
  const certifications = Array.isArray(body.certifications)
    ? body.certifications.map((s: any) => String(s).trim()).filter(Boolean) : [];

  if (!name) return bad('Name is required.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Valid email required.');
  if (password.length < 8) return bad('Password must be at least 8 characters.');

  let supabase;
  try { supabase = adminClient(env); }
  catch { return bad('Server not configured. Set Supabase env vars.', 503); }

  // Create the auth user (pre-confirmed so they can sign in immediately).
  const { data: created, error: cErr } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (cErr || !created.user) {
    const msg = cErr?.message ?? 'Could not create account.';
    return bad(/already/i.test(msg) ? 'An account with this email already exists.' : msg);
  }
  const userId = created.user.id;

  // Unique slug
  let base = slugify(name);
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data: clash } = await supabase.from('guides').select('id').eq('slug', slug).maybeSingle();
    if (!clash) break;
    slug = `${base}-${i}`;
  }

  // Insert the guide profile (pending approval).
  const { error: gErr } = await supabase.from('guides').insert({
    user_id: userId, slug, name, email, phone, bio,
    languages, certifications, license_number: license,
    years_experience: years, status: 'pending',
  });
  if (gErr) {
    await supabase.auth.admin.deleteUser(userId);
    return bad(`Could not create guide profile: ${gErr.message}`, 500);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
