import { describe, expect, it } from "vitest";
import { groupItems, itemSubtotal, latestPriceFor, listPending, listResolved, listTotal, nextSortOrder, readCategoryNameSorts, sortByName } from "@/lib/utils";
import type { ShoppingItem, ShoppingList } from "@/lib/types";

const list: ShoppingList = {
  id: "list-test",
  name: "Teste",
  budget: 100,
  status: "active",
  startedAt: "2026-09-01T10:00:00.000Z",
  items: [
    { id: "a", productId: "rice", name: "Arroz", category: "Alimentos", quantity: 2, unitPrice: 10, status: "purchased", sortOrder: 0 },
    { id: "b", productId: "milk", name: "Leite", category: "Alimentos", quantity: 1, status: "pending", sortOrder: 1 },
    { id: "c", name: "Sal", category: "Alimentos", quantity: 1, status: "already_have", sortOrder: 2 },
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

describe("shopping item order", () => {
  const shuffled: ShoppingItem[] = [
    { id: "b", name: "Leite", category: "Bebidas", quantity: 1, status: "pending", sortOrder: 2 },
    { id: "c", name: "Sabonete", category: "Higiene", quantity: 1, status: "already_have", sortOrder: 1 },
    { id: "d", name: "Feijão", category: "Alimentos", quantity: 1, status: "purchased", sortOrder: 3 },
    { id: "a", name: "Arroz", category: "Alimentos", quantity: 1, status: "pending", sortOrder: 0 },
    { id: "e", name: "Café", category: "Bebidas", quantity: 1, status: "pending", sortOrder: 2 },
  ];

  it("keeps each category in the saved position after a status change reshuffles the array", () => {
    const groups = groupItems(shuffled);
    expect(groups.Alimentos?.map((item) => item.id)).toEqual(["a", "d"]);
    expect(groups.Bebidas?.map((item) => item.id)).toEqual(["b", "e"]);
    expect(groups.Higiene?.map((item) => item.id)).toEqual(["c"]);
  });

  it("breaks equal positions by id", () => {
    expect(groupItems(shuffled).Bebidas?.map((item) => item.id)).toEqual(["b", "e"]);
  });

  it("puts a new item after the last saved position", () => {
    expect(nextSortOrder(shuffled)).toBe(4);
    expect(nextSortOrder([])).toBe(0);
  });
});

describe("category name order", () => {
  const products = [
    { name: "Óleo" },
    { name: "Água" },
    { name: "Arroz" },
  ];

  it("sorts one category from A to Z and another from Z to A", () => {
    expect(sortByName(products, "asc").map((product) => product.name)).toEqual(["Água", "Arroz", "Óleo"]);
    expect(sortByName(products, "desc").map((product) => product.name)).toEqual(["Óleo", "Arroz", "Água"]);
    expect(products.map((product) => product.name)).toEqual(["Óleo", "Água", "Arroz"]);
  });

  it("keeps only a valid direction for each known category", () => {
    expect(readCategoryNameSorts(JSON.stringify({ Alimentos: "desc", Higiene: "asc", Bebidas: "sideways", Extra: "desc" }))).toEqual({
      Alimentos: "desc",
      Higiene: "asc",
    });
    expect(readCategoryNameSorts("not-json")).toEqual({});
    expect(readCategoryNameSorts(null)).toEqual({});
  });
});
