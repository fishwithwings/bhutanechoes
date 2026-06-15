# Bhutan Echoes

A two-sided marketplace connecting travelers with **licensed local Bhutanese guides**.
Tourists browse standard tours, pick a guide, and book + pay online. Guides set
their own price (within an admin-defined band) and receive payouts via Stripe
Connect. The platform keeps a commission on every booking.

> **Status:** fully scaffolded and working end-to-end against bundled demo data.
> Connect Supabase + Stripe (below) to go live. The site renders and is browsable
> with **zero** configuration thanks to a seed-data fallback.

---

## Tech stack (built to cost ~$0 → <$30/mo)

| Concern            | Choice                                  | Cost |
| ------------------ | --------------------------------------- | ---- |
| Frontend + backend | **Astro** (SSR) on **Cloudflare Pages** | Free |
| Database + Auth + Storage | **Supabase**                     | Free → $25/mo |
| Server API         | Astro API routes = Cloudflare Functions | Free |
| Payments           | **Stripe Connect** (Express)            | Per-transaction |
| Transactional email| **Resend**                              | Free (3k/mo) |

> The brief mentioned Supabase Edge Functions for the backend. Since we're on
> Cloudflare already, the payment/booking logic lives in **Astro API routes**
> (`src/pages/api/*`) which deploy as Cloudflare Pages Functions — same security
> model (service-role key, server-only), but one codebase and one deploy.

---

## Architecture & security model

- **Public pages** (home, tours, tour detail, guide profiles) are server-rendered
  for SEO. They read via the Supabase **anon** key, governed by Row Level Security.
- **The browser is untrusted.** All money is computed **server-side**:
  - `POST /api/create-checkout` re-fetches the tour, guide and price from the DB,
    recomputes the total + commission ([`computeBookingTotals`](src/lib/format.ts)),
    writes a `pending` booking with the **service-role** key (RLS-bypassing), then
    opens a Stripe Checkout Session. The client price is never trusted.
  - `POST /api/stripe-webhook` is the **source of truth** for "paid" — it verifies
    the Stripe signature, flips the booking to `paid`, and emails guest + guide.
- **Dashboards & admin** are auth-gated client pages. Reads and owner/admin writes
  go straight through the anon client and are enforced by **RLS** — e.g. a guide
  can only edit their own row, an admin can approve guides. Only Stripe-secret
  operations (Connect onboarding) use a server route.
- **Privilege escalation is blocked**: a trigger ([0004](supabase/migrations/0004_role_guard.sql))
  prevents a user from changing their own `role`. Guide identity comes from owning
  a row in `guides`, not from the role column. Admin is the only special role.

### Pricing model
Prices are **per person**. `total = guide_price × group_size`,
`commission = total × PLATFORM_COMMISSION_PCT`, `guide_payout = total − commission`.

---

## Project layout

```
src/
  components/      Header, Footer, TourCard, GuideCard, StarRating
  layouts/         Layout.astro (nav + footer shell)
  lib/
    supabase.ts          public (anon) + admin (service-role) server clients
    supabase-browser.ts  browser client (auth, RLS reads/writes)
    data.ts              read layer — Supabase first, seed-data fallback
    seed-data.ts         bundled demo tours/guides so the site runs unconfigured
    stripe.ts            Stripe client (Workers fetch http client)
    auth.ts              verify Bearer token on API routes
    email.ts             Resend transactional emails
    format.ts            money/date helpers + commission math
    types.ts             shared TS types
  pages/
    index, tours/, guides/, about, for-guides, book, booking/confirmed, 404
    login, register, dashboard, admin
    api/  create-checkout, stripe-webhook, register-guide,
          connect/onboard, connect/onboard-return
supabase/migrations/
    0001_init.sql     tables + enums + triggers
    0002_rls.sql      Row Level Security policies
    0003_seed.sql     the 6 standard tours
    0004_role_guard.sql  anti-escalation trigger
    0005_storage.sql  guide-photos bucket + policies
```

---

## Local development

```bash
npm install
npm run dev          # http://localhost:4321  (works with demo data, no config)
```

To run against real services, copy `.env.example` → `.env` and fill it in.

---

## Going live

### 1. Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run the migrations **in order**: `0001` → `0005`
   (`supabase/migrations/*.sql`).
3. Project Settings → API: copy the **Project URL**, **anon key**, **service_role key**.
4. Create your own account by registering as a guide (or via the Auth dashboard),
   then make yourself admin in the SQL editor:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```

### 2. Stripe
1. Create a Stripe account, enable **Connect** (Express).
2. Copy the **secret key** and **publishable key** (test mode to start).
3. Add a webhook endpoint → `https://YOUR_SITE/api/stripe-webhook`, subscribe to
   `checkout.session.completed` and `account.updated`; copy the **signing secret**.
4. `PLATFORM_COMMISSION_PCT` controls your cut (e.g. `15`).
5. Bhutan may not be a supported Connect payout country — set
   `STRIPE_CONNECT_COUNTRY` to a supported code for testing.

### 3. Resend (email)
Create an account, verify your sending domain, copy the API key → `RESEND_API_KEY`,
set `FROM_EMAIL`.

### 4. Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist   # or connect the repo in the Cloudflare dashboard
```
Set all the env vars from `.env.example` in the Pages project settings
(Production + Preview). Set `PUBLIC_SITE_URL` to your deployed URL.

---

## End-to-end flow

1. Guest browses `/tours` → opens a tour → sees approved guides + per-person prices.
2. Picks a guide → `/book` → date + group size (live total) → **Continue to payment**.
3. `create-checkout` recomputes price, writes a pending booking, opens Stripe Checkout.
4. Guest pays → Stripe → `stripe-webhook` marks booking **paid**, emails both parties.
5. Guide sees the booking + payout in `/dashboard`; admin sees everything in `/admin`.
```
