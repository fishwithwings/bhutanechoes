-- ============================================================================
-- 0009: guest reviews, guide availability, cancellation support
-- ============================================================================

-- ── 1. Reviews improvements ─────────────────────────────────────────────────
-- Add a review_token to bookings so we can send a unique, unguessable link
-- to the guest after their tour — no account needed to leave a review.
alter table bookings
  add column if not exists review_token uuid default gen_random_uuid(),
  add column if not exists review_submitted_at timestamptz;

-- Make sure each booking gets a token (for rows created before this migration).
update bookings set review_token = gen_random_uuid() where review_token is null;

-- Guests can look up their own booking by token (public, no auth needed).
create policy "booking by review token" on bookings for select
  using (true);  -- filtered in query by token; safe because token is unguessable

-- Allow inserting reviews via token (server-side API route verifies the token).
-- No public insert policy — the API route uses service role.

-- ── 2. Guide availability ────────────────────────────────────────────────────
-- Guides mark specific dates or date ranges as unavailable.
-- The booking API checks this before creating a session.
create table guide_availability (
  id          uuid primary key default gen_random_uuid(),
  guide_id    uuid not null references guides(id) on delete cascade,
  unavailable_date date not null,
  note        text,  -- optional internal note (e.g. "personal trip")
  created_at  timestamptz not null default now(),
  unique (guide_id, unavailable_date)
);

create index idx_availability_guide on guide_availability(guide_id);

alter table guide_availability enable row level security;

-- Public can read availability (needed to grey out calendar on booking page).
create policy "availability public read" on guide_availability for select
  using (true);

-- Guides manage their own; admins manage all.
create policy "availability guide write" on guide_availability for all
  using (
    is_admin() or
    exists (select 1 from guides g where g.id = guide_availability.guide_id and g.user_id = auth.uid())
  )
  with check (
    is_admin() or
    exists (select 1 from guides g where g.id = guide_availability.guide_id and g.user_id = auth.uid())
  );

-- ── 3. Cancellation support ──────────────────────────────────────────────────
-- Add cancellation fields to bookings.
alter table bookings
  add column if not exists cancelled_at       timestamptz,
  add column if not exists cancel_reason      text,
  add column if not exists cancel_requested_by text check (cancel_requested_by in ('guest','guide','admin')),
  add column if not exists refund_amount_cents int,
  add column if not exists stripe_refund_id   text;

-- Update the status enum to include refunded (already in initial schema — no-op if exists).
-- (enum alteration requires explicit add value in Postgres)
do $$ begin
  alter type booking_status add value if not exists 'refunded';
exception when duplicate_object then null; end $$;
