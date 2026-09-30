-- Phase 2: household selection, canonical roles, and atomic membership/invite
-- lifecycle. `created_by` remains provenance; membership role is authority.

begin;

drop policy if exists "members can view their households" on public.households;
drop policy if exists "users can create households" on public.households;
drop policy if exists "owners can update households" on public.households;
drop policy if exists "household creators can add themselves as owner" on public.household_members;
drop policy if exists "owners can remove membership" on public.household_members;

create policy "members can view their households"
  on public.households for select to authenticated
  using (
    exists (
      select 1
      from public.household_members as membership
      where membership.household_id = households.id
        and membership.user_id = (select auth.uid())
    )
  );

-- Membership and household creation/changes go through checked RPCs only.
revoke all on public.households, public.household_members, public.household_invites
  from public, anon, authenticated;
grant select on public.households, public.household_members to authenticated;

create or replace function public.create_household(requested_name text default 'Minha casa')
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  clean_name text := btrim(requested_name);
  created_household uuid;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;
  if clean_name is null or clean_name = '' or char_length(clean_name) > 80 then
    raise exception 'invalid_household_name';
  end if;

  insert into public.households (name, created_by)
  values (clean_name, caller_id)
  returning id into created_household;

  insert into public.household_members (household_id, user_id, role)
  values (created_household, caller_id, 'owner');

  return created_household;
end;
$$;

create or replace function public.create_household_invite(target_household uuid)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public, auth, extensions
as $$
declare
  caller_id uuid := auth.uid();
  invite_token text;
  active_invite_count integer;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  perform household.id from public.households as household
  join public.household_members as membership
    on membership.household_id = household.id
    and membership.user_id = caller_id
    and membership.role in ('owner', 'admin')
  where household.id = target_household
  for update of household;
  if not found then
    raise exception 'invite_not_allowed';
  end if;

  select count(*) into active_invite_count
  from public.household_invites as invite
  where invite.household_id = target_household
    and invite.expires_at > now()
    and invite.consumed_at is null
    and invite.revoked_at is null;
  if active_invite_count >= 10 then
    raise exception 'active_invite_limit_reached';
  end if;

  invite_token := encode(gen_random_bytes(18), 'hex');
  insert into public.household_invites (household_id, token_hash, created_by, expires_at)
  values (
    target_household,
    encode(digest(convert_to(invite_token, 'UTF8'), 'sha256'), 'hex'),
    caller_id,
    now() + interval '14 days'
  );
  return invite_token;
end;
$$;

-- Keep already-open clients working until they load the explicit-house API.
-- The selected house is deterministic and authorization still comes from role.
create or replace function public.create_household_invite()
returns text
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  member_household uuid;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  select membership.household_id into member_household
  from public.household_members as membership
  where membership.user_id = caller_id
    and membership.role in ('owner', 'admin')
  order by membership.created_at, membership.household_id
  limit 1;

  if member_household is null then
    raise exception 'invite_not_allowed';
  end if;
  return public.create_household_invite(member_household);
end;
$$;

create or replace function public.accept_household_invite(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth, extensions
as $$
declare
  caller_id uuid := auth.uid();
  invited_household uuid;
  invite_expires_at timestamptz;
  invite_revoked_at timestamptz;
  invite_consumed_at timestamptz;
  inserted_rows integer;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;
  if invite_token is null or invite_token !~ '^[0-9a-f]{36}$' then
    raise exception 'invite_invalid_or_unavailable';
  end if;

  select invite.household_id, invite.expires_at, invite.revoked_at, invite.consumed_at
    into invited_household, invite_expires_at, invite_revoked_at, invite_consumed_at
  from public.household_invites as invite
  where invite.token_hash = encode(digest(convert_to($1, 'UTF8'), 'sha256'), 'hex')
  for update;

  if not found
    or invite_expires_at <= now()
    or invite_revoked_at is not null
    or invite_consumed_at is not null then
    raise exception 'invite_invalid_or_unavailable';
  end if;

  perform household.id
  from public.households as household
  where household.id = invited_household
  for update;
  if not found then
    raise exception 'invite_invalid_or_unavailable';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (invited_household, caller_id, 'member')
  on conflict (household_id, user_id) do nothing;
  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    -- Existing members get the same successful destination, and the bearer
    -- token is still consumed so it cannot be reused by another account.
    update public.household_invites
    set consumed_at = now(), consumed_by = caller_id
    where token_hash = encode(digest(convert_to($1, 'UTF8'), 'sha256'), 'hex');
    return invited_household;
  end if;

  update public.household_invites
  set consumed_at = now(), consumed_by = caller_id
  where token_hash = encode(digest(convert_to($1, 'UTF8'), 'sha256'), 'hex');

  return invited_household;
end;
$$;

-- Finish hashing tokens created by the still-live legacy RPC between migration
-- 002 and this transaction, then retire plaintext storage atomically with the
-- replacement RPCs.
set local search_path = pg_catalog, public, extensions;

update public.household_invites
set token_hash = encode(digest(convert_to(token, 'UTF8'), 'sha256'), 'hex')
where token_hash is null;

alter table public.household_invites
  alter column token_hash set not null;

create unique index household_invites_token_hash_key
  on public.household_invites(token_hash);

alter table public.household_invites
  drop column token;

create or replace function public.get_household_members(target_household uuid)
returns table(user_id uuid, role public.household_role, joined_at timestamptz, is_self boolean)
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
  select membership.user_id, membership.role, membership.created_at, membership.user_id = caller_id
  from public.household_members as membership
  where membership.household_id = target_household
  order by case membership.role when 'owner' then 0 when 'admin' then 1 else 2 end,
    membership.created_at, membership.user_id;
end;
$$;

create or replace function public.get_household_invites(target_household uuid)
returns table(
  id uuid,
  created_by uuid,
  created_at timestamptz,
  expires_at timestamptz,
  consumed_at timestamptz,
  consumed_by uuid,
  revoked_at timestamptz
)
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
    where membership.household_id = target_household
      and membership.user_id = caller_id
      and membership.role in ('owner', 'admin')
  ) then
    raise exception 'invite_list_not_allowed';
  end if;

  return query
  select invite.id, invite.created_by, invite.created_at, invite.expires_at,
    invite.consumed_at, invite.consumed_by, invite.revoked_at
  from public.household_invites as invite
  where invite.household_id = target_household
  order by invite.created_at desc
  limit 30;
end;
$$;

create or replace function public.revoke_household_invite(target_invite uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  invite_household uuid;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  select invite.household_id into invite_household
  from public.household_invites as invite
  where invite.id = target_invite
  for update;

  if not found then
    raise exception 'invite_not_found_or_forbidden';
  end if;

  perform household.id from public.households as household
  join public.household_members as membership
    on membership.household_id = household.id
    and membership.user_id = caller_id
    and membership.role in ('owner', 'admin')
  where household.id = invite_household
  for update of household;
  if not found then
    raise exception 'invite_not_found_or_forbidden';
  end if;

  update public.household_invites
  set revoked_at = now()
  where id = target_invite
    and consumed_at is null
    and revoked_at is null
    and expires_at > now();

  if not found then
    raise exception 'invite_not_active';
  end if;
end;
$$;

create or replace function public.change_household_member_role(
  target_household uuid,
  target_user uuid,
  new_role public.household_role
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  target_role public.household_role;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;
  if new_role is null or new_role not in ('admin', 'member') then
    raise exception 'ownership_changes_require_transfer';
  end if;

  perform household.id from public.households as household
  join public.household_members as actor
    on actor.household_id = household.id and actor.user_id = caller_id and actor.role = 'owner'
  where household.id = target_household
  for update of household;
  if not found then
    raise exception 'owner_required';
  end if;

  select membership.role into target_role
  from public.household_members as membership
  where membership.household_id = target_household and membership.user_id = target_user;
  if not found then
    raise exception 'member_not_found';
  end if;
  if target_role = 'owner' then
    raise exception 'ownership_changes_require_transfer';
  end if;

  update public.household_members
  set role = new_role
  where household_id = target_household and user_id = target_user;
end;
$$;

create or replace function public.remove_household_member(target_household uuid, target_user uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  actor_role public.household_role;
  target_role public.household_role;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  perform household.id from public.households as household
  join public.household_members as actor
    on actor.household_id = household.id and actor.user_id = caller_id
  where household.id = target_household
  for update of household;
  if not found then
    raise exception 'household_not_found_or_forbidden';
  end if;

  select membership.role into actor_role
  from public.household_members as membership
  where membership.household_id = target_household and membership.user_id = caller_id;
  if actor_role not in ('owner', 'admin') then
    raise exception 'remove_member_not_allowed';
  end if;
  if target_user = caller_id then
    raise exception 'use_leave_household';
  end if;

  select membership.role into target_role
  from public.household_members as membership
  where membership.household_id = target_household and membership.user_id = target_user;
  if not found then
    raise exception 'member_not_found';
  end if;
  if target_role = 'owner' then
    raise exception 'owners_must_transfer_ownership';
  end if;
  if actor_role = 'admin' and target_role <> 'member' then
    raise exception 'admin_can_only_remove_members';
  end if;

  delete from public.household_members
  where household_id = target_household and user_id = target_user;
end;
$$;

create or replace function public.leave_household(target_household uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  caller_role public.household_role;
  owner_count integer;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;

  perform household.id from public.households as household
  join public.household_members as actor
    on actor.household_id = household.id and actor.user_id = caller_id
  where household.id = target_household
  for update of household;
  if not found then
    raise exception 'household_not_found_or_forbidden';
  end if;

  select membership.role into caller_role
  from public.household_members as membership
  where membership.household_id = target_household and membership.user_id = caller_id;

  if caller_role = 'owner' then
    select count(*) into owner_count
    from public.household_members as membership
    where membership.household_id = target_household and membership.role = 'owner';
    if owner_count <= 1 then
      raise exception 'last_owner_must_transfer_first';
    end if;
  end if;

  delete from public.household_members
  where household_id = target_household and user_id = caller_id;
end;
$$;

create or replace function public.transfer_household_ownership(target_household uuid, new_owner uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  target_role public.household_role;
begin
  if caller_id is null then
    raise exception 'not_authenticated';
  end if;
  if new_owner = caller_id then
    raise exception 'invalid_transfer_target';
  end if;

  perform household.id from public.households as household
  join public.household_members as actor
    on actor.household_id = household.id and actor.user_id = caller_id and actor.role = 'owner'
  where household.id = target_household
  for update of household;
  if not found then
    raise exception 'owner_required';
  end if;

  select membership.role into target_role
  from public.household_members as membership
  where membership.household_id = target_household and membership.user_id = new_owner;
  if not found or target_role = 'owner' then
    raise exception 'transfer_target_must_be_non_owner_member';
  end if;

  update public.household_members set role = 'owner'
  where household_id = target_household and user_id = new_owner;
  update public.household_members set role = 'admin'
  where household_id = target_household and user_id = caller_id;
end;
$$;

-- SECURITY DEFINER functions are callable only by authenticated application users.
revoke all on function public.create_household(text) from public, anon, authenticated;
revoke all on function public.create_household_invite(uuid) from public, anon, authenticated;
revoke all on function public.create_household_invite() from public, anon, authenticated;
revoke all on function public.accept_household_invite(text) from public, anon, authenticated;
revoke all on function public.get_household_members(uuid) from public, anon, authenticated;
revoke all on function public.get_household_invites(uuid) from public, anon, authenticated;
revoke all on function public.revoke_household_invite(uuid) from public, anon, authenticated;
revoke all on function public.change_household_member_role(uuid, uuid, public.household_role) from public, anon, authenticated;
revoke all on function public.remove_household_member(uuid, uuid) from public, anon, authenticated;
revoke all on function public.leave_household(uuid) from public, anon, authenticated;
revoke all on function public.transfer_household_ownership(uuid, uuid) from public, anon, authenticated;

grant execute on function public.create_household(text) to authenticated;
grant execute on function public.create_household_invite(uuid) to authenticated;
grant execute on function public.create_household_invite() to authenticated;
grant execute on function public.accept_household_invite(text) to authenticated;
grant execute on function public.get_household_members(uuid) to authenticated;
grant execute on function public.get_household_invites(uuid) to authenticated;
grant execute on function public.revoke_household_invite(uuid) to authenticated;
grant execute on function public.change_household_member_role(uuid, uuid, public.household_role) to authenticated;
grant execute on function public.remove_household_member(uuid, uuid) to authenticated;
grant execute on function public.leave_household(uuid) to authenticated;
grant execute on function public.transfer_household_ownership(uuid, uuid) to authenticated;

commit;
