import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env ?? {};
  return new Response(JSON.stringify({
    has_url: !!env.PUBLIC_SUPABASE_URL,
    has_anon: !!env.PUBLIC_SUPABASE_ANON_KEY,
    has_service: !!env.SUPABASE_SERVICE_ROLE_KEY,
    keys: Object.keys(env),
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
