import { seedState } from "../fixtures/shopping";
import type { RestokState } from "../../lib/types";

// Browser-only fixtures. No credentials, network client or production route.
export function evidenceState(scenario: string): RestokState {
  const state = structuredClone(seedState);
  state.products = state.products.slice(0, 33);
  state.lists = state.lists.map((list) => ({ ...list, items: list.items.slice(0, 33) }));
  state.lists[0].name = "Compra ilustrativa da casa para o mês";
  if (scenario === "empty") return { products: [], lists: [] };
  if (scenario === "money") {
    const item = { ...state.lists[0].items[2], quantity: 3, status: "purchased" as const };
    state.lists[0] = { ...state.lists[0], budget: 0, items: [{ ...item, unitPrice: 5 }, { ...item, id: "fixture-unpriced", name: "Item sem preço", unitPrice: undefined }] };
    state.lists[1].items = [{ ...item, unitPrice: 0 }];
  }
  return state;
}
