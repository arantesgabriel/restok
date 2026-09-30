import type { CategoryName, ItemStatus, ShoppingItem, ShoppingList } from "@/lib/types";

export const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatPercent = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 }).format(value);

export const monthLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(date));

export const shortDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(date));

export const makeId = (_prefix: string) => {
  const bytes = new Uint8Array(16);
  const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (cryptoApi) cryptoApi.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const categoryIcon = (category: CategoryName) => {
  const icons: Record<CategoryName, string> = {
    Alimentos: "◌",
    Bebidas: "◍",
    Higiene: "⌁",
    Limpeza: "✦",
    Outros: "＋",
  };
  return icons[category];
};

export const statusLabel = (status: ItemStatus) => {
  const labels: Record<ItemStatus, string> = {
    pending: "Pendente",
    purchased: "Comprado",
    already_have: "Já temos",
  };
  return labels[status];
};

export const statusAfterPrice = (status: ItemStatus, unitPrice: number) => {
  if (status === "already_have") return "already_have" as const;
  if (unitPrice > 0) return "purchased" as const;
  return status;
};

export const itemSubtotal = (item: ShoppingItem) =>
  item.status === "purchased" && item.unitPrice ? item.quantity * item.unitPrice : 0;

export const listTotal = (list: ShoppingList) => list.items.reduce((total, item) => total + itemSubtotal(item), 0);

export const listResolved = (list: ShoppingList) =>
  list.items.filter((item) => item.status !== "pending").length;

export const listPending = (list: ShoppingList) => list.items.filter((item) => item.status === "pending").length;

export const latestPriceFor = (productId: string | undefined, lists: ShoppingList[]) => {
  if (!productId) return undefined;
  const previous = lists
    .filter((list) => list.status === "completed")
    .sort((a, b) => +new Date(b.finishedAt ?? b.startedAt) - +new Date(a.finishedAt ?? a.startedAt))
    .flatMap((list) => list.items)
    .find((item) => item.productId === productId && item.status === "purchased" && item.unitPrice);
  return previous?.unitPrice;
};

export const groupItems = (items: ShoppingItem[]) =>
  items.reduce<Partial<Record<CategoryName, ShoppingItem[]>>>((groups, item) => {
    (groups[item.category] ??= []).push(item);
    return groups;
  }, {});
