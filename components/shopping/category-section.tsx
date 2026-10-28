"use client";
import { useId, useState } from "react";
import { ArrowDownAZ, ArrowDownZA, ChevronDown, ChevronRight } from "lucide-react";
import type { CategoryName, ShoppingItem, ShoppingList } from "@/lib/types";
import type { NameSortDirection } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingItemRow } from "./item-row";
import styles from "./shopping.module.css";
export function CategorySection({category,direction,items,lists,onToggleSort,onEdit,onPurchased,onAlreadyHave,onUndo}:{category:CategoryName;direction:NameSortDirection;items:ShoppingItem[];lists:ShoppingList[];onToggleSort:()=>void;onEdit:(item:ShoppingItem)=>void;onPurchased:(item:ShoppingItem)=>void;onAlreadyHave:(item:ShoppingItem)=>void;onUndo:(item:ShoppingItem)=>void}) {
  const [open,setOpen]=useState(true); const id=useId(); const label=direction==="desc"?"Z–A":"A–Z";
  return <section data-category-section><div className={styles.categoryHeader}><button type="button" className={styles.categoryButton} aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}><span>{category} <span className={styles.categoryCount}>{items.filter(item=>item.status!=="pending").length} de {items.length} resolvidos</span></span>{open?<ChevronDown size={16}/>:<ChevronRight size={16}/>}</button><Button variant="quiet" className={styles.sort} aria-pressed={direction==="desc"} aria-label={`${category} em ordem ${label}. Alternar ordem alfabética`} onClick={onToggleSort}>{direction==="desc"?<ArrowDownZA size={16}/>:<ArrowDownAZ size={16}/>}<span aria-hidden="true">{label}</span></Button></div><div id={id} hidden={!open}>{items.map(item=><ShoppingItemRow key={item.id} item={item} lists={lists} onEdit={()=>onEdit(item)} onPurchased={()=>onPurchased(item)} onAlreadyHave={()=>onAlreadyHave(item)} onUndo={()=>onUndo(item)}/>)}</div></section>;
}
