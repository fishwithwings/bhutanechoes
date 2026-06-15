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

  // Also query tiers and tours table directly
  const { publicClient } = await import('../../lib/supabase');
  const client = publicClient(env);
  const { data: tiersData, error: tiersError } = await client
    .from('tour_tiers').select('tour_id, price_cents').limit(5);
  const { data: tourRow } = await client
    .from('tours').select('slug, min_price_cents').eq('slug', 'phobjikha-valley-tour').maybeSingle();

  return new Response(JSON.stringify({
    hasUrl,
    hasKey,
    tourCount: tours.length,
    phobjikha_min_price: phobjikha?.min_price_cents ?? null,
    phobjikha_db_row: tourRow,
    tiers_sample: tiersData,
    tiers_error: tiersError?.message ?? null,
    error,
  }, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
