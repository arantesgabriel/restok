"use client";
import {useRef,type ReactNode} from "react";
import {Menu} from "lucide-react";
import styles from "./site.module.css";
export function MobileNavigation({children}:{children:ReactNode}) {
  const details=useRef<HTMLDetailsElement>(null);
  return <details ref={details} className={styles.mobileMenu} onClick={event=>{if(event.target instanceof Element&&event.target.closest("a")&&details.current)details.current.open=false;}} onKeyDown={event=>{if(event.key==="Escape"&&details.current?.open){event.preventDefault();details.current.open=false;details.current.querySelector("summary")?.focus();}}}><summary><Menu size={18} aria-hidden="true"/>Menu</summary><nav aria-label="Seções">{children}</nav></details>;
}
