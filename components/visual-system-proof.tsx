"use client";

import Image from "next/image";
import { Check, ChevronDown, House, Search, ShoppingBasket, Undo2 } from "lucide-react";
import { useState } from "react";
import { seedState } from "@/lib/seed";
import { CATEGORY_ORDER, type ItemStatus } from "@/lib/types";
import { cn, formatBRL, groupItems, listPending, listResolved, listTotal, statusLabel } from "@/lib/utils";

type Filter = "all" | ItemStatus;

export function VisualSystemProof() {
  const [list, setList] = useState(seedState.lists[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const total = listTotal(list);
  const pending = listPending(list);
  const missingPrices = list.items.filter((item) => item.status === "purchased" && !item.unitPrice).length;
  const filtered = list.items.filter((item) => item.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")) && (filter === "all" || item.status === filter));
  const groups = groupItems(filtered);
  const setStatus = (id: string, status: ItemStatus) => setList((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, status } : item) }));

  return <div className="visual-system">
    <div className="proof-layout">
      <header className="proof-header">
        <Image src="/brand/restok-logo.png" alt="Restok" width={124} height={41} priority />
        <span className="proof-review-label">Prévia · dados de exemplo</span>
      </header>
      <nav className="proof-nav" aria-label="Navegação principal">
        <button type="button" aria-current="page"><ShoppingBasket size={20} />Compra</button>
        <button type="button" disabled><House size={20} />Casa</button>
      </nav>
      <main className="proof-main" id="proof-content">
        <div className="proof-title"><div><h1>{list.name}</h1><p>{listResolved(list)} de {list.items.length} resolvidos</p></div></div>
        <section className="proof-budget" aria-label="Resumo do orçamento">
          <div><span>Total registrado</span><strong>{formatBRL(total)}</strong></div>
          <div className="proof-budget-remaining"><span>{total > list.budget ? "Acima da meta" : "Disponível"}</span><b>{formatBRL(Math.abs(list.budget - total))}</b></div>
          <p>Meta de {formatBRL(list.budget)}{missingPrices ? ` · ${missingPrices} comprado(s) sem preço` : ""}</p>
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
                <div className="proof-item-copy"><h3>{item.name}</h3><p>{item.quantity} un.{item.status === "pending" ? "" : ` · ${statusLabel(item.status)}`}{item.status === "purchased" && !item.unitPrice ? " · sem preço" : ""}</p></div>
                <button type="button" className="proof-icon" aria-label={item.status === "already_have" ? `Desfazer já temos ${item.name}` : `Já temos ${item.name}`} onClick={() => setStatus(item.id, item.status === "already_have" ? "pending" : "already_have")}>{item.status === "already_have" ? <Undo2 size={18} /> : <House size={18} />}</button>
              </article>)}
            </div>
          </section> : null)}
          {!filtered.length ? <div className="proof-empty"><Search size={24} /><h2>Nenhum item nesta seleção</h2><p>{query ? `Sem resultados para “${query}” com este filtro.` : "Escolha outro filtro para ver os itens da compra."}</p><button type="button" className="proof-button secondary" onClick={() => { setQuery(""); setFilter("all"); }}>Ver todos os itens</button></div> : null}
        </div>
      </main>
      <div className="proof-dock"><span><strong>{pending} pendentes</strong><small>{formatBRL(total)} registrados</small></span></div>
    </div>
  </div>;
}
