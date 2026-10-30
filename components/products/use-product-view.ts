"use client";
import { useState } from "react";
import { CATEGORY_ORDER, type CategoryName, type Product } from "@/lib/types";
import { sortByName, type NameSortDirection } from "@/lib/utils";

export function useProductView(products: Product[], categorySort: Partial<Record<CategoryName, NameSortDirection>>) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "category" | "alphabetical">("list");
  const [category, setCategory] = useState<CategoryName | "Todos">("Todos");
  const needle = query.trim().toLocaleLowerCase("pt-BR");
  const matches = products.filter(product => (category === "Todos" || product.category === category) && (!needle || `${product.name} ${product.category}`.toLocaleLowerCase("pt-BR").includes(needle)));
  const active = matches.filter(product => product.active);
  const inactive = sortByName(matches.filter(product => !product.active), "asc");
  const sorted = sortByName(active, "asc");
  const grouped = CATEGORY_ORDER.map(category => ({
    category,
    direction: categorySort[category] ?? "asc",
    products: sortByName(active.filter(product => product.category === category), categorySort[category] ?? "asc"),
  })).filter(section => section.products.length);
  return {category, setCategory, query, setQuery, viewMode, setViewMode, active, inactive, sorted, grouped, resultCount:matches.length};
}
