import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Two Supabase clients:
 *
 *  - `publicClient` uses the ANON key and is safe to use anywhere (server render
 *    of public pages, or shipped to the browser). It is bound by RLS.
 *
 *  - `adminClient(env)` uses the SERVICE ROLE key and BYPASSES RLS. Use it ONLY
 *    inside server endpoints (src/pages/api/**, Edge Functions) for trusted
 *    operations: writing bookings, approving guides, etc. NEVER import it into a
 *    component that renders to the browser.
 *
 * On Cloudflare, runtime env vars arrive via the request `locals.runtime.env`,
 * not `process.env`. We accept an `env` bag so callers can pass either.
 */

type EnvBag = Record<string, string | undefined>;

function readEnv(env: EnvBag | undefined, key: string): string {
  const v =
    env?.[key] ??
    (typeof process !== 'undefined' ? process.env?.[key] : undefined) ??
    // Astro inlines PUBLIC_* at build for import.meta.env
    (import.meta.env as Record<string, string | undefined>)?.[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

export function publicClient(env?: EnvBag): SupabaseClient {
  return createClient(
    readEnv(env, 'PUBLIC_SUPABASE_URL'),
    readEnv(env, 'PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { persistSession: false } }
  );
}

export function adminClient(env?: EnvBag): SupabaseClient {
  // Try new secret key format first, fall back to legacy service role key
  let key: string;
  try { key = readEnv(env, 'SUPABASE_SECRET_KEY'); }
  catch { key = readEnv(env, 'SUPABASE_SERVICE_ROLE_KEY'); }
  return createClient(
    readEnv(env, 'PUBLIC_SUPABASE_URL'),
    key,
    { auth: { persistSession: false } }
  );
}
