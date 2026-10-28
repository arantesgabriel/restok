"use client";
import { useCallback, useEffect, useRef } from "react";
// The new sheet reads its exit token. Legacy dialogs keep their existing duration until PR12.
export function useDialogClose() {
  const closing=useRef<HTMLDialogElement|null>(null); const timeout=useRef<number|undefined>(undefined);
  useEffect(()=>()=>{window.clearTimeout(timeout.current);closing.current=null;},[]);
  return useCallback((onClose:()=>void)=>{
    const dialog=document.querySelector<HTMLDialogElement>("dialog[open]");
    if(!dialog){onClose();return true;}
    if(closing.current===dialog)return false;
    window.clearTimeout(timeout.current); closing.current=dialog; dialog.dataset.state="closing";
    const token=getComputedStyle(dialog).getPropertyValue("--duration-exit").trim();
    const duration=token?(token.endsWith("ms")?parseFloat(token):parseFloat(token)*1000):220;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeout.current=window.setTimeout(()=>{timeout.current=undefined;closing.current=null;if(dialog.isConnected)onClose();},reduced?0:Number.isFinite(duration)?duration:0);
    return true;
  },[]);
}
