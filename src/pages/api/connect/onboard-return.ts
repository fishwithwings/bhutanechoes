import type { APIRoute } from 'astro';

export const prerender = false;

// Stripe redirects here after onboarding. Actual completion is confirmed via the
// account.updated webhook; we just send the guide back to their dashboard.
export const GET: APIRoute = ({ redirect }) => redirect('/dashboard?connect=return');
