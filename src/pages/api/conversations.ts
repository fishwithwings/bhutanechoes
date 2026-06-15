import type { APIRoute } from 'astro';
import { adminClient } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  let body: any;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400 });
  }

  const { guest_user_id, guide_id, tour_slug } = body;
  if (!guest_user_id || !guide_id) {
    return new Response(JSON.stringify({ error: 'Missing fields.' }), { status: 400 });
  }

  let supabase;
  try { supabase = adminClient(env); }
  catch { return new Response(JSON.stringify({ error: 'Server not configured.' }), { status: 503 }); }

  // Upsert conversation (unique per guest+guide+tour)
  const { data, error } = await supabase
    .from('conversations')
    .upsert({ guest_user_id, guide_id, tour_slug: tour_slug ?? null },
             { onConflict: 'guest_user_id,guide_id,tour_slug', ignoreDuplicates: false })
    .select('id')
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ id: data.id }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
