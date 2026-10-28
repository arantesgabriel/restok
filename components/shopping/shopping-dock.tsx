import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import styles from "@/components/app/app-shell.module.css";
export function ShoppingDock({pending,total,resolved,count,onPending,onFinish,onAdd}:{pending:number;total:number;resolved:number;count:number;onPending:()=>void;onFinish:()=>void;onAdd:()=>void}) {
  return <div role="region" aria-label="Ações da compra e total registrado" className={styles.dockActions}><Button variant="quiet" className={styles.pending} aria-label={pending===0?"Finalizar compra":"Ver pendentes"} onClick={pending===0?onFinish:onPending}><span><span>{pending===0?"Finalizar compra":`${pending} pendentes`}</span><small>{formatBRL(total)} · {resolved}/{count} resolvidos</small></span></Button><Button aria-label="Adicionar item à compra" onClick={onAdd}><Plus size={18}/>Adicionar item</Button></div>;
}
