"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { ShoppingList } from "@/lib/types";
import { formatBRL, shortDate } from "@/lib/utils";
import { historyDate, historyMonths, historySummary } from "./history-model";
import styles from "./history.module.css";

export function HistoryView({ lists, onOpen, returnToId }: {
  lists: ShoppingList[]; onOpen: (list: ShoppingList) => void; returnToId?: string | null;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const months = historyMonths(lists);
  const [monthFilter,setMonthFilter] = useState("Todos");
  const completed = months.flatMap(month=>month.lists);
  const visibleMonths = monthFilter === "Todos" ? months : months.filter(month=>month.label===monthFilter);
  useLayoutEffect(() => { (rows.current.get(returnToId ?? "") ?? heading.current)?.focus(); }, [returnToId]);

  return <div className={styles.page}>
    <header className={styles.heading}><h1 ref={heading} tabIndex={-1}>Compras anteriores</h1><p>{completed.length} compras concluídas</p></header>
    {months.length ? <><dl className={styles.overview}><div><dt>Compras</dt><dd>{completed.length}</dd></div><div><dt>Última compra</dt><dd>{formatBRL(historySummary(completed[0]).total)}</dd></div><div><dt>Total registrado</dt><dd>{formatBRL(completed.reduce((total,list)=>total+historySummary(list).total,0))}</dd></div></dl><div className={styles.monthFilter} role="group" aria-label="Filtrar histórico por mês">{["Todos",...months.map(month=>month.label)].map(month=><Button key={month} variant="secondary" aria-pressed={monthFilter===month} onClick={()=>setMonthFilter(month)}>{month}</Button>)}</div></> : null}
    {months.length ? visibleMonths.map(month => <section key={month.label} aria-label={month.label} className={styles.month}>
      <h2>{month.label}</h2>
      <ol className={styles.records}>{month.lists.map(list => {
        const summary = historySummary(list);
        return <li key={list.id}><button type="button" className={styles.record} ref={node => { if (node) rows.current.set(list.id, node); else rows.current.delete(list.id); }} onClick={() => onOpen(list)}>
          <span className={styles.recordInfo}><span className={styles.recordName}><ShoppingBasket size={18} aria-hidden="true"/>{list.name}</span><span className={styles.meta}><time dateTime={historyDate(list)}>{shortDate(historyDate(list))}</time> · {list.items.length} {list.items.length === 1 ? "item" : "itens"}</span>
            <span className={styles.counts}><span>{summary.purchased} {summary.purchased === 1 ? "comprado" : "comprados"}</span><span>{summary.alreadyHave} já tínhamos</span><span>{summary.pending} {summary.pending === 1 ? "pendente" : "pendentes"}</span></span>
            {summary.withoutPrice ? <span className={styles.meta}>{summary.withoutPrice} {summary.withoutPrice === 1 ? "comprado sem preço" : "comprados sem preço"}</span> : null}
          </span>
          <span className={styles.recordTotal}><span className={styles.meta}>Total registrado</span><span className={styles.money}>{formatBRL(summary.total)}</span></span><ChevronRight size={18} aria-hidden="true" className={styles.chevron}/>
        </button></li>;
      })}</ol>
    </section>) : <EmptyState variant="first-use" icon={<ShoppingBasket size={24}/>} title="O histórico começa na próxima compra" description="Finalize sua primeira compra para guardar preços e totais."/>}
  </div>;
}
