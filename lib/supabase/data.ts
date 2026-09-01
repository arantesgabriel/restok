import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { seedProducts, seedState } from "@/lib/seed";
import type { CategoryName, Product, RestokState, ShoppingItem, ShoppingList } from "@/lib/types";

const categoryNames: CategoryName[] = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"];
const legacySeedNames = new Set(["Arroz", "Azeite", "Batata palha", "Cebola", "Chá mate com gás", "Chimichurri", "Creme de leite", "Farinha de trigo", "Feijão", "Filé de peito de frango", "Leite condensado", "Leite desnatado", "Lemon pepper", "Limão", "Macarrão", "Massa de alho", "Massa de bolo", "Milho", "Molho de tomate", "Muçarela 600g", "Óleo de cozinha", "Ovos", "Pão de forma", "Picanha suína", "Pimenta-do-reino", "Presunto 300g", "Requeijão", "Sal", "Água com gás (fardo)", "Coca Zero (fardo)", "Energético Monster", "Cotonete", "Colgate", "Creme de pentear", "Desodorante Brunna", "Desodorante Gabriel", "Lenço umedecido", "Sabonete", "Shampoo", "Cif", "Detergente", "Papel higiênico (pct c/12)", "Papel toalha", "Sabão em pó", "Saco de lixo grande", "Veja"]);

const normalizeProductName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

type RemoteContext = { client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>; userId: string; householdId: string };

async function getRemoteContext(): Promise<RemoteContext | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  let { data: membership } = await client.from("household_members").select("household_id").eq("user_id", user.id).limit(1).maybeSingle();
  if (!membership) {
    const { data: household, error: householdError } = await client.from("households").insert({ name: "Minha casa", created_by: user.id }).select("id").single();
    if (householdError || !household) return null;
    const { data: newMembership, error: membershipError } = await client.from("household_members").insert({ household_id: household.id, user_id: user.id, role: "owner" }).select("household_id").single();
    if (membershipError || !newMembership) return null;
    membership = newMembership;
  }
  return { client, userId: user.id, householdId: membership.household_id };
}

async function getCategoryIds(context: RemoteContext) {
  let { data: categories } = await context.client.from("categories").select("id,name").eq("household_id", context.householdId).order("sort_order");
  if (!categories?.length) {
    const { data: seeded } = await context.client.from("categories").insert(categoryNames.map((name, sort_order) => ({ household_id: context.householdId, name, sort_order }))).select("id,name");
    categories = seeded ?? [];
  }
  return Object.fromEntries((categories ?? []).map((category) => [category.name as CategoryName, category.id])) as Partial<Record<CategoryName, string>>;
}

export async function loadRemoteState(): Promise<RestokState | null> {
  const context = await getRemoteContext();
  if (!context) return null;
  await context.client.from("profiles").upsert({ id: context.userId });
  const categoryIds = await getCategoryIds(context);
  let { data: products } = await context.client.from("products").select("id,name,default_quantity,active,category_id").eq("household_id", context.householdId).order("created_at");
  if (!products?.length) {
    const rows = seedProducts.map((product) => ({ household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: true }));
    const { data: seeded } = await context.client.from("products").insert(rows).select("id,name,default_quantity,active,category_id");
    products = seeded ?? [];
  }
  const targetByName = new Map(seedProducts.map((product) => [normalizeProductName(product.name), product]));
  const matchedTargetIds = new Set<string>();
  await Promise.all((products ?? []).map(async (product) => {
    const target = targetByName.get(normalizeProductName(product.name));
    if (!target || matchedTargetIds.has(target.name)) return;
    matchedTargetIds.add(target.name);
    await context.client.from("products").update({ name: target.name, category_id: categoryIds[target.category] ?? null, default_quantity: target.defaultQuantity, active: true }).eq("id", product.id);
  }));
  const missingProducts = seedProducts.filter((product) => !matchedTargetIds.has(product.name));
  if (missingProducts.length) await context.client.from("products").insert(missingProducts.map((product) => ({ household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: true })));
  const targetNames = new Set(seedProducts.map((product) => product.name));
  const legacyProducts = (products ?? []).filter((product) => product.active && legacySeedNames.has(product.name) && !targetNames.has(targetByName.get(normalizeProductName(product.name))?.name ?? ""));
  if (legacyProducts.length) await Promise.all(legacyProducts.map((product) => context.client.from("products").update({ active: false }).eq("id", product.id)));
  if (missingProducts.length || legacyProducts.length) {
    const { data: refreshedProducts } = await context.client.from("products").select("id,name,default_quantity,active,category_id").eq("household_id", context.householdId).order("created_at");
    products = refreshedProducts ?? products;
  }
  const categoryById = Object.fromEntries(Object.entries(categoryIds).map(([name, id]) => [id, name])) as Record<string, CategoryName>;
  let { data: lists } = await context.client.from("shopping_lists").select("id,name,budget,status,started_at,finished_at").eq("household_id", context.householdId).order("started_at", { ascending: false });
  if (!lists?.length) {
    const template = seedState.lists[0];
    const { data: seededList } = await context.client.from("shopping_lists").insert({ household_id: context.householdId, name: template.name, budget: template.budget, status: template.status, started_at: template.startedAt, created_by: context.userId }).select("id,name,budget,status,started_at,finished_at").single();
    if (seededList) {
      const productByName = Object.fromEntries((products ?? []).map((product) => [product.name, product]));
      const itemRows = template.items.map((item) => ({ shopping_list_id: seededList.id, product_id: productByName[item.name]?.id ?? null, category_id: categoryIds[item.category] ?? null, name: item.name, quantity: item.quantity, unit_price: item.unitPrice ?? null, status: item.status }));
      await context.client.from("shopping_list_items").insert(itemRows);
      lists = [seededList];
    }
  }
  const listIds = (lists ?? []).map((list) => list.id);
  const { data: items } = listIds.length ? await context.client.from("shopping_list_items").select("id,shopping_list_id,product_id,category_id,name,quantity,unit_price,status").in("shopping_list_id", listIds).order("created_at") : { data: [] };
  const itemsByList = (items ?? []).reduce<Record<string, ShoppingItem[]>>((grouped, item) => {
    (grouped[item.shopping_list_id] ??= []).push({ id: item.id, productId: item.product_id ?? undefined, name: item.name, category: categoryById[item.category_id] ?? "Outros", quantity: Number(item.quantity), unitPrice: item.unit_price == null ? undefined : Number(item.unit_price), status: item.status });
    return grouped;
  }, {});
  return {
    products: (products ?? []).map((product) => ({ id: product.id, name: product.name, category: categoryById[product.category_id] ?? "Outros", defaultQuantity: Number(product.default_quantity), active: product.active })),
    lists: (lists ?? []).map((list) => ({ id: list.id, name: list.name, budget: Number(list.budget), status: list.status, startedAt: list.started_at, finishedAt: list.finished_at ?? undefined, items: itemsByList[list.id] ?? [] })),
  };
}

export async function createHouseholdInvite() {
  const client = getSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.rpc("create_household_invite");
  return error ? null : (data as string);
}

export async function acceptHouseholdInvite(token: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return false;
  const { error } = await client.rpc("accept_household_invite", { invite_token: token });
  return !error;
}

export async function persistItem(listId: string | undefined, item: ShoppingItem) {
  if (!listId) return;
  const context = await getRemoteContext();
  if (!context) return;
  const categoryIds = await getCategoryIds(context);
  await context.client.from("shopping_list_items").upsert({ id: item.id, shopping_list_id: listId, product_id: item.productId ?? null, category_id: categoryIds[item.category] ?? null, name: item.name, quantity: item.quantity, unit_price: item.unitPrice ?? null, status: item.status });
}

export async function persistProduct(product: Product) {
  const context = await getRemoteContext();
  if (!context) return;
  const categoryIds = await getCategoryIds(context);
  await context.client.from("products").upsert({ id: product.id, household_id: context.householdId, category_id: categoryIds[product.category] ?? null, name: product.name, default_quantity: product.defaultQuantity, active: product.active });
}

export async function persistList(list: ShoppingList) {
  const context = await getRemoteContext();
  if (!context) return;
  await context.client.from("shopping_lists").upsert({ id: list.id, household_id: context.householdId, name: list.name, budget: list.budget, status: list.status, started_at: list.startedAt, finished_at: list.finishedAt ?? null, created_by: context.userId });
}
