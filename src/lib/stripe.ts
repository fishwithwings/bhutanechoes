import Stripe from 'stripe';

type Env = Record<string, string | undefined> | undefined;

function key(env: Env): string {
  const k =
    env?.STRIPE_SECRET_KEY ??
    (typeof process !== 'undefined' ? process.env?.STRIPE_SECRET_KEY : undefined) ??
    (import.meta.env as any)?.STRIPE_SECRET_KEY;
  if (!k) throw new Error('Missing STRIPE_SECRET_KEY');
  return k;
}

/**
 * Stripe client configured for the Cloudflare Workers runtime (uses the fetch
 * HTTP client instead of Node's http). Safe to call in API routes only.
 */
export function stripeClient(env: Env): Stripe {
  return new Stripe(key(env), {
    apiVersion: '2025-01-27.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function envVar(env: Env, name: string, fallback?: string): string {
  const v =
    env?.[name] ??
    (typeof process !== 'undefined' ? process.env?.[name] : undefined) ??
    (import.meta.env as any)?.[name] ??
    fallback;
  if (v === undefined) throw new Error(`Missing env var: ${name}`);
  return v;
}
