import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./navigation.module.css";
export function HouseSwitcher({name,onOpen,disabled=false}:{name:string;onOpen:()=>void;disabled?:boolean}) {return <Button variant="quiet" className={styles.switcher} onClick={onOpen} disabled={disabled} aria-label={`Casas e pessoas: ${name}`}><span className={styles.identity}>{name}</span><ChevronDown size={16} strokeWidth={1.75}/></Button>;}
