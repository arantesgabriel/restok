export const CATEGORY_ORDER = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"] as const;

export type CategoryName = (typeof CATEGORY_ORDER)[number];
export type ItemStatus = "pending" | "purchased" | "already_have";
export type ListStatus = "active" | "completed";
export type HouseholdRole = "owner" | "admin" | "member";

export type HouseholdSummary = {
  id: string;
  name: string;
  role: HouseholdRole;
  createdAt: string;
};

export type HouseholdMember = {
  userId: string;
  role: HouseholdRole;
  joinedAt: string;
  isSelf: boolean;
};

export type HouseholdInvite = {
  id: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  consumedAt: string | null;
  consumedBy: string | null;
  revokedAt: string | null;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryName;
  defaultQuantity: number;
  active: boolean;
};

export type ShoppingItem = {
  id: string;
  productId?: string;
  name: string;
  category: CategoryName;
  quantity: number;
  unitPrice?: number;
  status: ItemStatus;
  sortOrder: number;
};

export type ShoppingList = {
  id: string;
  name: string;
  budget: number;
  status: ListStatus;
  startedAt: string;
  finishedAt?: string;
  items: ShoppingItem[];
};

export type RestokState = {
  products: Product[];
  lists: ShoppingList[];
};
