"use client";
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import "@/styles/base.css";
import styles from "./controls.module.css";
export type FieldProps=InputHTMLAttributes<HTMLInputElement> & {label:string;hint?:string;error?:string;initialFocus?:boolean};
export function Field({label,hint,error,id,initialFocus,className,...props}:FieldProps) {
  const generated=useId(); const inputId=id??generated; const description=[hint?`${inputId}-hint`:null,error?`${inputId}-error`:null,props["aria-describedby"]].filter(Boolean).join(" ")||undefined;
  return <div className={cn("restok-theme",styles.field)}><label className={styles.label} htmlFor={inputId}>{label}</label><input {...props} id={inputId} data-initial-focus={initialFocus||undefined} aria-invalid={Boolean(error)||props["aria-invalid"]} aria-describedby={description} className={cn(styles.control,className)} />{hint?<p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>:null}{error?<p id={`${inputId}-error`} role="alert" className={styles.error}>{error}</p>:null}</div>;
}
