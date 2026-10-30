"use client";
import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthFrame } from "./auth-frame";
import { AuthError } from "./auth-error";
import { PasswordField } from "./password-field";
import styles from "./auth.module.css";
export function ResetPasswordForm() {
  const router=useRouter();
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [error,setError]=useState<string|null>(null);
  const [saving,setSaving]=useState(false);
  const lock=useRef(false);
  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();if(lock.current)return;setError(null);
    if(password!==confirmation){setError("As senhas não coincidem.");return;}
    lock.current=true;setSaving(true);let navigating=false;
    try{
      const client=getSupabaseBrowserClient();
      if(!client){setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");return;}
      const result=await client.auth.updateUser({password});
      if(result.error){setError("Este link expirou ou já foi usado. Solicite uma nova redefinição e tente novamente.");return;}
      navigating=true;router.replace("/app?flow=onboarding");
    }catch{setError("Não foi possível atualizar a senha. Verifique sua conexão e tente novamente.");}
    finally{if(!navigating){lock.current=false;setSaving(false);}}
  };
  return <AuthFrame><header className={styles.heading}><h1 id="reset-title">Escolha uma nova senha</h1><p className={styles.muted}>Use pelo menos 6 caracteres para proteger sua conta.</p></header>
    <form className={styles.form} onSubmit={submit} aria-labelledby="reset-title" aria-busy={saving}>
      <p className={styles.sr} role="status">{saving ? "Salvando…" : ""}</p>
      <PasswordField id="new-password" label="Nova senha" required minLength={6} autoComplete="new-password" disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? "reset-error" : undefined} value={password} onChange={event=>setPassword(event.target.value)}/>
      <PasswordField id="confirm-password" label="Confirme a nova senha" required minLength={6} autoComplete="new-password" disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? "reset-error" : undefined} value={confirmation} onChange={event=>setConfirmation(event.target.value)}/>
      {error ? <AuthError id="reset-error">{error}</AuthError> : null}
      <Button type="submit" busy={saving}>{saving ? "Salvando…" : "Atualizar senha"}</Button>
      <p className={styles.switch}><Link href="/login">Voltar para o login</Link></p>
    </form></AuthFrame>;
}
