"use client";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { type ShoppingList } from "@/lib/types";
import { formatBRL,listTotal } from "@/lib/utils";
import styles from "./purchase-sheets.module.css";
export function CompleteSheet({ list, onClose, onHistory }: { list: ShoppingList; onClose: () => boolean; onHistory: () => void }) {
  const purchased = list.items.filter((item) => item.status === "purchased").length;
  const alreadyHave = list.items.filter((item) => item.status === "already_have").length;
  const pending = list.items.filter((item) => item.status === "pending").length;
  const withoutPrice = list.items.filter((item) => item.status === "purchased" && item.unitPrice === undefined).length;
  return <Sheet title="Compra finalizada" description={pending > 0 ? "Você pode consultar os itens pendentes pelo histórico." : "A lista foi guardada no histórico."} onClose={onClose} footer={<Button className={styles.full} onClick={onHistory}>Ver histórico</Button>}>
    <div className={styles.form}>
      <div className={styles.receipt}>
        <dl className={styles.counts}>
          <div className={styles.count}><dt className={styles.hint}>Comprados</dt><dd className={styles.countValue}>{purchased}</dd></div>
          <div className={styles.count}><dt className={styles.hint}>Já tínhamos</dt><dd className={styles.countValue}>{alreadyHave}</dd></div>
          <div className={styles.count}><dt className={styles.hint}>Pendentes</dt><dd className={styles.countValue}>{pending}</dd></div>
        </dl>
        <p className={styles.totalLabel}>Total registrado</p>
        <p className={styles.total}>{formatBRL(listTotal(list))}</p>
        {withoutPrice > 0 ? <p className={styles.hint}>{withoutPrice} {withoutPrice === 1 ? "item comprado sem preço" : "itens comprados sem preço"}</p> : null}
      </div>

    </div>
  </Sheet>;
}

