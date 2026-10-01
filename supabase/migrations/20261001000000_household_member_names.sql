begin;

-- Share only display names inside an existing household. Profiles keep their
-- account-private RLS policies and the existing member RPC contract is unchanged.
create or replace function public.get_household_member_names(target_household uuid)
returns table(user_id uuid, display_name text)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;
  if not exists (
    select 1 from public.household_members as membership
    where membership.household_id = target_household and membership.user_id = caller_id
  ) then
    raise exception 'household_not_found_or_forbidden';
  end if;
  return query
  select membership.user_id, profile.display_name
  from public.household_members as membership
  left join public.profiles as profile on profile.id = membership.user_id
  where membership.household_id = target_household;
end;
$$;
revoke all on function public.get_household_member_names(uuid) from public, anon, authenticated;
grant execute on function public.get_household_member_names(uuid) to authenticated;

commit;
