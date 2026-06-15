-- ============================================================================
-- Bhutan Echoes — initial schema
-- Two-sided marketplace: guests book licensed local guides for standard tours.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "unaccent";    -- slug helpers (optional)

-- Enums ---------------------------------------------------------------------
create type user_role     as enum ('guest', 'guide', 'admin');
create type guide_status  as enum ('pending', 'approved', 'rejected', 'suspended');
create type booking_status as enum ('pending', 'paid', 'cancelled', 'completed', 'refunded');
create type difficulty    as enum ('easy', 'moderate', 'challenging', 'strenuous');

-- ============================================================================
-- profiles : 1-1 with auth.users. Holds the role. Admin is identified here.
-- ============================================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        user_role not null default 'guest',
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Convenience: is the current user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- tours : standard catalogue. Admin sets min/max price band per tour.
-- ============================================================================
create table tours (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  summary         text,                       -- short blurb for cards
  description     text,                        -- long form
  duration_days   int not null check (duration_days >= 1),
  difficulty      difficulty not null default 'moderate',
  region          text,
  -- price band is PER PERSON, in the smallest currency unit (US cents)
  min_price_cents int not null check (min_price_cents >= 0),
  max_price_cents int not null check (max_price_cents >= min_price_cents),
  max_group_size  int not null default 12 check (max_group_size >= 1),
  image_url       text,
  gallery         jsonb not null default '[]'::jsonb,
  highlights      jsonb not null default '[]'::jsonb,  -- array of strings
  is_active       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- guides : one per guide user. Includes Stripe Connect onboarding state.
-- ============================================================================
create table guides (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null unique references auth.users(id) on delete cascade,
  slug                     text unique not null,
  name                     text not null,
  email                    text,
  phone                    text,
  bio                      text,
  photo_url                text,
  languages                jsonb not null default '[]'::jsonb,  -- e.g. ["English","Dzongkha"]
  certifications           jsonb not null default '[]'::jsonb,
  license_number           text,
  years_experience         int default 0 check (years_experience >= 0),
  status                   guide_status not null default 'pending',
  rejection_reason         text,
  -- Stripe Connect
  stripe_account_id        text,
  stripe_onboarding_done   boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ============================================================================
-- guide_tours : which tours a guide offers + their per-person price.
-- Price is validated against the tour's band by a trigger (admin can move the
-- band later; this keeps stored prices honest at write time).
-- ============================================================================
create table guide_tours (
  id          uuid primary key default gen_random_uuid(),
  guide_id    uuid not null references guides(id) on delete cascade,
  tour_id     uuid not null references tours(id) on delete cascade,
  price_cents int not null check (price_cents >= 0),  -- per person
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (guide_id, tour_id)
);

create or replace function validate_guide_tour_price()
returns trigger
language plpgsql
as $$
declare
  lo int;
  hi int;
begin
  select min_price_cents, max_price_cents into lo, hi
  from tours where id = new.tour_id;

  if new.price_cents < lo or new.price_cents > hi then
    raise exception 'Price % is outside the allowed band (% - %) for this tour',
      new.price_cents, lo, hi;
  end if;
  return new;
end;
$$;

create trigger trg_validate_guide_tour_price
  before insert or update on guide_tours
  for each row execute function validate_guide_tour_price();

-- ============================================================================
-- bookings : a guest books a guide for a tour on a date. Money fields are
-- authoritative and written ONLY by the server (Edge Function), never client.
-- ============================================================================
create table bookings (
  id                       uuid primary key default gen_random_uuid(),
  tour_id                  uuid not null references tours(id),
  guide_id                 uuid not null references guides(id),
  guest_name               text not null,
  guest_email              text not null,
  guest_phone              text,
  tour_date                date not null,
  group_size               int not null check (group_size >= 1),
  -- money (US cents). total = unit_price * group_size; commission = total * pct.
  unit_price_cents         int not null,
  total_price_cents        int not null,
  commission_cents         int not null,
  guide_payout_cents       int not null,
  commission_pct           numeric(5,2) not null,
  currency                 text not null default 'usd',
  status                   booking_status not null default 'pending',
  stripe_session_id        text unique,
  stripe_payment_intent_id text,
  notes                    text,
  created_at               timestamptz not null default now()
);

create index idx_bookings_guide on bookings(guide_id);
create index idx_bookings_tour  on bookings(tour_id);
create index idx_bookings_status on bookings(status);

-- ============================================================================
-- reviews : left for a guide, optionally tied to a completed booking.
-- ============================================================================
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  guide_id    uuid not null references guides(id) on delete cascade,
  booking_id  uuid references bookings(id) on delete set null,
  author_name text not null,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

create index idx_reviews_guide on reviews(guide_id);

-- updated_at helper ---------------------------------------------------------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_guides_touch
  before update on guides
  for each row execute function touch_updated_at();
