import { House, History, ShoppingBasket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./navigation.module.css";
export type AppScreen="shop"|"history"|"home"|"people";
export function Navigation({screen,onChange,desktop=false}:{screen:AppScreen;onChange:(screen:AppScreen)=>void;desktop?:boolean}) {
  const links = desktop ? [{id:"shop",label:"Compra",Icon:ShoppingBasket},{id:"home",label:"Casa e produtos",Icon:House},{id:"history",label:"Histórico",Icon:History},{id:"people",label:"Casas e pessoas",Icon:Users}] as const : [{id:"shop",label:"Compra",Icon:ShoppingBasket},{id:"history",label:"Histórico",Icon:History},{id:"home",label:"Casa",Icon:House}] as const;
  return <nav aria-label="Navegação principal" className={`restok-theme ${styles.nav}`}>{links.map(({id,label,Icon})=><Button key={id} variant="quiet" className={styles.item} aria-current={screen===id?"page":undefined} onClick={()=>onChange(id)}><Icon size={20} strokeWidth={1.75}/><span>{label}</span></Button>)}</nav>;
}
