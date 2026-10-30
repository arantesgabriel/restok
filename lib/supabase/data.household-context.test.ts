/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({
  user: "account-a", members: [] as { household_id: string; role: string }[], authError: false, membershipError: false, householdError: false,
  from: vi.fn(), getUser: vi.fn(),
}));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: () => ({ auth: { getUser: fixture.getUser }, from: fixture.from }) }));
import { activeHouseholdStorageKey, resolveRemoteContext } from "@/lib/supabase/data";

beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear();
  fixture.user = "account-a"; fixture.authError = false; fixture.membershipError = false; fixture.householdError = false;
  fixture.members = [{ household_id: "first", role: "owner" }, { household_id: "second", role: "member" }];
  fixture.getUser.mockImplementation(async () => ({ data: { user: fixture.authError ? null : { id: fixture.user, user_metadata: {} } }, error: fixture.authError ? {} : null }));
  fixture.from.mockImplementation((table: string) => {
    let id = "";
    const query = {
      select: () => query,
      eq: (column: string, value: string) => { if (column === "id") id = value; return query; },
      order: () => query,
      maybeSingle: async () => ({ data: { display_name: "Teste" }, error: null }),
      single: async () => ({ data: fixture.householdError ? null : { id, name: `Casa ${id}` }, error: fixture.householdError ? {} : null }),
      then: (resolve: (value: unknown) => unknown) => Promise.resolve(resolve({ data: table === "household_members" ? fixture.members : [], error: fixture.membershipError ? {} : null })),
    };
    return query;
  });
});
afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

describe("authorized household resolution", () => {
  it("uses the saved authorized membership when preference is omitted", async () => {
    localStorage.setItem(activeHouseholdStorageKey(fixture.user), "second");
    expect(await resolveRemoteContext()).toMatchObject({ householdId: "second", userId: "account-a", role: "member" });
  });
  it("gives an explicit accepted/selected household priority over storage", async () => {
    localStorage.setItem(activeHouseholdStorageKey(fixture.user), "second");
    expect(await resolveRemoteContext("first")).toMatchObject({ householdId: "first" });
  });
  it("preserves the explicit null contract instead of consulting storage", async () => {
    localStorage.setItem(activeHouseholdStorageKey(fixture.user), "second");
    expect(await resolveRemoteContext(null)).toMatchObject({ householdId: "first" });
  });
  it.each([undefined, "revoked"])("only falls back to an authorized membership (%s)", async (preferred) => {
    localStorage.setItem(activeHouseholdStorageKey(fixture.user), "revoked");
    expect(await resolveRemoteContext(preferred)).toMatchObject({ householdId: "first" });
  });
  it("does not inherit another person's saved membership", async () => {
    localStorage.setItem(activeHouseholdStorageKey("account-a"), "second");
    fixture.user = "account-b";
    expect(await resolveRemoteContext()).toMatchObject({ householdId: "first", userId: "account-b" });
  });
  it("still validates membership when the localStorage getter is denied", async () => {
    const getter = vi.spyOn(window, "localStorage", "get").mockImplementation(() => { throw new Error("denied"); });
    expect(await resolveRemoteContext()).toMatchObject({ householdId: "first" });
    expect(getter).toHaveBeenCalled();
  });
  it.each(["auth", "membership", "household", "empty"])("fails closed on %s failure/absence", async (kind) => {
    if (kind === "auth") fixture.authError = true;
    if (kind === "membership") fixture.membershipError = true;
    if (kind === "household") fixture.householdError = true;
    if (kind === "empty") fixture.members = [];
    expect(await resolveRemoteContext("second")).toBeNull();
  });
});
