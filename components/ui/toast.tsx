"use client";
import { useEffect, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { IconButton } from "./icon-button";
import "@/styles/base.css";
import styles from "./feedback.module.css";
// Persistent by default: callers must explicitly identify a transient confirmation.
export function Toast({message,onDismiss,transient=false,inline=false,visuallyHidden=false}:{message:string;onDismiss:()=>void;transient?:boolean;inline?:boolean;visuallyHidden?:boolean}) {
  const dismiss=useRef(onDismiss); dismiss.current=onDismiss;
  const root=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    const element=root.current;if(!transient||!element)return;
    let remaining=4000,started=0,timer:number|undefined;
    const reasons=new Set<string>();
    const stop=()=>{if(timer!==undefined){window.clearTimeout(timer);timer=undefined;remaining=Math.max(0,remaining-(Date.now()-started));}};
    const start=()=>{if(reasons.size||timer!==undefined)return;started=Date.now();timer=window.setTimeout(()=>{timer=undefined;dismiss.current();},remaining);};
    const pause=(reason:string)=>{reasons.add(reason);stop();};
    const resume=(reason:string)=>{reasons.delete(reason);start();};
    const enter=()=>pause("pointer"),leave=()=>resume("pointer"),focus=()=>pause("focus");
    const blur=(event:FocusEvent)=>{if(!element.contains(event.relatedTarget as Node|null))resume("focus");};
    const visibility=()=>{if(document.hidden)pause("hidden");else resume("hidden");};
    element.addEventListener("mouseenter",enter);element.addEventListener("mouseleave",leave);
    element.addEventListener("focusin",focus);element.addEventListener("focusout",blur);
    document.addEventListener("visibilitychange",visibility);
    if(element.contains(document.activeElement))reasons.add("focus");
    visibility();start();
    return()=>{stop();element.removeEventListener("mouseenter",enter);element.removeEventListener("mouseleave",leave);element.removeEventListener("focusin",focus);element.removeEventListener("focusout",blur);document.removeEventListener("visibilitychange",visibility);};
  },[message,transient,visuallyHidden]);
  if(visuallyHidden)return <span ref={element=>{root.current=element;}} role="status" className={styles.sr}>{message}</span>;
  if(inline)return <details ref={element=>{root.current=element;}} className={`restok-theme ${styles.inlineNotice}`} onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus();}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false;}}><summary aria-label={`Aviso: ${message}`} title={message}><MessageSquare size={19} aria-hidden="true"/><span role="status" className={styles.sr}>{message}</span></summary><div className={styles.noticePanel}><p>{message}</p><IconButton label="Dispensar aviso" onClick={onDismiss}><X size={18}/></IconButton></div></details>;
  return <div ref={element=>{root.current=element;}} className={`restok-theme ${styles.toast}`}><span role="status">{message}</span><IconButton label="Dispensar aviso" className={styles.dismiss} onClick={onDismiss}><X size={18}/></IconButton></div>;
}
