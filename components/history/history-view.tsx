"use client";

import { useLayoutEffect, useRef } from "react";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
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
  useLayoutEffect(() => { (rows.current.get(returnToId ?? "") ?? heading.current)?.focus(); }, [returnToId]);

  return <div className={styles.page}>
    <header className={styles.heading}><h1 ref={heading} tabIndex={-1}>Histórico</h1><p>Compras concluídas, com os preços e itens registrados na época.</p></header>
    {months.length ? months.map(month => <section key={month.label} aria-label={month.label} className={styles.month}>
      <h2>{month.label}</h2>
      <ol className={styles.records}>{month.lists.map(list => {
        const summary = historySummary(list);
        return <li key={list.id}><button type="button" className={styles.record} ref={node => { if (node) rows.current.set(list.id, node); else rows.current.delete(list.id); }} onClick={() => onOpen(list)}>
          <span className={styles.recordInfo}><span className={styles.recordName}>{list.name}</span><span className={styles.meta}><time dateTime={historyDate(list)}>{shortDate(historyDate(list))}</time> · {list.items.length} {list.items.length === 1 ? "item" : "itens"}</span>
            <span className={styles.counts}><span>{summary.purchased} {summary.purchased === 1 ? "comprado" : "comprados"}</span><span>{summary.alreadyHave} já tínhamos</span><span>{summary.pending} {summary.pending === 1 ? "pendente" : "pendentes"}</span></span>
            {summary.withoutPrice ? <span className={styles.meta}>{summary.withoutPrice} {summary.withoutPrice === 1 ? "comprado sem preço" : "comprados sem preço"}</span> : null}
          </span>
          <span className={styles.recordTotal}><span className={styles.meta}>Total registrado</span><span className={styles.money}>{formatBRL(summary.total)}</span></span><ChevronRight size={18} aria-hidden="true" className={styles.chevron}/>
        </button></li>;
      })}</ol>
    </section>) : <EmptyState variant="first-use" icon={<ShoppingBasket size={24}/>} title="O histórico começa na próxima compra" description="Finalize sua primeira compra para guardar preços e totais."/>}
  </div>;
}
