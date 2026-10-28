"use client";
import { useEffect, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { IconButton } from "./icon-button";
import "@/styles/base.css";
import styles from "./feedback.module.css";
// Persistent by default: callers must explicitly identify a transient confirmation.
export function Toast({message,onDismiss,transient=false,inline=false}:{message:string;onDismiss:()=>void;transient?:boolean;inline?:boolean}) {
  const dismiss=useRef(onDismiss); dismiss.current=onDismiss;
  useEffect(()=>{if(!transient)return;const timeout=window.setTimeout(()=>dismiss.current(),4000);return()=>window.clearTimeout(timeout);},[message,transient]);
  if(inline)return <details className={`restok-theme ${styles.inlineNotice}`} onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus();}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false;}}><summary aria-label={`Aviso: ${message}`} title={message}><MessageSquare size={19} aria-hidden="true"/><span role="status" className={styles.sr}>{message}</span></summary><div className={styles.noticePanel}><p>{message}</p><IconButton label="Dispensar aviso" onClick={onDismiss}><X size={18}/></IconButton></div></details>;
  return <div className={`restok-theme ${styles.toast}`}><span role="status">{message}</span><IconButton label="Dispensar aviso" className={styles.dismiss} onClick={onDismiss}><X size={18}/></IconButton></div>;
}
