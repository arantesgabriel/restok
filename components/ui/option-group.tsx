"use client";
import { useId, useRef, type ReactNode } from "react";
import { Button } from "./button";
import styles from "./controls.module.css";
export type Option<T extends string>={value:T;label:string;disabled?:boolean};
export function OptionGroup<T extends string>({label,value,options,onChange}:{label:string;value:T;options:Option<T>[];onChange:(value:T)=>void}) {
  return <div role="group" aria-label={label} className={`restok-theme ${styles.options}`}>{options.map(option=><Button key={option.value} variant="secondary" className={styles.option} disabled={option.disabled} aria-pressed={value===option.value} onClick={()=>onChange(option.value)}>{option.label}</Button>)}</div>;
}
export function Tabs<T extends string>({label,value,options,onChange,children}:{label:string;value:T;options:Option<T>[];onChange:(value:T)=>void;children:ReactNode}) {
  const id=useId(); const tablist=useRef<HTMLDivElement>(null); const enabled=options.filter(option=>!option.disabled);
  return <div className="restok-theme"><div ref={tablist} role="tablist" aria-label={label} className={`${styles.options} ${styles.tabs}`} onKeyDown={event=>{ const index=enabled.findIndex(option=>option.value===value); const next=event.key==="Home"?0:event.key==="End"?enabled.length-1:event.key==="ArrowRight"?(index+1)%enabled.length:event.key==="ArrowLeft"?(index-1+enabled.length)%enabled.length:-1; if(next<0||!enabled.length)return;event.preventDefault();onChange(enabled[next].value); tablist.current?.querySelector<HTMLButtonElement>(`[data-value="${enabled[next].value}"]`)?.focus(); }}>{options.map(option=><Button key={option.value} id={`${id}-${option.value}`} data-value={option.value} role="tab" aria-selected={value===option.value} aria-controls={`${id}-panel`} tabIndex={value===option.value?0:-1} disabled={option.disabled} variant="quiet" className={styles.option} onClick={()=>onChange(option.value)}>{option.label}</Button>)}</div><div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${value}`} tabIndex={0}>{children}</div></div>;
}
