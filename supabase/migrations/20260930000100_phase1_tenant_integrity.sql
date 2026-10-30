-- Phase 1: reject new cross-household references without rewriting existing
-- data. Historical rows remain available for a later classified cleanup.

begin;

-- Keep the RPC's selected household deterministic when a user has multiple
-- memberships with the same creation timestamp.
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
  order by membership.created_at, membership.household_id
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

create or replace function public.prevent_tenant_reassignment()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.household_id is distinct from old.household_id then
    raise exception using
      errcode = '42501',
      message = 'household_id_immutable';
  end if;

  return new;
end;
$$;

create or replace function public.guard_product_category_tenant()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.category_id is null then
    return new;
  end if;

  -- Do not block unrelated edits to any pre-existing row until historical
  -- cross-tenant references have been inspected and classified.
  if tg_op = 'UPDATE' then
    if new.category_id is not distinct from old.category_id then
      return new;
    end if;
  end if;

  perform 1
  from public.categories as category
  where category.id = new.category_id
    and category.household_id = new.household_id
  for share;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'product_category_household_mismatch';
  end if;

  return new;
end;
$$;

create or replace function public.guard_shopping_item_tenant_references()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  list_household uuid;
  validate_product boolean;
  validate_category boolean;
begin
  if tg_op = 'INSERT' then
    validate_product := true;
    validate_category := true;
  else
    validate_product := new.shopping_list_id is distinct from old.shopping_list_id
      or new.product_id is distinct from old.product_id;
    validate_category := new.shopping_list_id is distinct from old.shopping_list_id
      or new.category_id is distinct from old.category_id;

    if not validate_product and not validate_category then
      return new;
    end if;
  end if;

  select shopping_list.household_id
    into list_household
  from public.shopping_lists as shopping_list
  where shopping_list.id = new.shopping_list_id
  for share;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'shopping_list_household_unavailable';
  end if;

  if validate_product and new.product_id is not null then
    perform 1
    from public.products as product
    where product.id = new.product_id
      and product.household_id = list_household
    for share;

    if not found then
      raise exception using
        errcode = '23503',
        message = 'shopping_item_product_household_mismatch';
    end if;
  end if;

  if validate_category and new.category_id is not null then
    perform 1
    from public.categories as category
    where category.id = new.category_id
      and category.household_id = list_household
    for share;

    if not found then
      raise exception using
        errcode = '23503',
        message = 'shopping_item_category_household_mismatch';
    end if;
  end if;

  return new;
end;
$$;

create trigger categories_household_id_immutable
  before update of household_id on public.categories
  for each row execute function public.prevent_tenant_reassignment();

create trigger products_household_id_immutable
  before update of household_id on public.products
  for each row execute function public.prevent_tenant_reassignment();

create trigger shopping_lists_household_id_immutable
  before update of household_id on public.shopping_lists
  for each row execute function public.prevent_tenant_reassignment();

create trigger products_category_same_household
  before insert or update on public.products
  for each row execute function public.guard_product_category_tenant();

create trigger shopping_items_references_same_household
  before insert or update on public.shopping_list_items
  for each row execute function public.guard_shopping_item_tenant_references();

-- Trigger functions are implementation details, not PostgREST RPC endpoints.
revoke all on function public.prevent_tenant_reassignment() from public, anon, authenticated;
revoke all on function public.guard_product_category_tenant() from public, anon, authenticated;
revoke all on function public.guard_shopping_item_tenant_references() from public, anon, authenticated;

commit;
