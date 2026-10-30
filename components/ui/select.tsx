"use client";
import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import "@/styles/base.css";
import styles from "./controls.module.css";
export function Select({label,error,hint,id,className,children,...props}:SelectHTMLAttributes<HTMLSelectElement> & {label:string;error?:string;hint?:string}) {
  const generated=useId(); const inputId=id??generated;
  return <div className={cn("restok-theme",styles.field)}><label className={styles.label} htmlFor={inputId}>{label}</label><select {...props} id={inputId} aria-invalid={Boolean(error)} aria-describedby={[hint?`${inputId}-hint`:null,error?`${inputId}-error`:null,props["aria-describedby"]].filter(Boolean).join(" ")||undefined} className={cn(styles.control,className)}>{children}</select>{hint?<p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>:null}{error?<p id={`${inputId}-error`} role="alert" className={styles.error}>{error}</p>:null}</div>;
}
