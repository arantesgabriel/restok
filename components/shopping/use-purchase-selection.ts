"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";

export function usePurchaseSelection(products: Product[]) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set(products.filter(product => product.active).map(product => product.id)));
  const activeProducts = products.filter(product => product.active);
  const needle = query.trim().toLocaleLowerCase("pt-BR");
  const visibleProducts = activeProducts.filter(product => product.name.toLocaleLowerCase("pt-BR").includes(needle));
  const allVisibleSelected = visibleProducts.length > 0 && visibleProducts.every(product => selected.has(product.id));
  const toggle = (id: string) => setSelected(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleVisible = () => setSelected(current => {
    const next = new Set(current);
    for (const product of visibleProducts) {
      if (allVisibleSelected) next.delete(product.id); else next.add(product.id);
    }
    return next;
  });
  return { query, setQuery, selected, activeProducts, visibleProducts, allVisibleSelected, toggle, toggleVisible };
}
