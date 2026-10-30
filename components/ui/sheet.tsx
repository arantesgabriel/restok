"use client";
import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { AccessibleDialog } from "@/components/accessible-dialog";
import { IconButton } from "./icon-button";
import styles from "./overlay.module.css";
export function Sheet({title,description,children,onClose,wide=false,formLayout=false,footer}:{title:string;description?:string;children:ReactNode;onClose:()=>void;wide?:boolean;formLayout?:boolean;footer?:ReactNode}) {
  const id=useId();
  return <AccessibleDialog titleId={id} onClose={onClose} className={`restok-theme ${styles.dialog}`}><section data-sheet-panel className={`${styles.panel} ${wide?styles.wide:""} ${formLayout?styles.formPanel:""}`}><header className={styles.header}><div><h2 id={id} tabIndex={-1} data-dialog-initial-focus>{title}</h2>{description?<p>{description}</p>:null}</div><IconButton label="Fechar" onClick={onClose} variant="quiet"><X size={18}/></IconButton></header><div data-sheet-body className={styles.body}>{children}</div>{footer?<footer data-sheet-footer className={styles.footer}>{footer}</footer>:null}</section></AccessibleDialog>;
}
