import { Button } from "./button";
import type { ReactNode } from "react";
import styles from "./feedback.module.css";
export function SyncStatus({state,message,onRetry}:{state:"pending"|"error"|"success";message:ReactNode;onRetry?:()=>void}) {return <div className={`restok-theme ${styles.sync}`} data-state={state} role={state==="error"?"alert":"status"}><div>{message}</div>{onRetry?<Button variant="secondary" onClick={onRetry}>Tentar novamente</Button>:null}</div>;}
