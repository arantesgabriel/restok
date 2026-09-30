"use client";

import { ArrowRight, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { CATEGORY_ORDER, type Product } from "@/lib/types";

export function VisualSystemHome({ products, purchaseName, onEdit, onAdd, onPurchase }: {
  products: Product[];
  purchaseName: string;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  onPurchase: () => void;
}) {
  const [order, setOrder] = useState<"category" | "alphabetical">("category");
  const active = products.filter((product) => product.active);
  const sorted = [...active].sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));
  const rows = (items: Product[]) => items.map((product) => <article className="proof-product" key={product.id}>
    <div><h3>{product.name}</h3><p>{product.defaultQuantity} un. por compra{order === "alphabetical" ? ` · ${product.category}` : ""}</p></div>
    <button type="button" className="proof-icon" aria-label={`Editar produto ${product.name}`} onClick={() => onEdit(product)}><Pencil size={18} /></button>
  </article>);

  return <>
    <div className="proof-title"><div><h1>Produtos da casa</h1><p>O que costuma fazer parte da sua lista.</p></div></div>
    <button type="button" className="proof-active-purchase" onClick={onPurchase}><span><small>Compra em andamento</small><strong>{purchaseName}</strong></span><ArrowRight size={20} /></button>
    <div className="proof-home-toolbar"><h2>{active.length} produtos recorrentes</h2><button type="button" className="proof-icon" aria-label="Adicionar produto da casa" onClick={onAdd}><Plus size={20} /></button></div>
    <div className="proof-order" role="group" aria-label="Ordenar produtos">
      <button type="button" aria-pressed={order === "category"} onClick={() => setOrder("category")}>Por categoria</button>
      <button type="button" aria-pressed={order === "alphabetical"} onClick={() => setOrder("alphabetical")}>A–Z</button>
    </div>
    {active.length ? order === "alphabetical" ? <div>{rows(sorted)}</div> : CATEGORY_ORDER.map((category) => {
      const group = sorted.filter((product) => product.category === category);
      return group.length ? <section key={category}><div className="proof-category-label"><h2>{category}</h2><span>{group.length} produtos</span></div>{rows(group)}</section> : null;
    }) : <div className="proof-empty"><h2>Comece pelos produtos que sempre voltam</h2><p>Adicione um produto para preparar sua próxima lista.</p><button type="button" className="proof-button" onClick={onAdd}><Plus size={18} />Adicionar produto</button></div>}
  </>;
}
