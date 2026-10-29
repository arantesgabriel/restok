"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { persistProfileName } from "@/lib/supabase/data";
import { AuthError } from "./auth-error";
import styles from "./auth.module.css";
export function ProfileEditorSheet({name,onClose,onSaved}:{name:string;onClose:()=>boolean;onSaved:(name:string)=>void}) {
  const [value,setValue]=useState(name);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const lock=useRef(false);
  const close=()=>{if(!lock.current)onClose();};
  return <Sheet title="Seu nome" description="Este nome identifica você para as pessoas das suas casas." onClose={close} footer={<div className={styles.actions}><Button variant="secondary" disabled={busy} onClick={close}>Cancelar</Button><Button type="submit" form="profile-name-form" busy={busy}>{busy ? "Salvando…" : "Salvar nome"}</Button></div>}>
    <form id="profile-name-form" className={styles.form} onSubmit={async event=>{
      event.preventDefault();if(lock.current)return;
      const clean=value.trim();
      if(!clean||clean.length>80){setError("Informe seu nome com até 80 caracteres.");return;}
      lock.current=true;setBusy(true);setError("");
      try{if(!await persistProfileName(clean)){setError("Não foi possível salvar seu nome. Tente novamente.");return;}onSaved(clean);onClose();}
      catch{setError("Não foi possível salvar seu nome. Tente novamente.");}
      finally{lock.current=false;setBusy(false);}
    }}>
      <Field label="Seu nome" initialFocus required maxLength={80} autoComplete="name" disabled={busy} value={value} onChange={event=>setValue(event.target.value)} hint="Até 80 caracteres. Use um nome que as outras pessoas reconheçam." aria-invalid={Boolean(error)} aria-describedby={error ? "profile-name-error" : undefined}/>
      {error ? <AuthError id="profile-name-error">{error}</AuthError> : null}
    </form>
  </Sheet>;
}
