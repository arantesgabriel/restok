import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { seedProducts } from "@/lib/seed";
import type { CategoryName, HouseholdInvite, HouseholdMember, HouseholdRole, HouseholdSummary, Product, RestokState, ShoppingItem, ShoppingList } from "@/lib/types";
import { orderedShoppingItems } from "@/lib/utils";

const categoryNames: CategoryName[] = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"];
export type RemoteContext = { client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>; userId: string; email: string | null; profileName: string | null; householdId: string; householdName: string; role: HouseholdRole };
export type RemoteState = { state: RestokState; userId: string; householdId: string; householdName: string; role: HouseholdRole };
export type CurrentProfile = { userId: string; email: string | null; displayName: string | null };
export type RemoteWriteResult = { ok: true; synced: boolean } | { ok: false; message: string };

const localWriteResult: RemoteWriteResult = { ok: true, synced: false };
const syncedWriteResult: RemoteWriteResult = { ok: true, synced: true };
const failedWriteResult: RemoteWriteResult = { ok: false, message: "Não foi possível sincronizar esta alteração." };

async function readCurrentProfile(client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>): Promise<CurrentProfile | null> {
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return null;
  const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const { data: profile, error: profileError } = await client.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  if (profileError) return null;
  const displayName = profile?.display_name?.trim() || metadataName || null;
  if (!profile) {
    const { error } = await client.from("profiles").upsert({ id: user.id, display_name: metadataName || null }, { onConflict: "id", ignoreDuplicates: true });
    if (error) return null;
  } else if (!profile.display_name && metadataName) {
    const { error } = await client.from("profiles").update({ display_name: metadataName }).eq("id", user.id).is("display_name", null);
    if (error) return null;
  }
  return { userId: user.id, email: user.email ?? null, displayName };
}

export async function loadCurrentProfile(): Promise<CurrentProfile | null> {
  const client = getSupabaseBrowserClient();
  return client ? readCurrentProfile(client) : null;
}

export function activeHouseholdStorageKey(userId: string) {
  return `restok-active-household:${encodeURIComponent(userId)}`;
}

function savedHouseholdId(userId: string) {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(activeHouseholdStorageKey(userId)); }
  catch { return null; }
}

export async function loadUserHouseholds(): Promise<HouseholdSummary[] | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return null;

  const { data: memberships, error: membershipError } = await client
    .from("household_members")
    .select("household_id,role,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .order("household_id", { ascending: true });
  if (membershipError) return null;
  if (!memberships?.length) return [];

  const { data: households, error: householdError } = await client
    .from("households")
    .select("id,name,created_at")
    .in("id", memberships.map((membership) => membership.household_id));
  if (householdError) return null;
  const membershipByHousehold = new Map(memberships.map((membership) => [membership.household_id, membership]));
  return (households ?? []).map((household) => {
    const membership = membershipByHousehold.get(household.id)!;
    return { id: household.id, name: household.name, role: membership.role as HouseholdRole, createdAt: membership.created_at };
  }).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

export async function resolveRemoteContext(preferredHouseholdId?: string | null): Promise<RemoteContext | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const identity = await readCurrentProfile(client);
  if (!identity) return null;
  const { data: memberships, error: membershipError } = await client
    .from("household_members")
    .select("household_id,role,created_at")
    .eq("user_id", identity.userId)
    .order("created_at", { ascending: true })
    .order("household_id", { ascending: true });
  if (membershipError) return null;

  const availableMemberships = memberships ?? [];
  if (!availableMemberships.length) return null;

  const requestedId = preferredHouseholdId === undefined ? savedHouseholdId(identity.userId) : preferredHouseholdId;
  const membership = availableMemberships.find((candidate) => candidate.household_id === requestedId) ?? availableMemberships[0];
  const { data: household, error: householdError } = await client
    .from("households")
    .select("id,name")
    .eq("id", membership.household_id)
    .single();
  if (householdError || !household) return null;
  return { client, userId: identity.userId, email: identity.email, profileName: identity.displayName, householdId: membership.household_id, householdName: household.name, role: membership.role as HouseholdRole };
}

async function getCategoryIds(context: RemoteContext) {
  const { data: foundCategories, error: categoryError } = await context.client
    .from("categories")
    .select("id,name")
    .eq("household_id", context.householdId)
    .order("sort_order");
  if (categoryError) return null;

  let categories = foundCategories ?? [];
  const foundNames = new Set(categories.map((category) => category.name));
  const missingCategories = categoryNames.filter((name) => !foundNames.has(name));
  if (missingCategories.length) {
    const { error: seedError } = await context.client
      .from("categories")
      .upsert(missingCategories.map((name) => ({ household_id: context.householdId, name, sort_order: categoryNames.indexOf(name) })), { onConflict: "household_id,name", ignoreDuplicates: true });
    if (seedError) return null;
    const { data: refreshed, error: refreshError } = await context.client.from("categories").select("id,name").eq("household_id", context.householdId).order("sort_order");
    if (refreshError) return null;
    categories = refreshed ?? [];
  }
  return Object.fromEntries((categories ?? []).map((category) => [category.name as CategoryName, category.id])) as Partial<Record<CategoryName, string>>;
}

export async function loadRemoteState(existingContext?: RemoteContext): Promise<RemoteState | null> {
  const context = existingContext ?? await resolveRemoteContext();
  if (!context) return null;
  const categoryIds = await getCategoryIds(context);
  if (!categoryIds) return null;
  const { data: foundProducts, error: productsError } = await context.client
    .from("products")
    .select("id,name,default_quantity,active,category_id")
    .eq("household_id", context.householdId)
    .order("created_at");
  if (productsError) return null;
  let products = foundProducts;
  if (!products?.length) {
    const rows = seedProducts.map((product) => ({ household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: true }));
    const { data: seeded, error: seedError } = await context.client.from("products").insert(rows).select("id,name,default_quantity,active,category_id");
    if (seedError) return null;
    products = seeded ?? [];
  }
  const categoryById = Object.fromEntries(Object.entries(categoryIds).map(([name, id]) => [id, name])) as Record<string, CategoryName>;
  const { data: foundLists, error: listsError } = await context.client.from("shopping_lists").select("id,name,budget,status,started_at,finished_at").eq("household_id", context.householdId).order("started_at", { ascending: false });
  if (listsError) return null;
  const lists = foundLists ?? [];
  const listIds = (lists ?? []).map((list) => list.id);
  let items: { id: string; shopping_list_id: string; product_id: string | null; category_id: string | null; name: string; quantity: number; unit_price: number | null; status: ShoppingItem["status"]; sort_order: number }[] = [];
  if (listIds.length) {
    const { data: foundItems, error: itemsError } = await context.client.from("shopping_list_items").select("id,shopping_list_id,product_id,category_id,name,quantity,unit_price,status,sort_order").in("shopping_list_id", listIds).order("sort_order").order("id");
    if (itemsError) return null;
    items = foundItems ?? [];
  }
  const itemsByList = items.reduce<Record<string, ShoppingItem[]>>((grouped, item) => {
    (grouped[item.shopping_list_id] ??= []).push({ id: item.id, productId: item.product_id ?? undefined, name: item.name, category: item.category_id ? categoryById[item.category_id] ?? "Outros" : "Outros", quantity: Number(item.quantity), unitPrice: item.unit_price == null ? undefined : Number(item.unit_price), status: item.status, sortOrder: Number(item.sort_order) });
    return grouped;
  }, {});
  return {
    userId: context.userId,
    householdId: context.householdId,
    householdName: context.householdName,
    role: context.role,
    state: {
      products: (products ?? []).map((product) => ({ id: product.id, name: product.name, category: categoryById[product.category_id] ?? "Outros", defaultQuantity: Number(product.default_quantity), active: product.active })),
      lists: (lists ?? []).map((list) => ({ id: list.id, name: list.name, budget: Number(list.budget), status: list.status, startedAt: list.started_at, finishedAt: list.finished_at ?? undefined, items: itemsByList[list.id] ?? [] })),
    },
  };
}

export async function createHousehold(name: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("create_household", { requested_name: name });
  return error ? null : data as string;
}

export async function loadHouseholdMembers(householdId: string): Promise<HouseholdMember[] | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("get_household_members", { target_household: householdId });
  if (error || !data) return null;
  return (data as Array<{ user_id: string; role: HouseholdRole; joined_at: string; is_self: boolean }>).map((member) => ({
    userId: member.user_id,
    role: member.role,
    joinedAt: member.joined_at,
    isSelf: member.is_self,
  }));
}

export async function loadHouseholdInvites(householdId: string): Promise<HouseholdInvite[] | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("get_household_invites", { target_household: householdId });
  if (error || !data) return null;
  return (data as Array<{ id: string; created_by: string; created_at: string; expires_at: string; consumed_at: string | null; consumed_by: string | null; revoked_at: string | null }>).map((invite) => ({
    id: invite.id,
    createdBy: invite.created_by,
    createdAt: invite.created_at,
    expiresAt: invite.expires_at,
    consumedAt: invite.consumed_at,
    consumedBy: invite.consumed_by,
    revokedAt: invite.revoked_at,
  }));
}

export async function createHouseholdInvite(householdId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("create_household_invite", { target_household: householdId });
  return error ? null : (data as string);
}

export async function acceptHouseholdInvite(token: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("accept_household_invite", { invite_token: token });
  return error ? null : data as string;
}

export async function revokeHouseholdInvite(inviteId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("revoke_household_invite", { target_invite: inviteId });
  return !error;
}

export async function changeHouseholdMemberRole(householdId: string, userId: string, role: HouseholdRole) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("change_household_member_role", { target_household: householdId, target_user: userId, new_role: role });
  return !error;
}

export async function removeHouseholdMember(householdId: string, userId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("remove_household_member", { target_household: householdId, target_user: userId });
  return !error;
}

export async function leaveHousehold(householdId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("leave_household", { target_household: householdId });
  return !error;
}

export async function transferHouseholdOwnership(householdId: string, newOwner: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("transfer_household_ownership", { target_household: householdId, new_owner: newOwner });
  return !error;
}

export async function persistItem(listId: string | undefined, item: ShoppingItem, preferredHouseholdId?: string): Promise<RemoteWriteResult> {
  if (!isSupabaseConfigured) return localWriteResult;
  if (!listId) return failedWriteResult;
  try {
    const context = await resolveRemoteContext(preferredHouseholdId);
    if (!context) return failedWriteResult;
    const { data: list, error: listError } = await context.client
      .from("shopping_lists")
      .select("id")
      .eq("id", listId)
      .eq("household_id", context.householdId)
      .maybeSingle();
    if (listError || !list) return failedWriteResult;
    const categoryIds = await getCategoryIds(context);
    if (!categoryIds) return failedWriteResult;
    const { error } = await context.client.from("shopping_list_items").upsert({
      id: item.id,
      shopping_list_id: listId,
      product_id: item.productId ?? null,
      category_id: categoryIds[item.category] ?? null,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice ?? null,
      status: item.status,
      sort_order: item.sortOrder,
    });
    return error ? failedWriteResult : syncedWriteResult;
  } catch {
    return failedWriteResult;
  }
}

export async function persistProduct(product: Product, preferredHouseholdId?: string): Promise<RemoteWriteResult> {
  if (!isSupabaseConfigured) return localWriteResult;
  try {
    const context = await resolveRemoteContext(preferredHouseholdId);
    if (!context) return failedWriteResult;
    const categoryIds = await getCategoryIds(context);
    if (!categoryIds) return failedWriteResult;
    const { error } = await context.client.from("products").upsert({
      id: product.id,
      household_id: context.householdId,
      category_id: categoryIds[product.category] ?? null,
      name: product.name,
      default_quantity: product.defaultQuantity,
      active: product.active,
    });
    return error ? failedWriteResult : syncedWriteResult;
  } catch {
    return failedWriteResult;
  }
}

async function persistShoppingListWithItems(list: ShoppingList, preferredHouseholdId: string | undefined, idempotentCreate: boolean): Promise<RemoteWriteResult> {
  if (!isSupabaseConfigured) return localWriteResult;
  try {
    const context = await resolveRemoteContext(preferredHouseholdId);
    if (!context) return failedWriteResult;
    const categoryIds = await getCategoryIds(context);
    if (!categoryIds) return failedWriteResult;
    const { error } = await context.client.rpc("create_shopping_list_with_items", {
      requested_household: context.householdId,
      requested_list: {
        id: list.id,
        name: list.name,
        budget: list.budget,
        status: list.status,
        started_at: list.startedAt,
        finished_at: list.finishedAt ?? null,
      },
      requested_items: orderedShoppingItems(list.items).map((item) => ({
        id: item.id,
        product_id: item.productId ?? null,
        category_id: categoryIds[item.category] ?? null,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice ?? null,
        status: item.status,
        sort_order: item.sortOrder,
      })),
      idempotent_create: idempotentCreate,
    });
    return error ? failedWriteResult : syncedWriteResult;
  } catch {
    return failedWriteResult;
  }
}

export async function persistList(list: ShoppingList, preferredHouseholdId?: string): Promise<RemoteWriteResult> {
  return persistShoppingListWithItems(list, preferredHouseholdId, false);
}

export async function createShoppingListWithItems(list: ShoppingList, preferredHouseholdId?: string): Promise<RemoteWriteResult> {
  return persistShoppingListWithItems(list, preferredHouseholdId, true);
}
