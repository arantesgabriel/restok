import { House, ListFilter, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./navigation.module.css";
export type AppScreen="shop"|"history"|"home";
export function Navigation({screen,onChange}:{screen:AppScreen;onChange:(screen:AppScreen)=>void}) {return <nav aria-label="Navegação principal" className={`restok-theme ${styles.nav}`}>{([{id:"shop",label:"Compra",Icon:ShoppingBasket},{id:"history",label:"Histórico",Icon:ListFilter},{id:"home",label:"Casa",Icon:House}] as const).map(({id,label,Icon})=><Button key={id} variant="quiet" className={styles.item} aria-current={screen===id?"page":undefined} onClick={()=>onChange(id)}><Icon size={20}/>{label}</Button>)}</nav>;}
