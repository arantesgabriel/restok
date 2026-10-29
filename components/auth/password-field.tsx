"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, type FieldProps } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import styles from "./auth.module.css";
export function PasswordField({id,label,hint,...props}:FieldProps & {id:string}) {
  const [visible,setVisible]=useState(false);
  return <div><div className={styles.password}><Field {...props} id={id} label={label} aria-describedby={[props["aria-describedby"],hint ? `${id}-hint` : null].filter(Boolean).join(" ")||undefined} type={visible ? "text" : "password"}/><IconButton className={styles.reveal} label={`${visible ? "Ocultar" : "Mostrar"} ${label.toLocaleLowerCase("pt-BR")}`} aria-controls={id} aria-pressed={visible} variant="bordered" onClick={()=>setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</IconButton></div>{hint ? <p className={styles.hint} id={`${id}-hint`}>{hint}</p> : null}</div>;
}
