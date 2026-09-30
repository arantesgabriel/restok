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
let testTargetUrl: URL;
try {
  testTargetUrl = new URL(testUrl);
} catch {
  throw new Error("RESTOK_TEST_SUPABASE_URL must be a valid local Supabase URL.");
}
if (!["http:", "https:"].includes(testTargetUrl.protocol) || testTargetUrl.username || testTargetUrl.password) {
  throw new Error("RESTOK_TEST_SUPABASE_URL must use HTTP(S) and cannot embed credentials.");
}
if (!["localhost", "127.0.0.1", "[::1]", "::1"].includes(testTargetUrl.hostname.toLowerCase())) {
  throw new Error("The isolation suite only permits a local Supabase URL (localhost or loopback IP).");
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

async function createHousehold(client: SupabaseClient, name: string) {
  const { data, error } = await client.rpc("create_household", { requested_name: name });
  return assertData(data, error, "create household") as string;
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
  const householdA = await createHousehold(userA, `RESTOK test A ${suffix}`);
  const householdB = await createHousehold(userB, `RESTOK test B ${suffix}`);

  const { data: invite, error: inviteError } = await userA.rpc("create_household_invite", { target_household: householdA });
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
    const probeHousehold = await createHousehold(userA, `Membership probe ${randomUUID()}`);

    const forgedMember = await userA.from("household_members").insert({
      household_id: probeHousehold,
      user_id: fixture.userA,
      role: "member",
    });
    expect(forgedMember.error).not.toBeNull();

    const forgedThirdParty = await userA.from("household_members").insert({
      household_id: probeHousehold,
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

    const { data: members, error: membersError } = await userA.rpc("get_household_members", {
      target_household: probeHousehold,
    });
    expect(membersError).toBeNull();
    expect(members).toHaveLength(1);
    expect(members?.[0]).toMatchObject({ user_id: fixture.userA, role: "owner", is_self: true });
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

  it("enforces role lifecycle and single-use invitations", async () => {
    const memberInvite = await userC.rpc("create_household_invite", { target_household: fixture.householdA });
    expect(memberInvite.error).not.toBeNull();

    const promotion = await userA.rpc("change_household_member_role", {
      target_household: fixture.householdA,
      target_user: fixture.userC,
      new_role: "admin",
    });
    expect(promotion.error).toBeNull();

    const { data: invite, error: inviteError } = await userC.rpc("create_household_invite", {
      target_household: fixture.householdA,
    });
    const adminToken = assertData(invite, inviteError, "admin creates invite");
    expect(typeof adminToken).toBe("string");

    const { data: visibleInvites, error: visibleInvitesError } = await userC.rpc("get_household_invites", {
      target_household: fixture.householdA,
    });
    expect(visibleInvitesError).toBeNull();
    expect(visibleInvites?.[0]).toHaveProperty("created_by", fixture.userC);
    expect(visibleInvites?.[0]).not.toHaveProperty("token");
    expect(visibleInvites?.[0]).not.toHaveProperty("token_hash");

    const ownershipAttempt = await userC.rpc("transfer_household_ownership", {
      target_household: fixture.householdA,
      new_owner: fixture.userA,
    });
    expect(ownershipAttempt.error).not.toBeNull();

    const adminPromotionAttempt = await userC.rpc("change_household_member_role", {
      target_household: fixture.householdA,
      target_user: fixture.userA,
      new_role: "admin",
    });
    expect(adminPromotionAttempt.error).not.toBeNull();

    const adminInvites = assertData(visibleInvites, visibleInvitesError, "read admin invites") as Array<{ id: string; created_by: string }>;
    const createdInvite = adminInvites.find((candidate) => candidate.created_by === fixture.userC);
    expect(createdInvite).toBeDefined();
    const revoke = await userC.rpc("revoke_household_invite", { target_invite: createdInvite!.id });
    expect(revoke.error).toBeNull();
    const revokedAcceptance = await userB.rpc("accept_household_invite", { invite_token: adminToken });
    expect(revokedAcceptance.error).not.toBeNull();

    const demotion = await userA.rpc("change_household_member_role", {
      target_household: fixture.householdA,
      target_user: fixture.userC,
      new_role: "member",
    });
    expect(demotion.error).toBeNull();

    const ownerInvite = await userA.rpc("create_household_invite", { target_household: fixture.householdA });
    const ownerToken = assertData(ownerInvite.data, ownerInvite.error, "owner creates invite");
    const accepted = await userC.rpc("accept_household_invite", { invite_token: ownerToken });
    expect(accepted.error).toBeNull();
    expect(accepted.data).toBe(fixture.householdA);
    const replay = await userB.rpc("accept_household_invite", { invite_token: ownerToken });
    expect(replay.error).not.toBeNull();

    const leave = await userC.rpc("leave_household", { target_household: fixture.householdA });
    expect(leave.error).toBeNull();
    const removedMemberRead = await userC.from("shopping_lists").select("id").eq("id", fixture.listA);
    expect(removedMemberRead.data ?? []).toHaveLength(0);

    const lastOwnerLeave = await userA.rpc("leave_household", { target_household: fixture.householdA });
    expect(lastOwnerLeave.error).not.toBeNull();
  });

  it("creates a shopping trip atomically and treats a retry as a no-op", async () => {
    const listId = randomUUID();
    const itemId = randomUUID();
    const requestedList = {
      id: listId,
      name: `Atomic trip ${randomUUID()}`,
      budget: 100,
      status: "active",
      started_at: new Date().toISOString(),
    };
    const requestedItems = [{
      id: itemId,
      product_id: null,
      category_id: fixture.categoryA,
      name: "Manual snapshot",
      quantity: 2,
      unit_price: 10,
      status: "pending",
    }];
    const payload = {
      requested_household: fixture.householdA,
      requested_list: requestedList,
      requested_items: requestedItems,
      idempotent_create: true,
    };

    const create = await userA.rpc("create_shopping_list_with_items", payload);
    expect(create.error).toBeNull();
    const retry = await userA.rpc("create_shopping_list_with_items", payload);
    expect(retry.error).toBeNull();
    expect(retry.data).toBe(listId);

    const [savedList, savedItems, activeLists] = await Promise.all([
      userA.from("shopping_lists").select("id,status").eq("id", listId).single(),
      userA.from("shopping_list_items").select("id").eq("shopping_list_id", listId),
      userA.from("shopping_lists").select("id").eq("household_id", fixture.householdA).eq("status", "active"),
    ]);
    expect(savedList.data?.status).toBe("active");
    expect(savedItems.data).toHaveLength(1);
    expect(savedItems.data?.[0]?.id).toBe(itemId);
    expect(activeLists.data).toHaveLength(1);

    const unauthorizedCreate = await userB.rpc("create_shopping_list_with_items", {
      ...payload,
      requested_list: { ...requestedList, id: randomUUID() },
    });
    expect(unauthorizedCreate.error).not.toBeNull();
  });
});
