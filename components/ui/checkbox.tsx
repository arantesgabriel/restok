import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./controls.module.css";
import "@/styles/base.css";
export function Checkbox({children,...props}:Omit<InputHTMLAttributes<HTMLInputElement>,"type"> & {children:ReactNode}) {
  return <label className={`restok-theme ${styles.checkbox}`}><input {...props} type="checkbox"/><span>{children}</span></label>;
}
