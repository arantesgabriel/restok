-- Phase 2 schema: support canonical admin role and one-time, revocable invites.
-- Existing invite links remain valid because their hashes are backfilled.

begin;

alter type public.household_role add value if not exists 'admin';

alter table public.household_invites
  add column token_hash text,
  add column consumed_at timestamptz,
  add column consumed_by uuid references auth.users(id) on delete set null,
  add column revoked_at timestamptz,
  add constraint household_invites_single_terminal_state
    check (consumed_at is null or revoked_at is null);

set local search_path = pg_catalog, public, extensions;

update public.household_invites
set token_hash = encode(digest(convert_to(token, 'UTF8'), 'sha256'), 'hex');

commit;
