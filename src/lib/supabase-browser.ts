import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client (anon key, persisted session). Used for auth and
 * for RLS-governed reads/writes from dashboard & admin pages. Safe to ship to the
 * browser — the anon key is public by design; security comes from RLS.
 */
let _client: SupabaseClient | null = null;

export function browserClient(): SupabaseClient {
  if (_client) return _client;
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env.'
    );
  }
  _client = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return _client;
}
