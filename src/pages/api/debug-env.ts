import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env ?? {};
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return new Response(JSON.stringify({
    has_url: !!env.PUBLIC_SUPABASE_URL,
    has_anon: !!env.PUBLIC_SUPABASE_ANON_KEY,
    has_service: !!serviceKey,
    service_key_prefix: serviceKey.slice(0, 12),
    service_key_length: serviceKey.length,
    anon_key_prefix: (env.PUBLIC_SUPABASE_ANON_KEY ?? '').slice(0, 12),
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
