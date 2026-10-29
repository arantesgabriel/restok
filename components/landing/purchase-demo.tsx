"use client";
import {useState} from "react";
import {ChevronDown} from "lucide-react";
import {MoneyField} from "@/components/ui/money-field";
import {moneyInput,parseMoney} from "@/lib/money";
import {Select} from "@/components/ui/select";
import type {ItemStatus,ShoppingItem} from "@/lib/types";
import {formatBRL,listTotal} from "@/lib/utils";
import {countPurchased,exampleLabel,showcaseItems,showcaseList} from "./demo-data";
import {DemoReset,useDemoReady} from "./demo-controls";
import {DemoRow} from "./demo-row";
import styles from "./demos.module.css";
const initialPrices=Object.fromEntries(showcaseItems.map(item=>[item.id,moneyInput(item.unitPrice)]));
export function PurchaseDemo(){
  const [items,setItems]=useState(showcaseItems),[prices,setPrices]=useState(initialPrices),ready=useDemoReady();
  const total=listTotal({...showcaseList,items}),purchased=countPurchased(items),alreadyHave=items.filter(item=>item.status==="already_have").length;
  const missingPrice=items.some(item=>item.status==="purchased"&&item.unitPrice===undefined),balance=showcaseList.budget-total;
  const update=(id:string,change:Partial<ShoppingItem>)=>setItems(current=>current.map(item=>item.id===id ? {...item,...change} : item));
  return <div className={styles.frame}><p className={styles.example}>{exampleLabel}. Abra um item para experimentar estados e preços.</p>
    <div role="status" aria-atomic="true"><div className={styles.budget} data-large-total={formatBRL(total).length>14||undefined}><p><span>Total registrado</span><strong>{formatBRL(total)}</strong></p><p><span>Orçamento</span><b>{formatBRL(showcaseList.budget)}</b></p></div><p className={`${styles.budgetStatus} ${balance<0 ? styles.exceeded : ""}`}>{formatBRL(Math.abs(balance))} {balance<0 ? "acima do orçamento" : "disponíveis"} · {purchased} de {items.length} comprados · {alreadyHave} já temos.</p>{missingPrice ? <p className={styles.note}>Total parcial: há item comprado sem preço informado.</p> : null}</div>
    <progress className={styles.progress} value={purchased} max={items.length} aria-label="Itens comprados"/><p className={styles.note}>Pendentes e “Já temos” não entram no total.</p>
    <ul className={styles.items}>{items.map(item=><li key={item.id}><details className={styles.editor}><summary><DemoRow item={item}/><span className={styles.editHint}>Editar item<ChevronDown size={16} aria-hidden="true"/></span></summary><fieldset className={`${styles.fieldSet} ${styles.editFields}`} disabled={!ready}><legend className={styles.sr}>Editar {item.name}</legend><Select label={`Situação de ${item.name}`} value={item.status} onChange={event=>update(item.id,{status:event.target.value as ItemStatus})}><option value="pending">Pendente</option><option value="purchased">Comprado</option><option value="already_have">Já temos</option></Select><MoneyField label={`Preço unitário de ${item.name}`} value={prices[item.id]} hint="Vazio significa preço não informado." error={!parseMoney(prices[item.id]).ok ? "Use um preço válido, igual ou maior que zero, com até duas casas decimais. O total mantém o último valor válido." : undefined} onValueChange={raw=>{setPrices(current=>({...current,[item.id]:raw}));const parsed=parseMoney(raw);if(parsed.ok)update(item.id,{unitPrice:parsed.value});}}/></fieldset></details></li>)}</ul><DemoReset ready={ready} onReset={()=>{setItems(showcaseItems);setPrices(initialPrices);}}/>
  </div>;
}
