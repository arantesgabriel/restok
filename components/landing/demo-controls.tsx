"use client";
import {useSyncExternalStore} from "react";
import {Button} from "@/components/ui/button";
import styles from "./demos.module.css";
const subscribe=()=>()=>{};
export function useDemoReady(){return useSyncExternalStore(subscribe,()=>true,()=>false);}
export function DemoReset({ready,onReset}:{ready:boolean;onReset:()=>void}){return <div className={styles.reset}><Button variant="quiet" disabled={!ready} onClick={onReset}>Reiniciar exemplo</Button><noscript><p className={styles.note}>Ative o JavaScript para experimentar as ações. Os dados continuam disponíveis acima.</p></noscript></div>;}
