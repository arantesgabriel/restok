import { ChevronDown, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./navigation.module.css";
export function HouseSwitcher({name,onOpen,disabled=false}:{name:string;onOpen:()=>void;disabled?:boolean}) {return <Button variant="quiet" className={styles.switcher} onClick={onOpen} disabled={disabled} title={name} aria-label={`Casas e pessoas: ${name}`}><House size={18} className={styles.houseIcon}/><span className={styles.identity}><strong>{name}</strong><small>Trocar casa</small></span><ChevronDown size={14} strokeWidth={1.75}/></Button>;}
