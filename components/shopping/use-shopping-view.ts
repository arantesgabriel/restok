"use client";
import { useMemo, useState } from "react";
import type { ItemStatus, ShoppingList } from "@/lib/types";
import { groupItems, sortByName } from "@/lib/utils";
export type ShoppingFilter = "all" | ItemStatus;
export type ShoppingViewMode = "list" | "category" | "alphabetical";
export function useShoppingView(list: ShoppingList | null) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ShoppingFilter>("all");
  const [shopViewMode, setShopViewMode] = useState<ShoppingViewMode>("list");
  const filteredItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return (list?.items ?? []).filter(item => (!needle || item.name.toLocaleLowerCase("pt-BR").includes(needle) || item.category.toLocaleLowerCase("pt-BR").includes(needle)) && (filter === "all" || item.status === filter));
  }, [list, query, filter]);
  return { query, setQuery, filter, setFilter, shopViewMode, setShopViewMode, filteredItems, orderedItems:[...filteredItems].sort((a,b)=>a.sortOrder-b.sortOrder), groups: groupItems(filteredItems), alphabeticalItems: sortByName(filteredItems, "asc") };
}
