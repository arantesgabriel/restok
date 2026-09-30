import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const testUrl = process.env.RESTOK_TEST_SUPABASE_URL;
const anonKey = process.env.RESTOK_TEST_SUPABASE_ANON_KEY;
const testTarget = process.env.RESTOK_TEST_PROJECT_KIND;
const credentials = {
  a: { email: process.env.RESTOK_TEST_USER_A_EMAIL, password: process.env.RESTOK_TEST_USER_A_PASSWORD },
  b: { email: process.env.RESTOK_TEST_USER_B_EMAIL, password: process.env.RESTOK_TEST_USER_B_PASSWORD },
  c: { email: process.env.RESTOK_TEST_USER_C_EMAIL, password: process.env.RESTOK_TEST_USER_C_PASSWORD },
};

if (testTarget !== "disposable") {
  throw new Error("Set RESTOK_TEST_PROJECT_KIND=disposable only for an isolated Supabase test project.");
}
if (!testUrl || !anonKey || Object.values(credentials).some(({ email, password }) => !email || !password)) {
  throw new Error("The PostgREST suite requires a test URL, anon key, and A/B/C test-user credentials.");
}
if (process.env.NEXT_PUBLIC_SUPABASE_URL && testUrl === process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("The isolation suite refuses to target the app's configured Supabase project.");
}

const clientOptions = {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
};

type Fixture = {
  householdA: string;
  householdB: string;
  listA: string;
  listB: string;
  categoryA: string;
  categoryB: string;
  productA: string;
  productB: string;
  itemA: string;
  userA: string;
  userB: string;
  userC: string;
};

let userA: SupabaseClient;
let userB: SupabaseClient;
let userC: SupabaseClient;
let anonymous: SupabaseClient;
let fixture: Fixture;

function assertData<T>(data: T | null, error: { message: string } | null, operation: string): T {
  if (error || data === null) throw new Error(`${operation} failed: ${error?.message ?? "no data returned"}`);
  return data;
}

async function signIn(email: string, password: string) {
  const client = createClient(testUrl!, anonKey!, clientOptions);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  const user = assertData(data.user, error, "sign in");
  return { client, userId: user.id };
}

async function createHousehold(client: SupabaseClient, userId: string, name: string) {
  const { data: household, error: householdError } = await client
    .from("households")
    .insert({ name, created_by: userId })
    .select("id")
    .single();
  const created = assertData(household, householdError, "create household");
  const { error: memberError } = await client.from("household_members").insert({
    household_id: created.id,
    user_id: userId,
    role: "owner",
  });
  if (memberError) throw new Error(`create owner membership failed: ${memberError.message}`);
  return created.id as string;
}

async function resolveOwnHousehold(client: SupabaseClient, userId: string, name: string) {
  const { data: membership, error } = await client
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .order("household_id", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`resolve test household failed: ${error.message}`);
  return membership?.household_id as string | undefined ?? createHousehold(client, userId, name);
}

async function createCategory(client: SupabaseClient, householdId: string, name: string) {
  const { data, error } = await client
    .from("categories")
    .insert({ household_id: householdId, name, sort_order: 0 })
    .select("id")
    .single();
  return assertData(data, error, "create category").id as string;
}

async function createProduct(client: SupabaseClient, householdId: string, categoryId: string, name: string) {
  const { data, error } = await client
    .from("products")
    .insert({ household_id: householdId, category_id: categoryId, name, default_quantity: 1 })
    .select("id")
    .single();
  return assertData(data, error, "create product").id as string;
}

async function createList(client: SupabaseClient, householdId: string, userId: string, name: string) {
  const { data, error } = await client
    .from("shopping_lists")
    .insert({ household_id: householdId, created_by: userId, name, budget: 0, status: "completed" })
    .select("id")
    .single();
  return assertData(data, error, "create shopping list").id as string;
}

beforeAll(async () => {
  const [a, b, c] = await Promise.all([
    signIn(credentials.a.email!, credentials.a.password!),
    signIn(credentials.b.email!, credentials.b.password!),
    signIn(credentials.c.email!, credentials.c.password!),
  ]);
  userA = a.client;
  userB = b.client;
  userC = c.client;
  anonymous = createClient(testUrl!, anonKey!, clientOptions);

  const suffix = randomUUID();
  const { error: profileError } = await userA.from("profiles").upsert({
    id: a.userId,
    display_name: `RESTOK test A ${suffix}`,
  });
  if (profileError) throw new Error(`create profile fixture failed: ${profileError.message}`);

  const householdA = await resolveOwnHousehold(userA, a.userId, `RESTOK test A ${suffix}`);
  const householdB = await resolveOwnHousehold(userB, b.userId, `RESTOK test B ${suffix}`);

  const { data: invite, error: inviteError } = await userA.rpc("create_household_invite");
  const token = assertData(invite, inviteError, "create invite");
  const { data: acceptedHousehold, error: acceptError } = await userC.rpc("accept_household_invite", { invite_token: token });
  const householdAFromInvite = assertData(acceptedHousehold, acceptError, "accept invite") as string;
  if (householdAFromInvite !== householdA) {
    throw new Error("The test account A must create its first household so invite ownership is deterministic.");
  }

  const categoryA = await createCategory(userA, householdA, `A ${suffix}`);
  const categoryB = await createCategory(userB, householdB, `B ${suffix}`);
  const productA = await createProduct(userA, householdA, categoryA, `Product A ${suffix}`);
  const productB = await createProduct(userB, householdB, categoryB, `Product B ${suffix}`);
  const listA = await createList(userA, householdA, a.userId, `List A ${suffix}`);
  const listB = await createList(userB, householdB, b.userId, `List B ${suffix}`);
  const { data: item, error: itemError } = await userA
    .from("shopping_list_items")
    .insert({ shopping_list_id: listA, product_id: productA, category_id: categoryA, name: `Item A ${suffix}`, quantity: 1 })
    .select("id")
    .single();
  const itemA = assertData(item, itemError, "create shopping item");

  fixture = {
    householdA,
    householdB,
    listA,
    listB,
    categoryA,
    categoryB,
    productA,
    productB,
    itemA: itemA.id as string,
    userA: a.userId,
    userB: b.userId,
    userC: c.userId,
  };
});

afterAll(async () => {
  await Promise.all([userA?.auth.signOut(), userB?.auth.signOut(), userC?.auth.signOut()]);
});

describe("tenant isolation through PostgREST", () => {
  it("lets A and invited C share A while B sees only B", async () => {
    const [aLists, cLists, bLists, cOtherHousehold] = await Promise.all([
      userA.from("shopping_lists").select("id").eq("id", fixture.listA),
      userC.from("shopping_lists").select("id").eq("id", fixture.listA),
      userB.from("shopping_lists").select("id").eq("id", fixture.listA),
      userC.from("shopping_lists").select("id").eq("id", fixture.listB),
    ]);
    expect(aLists.data).toHaveLength(1);
    expect(cLists.data).toHaveLength(1);
    expect(bLists.data ?? []).toHaveLength(0);
    expect(cOtherHousehold.data ?? []).toHaveLength(0);

    const ownBList = await userB.from("shopping_lists").select("id").eq("id", fixture.listB);
    expect(ownBList.data).toHaveLength(1);

    const cMembership = await userC
      .from("household_members")
      .select("role")
      .eq("household_id", fixture.householdA)
      .single();
    expect(cMembership.data?.role).toBe("member");
  });

  it("rejects direct membership creation and forged roles", async () => {
    const { data: probe, error: householdError } = await userA
      .from("households")
      .insert({ name: `Membership probe ${randomUUID()}`, created_by: fixture.userA })
      .select("id")
      .single();
    const probeHousehold = assertData(probe, householdError, "create membership probe household");

    const forgedMember = await userA.from("household_members").insert({
      household_id: probeHousehold.id,
      user_id: fixture.userA,
      role: "member",
    });
    expect(forgedMember.error).not.toBeNull();

    const forgedThirdParty = await userA.from("household_members").insert({
      household_id: probeHousehold.id,
      user_id: fixture.userC,
      role: "owner",
    });
    expect(forgedThirdParty.error).not.toBeNull();

    const arbitraryJoin = await userA.from("household_members").insert({
      household_id: fixture.householdB,
      user_id: fixture.userA,
      role: "owner",
    });
    expect(arbitraryJoin.error).not.toBeNull();

    const legitimateOwner = await userA.from("household_members").insert({
      household_id: probeHousehold.id,
      user_id: fixture.userA,
      role: "owner",
    });
    expect(legitimateOwner.error).toBeNull();
  });

  it("rejects cross-household product and category references but accepts snapshots", async () => {
    const tenantMove = await userA
      .from("products")
      .update({ household_id: fixture.householdB })
      .eq("id", fixture.productA)
      .select("id");
    expect(tenantMove.error?.code).toBe("42501");

    const crossProductCategory = await userA.from("products").insert({
      household_id: fixture.householdA,
      category_id: fixture.categoryB,
      name: `Cross category ${randomUUID()}`,
      default_quantity: 1,
    });
    expect(crossProductCategory.error?.code).toBe("23503");

    const crossHouseholdProduct = await userA.from("shopping_list_items").insert({
      shopping_list_id: fixture.listA,
      product_id: fixture.productB,
      category_id: fixture.categoryA,
      name: `Cross product ${randomUUID()}`,
      quantity: 1,
    });
    expect(crossHouseholdProduct.error?.code).toBe("23503");

    const { data: manualItem, error: manualItemError } = await userA.from("shopping_list_items").insert({
      shopping_list_id: fixture.listA,
      product_id: null,
      category_id: fixture.categoryA,
      name: `Manual snapshot ${randomUUID()}`,
      quantity: 1,
    }).select("id").single();
    const savedManualItem = assertData(manualItem, manualItemError, "create manual snapshot");

    const categoryDelete = await userA.from("categories").delete().eq("id", fixture.categoryA).select("id");
    expect(categoryDelete.error).toBeNull();
    expect(categoryDelete.data).toHaveLength(1);

    const [itemAfterCategoryDelete, productAfterCategoryDelete] = await Promise.all([
      userA.from("shopping_list_items").select("id,category_id,product_id").eq("id", savedManualItem.id),
      userA.from("products").select("id,category_id").eq("id", fixture.productA),
    ]);
    expect(itemAfterCategoryDelete.data?.[0]).toMatchObject({ id: savedManualItem.id, category_id: null, product_id: null });
    expect(productAfterCategoryDelete.data?.[0]).toMatchObject({ id: fixture.productA, category_id: null });
  });

  it("blocks foreign reads, updates, deletes, profile enumeration, and helper RPCs", async () => {
    const [foreignList, foreignUpdate, foreignDelete, foreignProfile] = await Promise.all([
      userB.from("shopping_lists").select("id").eq("id", fixture.listA),
      userB.from("shopping_list_items").update({ name: "tampered" }).eq("id", fixture.itemA).select("id"),
      userB.from("shopping_list_items").delete().eq("id", fixture.itemA).select("id"),
      userC.from("profiles").select("id").eq("id", fixture.userA),
    ]);
    expect(foreignList.data ?? []).toHaveLength(0);
    expect(foreignUpdate.data ?? []).toHaveLength(0);
    expect(foreignDelete.data ?? []).toHaveLength(0);
    expect(foreignProfile.data ?? []).toHaveLength(0);

    const helperRpc = await userB.rpc("household_for_list", { target_list: fixture.listA });
    expect(helperRpc.error).not.toBeNull();

    const anonymousRead = await anonymous.from("shopping_lists").select("id").eq("id", fixture.listA);
    expect(anonymousRead.error !== null || (anonymousRead.data ?? []).length === 0).toBe(true);
  });
});
