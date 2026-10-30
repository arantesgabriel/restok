import type { ReactNode } from "react";
import styles from "./controls.module.css";
export function List({children,label}:{children:ReactNode;label:string}) { return <ul aria-label={label} className={`restok-theme ${styles.list}`}>{children}</ul>; }
export function ListRow({children}:{children:ReactNode}) { return <li className={styles.row}>{children}</li>; }
