"use client";
import { Check, Undo2 } from "lucide-react";
import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { formatBRL, formatPercent, itemSubtotal, latestPriceFor } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { AlreadyHave } from "./already-have";
import { StatusBadge } from "./status-toggle";
import styles from "./shopping.module.css";
function PreviousPrice({item,lists}:{item:ShoppingItem;lists:ShoppingList[]}) {
  const previous=latestPriceFor(item.productId,lists);
  if(previous===undefined || item.unitPrice===undefined)return null;
  const difference=item.unitPrice-previous;
  const comparison=previous===0 ? `${formatBRL(Math.abs(difference))} ${difference>0?"a mais por unidade":"igual ao anterior"}` : Math.abs(difference)<.005 ? "igual ao anterior" : `${formatPercent(Math.abs(difference/previous))} ${difference>0?"a mais":"a menos"}`;
  return <span className={styles.previous}>Anterior {formatBRL(previous)} · {comparison}</span>;
}
export type ItemRowProps={item:ShoppingItem;lists:ShoppingList[];onEdit:()=>void;onPurchased:()=>void;onAlreadyHave:()=>void;onUndo:()=>void};
export function ShoppingItemRow({item,lists,onEdit,onPurchased,onAlreadyHave,onUndo}:ItemRowProps) {
  const priced=item.status==="purchased"&&item.unitPrice!==undefined;
  return <article data-shopping-row className={styles.row}>
    <button type="button" className={styles.edit} onClick={onEdit} aria-label={`Editar ${item.name}`} aria-describedby={`item-meta-${item.id}`}>
      <span className={styles.itemText}><span className={styles.name}>{item.name}</span><span id={`item-meta-${item.id}`} className={styles.metadata}><span>{item.quantity} un.</span>{priced?<><span>{formatBRL(item.unitPrice!)} un.</span><PreviousPrice item={item} lists={lists}/></>:<StatusBadge status={item.status}/>}</span></span>
      {priced?<strong data-item-total className={styles.price}>{formatBRL(itemSubtotal(item))}</strong>:item.status==="purchased"?<span className={styles.price}>Sem preço</span>:null}
    </button>
    <div className={styles.rowActions}>{item.status==="pending"?<><IconButton label={`Marcar ${item.name} como comprado`} onClick={onPurchased}><Check size={19}/></IconButton><AlreadyHave name={item.name} onSelect={onAlreadyHave}/></>:<IconButton label={`Desfazer situação de ${item.name}`} onClick={onUndo}><Undo2 size={18}/></IconButton>}</div>
  </article>;
}
