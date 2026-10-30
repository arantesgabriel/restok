"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import styles from "./overlay.module.css";
export type ActionMenuItem={label:string;icon?:ReactNode;onSelect:()=>void};
export function ActionMenu({label,children,items,triggerClassName,menuClassName}:{label:string;children:ReactNode;items:ActionMenuItem[];triggerClassName?:string;menuClassName?:string}) {
  const [open,setOpen]=useState(false),[position,setPosition]=useState({top:0,left:0,maxHeight:0});
  const id=useId(),trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{if(!open)return;const place=()=>{const rect=trigger.current?.getBoundingClientRect();if(!rect)return;const width=Math.min(272,innerWidth-16),height=Math.min(menu.current?.scrollHeight??items.length*44+8,innerHeight-16);const top=rect.bottom+8+height<=innerHeight?rect.bottom+8:Math.max(8,rect.top-height-8);setPosition({top,left:Math.max(8,Math.min(rect.right-width,innerWidth-width-8)),maxHeight:innerHeight-top-8});};place();window.addEventListener("resize",place);return()=>window.removeEventListener("resize",place);},[open,items.length]);
  useEffect(()=>{if(!open)return;menu.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();const key=(event:globalThis.KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();setOpen(false);trigger.current?.focus();}else if(event.key==="Tab"){setOpen(false);trigger.current?.focus();}};const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!menu.current?.contains(event.target)&&!trigger.current?.contains(event.target))setOpen(false);};document.addEventListener("keydown",key);document.addEventListener("pointerdown",outside);return()=>{document.removeEventListener("keydown",key);document.removeEventListener("pointerdown",outside);};},[open]);
  function move(event:KeyboardEvent<HTMLDivElement>){
    if(event.key === "Escape" || event.key === "Tab") {
      event.stopPropagation();
      if(event.key === "Escape") event.preventDefault();
      setOpen(false); trigger.current?.focus(); return;
    }
    const buttons=Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]")??[]);const current=buttons.indexOf(document.activeElement as HTMLButtonElement);const next=event.key==="Home"?0:event.key==="End"?buttons.length-1:event.key==="ArrowDown"?(current+1)%buttons.length:event.key==="ArrowUp"?(current-1+buttons.length)%buttons.length:-1;if(next<0)return;event.preventDefault();buttons[next]?.focus();}
  return <><Button ref={trigger} variant="secondary" aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} className={triggerClassName} onKeyDown={event=>{if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();setOpen(true);}}} onClick={()=>setOpen(current=>!current)}>{children}</Button>{open?createPortal(<div ref={menu} id={id} role="menu" aria-label={label} onKeyDown={move} className={`restok-theme ${styles.menu} ${menuClassName??""}`} style={position}>{items.map(item=><button key={item.label} type="button" role="menuitem" tabIndex={-1} className={styles.menuitem} onClick={()=>{setOpen(false);trigger.current?.focus();item.onSelect();}}>{item.icon}{item.label}</button>)}</div>,trigger.current?.closest("dialog") ?? document.body):null}</>;
}
