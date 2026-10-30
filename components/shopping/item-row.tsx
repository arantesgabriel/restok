"use client";

import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { formatBRL, formatPercent, itemSubtotal, latestPriceFor } from "@/lib/utils";
import { AlreadyHave } from "./already-have";
import { ShoppingStatusButton, StatusBadge } from "./status-toggle";
import styles from "./shopping.module.css";

function PreviousPrice({ item, lists }: { item: ShoppingItem; lists: ShoppingList[] }) {
  const previous = latestPriceFor(item.productId, lists);
  if (previous === undefined || item.unitPrice === undefined) return null;

  const difference = item.unitPrice - previous;
  const comparison = previous === 0
    ? `${formatBRL(Math.abs(difference))} ${difference > 0 ? "a mais por unidade" : "igual ao anterior"}`
    : Math.abs(difference) < 0.005
      ? "igual ao anterior"
      : `${formatPercent(Math.abs(difference / previous))} ${difference > 0 ? "a mais" : "a menos"}`;

  return <span className={styles.previous}>Anterior {formatBRL(previous)} · {comparison}</span>;
}

export type ItemRowProps = {
  item: ShoppingItem;
  lists: ShoppingList[];
  onEdit: () => void;
  onPurchased: () => void;
  onAlreadyHave: () => void;
  onUndo: () => void;
};

export function ShoppingItemRow({ item, lists, onEdit, onPurchased, onAlreadyHave, onUndo }: ItemRowProps) {
  const priced = item.status === "purchased" && item.unitPrice !== undefined;
  const total = priced ? formatBRL(itemSubtotal(item)) : null;

  return (
    <article
      data-shopping-row
      data-item-status={item.status}
      data-has-price={priced ? "true" : undefined}
      data-item-price-missing={item.status === "purchased" && item.unitPrice === undefined ? "true" : undefined}
      data-total-long={total && total.length > 11 ? "true" : undefined}
      data-total-extreme={total && total.length > 18 ? "true" : undefined}
      className={styles.row}
    >
      <ShoppingStatusButton name={item.name} status={item.status} onPurchased={onPurchased} onUndo={onUndo} />
      <button
        type="button"
        className={styles.edit}
        onClick={onEdit}
        aria-label={`Editar ${item.name}`}
        aria-describedby={`item-meta-${item.id}`}
      >
        <span className={styles.itemText}>
          <span className={styles.name}>{item.name}</span>
          <span id={`item-meta-${item.id}`} className={styles.metadata}>
            <span>{item.quantity} un.</span>
            {priced ? <span>{formatBRL(item.unitPrice!)} un.</span> : null}
            {item.status === "pending" ? <span className={styles.sr}>Pendente</span> : <StatusBadge status={item.status} />}
            {priced ? <PreviousPrice item={item} lists={lists} /> : null}
          </span>
        </span>
      </button>
      <div className={styles.rowActions}>
        {item.status === "pending" ? <AlreadyHave name={item.name} onSelect={onAlreadyHave} /> : null}
      </div>
      {total ? <strong data-item-total className={styles.price}>{total}</strong> : item.status === "purchased" ? <span data-item-price-missing-label className={styles.price}>Sem preço</span> : null}
    </article>
  );
}
