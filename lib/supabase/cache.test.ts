import { describe, expect, it } from "vitest";
import { clearRemoteStateCaches, DEMO_STATE_KEY, remoteStateStorageKey } from "@/lib/supabase/cache";

describe("remote state cache scope", () => {
  it("separates users that share a browser", () => {
    expect(remoteStateStorageKey("user-a", "household-1")).not.toBe(
      remoteStateStorageKey("user-b", "household-1"),
    );
  });

  it("separates households for a user with multiple memberships", () => {
    expect(remoteStateStorageKey("user-a", "household-1")).not.toBe(
      remoteStateStorageKey("user-a", "household-2"),
    );
  });

  it("keeps anonymous demo data outside authenticated tenant caches", () => {
    expect(DEMO_STATE_KEY).not.toBe(remoteStateStorageKey("user-a", "household-1"));
  });

  it("clears every household cache for one user and preserves other users", () => {
    const entries = new Map([
      [remoteStateStorageKey("user-a", "household-1"), "a1"],
      [remoteStateStorageKey("user-a", "household-2"), "a2"],
      [remoteStateStorageKey("user-b", "household-1"), "b1"],
    ]);
    const storage = {
      get length() { return entries.size; },
      key(index: number) { return [...entries.keys()][index] ?? null; },
      removeItem(key: string) { entries.delete(key); },
    };

    clearRemoteStateCaches(storage, "user-a");

    expect([...entries.values()]).toEqual(["b1"]);
  });
});
