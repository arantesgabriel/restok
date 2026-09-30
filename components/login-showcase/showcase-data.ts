import type { CategoryName, ItemStatus } from "@/lib/types";

/**
 * Uma compra de demonstração com números que fecham entre si.
 * O total é a soma dos itens comprados; "já temos" fica de fora;
 * o disponível é orçamento menos total; economizados é a soma do
 * que ficou abaixo do preço da compra anterior.
 * O mock antigo (R$ 483,72, 28 itens, frango a R$ 158,90) não fechava.
 */
export type DemoItem = {
  id: string;
  name: string;
  category: CategoryName;
  quantity: number;
  unitPriceCents: number;
  previousUnitPriceCents?: number;
  status: ItemStatus;
  addedBy?: string;
};

export const demoListName = "Compras de setembro";
export const demoBudgetCents = 80_000;

export const demoItems: DemoItem[] = [
  { id: "arroz", name: "Arroz", category: "Alimentos", quantity: 4, unitPriceCents: 2490, previousUnitPriceCents: 2690, status: "purchased" },
  { id: "leite", name: "Leite desnatado", category: "Bebidas", quantity: 2, unitPriceCents: 649, previousUnitPriceCents: 699, status: "purchased" },
  { id: "frango", name: "Peito de frango", category: "Alimentos", quantity: 1, unitPriceCents: 3290, previousUnitPriceCents: 3590, status: "purchased" },
  { id: "cafe", name: "Café", category: "Bebidas", quantity: 1, unitPriceCents: 1890, previousUnitPriceCents: 2190, status: "purchased", addedBy: "Maria" },
  { id: "feijao", name: "Feijão", category: "Alimentos", quantity: 3, unitPriceCents: 849, previousUnitPriceCents: 949, status: "purchased" },
  { id: "ovos", name: "Ovos", category: "Alimentos", quantity: 2, unitPriceCents: 1890, previousUnitPriceCents: 2040, status: "purchased" },
  { id: "carne", name: "Carne moída", category: "Alimentos", quantity: 3, unitPriceCents: 4290, previousUnitPriceCents: 4590, status: "purchased" },
  { id: "queijo", name: "Queijo mussarela", category: "Alimentos", quantity: 1, unitPriceCents: 3190, previousUnitPriceCents: 3490, status: "purchased" },
  { id: "azeite", name: "Azeite", category: "Alimentos", quantity: 1, unitPriceCents: 4690, previousUnitPriceCents: 4990, status: "purchased" },
  { id: "papel", name: "Papel higiênico", category: "Higiene", quantity: 1, unitPriceCents: 3290, previousUnitPriceCents: 3490, status: "purchased" },
  { id: "sabonete", name: "Sabonete", category: "Higiene", quantity: 3, unitPriceCents: 350, status: "already_have" },
];

/** Janela do cartão: comprado, comprado, item da colaboração e "já temos". */
export const demoStillItemIds = ["frango", "leite", "cafe", "sabonete"] as const;

/**
 * Itens que entram na cena de planejamento, nesta ordem.
 * Os três primeiros já fazem parte das 10; o café é o 11º, acrescentado pela colaboração.
 */
export const planningSlotIds = ["arroz", "leite", "frango", "cafe"] as const;
export const planningBaseItemCount = 10;
export const planningJoinedItemCount = 11;

export const demoCollaborator = {
  name: "Maria",
  initials: "MA",
  action: "adicionou Café",
} as const;

const earlierTripsCents = [42_140, 43_870, 40_110, 45_580];

export const lineCents = (item: DemoItem) =>
  item.status === "purchased" ? item.quantity * item.unitPriceCents : 0;

export const spentCents = (items: DemoItem[]) =>
  items.reduce((total, item) => total + lineCents(item), 0);

export const savedCents = (items: DemoItem[]) =>
  items.reduce((total, item) => {
    if (item.status !== "purchased" || item.previousUnitPriceCents === undefined) return total;
    const delta = item.previousUnitPriceCents - item.unitPriceCents;
    return delta > 0 ? total + delta * item.quantity : total;
  }, 0);

export const countStatus = (items: DemoItem[], status: ItemStatus) =>
  items.filter((item) => item.status === status).length;

export const resolvedCount = (items: DemoItem[]) =>
  items.filter((item) => item.status !== "pending").length;

export const demoHistoryCents = [...earlierTripsCents, spentCents(demoItems)];

export const demoStory = [
  { id: "planeje", label: "Planeje" },
  { id: "compre", label: "Compre" },
  { id: "acompanhe", label: "Acompanhe" },
] as const;

/** Quadro parado desta fase: a lista no mercado é o cartão dominante. */
export const demoStillStep = "compre" as const;
