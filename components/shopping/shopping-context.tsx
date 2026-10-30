import type { ShoppingList } from "@/lib/types";
import { formatBRL, listPending, listResolved, listTotal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styles from "./shopping.module.css";

export function ShoppingContext({
  list,
  onPending,
  onFinish,
}: {
  list: ShoppingList;
  onPending: () => void;
  onFinish: () => void;
}) {
  const pending = listPending(list);
  const resolved = listResolved(list);
  const total = listTotal(list);
  const withoutPrice = list.items.filter((item) => item.status === "purchased" && item.unitPrice === undefined).length;

  return (
    <section className={styles.contextSummary} aria-labelledby="shopping-context-title">
      <h2 id="shopping-context-title">Resumo da compra</h2>
      <dl className={styles.contextStats}>
        <div><dt>Pendentes</dt><dd>{pending}</dd></div>
        <div><dt>Resolvidos</dt><dd>{resolved} de {list.items.length}</dd></div>
        <div><dt>Total registrado</dt><dd>{formatBRL(total)}</dd></div>
        {withoutPrice ? <div><dt>Comprados sem preço</dt><dd>{withoutPrice}</dd></div> : null}
      </dl>
      <div className={styles.contextActions}>
        {pending ? (
          <Button variant="secondary" onClick={onPending}>
            Ver {pending} {pending === 1 ? "pendente" : "pendentes"}
          </Button>
        ) : null}
        <Button onClick={onFinish}>Finalizar compra</Button>
      </div>
    </section>
  );
}
