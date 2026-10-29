import { seedState } from "../fixtures/shopping";
import type { RestokState } from "../../lib/types";

// Browser-only fixtures. No credentials, network client or production route.
export function evidenceState(scenario: string): RestokState {
  const state = structuredClone(seedState);
  state.products = state.products.slice(0, 33);
  state.lists = state.lists.map((list) => ({ ...list, items: list.items.slice(0, 33) }));
  state.lists[0].name = "Compra ilustrativa da casa para o mês";
  if (scenario === "empty") return { products: [], lists: [] };
  if (scenario === "collection100") {
    state.products = Array.from({length:100},(_,index)=>({...state.products[index%33],id:`collection-${index}`,name:`${state.products[index%33].name} · ${index+1}`}));
  }
  if (scenario === "catalog") {
    const prefix="Produto recorrente com nome longo para conferir leitura completa no catálogo ";
    state.products[0]={...state.products[0],name:prefix.padEnd(79,"A")+"A",defaultQuantity:999999};
    state.products[1]={...state.products[1],name:prefix.padEnd(79,"A")+"B"};
    state.products[2]={...state.products[2],active:false};
  }
  if (scenario === "money") {
    const item = { ...state.lists[0].items[2], quantity: 3, status: "purchased" as const };
    state.lists[0] = { ...state.lists[0], budget: 0, items: [{ ...item, unitPrice: 5 }, { ...item, id: "fixture-unpriced", name: "Item sem preço", unitPrice: undefined }] };
    state.lists[1].items = [{ ...item, unitPrice: 0 }];
  }
  if (scenario === "stress") {
    state.lists[0].items[0] = {...state.lists[0].items[0],name:"Produto com um nome completo muito longo para verificar leitura e quebra em celulares",quantity:999999,unitPrice:9999999999.99,status:"purchased"};
  }
  return state;
}
