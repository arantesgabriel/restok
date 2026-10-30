import { seedState } from "../fixtures/shopping";
import type { RestokState } from "../../lib/types";
import demoSeed from "../../docs/restok-demo-v6-handoff/fixtures/demo-seed.json";

// Browser-only fixtures. No credentials, network client or production route.
export function evidenceState(scenario: string): RestokState {
  if (scenario === "demo-v6") {
    // Test-only adapter. The real category vocabulary and missing-price semantics
    // remain intact; no demo data is imported by production sources.
    const category = (name: string) => name === "Limpeza" ? "Limpeza" as const : "Alimentos" as const;
    return {
      products: demoSeed.houses.home.catalog.map(product => ({ id:String(product.id),name:product.name,category:category(product.cat),defaultQuantity:product.qty,active:product.active })),
      lists: [{ id:"demo-v6",name:"Compra da semana",budget:demoSeed.houses.home.budget,status:"active",startedAt:"2026-10-28T12:00:00.000Z",items:demoSeed.houses.home.items.map((item,index) => ({ id:String(item.id),productId:String(item.id),name:item.name,category:category(item.cat),quantity:item.qty,unitPrice:item.price ?? undefined,status:item.state === "done" ? "purchased" as const : item.state === "have" ? "already_have" as const : "pending" as const,sortOrder:index })) }],
    };
  }
  // Mirrors only the five fictitious products created with explicit permission
  // for the PR08 gate. The previous UI runs without any backend/session.
  if (scenario === "catalog-pr08-compare") return {
    lists: [],
    products: [
      { id: "qa08-a", name: "Produto de teste com nome longo para conferir leitura completa no catálogo PR08 A", category: "Alimentos", defaultQuantity: 999999, active: true },
      { id: "qa08-rice", name: "Arroz QA PR08", category: "Alimentos", defaultQuantity: 1, active: true },
      { id: "qa08-water", name: "Água QA PR08", category: "Bebidas", defaultQuantity: 1, active: true },
      { id: "qa08-soap", name: "Sabão editado QA PR08", category: "Limpeza", defaultQuantity: 3, active: true },
      { id: "qa08-b", name: "Produto de teste com nome longo para conferir leitura completa no catálogo PR08 B", category: "Higiene", defaultQuantity: 1, active: true },
    ],
  };
  const state = structuredClone(seedState);
  state.products = state.products.slice(0, 33);
  state.lists = state.lists.map((list) => ({ ...list, items: list.items.slice(0, 33) }));
  state.lists[0].name = "Compra ilustrativa da casa para o mês";
  if (scenario === "empty") return { products: [], lists: [] };
  if (scenario === "few") state.lists[0].items = state.lists[0].items.slice(0, 3);
  if (scenario === "empty-list") state.lists[0].items = [];
  if (scenario === "collection100") {
    state.products = Array.from({length:100},(_,index)=>({...state.products[index%33],id:`collection-${index}`,name:`${state.products[index%33].name} · ${index+1}`}));
  }
  if (scenario === "list100") {
    const source = state.lists[0].items;
    state.lists[0].items = Array.from({ length: 100 }, (_, index) => {
      const item = source[index % source.length];
      const status = index % 9 === 0 ? "purchased" as const : index % 13 === 0 ? "already_have" as const : "pending" as const;
      return { ...item, id: `fixture-list100-${index + 1}`, name: `${item.name} · ${String(index + 1).padStart(3, "0")}`, sortOrder: index, status };
    });
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
  if (scenario === "money-equal" || scenario === "money-over") {
    const priced = { ...state.lists[0].items[2], quantity: 3, status: "purchased" as const, unitPrice: 5 };
    const unpriced = { ...state.lists[0].items[1], id: "fixture-equal-unpriced", name: "Item comprado sem preço", status: "purchased" as const, unitPrice: undefined };
    state.lists[0] = { ...state.lists[0], budget: scenario === "money-equal" ? 15 : 10, items: [priced, unpriced] };
  }
  if (scenario === "money-high") {
    const item = { ...state.lists[0].items[2], name: "Produto com nome extenso para conferir o alinhamento do valor completo em telas estreitas", quantity: 1, status: "purchased" as const, unitPrice: 9999999.99 };
    state.lists[0] = { ...state.lists[0], budget: 100, items: [item] };
  }
  if (scenario === "stress") {
    state.lists[0].items[0] = {...state.lists[0].items[0],name:"Produto com um nome completo muito longo para verificar leitura e quebra em celulares",quantity:999999,unitPrice:9999999999.99,status:"purchased"};
  }
  return state;
}
