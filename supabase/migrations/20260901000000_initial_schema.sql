create extension if not exists "pgcrypto";

create type public.household_role as enum ('owner', 'member');
create type public.shopping_list_status as enum ('active', 'completed');
create type public.shopping_item_status as enum ('pending', 'purchased', 'already_have');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.household_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (household_id, user_id)
);

create table public.household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  token text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  icon text,
  created_at timestamptz not null default now(),
  unique (household_id, name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  default_quantity numeric not null default 1 check (default_quantity > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  budget numeric(12,2) not null default 0 check (budget >= 0),
  status public.shopping_list_status not null default 'active',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_list_per_household on public.shopping_lists(household_id) where status = 'active';

create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid not null references public.shopping_lists(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  quantity numeric not null default 1 check (quantity > 0),
  unit_price numeric(12,2) check (unit_price is null or unit_price >= 0),
  status public.shopping_item_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shopping_list_items_product_history on public.shopping_list_items(product_id, created_at desc) where status = 'purchased';

create or replace function public.is_household_member(target_household uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.household_members where household_id = target_household and user_id = auth.uid());
$$;

create or replace function public.household_for_list(target_list uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select household_id from public.shopping_lists where id = target_list;
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create trigger products_touch_updated_at before update on public.products for each row execute function public.touch_updated_at();
create trigger shopping_lists_touch_updated_at before update on public.shopping_lists for each row execute function public.touch_updated_at();
create trigger shopping_list_items_touch_updated_at before update on public.shopping_list_items for each row execute function public.touch_updated_at();

create or replace function public.create_household_invite()
returns text language plpgsql security definer set search_path = public as $$
declare
  member_household uuid;
  invite_token text;
begin
  select household_id into member_household from public.household_members where user_id = auth.uid() order by created_at limit 1;
  if member_household is null then raise exception 'household_not_found'; end if;
  invite_token := encode(gen_random_bytes(18), 'hex');
  insert into public.household_invites (household_id, token, created_by) values (member_household, invite_token, auth.uid());
  return invite_token;
end;
$$;

create or replace function public.accept_household_invite(invite_token text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  invited_household uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select household_id into invited_household from public.household_invites where token = invite_token and expires_at > now();
  if invited_household is null then raise exception 'invite_invalid_or_expired'; end if;
  insert into public.household_members (household_id, user_id, role) values (invited_household, auth.uid(), 'member') on conflict (household_id, user_id) do nothing;
  return invited_household;
end;
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.household_invites enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.shopping_list_items enable row level security;

create policy "profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "users can create their profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "users can update their profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "members can view their households" on public.households for select to authenticated using (public.is_household_member(id) or created_by = auth.uid());
create policy "users can create households" on public.households for insert to authenticated with check (created_by = auth.uid());
create policy "owners can update households" on public.households for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "members can view membership" on public.household_members for select to authenticated using (public.is_household_member(household_id) or user_id = auth.uid());
create policy "members can add membership" on public.household_members for insert to authenticated with check (user_id = auth.uid() or exists (select 1 from public.households where id = household_id and created_by = auth.uid()));
create policy "owners can remove membership" on public.household_members for delete to authenticated using (exists (select 1 from public.households where id = household_id and created_by = auth.uid()));
create policy "members can create invites" on public.household_invites for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "members can view invites" on public.household_invites for select to authenticated using (public.is_household_member(household_id));

create policy "members can manage categories" on public.categories for all to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members can manage products" on public.products for all to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members can view shopping lists" on public.shopping_lists for select to authenticated using (public.is_household_member(household_id));
create policy "members can create shopping lists" on public.shopping_lists for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "members can update shopping lists" on public.shopping_lists for update to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "members can delete shopping lists" on public.shopping_lists for delete to authenticated using (public.is_household_member(household_id));
create policy "members can manage list items" on public.shopping_list_items for all to authenticated using (public.is_household_member(public.household_for_list(shopping_list_id))) with check (public.is_household_member(public.household_for_list(shopping_list_id)));

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on function public.create_household_invite() to authenticated;
grant execute on function public.accept_household_invite(text) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.shopping_list_items;
exception when duplicate_object then null;
end $$;
