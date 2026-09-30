"use client";

import Image from "next/image";
import { Check, ChevronDown, House, Plus, Search, ShoppingBasket, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { seedState } from "@/lib/seed";
import { VisualSystemHome } from "@/components/visual-system-home";
import { VisualSystemEditor, type ProofEditor } from "@/components/visual-system-editor";
import { CATEGORY_ORDER, type ItemStatus } from "@/lib/types";
import { cn, formatBRL, groupItems, itemSubtotal, listPending, listResolved, listTotal, makeId, nextSortOrder, statusLabel } from "@/lib/utils";

type Filter = "all" | ItemStatus;

export function VisualSystemProof() {
  const [list, setList] = useState(seedState.lists[0]);
  const [screen, setScreen] = useState<"shop" | "home">("shop");
  const [products, setProducts] = useState(seedState.products);
  const [editor, setEditor] = useState<ProofEditor | null>(null);
  const [toast, setToast] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const total = listTotal(list);
  const pending = listPending(list);
  const missingPrices = list.items.filter((item) => item.status === "purchased" && !item.unitPrice).length;
  const filtered = list.items.filter((item) => item.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")) && (filter === "all" || item.status === filter));
  const groups = groupItems(filtered);
  const setStatus = (id: string, status: ItemStatus) => setList((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, status } : item) }));
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  return <div className="visual-system" data-reduced-motion={reducedMotion || undefined}>
    <div className="proof-layout">
      <header className="proof-header">
        <Image src="/brand/restok-logo.png" alt="Restok" width={124} height={41} priority />
        <details className="proof-review-options"><summary aria-label="Opções da prévia"><span className="proof-review-label">Prévia · dados de exemplo</span><ChevronDown size={14} /></summary><div><p>As alterações ficam só nesta prévia e são descartadas ao recarregar.</p><label><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} />Reduzir movimentos</label></div></details>
      </header>
      <nav className="proof-nav" aria-label="Navegação principal">
        <button type="button" aria-current={screen === "shop" ? "page" : undefined} onClick={() => setScreen("shop")}><ShoppingBasket size={20} />Compra</button>
        <button type="button" aria-current={screen === "home" ? "page" : undefined} onClick={() => setScreen("home")}><House size={20} />Casa</button>
      </nav>
      <main className="proof-main" id="proof-content">
        {screen === "home" ? <VisualSystemHome products={products} purchaseName={list.name} onEdit={(product) => setEditor({ kind: "product", product })} onAdd={() => setEditor({ kind: "product" })} onPurchase={() => setScreen("shop")} /> : <>
        <div className="proof-title"><div><h1>{list.name}</h1><p>{listResolved(list)} de {list.items.length} resolvidos</p></div></div>
        <section className="proof-budget" aria-label="Resumo do orçamento" data-over-budget={total > list.budget || undefined} data-wide-values={Math.max(total, Math.abs(list.budget - total)) >= 100000 || undefined}>
          <div><span>Total registrado</span><strong>{formatBRL(total)}</strong></div>
          <div className="proof-budget-remaining"><span>{total > list.budget ? "Acima da meta" : "Disponível"}</span><b>{formatBRL(Math.abs(list.budget - total))}</b></div>
          <p>Meta de {formatBRL(list.budget)}{missingPrices ? ` · ${missingPrices} ${missingPrices === 1 ? "comprado" : "comprados"} sem preço` : ""}</p>
          <div className="proof-progress" role="progressbar" aria-label="Uso do orçamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, total / list.budget * 100)}><span style={{ transform: `scaleX(${Math.min(1, total / list.budget)})` }} /></div>
        </section>
        <label className="proof-search"><Search size={18} aria-hidden="true" /><input type="search" aria-label="Buscar na lista" placeholder="Buscar na lista" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className="proof-filters" role="group" aria-label="Filtrar itens por situação">
          {(["all", "pending", "purchased", "already_have"] as Filter[]).map((value) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "Todos" : statusLabel(value)}</button>)}
        </div>
        <div className="proof-list">
          {CATEGORY_ORDER.map((category) => groups[category]?.length ? <section key={category} aria-label={category}>
            <button type="button" className="proof-category" aria-expanded={!collapsed.includes(category)} aria-controls={`proof-${category}`} onClick={() => setCollapsed((current) => current.includes(category) ? current.filter((value) => value !== category) : [...current, category])}>
              <h2>{category}</h2><span>{groups[category]?.length} itens</span><ChevronDown size={16} />
            </button>
            <div id={`proof-${category}`} hidden={collapsed.includes(category)}>
              {groups[category]?.map((item) => <article key={item.id} className={cn("proof-item", item.status !== "pending" && "is-resolved")}>
                <button type="button" className="proof-check" aria-label={item.status === "pending" ? `Marcar ${item.name} como comprado` : `Voltar ${item.name} a pendente`} aria-pressed={item.status === "purchased"} onClick={() => setStatus(item.id, item.status === "pending" ? "purchased" : "pending")}>
                  {item.status === "purchased" ? <Check size={19} /> : item.status === "already_have" ? <House size={18} /> : <span />}
                </button>
                <button type="button" className="proof-item-copy" aria-label={`Editar item ${item.name}`} aria-describedby={`proof-meta-${item.id}`} onClick={() => setEditor({ kind: "item", item })}><span className="proof-item-name">{item.name}</span><span className="proof-item-meta" id={`proof-meta-${item.id}`}>{item.quantity} un.{item.status === "pending" ? "" : ` · ${statusLabel(item.status)}`}{item.status === "purchased" ? item.unitPrice ? ` · ${formatBRL(itemSubtotal(item))}` : " · sem preço" : ""}</span></button>
                <button type="button" className="proof-icon" aria-pressed={item.status === "already_have"} aria-label={item.status === "already_have" ? `Desfazer já temos ${item.name}` : `Já temos ${item.name}`} onClick={() => setStatus(item.id, item.status === "already_have" ? "pending" : "already_have")}>{item.status === "already_have" ? <Undo2 size={18} /> : <House size={18} />}</button>
              </article>)}
            </div>
          </section> : null)}
          {!filtered.length ? <div className="proof-empty"><Search size={24} /><h2>Nenhum item nesta seleção</h2><p>{query ? `Sem resultados para “${query}” com este filtro.` : "Escolha outro filtro para ver os itens da compra."}</p><button type="button" className="proof-button secondary" onClick={() => { setQuery(""); setFilter("all"); }}>Ver todos os itens</button></div> : null}
        </div>
        </>}
      </main>
      {screen === "shop" ? <div className="proof-dock" role="region" aria-label="Ações da compra e total registrado"><span><strong>{pending} pendentes</strong><small><span className="sr-only">Total registrado: </span>{formatBRL(total)}</small></span><button type="button" className="proof-button" onClick={() => setEditor({ kind: "item" })}><Plus size={18} />Adicionar item</button></div> : null}
    </div>
    {editor ? <VisualSystemEditor editor={editor} onClose={() => setEditor(null)} onSaveItem={(item, addToHome) => {
      const productId = addToHome ? makeId("product") : item.productId;
      if (addToHome) setProducts((current) => [...current, { id: productId!, name: item.name, category: item.category, defaultQuantity: item.quantity, active: true }]);
      setList((current) => ({ ...current, items: current.items.some((existing) => existing.id === item.id) ? current.items.map((existing) => existing.id === item.id ? { ...item, productId } : existing) : [...current.items, { ...item, productId, sortOrder: nextSortOrder(current.items) }] }));
      setToast("Item atualizado na lista.");
    }} onSaveProduct={(product) => { setProducts((current) => current.some((existing) => existing.id === product.id) ? current.map((existing) => existing.id === product.id ? product : existing) : [...current, product]); setToast("Produto salvo na casa."); }} /> : null}
    {toast ? <div className="proof-toast" role="status"><Check size={16} />{toast}</div> : null}
  </div>;
}
