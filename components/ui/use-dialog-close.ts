"use client";
import { useCallback, useEffect, useRef } from "react";
import { waitForExit } from "./exit-lifecycle";
export function useDialogClose() {
  const closing=useRef<HTMLDialogElement|null>(null); const cancel=useRef<(()=>void)|undefined>(undefined);
  useEffect(()=>()=>{cancel.current?.();closing.current=null;},[]);
  return useCallback((onClose:()=>void)=>{
    const dialog=document.querySelector<HTMLDialogElement>("dialog[open]");
    if(!dialog){onClose();return true;}
    if(closing.current===dialog)return false;
    cancel.current?.(); closing.current=dialog;
    cancel.current=waitForExit(dialog,()=>{closing.current=null;onClose();});
    return true;
  },[]);
}
