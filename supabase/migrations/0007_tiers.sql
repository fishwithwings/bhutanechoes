-- ============================================================================
-- Package tiers: guests choose Basic / Classic / Luxury for each tour.
-- Prices are ALL-INCLUSIVE per person: SDF ($100/night), hotels, meals,
-- guide, transport, permits. Set by admin only.
-- ============================================================================

create type tier_key as enum ('basic', 'classic', 'luxury');

create table tour_tiers (
  id          uuid primary key default gen_random_uuid(),
  tour_id     uuid not null references tours(id) on delete cascade,
  key         tier_key not null,
  label       text not null,    -- "Essential", "Classic", "Luxury"
  tagline     text,             -- one-line pitch
  price_cents int not null check (price_cents > 0),
  includes    jsonb not null default '[]'::jsonb,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique (tour_id, key)
);

alter table tour_tiers enable row level security;

create policy "tiers public read"  on tour_tiers for select using (true);
create policy "tiers admin write"  on tour_tiers for all
  using (is_admin()) with check (is_admin());

-- Add tier_key to bookings (nullable → backfill-safe)
alter table bookings add column tier_key tier_key;

-- Guide-tours: price_cents is no longer set by guides — make it optional.
-- Existing rows keep their value; new rows can omit it. The tier drives the price.
alter table guide_tours alter column price_cents drop not null;
alter table guide_tours alter column price_cents set default null;

-- Drop the price-band trigger — it validated guide price, no longer relevant.
drop trigger if exists trg_validate_guide_tour_price on guide_tours;
drop function if exists validate_guide_tour_price();
