import { seedState } from "../fixtures/shopping";
import type { RestokState } from "../../lib/types";

// Browser-only fixtures. No credentials, network client or production route.
export function evidenceState(scenario: string): RestokState {
  const state = structuredClone(seedState);
  state.products = state.products.slice(0, 33);
  state.lists = state.lists.map((list) => ({ ...list, items: list.items.slice(0, 33) }));
  state.lists[0].name = "Compra ilustrativa da casa para o mês";
  if (scenario === "empty") return { products: [], lists: [] };
  return state;
}
