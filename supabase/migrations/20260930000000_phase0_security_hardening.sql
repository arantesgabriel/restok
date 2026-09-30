-- Phase 0: contain arbitrary household membership and reduce the exposed API
-- surface. Existing membership rows are intentionally preserved for review.

begin;

-- RLS policies now check the caller's own membership row directly. This avoids
-- exposing SECURITY DEFINER membership/list lookup helpers as PostgREST RPCs.
drop policy if exists "profiles are visible to authenticated users" on public.profiles;
drop policy if exists "users can create their profile" on public.profiles;
drop policy if exists "users can update their profile" on public.profiles;
drop policy if exists "members can view their households" on public.households;
drop policy if exists "users can create households" on public.households;
drop policy if exists "owners can update households" on public.households;
drop policy if exists "members can view membership" on public.household_members;
drop policy if exists "members can add membership" on public.household_members;
drop policy if exists "owners can remove membership" on public.household_members;
drop policy if exists "members can create invites" on public.household_invites;
drop policy if exists "members can view invites" on public.household_invites;
drop policy if exists "members can manage categories" on public.categories;
drop policy if exists "members can manage products" on public.products;
drop policy if exists "members can view shopping lists" on public.shopping_lists;
drop policy if exists "members can create shopping lists" on public.shopping_lists;
drop policy if exists "members can update shopping lists" on public.shopping_lists;
drop policy if exists "members can delete shopping lists" on public.shopping_lists;
drop policy if exists "members can manage list items" on public.shopping_list_items;

-- A profile is private to its account until a product rule requires sharing it.
create policy "users can view their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "users can create their profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "users can update their profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "members can view their households"
  on public.households for select to authenticated
  using (
    created_by = (select auth.uid())
    or exists (
      select 1
      from public.household_members as membership
      where membership.household_id = households.id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "users can create households"
  on public.households for insert to authenticated
  with check (created_by = (select auth.uid()));

create policy "owners can update households"
  on public.households for update to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

-- The only direct membership insert is the initial owner row for a household
-- created by the same caller. Invite acceptance uses a fixed-role RPC below.
create policy "users can view their own memberships"
  on public.household_members for select to authenticated
  using (user_id = (select auth.uid()));

create policy "household creators can add themselves as owner"
  on public.household_members for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'owner'
    and exists (
      select 1
      from public.households as household
      where household.id = household_members.household_id
        and household.created_by = (select auth.uid())
    )
  );

create policy "owners can remove membership"
  on public.household_members for delete to authenticated
  using (
    exists (
      select 1
      from public.households as household
      where household.id = household_members.household_id
        and household.created_by = (select auth.uid())
    )
  );

-- Invites are accessed only through the authenticated, token-validating RPCs;
-- members no longer receive raw bearer tokens through table SELECT.
create policy "members can manage categories"
  on public.categories for all to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = categories.household_id
        and membership.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = categories.household_id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "members can manage products"
  on public.products for all to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = products.household_id
        and membership.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = products.household_id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "members can view shopping lists"
  on public.shopping_lists for select to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = shopping_lists.household_id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "members can create shopping lists"
  on public.shopping_lists for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1
      from public.household_members as membership
      where membership.household_id = shopping_lists.household_id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "members can update shopping lists"
  on public.shopping_lists for update to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = shopping_lists.household_id
        and membership.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = shopping_lists.household_id
        and membership.user_id = (select auth.uid())
    )
  );

create policy "members can delete shopping lists"
  on public.shopping_lists for delete to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = shopping_lists.household_id
        and membership.user_id = (select auth.uid())
    )
  );

-- The parent list's SELECT policy scopes this lookup to a household the caller
-- belongs to, so no SECURITY DEFINER list-to-household RPC is needed.
create policy "members can manage list items"
  on public.shopping_list_items for all to authenticated
  using (
    exists (
      select 1
      from public.shopping_lists as parent_list
      where parent_list.id = shopping_list_items.shopping_list_id
    )
  )
  with check (
    exists (
      select 1
      from public.shopping_lists as parent_list
      where parent_list.id = shopping_list_items.shopping_list_id
    )
  );

-- Retire the publicly addressable SECURITY DEFINER helpers after removing all
-- policy dependencies on them.
drop function if exists public.household_for_list(uuid);
drop function if exists public.is_household_member(uuid);

-- Pin SECURITY DEFINER functions to trusted schemas and require an authenticated
-- caller. Invite acceptance always creates a member; the client cannot choose
-- a role, and membership rows cannot be read to retrieve invite tokens.
create or replace function public.create_household_invite()
returns text
language plpgsql
security definer
set search_path = pg_catalog, public, auth, extensions
as $$
declare
  caller_id uuid := auth.uid();
  member_household uuid;
  invite_token text;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  select membership.household_id
    into member_household
  from public.household_members as membership
  join public.households as household
    on household.id = membership.household_id
  where membership.user_id = caller_id
    and household.created_by = caller_id
  order by membership.created_at
  limit 1;

  if member_household is null then
    raise exception 'household_not_found';
  end if;

  invite_token := encode(gen_random_bytes(18), 'hex');
  insert into public.household_invites (household_id, token, created_by)
  values (member_household, invite_token, caller_id);
  return invite_token;
end;
$$;

create or replace function public.accept_household_invite(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  invited_household uuid;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  select invite.household_id
    into invited_household
  from public.household_invites as invite
  where invite.token = $1
    and invite.expires_at > now();

  if invited_household is null then
    raise exception 'invite_invalid_or_expired';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (invited_household, caller_id, 'member')
  on conflict (household_id, user_id) do nothing;

  return invited_household;
end;
$$;

-- The trigger helper is not an application RPC.
revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.create_household_invite() from public, anon, authenticated;
revoke all on function public.accept_household_invite(text) from public, anon, authenticated;
grant execute on function public.create_household_invite() to authenticated;
grant execute on function public.accept_household_invite(text) to authenticated;

-- Replace blanket CRUD grants with the operations supported by current RLS.
revoke all on all tables in schema public from public, anon, authenticated;
revoke all on schema public from public, anon;
grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.households to authenticated;
grant select, insert, delete on public.household_members to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.shopping_lists to authenticated;
grant select, insert, update, delete on public.shopping_list_items to authenticated;

commit;
