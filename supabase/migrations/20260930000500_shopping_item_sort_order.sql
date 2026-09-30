-- Shopping items keep the order they were added in. Status updates must not
-- rewrite that position: created_at is identical for items inserted together,
-- so ordering by it changes after a row is updated.
begin;

alter table public.shopping_list_items
  add column sort_order integer;

with ranked as (
  select
    id,
    (row_number() over (
      partition by shopping_list_id
      order by created_at, id
    ) - 1)::integer as next_order
  from public.shopping_list_items
)
update public.shopping_list_items as item
set sort_order = ranked.next_order
from ranked
where item.id = ranked.id;

alter table public.shopping_list_items
  alter column sort_order set default 0,
  alter column sort_order set not null;

alter table public.shopping_list_items
  add constraint shopping_list_items_sort_order_check check (sort_order >= 0);

create index shopping_list_items_list_order
  on public.shopping_list_items (shopping_list_id, sort_order, id);

create or replace function public.create_shopping_list_with_items(
  requested_household uuid,
  requested_list jsonb,
  requested_items jsonb,
  idempotent_create boolean
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  requested_list_id uuid;
  saved_list_id uuid;
  requested_status public.shopping_list_status;
  expected_items integer;
  distinct_items integer;
  saved_items integer;
begin
  if caller_id is null then
    raise exception using errcode = '42501', message = 'not_authenticated';
  end if;
  if idempotent_create is null then
    raise exception using errcode = '22023', message = 'missing_idempotency_mode';
  end if;

  if not exists (
    select 1
    from public.household_members as membership
    where membership.household_id = requested_household
      and membership.user_id = caller_id
  ) then
    raise exception using errcode = '42501', message = 'household_access_denied';
  end if;

  if requested_list is null
    or jsonb_typeof(requested_list) is distinct from 'object'
    or requested_items is null
    or jsonb_typeof(requested_items) is distinct from 'array' then
    raise exception using errcode = '22023', message = 'invalid_shopping_list_payload';
  end if;

  requested_list_id := (requested_list ->> 'id')::uuid;
  requested_status := coalesce((requested_list ->> 'status')::public.shopping_list_status, 'active');
  expected_items := jsonb_array_length(requested_items);
  select count(distinct item.id)::integer
    into distinct_items
  from jsonb_to_recordset(requested_items) as item(id uuid);

  if expected_items <> distinct_items then
    raise exception using errcode = '22023', message = 'duplicate_shopping_item_ids';
  end if;

  -- A successful create whose response was lost is a no-op on retry. It must
  -- not reactivate an old trip or complete a newer active trip.
  if idempotent_create and exists (
    select 1
    from public.shopping_lists as existing_list
    where existing_list.id = requested_list_id
      and existing_list.household_id = requested_household
  ) then
    return requested_list_id;
  end if;

  if not idempotent_create
    and requested_status = 'active'
    and exists (
      select 1
      from public.shopping_lists as existing_list
      where existing_list.id = requested_list_id
        and existing_list.household_id = requested_household
        and existing_list.status = 'completed'
    ) then
    raise exception using errcode = '23514', message = 'shopping_list_already_completed';
  end if;

  -- Complete the prior active trip in this same transaction. On a retry the
  -- requested list is already the active trip, so this leaves it untouched.
  if requested_status = 'active' then
    update public.shopping_lists
    set status = 'completed', finished_at = coalesce(finished_at, now())
    where household_id = requested_household
      and status = 'active'
      and id <> requested_list_id;
  end if;

  insert into public.shopping_lists (
    id, household_id, name, budget, status, started_at, finished_at, created_by
  ) values (
    requested_list_id,
    requested_household,
    requested_list ->> 'name',
    coalesce((requested_list ->> 'budget')::numeric, 0),
    requested_status,
    coalesce((requested_list ->> 'started_at')::timestamptz, now()),
    (requested_list ->> 'finished_at')::timestamptz,
    caller_id
  )
  on conflict (id) do update
  set name = excluded.name,
      budget = excluded.budget,
      status = excluded.status,
      started_at = excluded.started_at,
      finished_at = excluded.finished_at
  where public.shopping_lists.household_id = excluded.household_id
  returning id into saved_list_id;

  if saved_list_id is null then
    raise exception using errcode = '23505', message = 'shopping_list_id_conflict';
  end if;

  -- A new item keeps the position the client asked for when that position is
  -- after everything already stored. Anything else is appended. Existing rows
  -- do not have sort_order updated, so marking an item resolved cannot reorder
  -- the list.
  with incoming as (
    select
      (item.value ->> 'id')::uuid as id,
      (item.value ->> 'product_id')::uuid as product_id,
      (item.value ->> 'category_id')::uuid as category_id,
      item.value ->> 'name' as name,
      (item.value ->> 'quantity')::numeric as quantity,
      (item.value ->> 'unit_price')::numeric as unit_price,
      (item.value ->> 'status')::public.shopping_item_status as status,
      (item.value ->> 'sort_order')::integer as sort_order,
      item.ordinality
    from jsonb_array_elements(requested_items) with ordinality as item(value, ordinality)
  ),
  bounds as (
    select coalesce(max(existing.sort_order), -1) as max_order
    from public.shopping_list_items as existing
    where existing.shopping_list_id = saved_list_id
  ),
  placed as (
    select
      incoming.id,
      incoming.product_id,
      incoming.category_id,
      incoming.name,
      incoming.quantity,
      incoming.unit_price,
      incoming.status,
      case
        when incoming.sort_order is not null and incoming.sort_order > bounds.max_order then incoming.sort_order
        else bounds.max_order + row_number() over (
          partition by (
            stored.id is null
            and (incoming.sort_order is null or incoming.sort_order <= bounds.max_order)
          )
          order by incoming.ordinality
        )
      end::integer as final_order
    from incoming
    cross join bounds
    left join public.shopping_list_items as stored
      on stored.id = incoming.id
     and stored.shopping_list_id = saved_list_id
  )
  insert into public.shopping_list_items (
    id, shopping_list_id, product_id, category_id, name, quantity, unit_price, status, sort_order
  )
  select
    placed.id,
    saved_list_id,
    placed.product_id,
    placed.category_id,
    placed.name,
    placed.quantity,
    placed.unit_price,
    placed.status,
    placed.final_order
  from placed
  on conflict (id) do update
  set product_id = excluded.product_id,
      category_id = excluded.category_id,
      name = excluded.name,
      quantity = excluded.quantity,
      unit_price = excluded.unit_price,
      status = excluded.status
  where public.shopping_list_items.shopping_list_id = excluded.shopping_list_id;

  select count(*)::integer
    into saved_items
  from public.shopping_list_items as saved_item
  join jsonb_to_recordset(requested_items) as requested_item(id uuid)
    on requested_item.id = saved_item.id
  where saved_item.shopping_list_id = saved_list_id;

  if saved_items <> expected_items then
    raise exception using errcode = '23505', message = 'shopping_item_id_conflict';
  end if;

  return saved_list_id;
end;
$$;

revoke all on function public.create_shopping_list_with_items(uuid, jsonb, jsonb, boolean)
  from public, anon;
grant execute on function public.create_shopping_list_with_items(uuid, jsonb, jsonb, boolean)
  to authenticated;

commit;
