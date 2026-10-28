"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { IconButton } from "./icon-button";
import "@/styles/base.css";
import styles from "./feedback.module.css";
// Persistent by default: callers must explicitly identify a transient confirmation.
export function Toast({message,onDismiss,transient=false}:{message:string;onDismiss:()=>void;transient?:boolean}) {
  const dismiss=useRef(onDismiss); dismiss.current=onDismiss;
  useEffect(()=>{if(!transient)return;const timeout=window.setTimeout(()=>dismiss.current(),4000);return()=>window.clearTimeout(timeout);},[message,transient]);
  return <div className={`restok-theme ${styles.toast}`}><span role="status">{message}</span><IconButton label="Dispensar aviso" className={styles.dismiss} onClick={onDismiss}><X size={18}/></IconButton></div>;
}
