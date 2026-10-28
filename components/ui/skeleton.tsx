import "@/styles/base.css";
import styles from "./feedback.module.css";
export function Skeleton({label="Carregando",rows=3}:{label?:string;rows?:number}) {return <div className={`restok-theme ${styles.skeleton}`} role="status" aria-label={label} aria-busy="true">{Array.from({length:rows},(_,index)=><span key={index} aria-hidden="true"/>)}</div>;}
