import type { APIRoute } from 'astro';
import { getTours } from '../../lib/data';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  const hasUrl = !!(env?.PUBLIC_SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL);
  const hasKey = !!(env?.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.PUBLIC_SUPABASE_ANON_KEY);

  let tours: any[] = [];
  let error: string | null = null;
  try {
    tours = await getTours(env);
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  const phobjikha = tours.find(t => t.slug === 'phobjikha-valley-tour');

  return new Response(JSON.stringify({
    hasUrl,
    hasKey,
    envUrl: env?.PUBLIC_SUPABASE_URL ?? null,
    tourCount: tours.length,
    phobjikha_min_price: phobjikha?.min_price_cents ?? null,
    error,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
