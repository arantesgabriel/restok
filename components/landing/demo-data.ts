import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { listTotal } from "@/lib/utils";

export const exampleLabel = "Exemplo ilustrativo";

export const showcaseItems: ShoppingItem[] = [
  { id: "tomate", name: "Tomate", category: "Alimentos", quantity: 1, unitPrice: 8.9, status: "pending", sortOrder: 0 },
  { id: "leite", name: "Leite", category: "Bebidas", quantity: 2, unitPrice: 5.9, status: "pending", sortOrder: 1 },
  { id: "pao", name: "Pão", category: "Alimentos", quantity: 1, unitPrice: 6.5, status: "purchased", sortOrder: 2 },
  { id: "banana", name: "Banana", category: "Alimentos", quantity: 1, unitPrice: 5.9, status: "purchased", sortOrder: 3 },
];

export const showcaseList: ShoppingList = {
  id: "landing-showcase",
  name: "Compra da semana",
  budget: 80,
  status: "active",
  startedAt: "2026-10-01T12:00:00.000Z",
  items: showcaseItems,
};

export const showcaseBudget = showcaseList.budget;
export const showcaseRegistered = listTotal(showcaseList);
export const showcaseRemaining = showcaseBudget - showcaseRegistered;

export const countPurchased = (items: ShoppingItem[]) => items.filter((item) => item.status === "purchased").length;

export const showcasePurchasedCount = countPurchased(showcaseItems);

export const categories = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"] as const;

export const householdPeople = [
  { initial: "A", role: "Quem convidou" },
  { initial: "B", role: "Quem entrou pelo link" },
] as const;

export const previousBreadPrice = 6.2;

const historyItem = (id: string, name: string, category: ShoppingItem["category"], quantity: number, unitPrice: number): ShoppingItem => ({
  id,
  name,
  category,
  quantity,
  unitPrice,
  status: "purchased",
  sortOrder: 0,
});

export const historyLists: Array<ShoppingList & { displayDate: string }> = [
  {
    id: "feira",
    name: "Feira de sábado",
    budget: 40,
    status: "completed",
    startedAt: "2026-09-12T12:00:00.000Z",
    finishedAt: "2026-09-12T15:00:00.000Z",
    displayDate: "12 set",
    items: [
      historyItem("arroz", "Arroz", "Alimentos", 1, 7.5),
      historyItem("feijao", "Feijão", "Alimentos", 2, 8),
      historyItem("oleo", "Óleo", "Alimentos", 1, 9.9),
    ],
  },
  {
    id: "mes",
    name: "Compra do mês",
    budget: 30,
    status: "completed",
    startedAt: "2026-08-28T12:00:00.000Z",
    finishedAt: "2026-08-28T15:00:00.000Z",
    displayDate: "28 ago",
    items: [
      historyItem("sabao", "Sabão", "Limpeza", 1, 12.9),
      historyItem("papel", "Papel", "Limpeza", 2, 4.5),
    ],
  },
  {
    id: "reposicao",
    name: "Reposição rápida",
    budget: 40,
    status: "completed",
    startedAt: "2026-08-14T12:00:00.000Z",
    finishedAt: "2026-08-14T15:00:00.000Z",
    displayDate: "14 ago",
    items: [
      historyItem("cafe", "Café", "Alimentos", 1, 18.4),
      historyItem("acucar", "Açúcar", "Alimentos", 1, 4.2),
      historyItem("leite-anterior", "Leite", "Bebidas", 1, 5.5),
    ],
  },
];
