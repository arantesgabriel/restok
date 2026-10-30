"use client";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { formatBRL, formatPercent, latestPriceFor } from "@/lib/utils";
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
  onDelete?: () => void;
};

export function ShoppingItemRow({ item, lists, onEdit, onPurchased, onAlreadyHave, onUndo, onDelete }: ItemRowProps) {
  const [revealed, setRevealed] = useState(false);
  const gesture = useRef<{x:number;y:number;horizontal:boolean;cancelled:boolean} | null>(null);
  const suppressClick = useRef(false);
  const priced = item.unitPrice !== undefined;
  const total = priced ? formatBRL(item.quantity * item.unitPrice!) : null;

  return (
    <div className={styles.swipeRow} data-delete-enabled={Boolean(onDelete) || undefined} data-delete-revealed={revealed || undefined}>
    {onDelete ? <button type="button" className={styles.deleteItem} aria-label={`Excluir ${item.name}`} onFocus={()=>setRevealed(true)} onClick={onDelete}><Trash2 size={18}/><span>Excluir</span></button> : null}
    <article
      onPointerDown={event=>{
        if(!onDelete || event.pointerType === "mouse" || !event.isPrimary) return;
        gesture.current={x:event.clientX,y:event.clientY,horizontal:false,cancelled:false};
        suppressClick.current=false;
      }}
      onPointerMove={event=>{
        const start=gesture.current;if(!start || start.cancelled)return;
        const dx=event.clientX-start.x,dy=event.clientY-start.y;
        if(!start.horizontal && Math.abs(dy)>10 && Math.abs(dy)>Math.abs(dx)){start.cancelled=true;return;}
        if(!start.horizontal && Math.abs(dx)>12 && Math.abs(dx)>Math.abs(dy)*1.5){start.horizontal=true;event.currentTarget.setPointerCapture?.(event.pointerId);}
        if(start.horizontal){suppressClick.current=true; if(dx < -40)setRevealed(true);else if(dx>30)setRevealed(false);}
      }}
      onPointerUp={()=>{gesture.current=null;}}
      onPointerCancel={()=>{gesture.current=null;suppressClick.current=false;}}
      onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}else if(revealed && window.matchMedia("(max-width:1023px)").matches){event.preventDefault();event.stopPropagation();setRevealed(false);}}}
      onKeyDown={event=>{if(event.key==="Escape")setRevealed(false);}}
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
          <span data-item-name className={styles.name}>{item.name}</span>
          <span id={`item-meta-${item.id}`} className={styles.metadata}>
            <span>{item.quantity} un.</span>
            {item.status === "pending" ? <span className={styles.sr}>Pendente</span> : <StatusBadge status={item.status} />}
            {priced ? <PreviousPrice item={item} lists={lists} /> : null}
          </span>
        </span>
      </button>
      <div className={styles.itemRight}>
        <div className={styles.priceBlock}>
          {total ? <strong data-item-total className={styles.price} title={item.status !== "purchased" ? "Preço informado. Não incluído no total registrado." : undefined}>{total}</strong> : <span data-item-price-missing-label className={styles.price}>Sem preço</span>}
          {priced && item.quantity > 1 ? <small data-item-unit-price className={styles.unitPrice}>{formatBRL(item.unitPrice!)} / un.</small> : null}
        </div>
        <div className={styles.rowActions}><AlreadyHave name={item.name} selected={item.status === "already_have"} onSelect={item.status === "already_have" ? onUndo : onAlreadyHave} /></div>
      </div>
    </article>
    </div>
  );
}
