import type { ReactNode } from "react";
import "@/styles/base.css";
import styles from "./feedback.module.css";
export function EmptyState({icon,title,description,action}:{icon:ReactNode;title:string;description:string;action?:ReactNode}) {return <div className={`restok-theme ${styles.empty}`}><span aria-hidden="true">{icon}</span><h2>{title}</h2><p>{description}</p>{action}</div>;}
