import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { seedProducts, seedState } from "@/lib/seed";
import type { CategoryName, HouseholdInvite, HouseholdMember, HouseholdRole, HouseholdSummary, Product, RestokState, ShoppingItem, ShoppingList } from "@/lib/types";

const categoryNames: CategoryName[] = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"];
const legacySeedNames = new Set(["Arroz", "Azeite", "Batata palha", "Cebola", "Chá mate com gás", "Chimichurri", "Creme de leite", "Farinha de trigo", "Feijão", "Filé de peito de frango", "Leite condensado", "Leite desnatado", "Lemon pepper", "Limão", "Macarrão", "Massa de alho", "Massa de bolo", "Milho", "Molho de tomate", "Muçarela 600g", "Óleo de cozinha", "Ovos", "Pão de forma", "Picanha suína", "Pimenta-do-reino", "Presunto 300g", "Requeijão", "Sal", "Água com gás (fardo)", "Coca Zero (fardo)", "Energético Monster", "Cotonete", "Colgate", "Creme de pentear", "Desodorante Brunna", "Desodorante Gabriel", "Lenço umedecido", "Sabonete", "Shampoo", "Cif", "Detergente", "Papel higiênico (pct c/12)", "Papel toalha", "Sabão em pó", "Saco de lixo grande", "Veja"]);

const normalizeProductName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export type RemoteContext = { client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>; userId: string; householdId: string; householdName: string; role: HouseholdRole };
export type RemoteState = { state: RestokState; userId: string; householdId: string; householdName: string; role: HouseholdRole };

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
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return null;
  const { data: memberships, error: membershipError } = await client
    .from("household_members")
    .select("household_id,role,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .order("household_id", { ascending: true });
  if (membershipError) return null;

  let availableMemberships = memberships ?? [];
  if (!availableMemberships.length) {
    const { data: newHouseholdId, error: createError } = await client.rpc("create_household", { requested_name: "Minha casa" });
    if (createError || !newHouseholdId) return null;
    const { data: createdMembership, error: createdMembershipError } = await client
      .from("household_members")
      .select("household_id,role,created_at")
      .eq("user_id", user.id)
      .eq("household_id", newHouseholdId)
      .single();
    if (createdMembershipError || !createdMembership) return null;
    availableMemberships = [createdMembership];
  }

  const requestedId = preferredHouseholdId === undefined ? savedHouseholdId(user.id) : preferredHouseholdId;
  const membership = availableMemberships.find((candidate) => candidate.household_id === requestedId) ?? availableMemberships[0];
  const { data: household, error: householdError } = await client
    .from("households")
    .select("id,name")
    .eq("id", membership.household_id)
    .single();
  if (householdError || !household) return null;
  return { client, userId: user.id, householdId: membership.household_id, householdName: household.name, role: membership.role as HouseholdRole };
}

async function getCategoryIds(context: RemoteContext) {
  const { data: foundCategories, error: categoryError } = await context.client
    .from("categories")
    .select("id,name")
    .eq("household_id", context.householdId)
    .order("sort_order");
  if (categoryError) return null;

  let categories = foundCategories;
  if (!categories?.length) {
    const { data: seeded, error: seedError } = await context.client
      .from("categories")
      .insert(categoryNames.map((name, sort_order) => ({ household_id: context.householdId, name, sort_order })))
      .select("id,name");
    if (seedError) return null;
    categories = seeded ?? [];
  }
  return Object.fromEntries((categories ?? []).map((category) => [category.name as CategoryName, category.id])) as Partial<Record<CategoryName, string>>;
}

export async function loadRemoteState(existingContext?: RemoteContext): Promise<RemoteState | null> {
  const context = existingContext ?? await resolveRemoteContext();
  if (!context) return null;
  const { error: profileError } = await context.client.from("profiles").upsert({ id: context.userId });
  if (profileError) return null;
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
  const targetByName = new Map(seedProducts.map((product) => [normalizeProductName(product.name), product]));
  const matchedTargetIds = new Set<string>();
  const reconcileErrors = await Promise.all((products ?? []).map(async (product) => {
    const target = targetByName.get(normalizeProductName(product.name));
    if (!target || matchedTargetIds.has(target.name)) return null;
    matchedTargetIds.add(target.name);
    const { error } = await context.client.from("products").update({ name: target.name, category_id: categoryIds[target.category] ?? null, default_quantity: target.defaultQuantity, active: true }).eq("id", product.id);
    return error;
  }));
  if (reconcileErrors.some(Boolean)) return null;
  const missingProducts = seedProducts.filter((product) => !matchedTargetIds.has(product.name));
  if (missingProducts.length) {
    const { error } = await context.client.from("products").insert(missingProducts.map((product) => ({ household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: true })));
    if (error) return null;
  }
  const targetNames = new Set(seedProducts.map((product) => product.name));
  const legacyProducts = (products ?? []).filter((product) => product.active && legacySeedNames.has(product.name) && !targetNames.has(targetByName.get(normalizeProductName(product.name))?.name ?? ""));
  if (legacyProducts.length) {
    const legacyErrors = await Promise.all(legacyProducts.map(async (product) => {
      const { error } = await context.client.from("products").update({ active: false }).eq("id", product.id);
      return error;
    }));
    if (legacyErrors.some(Boolean)) return null;
  }
  if (missingProducts.length || legacyProducts.length) {
    const { data: refreshedProducts, error: refreshError } = await context.client.from("products").select("id,name,default_quantity,active,category_id").eq("household_id", context.householdId).order("created_at");
    if (refreshError) return null;
    products = refreshedProducts ?? products;
  }
  const categoryById = Object.fromEntries(Object.entries(categoryIds).map(([name, id]) => [id, name])) as Record<string, CategoryName>;
  const { data: foundLists, error: listsError } = await context.client.from("shopping_lists").select("id,name,budget,status,started_at,finished_at").eq("household_id", context.householdId).order("started_at", { ascending: false });
  if (listsError) return null;
  let lists = foundLists;
  if (!lists?.length) {
    const template = seedState.lists[0];
    const { data: seededList, error: listSeedError } = await context.client.from("shopping_lists").insert({ household_id: context.householdId, name: template.name, budget: template.budget, status: template.status, started_at: template.startedAt, created_by: context.userId }).select("id,name,budget,status,started_at,finished_at").single();
    if (listSeedError) return null;
    if (seededList) {
      const productByName = Object.fromEntries((products ?? []).map((product) => [product.name, product]));
      const itemRows = template.items.map((item) => ({ shopping_list_id: seededList.id, product_id: productByName[item.name]?.id ?? null, category_id: categoryIds[item.category] ?? null, name: item.name, quantity: item.quantity, unit_price: item.unitPrice ?? null, status: item.status }));
      const { error: itemSeedError } = await context.client.from("shopping_list_items").insert(itemRows);
      if (itemSeedError) return null;
      lists = [seededList];
    }
  }
  const listIds = (lists ?? []).map((list) => list.id);
  let items: { id: string; shopping_list_id: string; product_id: string | null; category_id: string | null; name: string; quantity: number; unit_price: number | null; status: ShoppingItem["status"] }[] = [];
  if (listIds.length) {
    const { data: foundItems, error: itemsError } = await context.client.from("shopping_list_items").select("id,shopping_list_id,product_id,category_id,name,quantity,unit_price,status").in("shopping_list_id", listIds).order("created_at");
    if (itemsError) return null;
    items = foundItems ?? [];
  }
  const itemsByList = items.reduce<Record<string, ShoppingItem[]>>((grouped, item) => {
    (grouped[item.shopping_list_id] ??= []).push({ id: item.id, productId: item.product_id ?? undefined, name: item.name, category: item.category_id ? categoryById[item.category_id] ?? "Outros" : "Outros", quantity: Number(item.quantity), unitPrice: item.unit_price == null ? undefined : Number(item.unit_price), status: item.status });
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

export async function persistItem(listId: string | undefined, item: ShoppingItem) {
  if (!listId) return;
  const context = await resolveRemoteContext();
  if (!context) return;
  const { data: list, error: listError } = await context.client
    .from("shopping_lists")
    .select("id")
    .eq("id", listId)
    .eq("household_id", context.householdId)
    .maybeSingle();
  if (listError || !list) return;
  const categoryIds = await getCategoryIds(context);
  if (!categoryIds) return;
  await context.client.from("shopping_list_items").upsert({ id: item.id, shopping_list_id: listId, product_id: item.productId ?? null, category_id: categoryIds[item.category] ?? null, name: item.name, quantity: item.quantity, unit_price: item.unitPrice ?? null, status: item.status });
}

export async function persistProduct(product: Product) {
  const context = await resolveRemoteContext();
  if (!context) return;
  const categoryIds = await getCategoryIds(context);
  if (!categoryIds) return;
  await context.client.from("products").upsert({ id: product.id, household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: product.active });
}

export async function persistList(list: ShoppingList) {
  const context = await resolveRemoteContext();
  if (!context) return;
  await context.client.from("shopping_lists").upsert({ id: list.id, household_id: context.householdId, name: list.name, budget: list.budget, status: list.status, started_at: list.startedAt, finished_at: list.finishedAt ?? null, created_by: context.userId });
}
