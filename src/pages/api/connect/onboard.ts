import type { APIRoute } from 'astro';
import { adminClient } from '../../../lib/supabase';
import { stripeClient, envVar } from '../../../lib/stripe';
import { getUserFromRequest } from '../../../lib/auth';

export const prerender = false;

function bad(error: string, status = 400) {
  return new Response(JSON.stringify({ error }), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Create (if needed) the guide's Stripe Connect Express account and return an
 * onboarding account link to redirect them to. Requires the guide to be logged
 * in (Bearer token).
 *
 * NOTE: Stripe Connect availability depends on the platform's country and the
 * guide's country. Bhutan may not be a supported payout country in Stripe; set
 * STRIPE_CONNECT_COUNTRY to a supported country code for testing (defaults US).
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;

  const user = await getUserFromRequest(request, env);
  if (!user) return bad('Not authenticated.', 401);

  let supabase, stripe;
  try { supabase = adminClient(env); stripe = stripeClient(env); }
  catch { return bad('Stripe not configured.', 503); }

  const { data: guide } = await supabase
    .from('guides').select('*').eq('user_id', user.id).maybeSingle();
  if (!guide) return bad('Guide profile not found.', 404);

  let accountId = guide.stripe_account_id as string | null;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: envVar(env, 'STRIPE_CONNECT_COUNTRY', 'US'),
      email: guide.email ?? user.email ?? undefined,
      business_type: 'individual',
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      metadata: { guide_id: guide.id },
    });
    accountId = account.id;
    await supabase.from('guides').update({ stripe_account_id: accountId }).eq('id', guide.id);
  }

  const siteUrl = envVar(env, 'PUBLIC_SITE_URL', new URL(request.url).origin);
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/api/connect/onboard-return`,
    return_url: `${siteUrl}/api/connect/onboard-return`,
    type: 'account_onboarding',
  });

  return new Response(JSON.stringify({ url: link.url }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
