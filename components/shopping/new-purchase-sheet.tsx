"use client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { MoneyField } from "@/components/ui/money-field";
import { SearchField } from "@/components/ui/search-field";
import { Sheet } from "@/components/ui/sheet";
import { parseMoney } from "@/lib/money";
import { type Product,type ShoppingList } from "@/lib/types";
import { listPending } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import styles from "./purchase-sheets.module.css";
import { usePurchaseSelection } from "./use-purchase-selection";
export function NewPurchaseSheet({
  products,
  activeList,
  onClose,
  onCreate,
}: {
  products: Product[];
  activeList: ShoppingList | null;
  onClose: () => boolean;
  onCreate: (name: string, budget: number, selectedIds: string[]) => void;
}) {
  const [name, setName] = useState(`Compras de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date())}`);
  const [budget, setBudget] = useState("800");
  const [error, setError] = useState("");
  const { query, setQuery, selected, activeProducts, visibleProducts, allVisibleSelected, toggle, toggleVisible } = usePurchaseSelection(products);
  const normalizedQuery = query.trim();
  return <Sheet title="Nova compra" description="Comece com os produtos que costumam fazer parte da casa." onClose={onClose} wide footer={<Button className={styles.full} onClick={() => { const parsed = parseMoney(budget); if (!parsed.ok || parsed.value === undefined) { setError("Informe um orçamento válido, igual ou maior que zero."); return; } if (onClose()) onCreate(name.trim() || "Nova compra", parsed.value, [...selected]); }}>{activeList ? "Encerrar atual e começar" : "Começar compra"} <ArrowLeft className={styles.forward} size={17} /></Button>}>
    <div className={styles.form}>
      <div className={styles.fields}>
        <Field label="Nome" initialFocus value={name} onChange={(event) => setName(event.target.value)}  />
        <MoneyField label="Orçamento" value={budget} onValueChange={(value) => { setBudget(value); setError(""); }} required error={error || undefined} />
      </div>
      {activeList ? <p role="status" className={styles.warning}>Começar esta compra vai encerrar “{activeList.name}” e movê-la para o histórico. {listPending(activeList) > 0 ? `Ainda há ${listPending(activeList)} itens pendentes.` : "Todos os itens atuais foram resolvidos."}</p> : null}
      <SearchField label="Buscar produtos da casa" value={query} onValueChange={setQuery} />
      <div className={styles.selectionHeader}><div><p className={styles.label}>Produtos da casa</p><p role="status" aria-live="polite" className={styles.hint}>{selected.size} de {activeProducts.length} selecionados</p></div><button type="button" className={styles.selectionAction} onClick={toggleVisible}>{allVisibleSelected ? "Desmarcar resultados" : normalizedQuery ? "Selecionar resultados" : "Selecionar todos"}</button></div>
      <div className={styles.products}>
        {visibleProducts.length ? visibleProducts.map((product) => <label key={product.id} className={styles.product}><input type="checkbox" checked={selected.has(product.id)} onChange={() => toggle(product.id)} className={styles.checkbox} /><span className={styles.productName}>{product.name}</span><span className={styles.productQuantity}>{product.defaultQuantity} un.</span></label>) : <p className={styles.empty}>{activeProducts.length ? "Nenhum produto corresponde à busca." : "Adicione produtos da casa para preparar uma compra mais rápido."}</p>}
      </div>

    </div>
  </Sheet>;
}

