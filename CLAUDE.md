# Bhutan Echoes — project context

Tour marketplace: travelers book Bhutan tours directly with licensed local
guides. Astro (server output, Cloudflare Pages adapter) + Supabase (Postgres +
auth) + Stripe Connect (guides get paid directly, platform takes a commission).
Sister site: trekbhutan.com (separate repo, same owner, trekking-focused).

## Architecture notes

- `output: 'server'` in `astro.config.mjs`, but individual pages opt into
  static prerendering (`export const prerender = true`) — home, about,
  for-guides, travel-guide articles. Tour/guide listing and detail pages are
  SSR (`prerender = false`) because prices must always match the DB live
  (see git history: "Fix tour listing prices" — earlier version had
  mismatched cached prices).
- Supabase: **RLS alone is not enough** — the `anon` role also needs
  table-level SELECT grants, or public pages silently show stale/seed data
  instead of real data. Bit us once already.
- Tour images are stored as raw Unsplash CDN URLs in `tours.image_url`. They
  must be the full CDN path (`photo-1743402063949-ad3c824c2484`), not an
  Unsplash *page slug* (`photo-uMbGXBy7bKs`) — the latter 404s. All 10 live
  tours had this exact bug in Sept 2026; fixed via
  `supabase/migrations/0011_fix_broken_tour_images.sql`. If a newly-added
  tour's image is broken, check this first.
- Canonical domain is `bhutanechoes.com` (real), not the Cloudflare Pages
  default `bhutanechoes.pages.dev` — `astro.config.mjs`'s `site` field and
  `Layout.astro`'s canonical URL must both point at the real domain.

## SEO state (as of Sept 2026)

- Site was not indexed by Google at all until mid-Sept 2026. As of the last
  check: 20 pages indexed, 12 not (mostly normal "Discovered, not yet
  crawled" backlog for a young site — not errors needing action, see GSC
  Page Indexing report for current status).
- `/tours/black-necked-crane-festival-9d` was crawled once and rejected
  (not indexed) — this happened while images were still 404ing, likely why.
  Re-request indexing there if it's still unindexed after a while.
- Every tour page now cross-links ~3 related tours ("You might also like")
  and guide pages link tour names directly to `/tours/{slug}` (not just via
  `/book?tour=...` query URLs) — both added specifically to strengthen
  internal link signals for indexing.
- "Bhutan Echoes" as a brand name collides with an existing, well-known
  Bhutanese literature festival (Drukyul's Literature Festival) — branded
  search traffic will likely go to them, not this site. Worth knowing before
  investing heavily in brand-name content marketing.
- Footer and the travel-guide "best time to visit" article both link to
  trekbhutan.com (sister site) — legitimate cross-promotion, not expected to
  meaningfully move SEO rankings on its own.

## Known open item

- `npm audit` (Sept 2026): 1 critical / 12 high vulnerabilities, mostly in
  `astro` itself (XSS vectors, AVIF RCE, host-header SSRF) and
  `@astrojs/cloudflare` (SSRF). Fix requires `npm audit fix --force`
  (astro 7.2.7→7.3.5, @astrojs/cloudflare 13.1.9→14.3.3 — breaking-ish
  version bumps) followed by a full manual test pass (booking flow, admin
  panel, guide registration) before trusting it. Not yet done as of this
  writing.

## Dev setup

- `.env` is gitignored (secrets: Supabase, Stripe, Resend keys) — copy
  `.env.example` and fill in real values per-machine, never commit it.
- `npm run dev` → `http://localhost:4321`.
- Working across multiple machines: git is the only sync mechanism: `git
  pull` before starting, `git push` after finishing. No shared session
  state beyond git — `.env` must be set up independently on each machine.
