"use client";
import { useRef, useId } from "react";
import { Search, X } from "lucide-react";
import { IconButton } from "./icon-button";
import styles from "./controls.module.css";
export function SearchField({label,value,onValueChange}:{label:string;value:string;onValueChange:(value:string)=>void}) {
  const id=useId(); const input=useRef<HTMLInputElement>(null);
  return <div className={`restok-theme ${styles.search}`}><Search size={18} className={styles.searchIcon} aria-hidden="true"/><input ref={input} id={id} type="search" aria-label={label} placeholder={label} value={value} onChange={event=>onValueChange(event.target.value)} className={`${styles.control} ${styles.searchInput}`} />{value?<IconButton label={`Limpar ${label.toLocaleLowerCase("pt-BR")}`} className={styles.clear} onClick={()=>{onValueChange("");input.current?.focus();}}><X size={18}/></IconButton>:null}</div>;
}
