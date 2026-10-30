import { describe, expect, it, vi } from "vitest";
import { browserStorage, clearRemoteStateCaches, remoteStateStorageKey } from "@/lib/supabase/cache";

it("treats denied storage methods and quota failure as optional persistence", () => {
  const denied = () => { throw new Error("denied or quota exceeded"); };
  vi.stubGlobal("window", { localStorage: { get length() { return denied(); }, key: denied, getItem: denied, setItem: denied, removeItem: denied } });
  try {
    expect(browserStorage.getItem("key")).toBeNull();
    expect(browserStorage.key(0)).toBeNull();
    expect(browserStorage.length).toBe(0);
    expect(() => browserStorage.setItem("key", "value")).not.toThrow();
    expect(() => browserStorage.removeItem("key")).not.toThrow();
    expect(() => clearRemoteStateCaches(browserStorage, "person")).not.toThrow();
  } finally { vi.unstubAllGlobals(); }
});

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
