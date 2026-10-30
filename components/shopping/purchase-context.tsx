import { ShoppingBasket } from "lucide-react";
import type { ShoppingList } from "@/lib/types";
import type { ShoppingFilter } from "./use-shopping-view";
import { Button } from "@/components/ui/button";
import styles from "./shopping.module.css";

export function PurchaseContext({list,onFilter,onFinish}:{list:ShoppingList;onFilter:(filter:ShoppingFilter)=>void;onFinish:()=>void}) {
  const pending=list.items.filter(item=>item.status==="pending").length;
  const purchased=list.items.filter(item=>item.status==="purchased").length;
  const owned=list.items.filter(item=>item.status==="already_have").length;
  const unknown=list.items.filter(item=>item.unitPrice===undefined).length;
  return <section className={styles.contextPanel} aria-label="Resumo da compra">
    <h2><ShoppingBasket size={16} aria-hidden="true"/>Resumo da compra</h2>
    <dl>
      {([{label:"Pendentes",count:pending,filter:"pending"},{label:"Comprados",count:purchased,filter:"purchased"},{label:"Já temos",count:owned,filter:"already_have"}] as const).map(row=><div key={row.filter}><dt><button type="button" onClick={()=>onFilter(row.filter)} aria-label={`Mostrar ${row.count} ${row.label.toLocaleLowerCase("pt-BR")} no resumo`}>{row.label}</button></dt><dd>{row.count}</dd></div>)}
      <div><dt>Preço desconhecido</dt><dd>{unknown}</dd></div>
    </dl>
    <p>O valor total usa apenas itens comprados com preço informado.</p>
    <Button variant="secondary" className={styles.contextFinish} onClick={onFinish}>Finalizar compra</Button>
  </section>;
}
