import {Check,Minus,Square} from "lucide-react";
import type {ShoppingItem} from "@/lib/types";
import {formatBRL,itemSubtotal,statusLabel} from "@/lib/utils";
import styles from "./demos.module.css";
export function DemoRow({item}:{item:ShoppingItem}) {
  const amount=item.status==="purchased"&&item.unitPrice!==undefined ? formatBRL(itemSubtotal(item)) : "—";
  const Icon=item.status==="purchased" ? Check : item.status==="already_have" ? Minus : Square;
  return <span className={styles.row} data-state={item.status} data-large-amount={amount.length>14||undefined}><Icon size={17} aria-hidden="true"/><span className={styles.rowCopy}><span className={styles.rowName}>{item.name}</span><span className={styles.rowMeta}>{item.quantity} × {item.unitPrice===undefined ? "Preço não informado" : formatBRL(item.unitPrice)} · {statusLabel(item.status)}</span></span><span className={styles.amount}>{amount}</span></span>;
}
