-- ============================================================================
-- Prevent privilege escalation: a normal user must not be able to promote
-- themselves by updating profiles.role. Only an existing admin (or a trusted
-- server using the service role / the SQL editor, where auth.uid() is null) may
-- change a role. Guide identity comes from owning a row in `guides`, not from
-- the role column, so guides never need to self-assign a role.
-- ============================================================================
create or replace function guard_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null      -- a logged-in end user...
     and not is_admin() then          -- ...who is not an admin
    raise exception 'Only an admin may change a user role';
  end if;
  return new;
end;
$$;

create trigger trg_guard_role_change
  before update on profiles
  for each row execute function guard_role_change();

-- Bootstrap the first admin once, in the Supabase SQL editor (auth.uid() is null
-- there, so the guard allows it). Replace the email:
--   update profiles set role = 'admin' where email = 'you@example.com';
