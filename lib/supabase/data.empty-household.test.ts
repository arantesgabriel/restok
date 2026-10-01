import { expect, it, vi } from "vitest";
import { loadRemoteState } from "@/lib/supabase/data";
import type { RemoteContext } from "@/lib/supabase/data";
import { CATEGORY_ORDER } from "@/lib/types";

it("keeps an empty household empty instead of inserting sample products", async () => {
  const insert = vi.fn();
  const from = vi.fn((table: string) => {
    const result = { data: table === "categories" ? CATEGORY_ORDER.map((name, index) => ({ id: `category-${index}`, name })) : [], error: null };
    const query = { select: () => query, eq: () => query, order: () => query, insert, then: (resolve: (value: typeof result) => unknown) => Promise.resolve(resolve(result)) };
    return query;
  });
  const context = { client: { from }, userId: "user", householdId: "house", householdName: "Casa", profileName: "Ana", email: "ana@example.com", role: "owner" } as unknown as RemoteContext;
  const remote = await loadRemoteState(context);
  expect(remote?.state).toEqual({ products: [], lists: [] });
  expect(insert).not.toHaveBeenCalled();
});
