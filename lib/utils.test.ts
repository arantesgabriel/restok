import { describe, expect, it } from "vitest";
import { itemSubtotal, latestPriceFor, listPending, listResolved, listTotal } from "@/lib/utils";
import type { ShoppingList } from "@/lib/types";

const list: ShoppingList = {
  id: "list-test",
  name: "Teste",
  budget: 100,
  status: "active",
  startedAt: "2026-09-01T10:00:00.000Z",
  items: [
    { id: "a", productId: "rice", name: "Arroz", category: "Alimentos", quantity: 2, unitPrice: 10, status: "purchased" },
    { id: "b", productId: "milk", name: "Leite", category: "Alimentos", quantity: 1, status: "pending" },
    { id: "c", name: "Sal", category: "Alimentos", quantity: 1, status: "already_have" },
  ],
};

describe("shopping calculations", () => {
  it("only counts purchased items in the total", () => {
    expect(itemSubtotal(list.items[0])).toBe(20);
    expect(listTotal(list)).toBe(20);
    expect(listPending(list)).toBe(1);
    expect(listResolved(list)).toBe(2);
  });

  it("finds the latest purchased price for a recurring product", () => {
    const history: ShoppingList[] = [
      { ...list, id: "older", status: "completed", finishedAt: "2026-08-01T10:00:00.000Z", items: [{ ...list.items[0], unitPrice: 8 }] },
      { ...list, id: "newer", status: "completed", finishedAt: "2026-08-20T10:00:00.000Z", items: [{ ...list.items[0], unitPrice: 9 }] },
    ];
    expect(latestPriceFor("rice", history)).toBe(9);
    expect(latestPriceFor("unknown", history)).toBeUndefined();
  });
});
