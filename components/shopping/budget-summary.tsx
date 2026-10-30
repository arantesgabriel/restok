import { Pencil } from "lucide-react";
import type { ShoppingList } from "@/lib/types";
import { formatBRL, listTotal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styles from "./shopping-controls.module.css";

export function BudgetSummary({ list, onEdit }: { list: ShoppingList; onEdit: () => void }) {
  const total = listTotal(list);
  const difference = total - list.budget;
  const overBudget = difference > 0;
  const withoutPrice = list.items.filter((item) => item.status === "purchased" && item.unitPrice === undefined).length;
  const percentage = list.budget > 0 ? Math.min(total / list.budget * 100, 100) : total > 0 ? 100 : 0;
  const available = formatBRL(Math.abs(difference));
  const totalLabel = formatBRL(total);

  return (
    <section
      data-budget-summary
      data-budget-over={overBudget ? "true" : "false"}
      data-total-long={totalLabel.length > 11 ? "true" : undefined}
      data-total-extreme={totalLabel.length > 18 ? "true" : undefined}
      data-balance-long={available.length > 11 ? "true" : undefined}
      data-balance-extreme={available.length > 18 ? "true" : undefined}
      aria-label="Resumo do orçamento"
      className={`restok-theme ${styles.budget}`}
    >
      <div className={styles.values}>
        <div className={styles.total}>
          <span>Gasto até agora</span>
          <strong>{totalLabel}</strong>
        </div>
        <div className={styles.balance}>
          <span>{overBudget ? "Acima da meta" : "Ainda disponíveis"}</span>
          <b>{available}</b>
        </div>
      </div>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Uso do orçamento"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={`${totalLabel} de ${formatBRL(list.budget)}${overBudget ? `; excedente de ${formatBRL(difference)}` : ""}`}
      >
        <span style={{ transform: `scaleX(${percentage / 100})` }} />
      </div>
      <div className={styles.meta}>
        <span className={styles.target}>
          Meta desta compra: <b>{formatBRL(list.budget)}</b>
          {withoutPrice ? (
            <small>
              {withoutPrice} {withoutPrice === 1 ? "item comprado sem preço" : "itens comprados sem preço"}
            </small>
          ) : null}
        </span>
        <Button variant="secondary" className={styles.editBudget} aria-label="Editar meta da compra" onClick={onEdit}>
          <Pencil size={16} aria-hidden="true" />
          Editar meta
        </Button>
      </div>
    </section>
  );
}
