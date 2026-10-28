import { ChevronDown, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./navigation.module.css";
export function HouseSwitcher({name,onOpen,disabled=false}:{name:string;onOpen:()=>void;disabled?:boolean}) {return <Button variant="secondary" className={styles.switcher} onClick={onOpen} disabled={disabled} aria-label={`Casas e pessoas: ${name}`}><House size={18}/><span className={styles.identity}><small>Casa ativa</small>{name}</span><ChevronDown size={18}/></Button>;}
