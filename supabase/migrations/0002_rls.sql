-- ============================================================================
-- Row Level Security
--
-- Threat model: the browser uses the ANON key and is fully untrusted. Anything
-- sensitive (writing bookings/money, approving guides) goes through Edge
-- Functions using the SERVICE ROLE key, which BYPASSES RLS. So these policies
-- govern only what the public client may read/write directly.
-- ============================================================================

alter table profiles    enable row level security;
alter table tours       enable row level security;
alter table guides      enable row level security;
alter table guide_tours enable row level security;
alter table bookings    enable row level security;
alter table reviews     enable row level security;

-- ---- profiles -------------------------------------------------------------
-- A user can see/update only their own profile. Admins see all.
create policy "own profile read"  on profiles for select
  using (auth.uid() = id or is_admin());
create policy "own profile update" on profiles for update
  using (auth.uid() = id);

-- ---- tours ----------------------------------------------------------------
-- Anyone may read active tours. Only admins write (and admin UI uses service key,
-- but we also allow it here for an authenticated admin session).
create policy "tours public read" on tours for select
  using (is_active or is_admin());
create policy "tours admin write" on tours for all
  using (is_admin()) with check (is_admin());

-- ---- guides ---------------------------------------------------------------
-- Public may read APPROVED guides. A guide may read/update their own row
-- regardless of status. Admins see all.
create policy "guides public read" on guides for select
  using (status = 'approved' or user_id = auth.uid() or is_admin());
create policy "guide insert own" on guides for insert
  with check (user_id = auth.uid());
create policy "guide update own" on guides for update
  using (user_id = auth.uid() or is_admin());

-- ---- guide_tours ----------------------------------------------------------
-- Public may read active offerings of approved guides. A guide manages their own.
create policy "guide_tours public read" on guide_tours for select
  using (
    is_admin()
    or exists (
      select 1 from guides g
      where g.id = guide_tours.guide_id
        and (g.user_id = auth.uid() or g.status = 'approved')
    )
  );
create policy "guide_tours manage own" on guide_tours for all
  using (
    exists (select 1 from guides g where g.id = guide_tours.guide_id and g.user_id = auth.uid())
    or is_admin()
  )
  with check (
    exists (select 1 from guides g where g.id = guide_tours.guide_id and g.user_id = auth.uid())
    or is_admin()
  );

-- ---- bookings -------------------------------------------------------------
-- No public read (contains PII + money). A guide sees bookings for themselves.
-- Admin sees all. Writes happen via service-role Edge Functions only — there is
-- intentionally NO insert/update policy for the anon/auth client.
create policy "bookings guide read" on bookings for select
  using (
    is_admin()
    or exists (select 1 from guides g where g.id = bookings.guide_id and g.user_id = auth.uid())
  );

-- ---- reviews --------------------------------------------------------------
-- Public reads published reviews. Inserts go through a server function so we can
-- tie them to genuine completed bookings; no public insert policy.
create policy "reviews public read" on reviews for select
  using (is_published or is_admin());
create policy "reviews admin write" on reviews for all
  using (is_admin()) with check (is_admin());
