"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shopping/status-toggle";
import { CATEGORY_ORDER, type ShoppingList } from "@/lib/types";
import { formatBRL, groupItems, itemSubtotal, monthLabel, shortDate } from "@/lib/utils";
import { historyDate, historySummary, previousHistoryPrice } from "./history-model";
import { HistoryPriceComparison } from "./history-price-comparison";
import styles from "./history.module.css";

export function HistoryDetail({ list, lists, onBack }: { list: ShoppingList; lists: ShoppingList[]; onBack: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const summary = historySummary(list);
  const groups = groupItems(list.items);
  useLayoutEffect(() => { heading.current?.focus(); }, [list.id]);

  return <div className={styles.page}>
    <div><Button variant="quiet" onClick={onBack}><ArrowLeft size={18} aria-hidden="true"/>Voltar ao histórico</Button></div>
    <header className={styles.heading}><p className={styles.meta}><time dateTime={historyDate(list)}>{shortDate(historyDate(list))} · {monthLabel(historyDate(list))}</time></p><h1 ref={heading} tabIndex={-1}>{list.name}</h1><p>{list.items.length} {list.items.length === 1 ? "item nesta compra" : "itens nesta compra"}</p></header>
    <section className={styles.summary} aria-label="Resumo da compra concluída">
      <div className={styles.total}><p className={styles.meta}>Total registrado</p><p className={styles.totalValue}>{formatBRL(summary.total)}</p><p className={styles.meta}>Soma dos itens comprados com preço informado.</p>{summary.withoutPrice ? <p className={styles.unpriced}>{summary.withoutPrice} {summary.withoutPrice === 1 ? "item comprado sem preço" : "itens comprados sem preço"}</p> : null}</div>
      <dl className={styles.stats}><div><dt>Comprados</dt><dd>{summary.purchased}</dd></div><div><dt>Já tínhamos</dt><dd>{summary.alreadyHave}</dd></div><div><dt>Pendentes</dt><dd>{summary.pending}</dd></div></dl>
    </section>
    {list.items.length ? <div className={styles.groups}>{CATEGORY_ORDER.map(category => groups[category]?.length ? <section key={category} aria-label={category}>
      <h2 className={styles.category}>{category}</h2><ul className={styles.items}>{groups[category]!.map(item => <li key={item.id} className={styles.item}>
        <div className={styles.itemInfo}><h3>{item.name}</h3><p className={styles.meta}>Quantidade: {item.quantity}</p><StatusBadge status={item.status}/></div>
        {item.status === "purchased" ? <div className={styles.itemMoney}><p className={styles.meta}>Subtotal</p>{item.unitPrice !== undefined ? <><p className={styles.money}>{formatBRL(itemSubtotal(item))}</p><p className={styles.meta}>{formatBRL(item.unitPrice)} / un.</p></> : <p className={styles.unpriced}>Sem preço informado</p>}</div> : null}
        <HistoryPriceComparison item={item} previousPrice={previousHistoryPrice(item, list, lists)}/>
      </li>)}</ul>
    </section> : null)}</div> : <p className={styles.meta}>Esta compra foi concluída sem itens.</p>}
  </div>;
}
