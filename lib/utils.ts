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

export const makeId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
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
