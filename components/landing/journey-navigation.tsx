import { History,ListChecks,ShoppingBasket,Users } from "lucide-react";
import styles from "./site.module.css";
const stages=[{href:"#planejar",label:"Planejar",icon:ListChecks},{href:"#compartilhar",label:"Compartilhar",icon:Users},{href:"#comprar",label:"Comprar",icon:ShoppingBasket},{href:"#acompanhar",label:"Acompanhar",icon:History}];
export function JourneyNavigation(){return <nav className={styles.steps} aria-label="Etapas">{stages.map(({href,label,icon:Icon})=><a key={href} href={href}><Icon size={17} aria-hidden="true"/>{label}</a>)}</nav>;}
