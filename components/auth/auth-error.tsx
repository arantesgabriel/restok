"use client";
import { useEffect, useRef } from "react";
import styles from "./auth.module.css";
export function AuthError({id,children}:{id:string;children:string}) {
  const target=useRef<HTMLParagraphElement>(null);
  useEffect(()=>{target.current?.focus();},[children]);
  return <p ref={target} id={id} role="alert" tabIndex={-1} className={styles.error}>{children}</p>;
}
