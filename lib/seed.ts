import type { Product, RestokState, ShoppingItem } from "@/lib/types";

const productSeed: Array<[string, Product["category"], number]> = [
  ["Arroz", "Alimentos", 1],
  ["Azeite", "Alimentos", 1],
  ["Batata palha", "Alimentos", 1],
  ["Cebola", "Alimentos", 5],
  ["Chá mate com gás", "Bebidas", 3],
  ["Chimichurri", "Alimentos", 1],
  ["Creme de leite", "Alimentos", 4],
  ["Farinha de trigo", "Alimentos", 1],
  ["Feijão", "Alimentos", 1],
  ["Filé de peito de frango", "Alimentos", 6],
  ["Leite condensado", "Alimentos", 2],
  ["Leite desnatado", "Alimentos", 1],
  ["Lemon pepper", "Alimentos", 1],
  ["Limão", "Alimentos", 3],
  ["Macarrão", "Alimentos", 1],
  ["Massa de alho", "Alimentos", 1],
  ["Massa de bolo", "Alimentos", 1],
  ["Milho", "Alimentos", 3],
  ["Molho de tomate", "Alimentos", 4],
  ["Muçarela 600g", "Alimentos", 1],
  ["Óleo de cozinha", "Alimentos", 2],
  ["Ovos", "Alimentos", 1],
  ["Pão de forma", "Alimentos", 2],
  ["Picanha suína", "Alimentos", 1],
  ["Pimenta-do-reino", "Alimentos", 1],
  ["Presunto 300g", "Alimentos", 1],
  ["Requeijão", "Alimentos", 1],
  ["Sal", "Alimentos", 1],
  ["Água com gás (fardo)", "Bebidas", 24],
  ["Coca Zero (fardo)", "Bebidas", 24],
  ["Energético Monster", "Bebidas", 1],
  ["Cotonete", "Higiene", 21],
  ["Colgate", "Higiene", 1],
  ["Creme de pentear", "Higiene", 1],
  ["Desodorante Brunna", "Higiene", 1],
  ["Desodorante Gabriel", "Higiene", 1],
  ["Lenço umedecido", "Higiene", 1],
  ["Sabonete", "Higiene", 3],
  ["Shampoo", "Higiene", 1],
  ["Cif", "Limpeza", 1],
  ["Detergente", "Limpeza", 2],
  ["Papel higiênico (pct c/12)", "Limpeza", 1],
  ["Papel toalha", "Limpeza", 2],
  ["Sabão em pó", "Limpeza", 1],
  ["Saco de lixo grande", "Limpeza", 1],
  ["Veja", "Limpeza", 1],
];

export const seedProducts: Product[] = productSeed.map(([name, category, defaultQuantity], index) => ({
  id: `product-${index + 1}`,
  name,
  category,
  defaultQuantity,
  active: true,
}));

const historicalPrices: Record<string, number> = {
  Arroz: 15.89,
  Azeite: 28.9,
  "Batata palha": 17.9,
  Cebola: 3.96,
  "Chá mate com gás": 4.39,
  Chimichurri: 6.29,
  "Creme de leite": 2.69,
  "Farinha de trigo": 3.49,
  Feijão: 8.79,
  "Filé de peito de frango": 17.59,
  "Leite condensado": 5.49,
  "Leite desnatado": 5.19,
  "Lemon pepper": 6.29,
  Limão: 0.8,
  Macarrão: 5.99,
  "Massa de alho": 5.99,
  "Massa de bolo": 10.49,
  Milho: 3.29,
  "Molho de tomate": 1.89,
  "Muçarela 600g": 31.33,
  "Óleo de cozinha": 6.99,
  Ovos: 14.9,
  "Pão de forma": 3.98,
  "Picanha suína": 31.64,
  "Pimenta-do-reino": 1.99,
  "Presunto 300g": 9.5,
  Requeijão: 14.99,
  Sal: 2.29,
  "Água com gás (fardo)": 1.89,
  "Coca Zero (fardo)": 1.69,
  "Energético Monster": 8.99,
  Cotonete: 4.39,
  Colgate: 2.49,
  "Creme de pentear": 16.9,
  "Desodorante Brunna": 17.9,
  "Desodorante Gabriel": 14.99,
  "Lenço umedecido": 12.98,
  Sabonete: 2.98,
  Shampoo: 14.99,
  Cif: 9.98,
  Detergente: 2.49,
  "Papel higiênico (pct c/12)": 16.9,
  "Papel toalha": 4.29,
  "Sabão em pó": 17.89,
  "Saco de lixo grande": 11.9,
  Veja: 5.99,
};

const makeItems = (statusPattern: (index: number, product: Product) => ShoppingItem["status"], withPrices: boolean) =>
  seedProducts.map((product, index) => {
    const price = historicalPrices[product.name];
    return {
      id: `item-${product.id}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      quantity: product.defaultQuantity,
      ...(withPrices && price ? { unitPrice: price } : {}),
      status: statusPattern(index, product),
    };
  });

const activeItems = makeItems((index) => {
  if (index % 9 === 1 || index === 12 || index === 33) return "purchased";
  if (index % 13 === 4 || index === 39) return "already_have";
  return "pending";
}, true);

export const seedState: RestokState = {
  products: seedProducts,
  lists: [
    {
      id: "list-active",
      name: "Compras de Setembro",
      budget: 800,
      status: "active",
      startedAt: "2026-09-01T09:30:00.000Z",
      items: activeItems,
    },
    {
      id: "list-august",
      name: "Compras de Agosto",
      budget: 800,
      status: "completed",
      startedAt: "2026-08-04T10:00:00.000Z",
      finishedAt: "2026-08-04T11:25:00.000Z",
      items: makeItems((index) => (index % 4 === 0 ? "already_have" : "purchased"), true).map((item, index) => ({
        ...item,
        unitPrice: item.unitPrice ? Number((item.unitPrice * (index % 3 === 0 ? 0.96 : 1)).toFixed(2)) : undefined,
      })),
    },
  ],
};
