-- ============================================================================
-- Storage bucket for guide profile photos. Public read; an authenticated guide
-- may upload/replace files under a folder named after their own user id.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('guide-photos', 'guide-photos', true)
on conflict (id) do nothing;

create policy "guide photos public read"
  on storage.objects for select
  using (bucket_id = 'guide-photos');

create policy "guide photos owner write"
  on storage.objects for insert
  with check (
    bucket_id = 'guide-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "guide photos owner update"
  on storage.objects for update
  using (
    bucket_id = 'guide-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
