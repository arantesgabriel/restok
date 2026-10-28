import { Pencil } from "lucide-react";
import type { ShoppingList } from "@/lib/types";
import { formatBRL, listTotal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styles from "./shopping-controls.module.css";
export function BudgetSummary({list,onEdit}:{list:ShoppingList;onEdit:()=>void}) {
  const total=listTotal(list), over=total-list.budget;
  const withoutPrice=list.items.filter(item=>item.status==="purchased"&&item.unitPrice===undefined).length;
  const percentage=list.budget>0?Math.min(total/list.budget*100,100):total>0?100:0;
  return <section data-budget-summary data-budget-over={over>0?"true":"false"} aria-label="Resumo do orçamento" className={`restok-theme ${styles.budget}`}><div className={styles.values}><div><span>Total registrado</span><strong>{formatBRL(total)}</strong></div><div><span>{over>0?"Acima da meta":"Disponível"}</span><b>{formatBRL(Math.abs(over))}</b></div></div><div className={styles.meta}><span>Meta de {formatBRL(list.budget)}{withoutPrice?<span>{withoutPrice} {withoutPrice===1?"item comprado sem preço":"itens comprados sem preço"}</span>:null}</span><Button variant="quiet" className={styles.edit} aria-label="Editar meta da compra" onClick={onEdit}><Pencil size={16}/>Editar</Button></div><div className={styles.progress} role="progressbar" aria-label="Uso do orçamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={`${formatBRL(total)} de ${formatBRL(list.budget)}${over>0?`; excedente de ${formatBRL(over)}`:""}`}><span style={{transform:`scaleX(${percentage/100})`}}/></div></section>;
}
