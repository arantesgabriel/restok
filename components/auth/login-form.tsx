"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { AuthFrame } from "./auth-frame";
import { AuthError } from "./auth-error";
import { PasswordField } from "./password-field";
import { useLoginForm } from "./use-login-form";
import styles from "./auth.module.css";
export function LoginForm() {
  const view=useLoginForm();
  const describedBy=view.error ? "login-error" : undefined;
  return <AuthFrame>{view.accountCreated ? <section className={styles.form}>
    <div className={styles.heading}><h1 ref={view.successTitleRef} id="login-title" tabIndex={-1} aria-describedby="login-success-detail">Confira seu email</h1><p id="login-success-detail">{view.message}</p></div>
    <Button variant="secondary" onClick={view.switchMode}>Voltar para o login</Button>
  </section> : <><header className={styles.heading}><h1 id="login-title">{view.isSignUp ? "Crie sua conta" : "Entre na sua conta"}</h1><p className={styles.muted}>{view.isSignUp ? "Use seu nome e email. Depois, crie uma casa ou aceite um convite." : "Use seu email e senha para acessar suas casas e compras."}</p></header>
    <form onSubmit={view.submit} className={styles.form} aria-labelledby="login-title" aria-busy={view.busy}>
      <p className={styles.sr} role="status">{view.loading ? view.isSignUp ? "Criando..." : "Entrando..." : view.resetting ? "Enviando…" : ""}</p>
      {view.isSignUp ? <Field id="name" label="Seu nome" required maxLength={80} autoComplete="name" disabled={view.busy} value={view.name} onChange={event=>view.setName(event.target.value)} aria-describedby={describedBy}/> : null}
      <Field id="email" label="Email" type="email" required autoComplete="email" autoCapitalize="none" disabled={view.busy} aria-invalid={view.emailInvalid||undefined} aria-describedby={describedBy} value={view.email} onChange={event=>view.setEmail(event.target.value)} placeholder="voce@exemplo.com"/>
      <PasswordField id="password" label="Senha" required minLength={6} autoComplete={view.isSignUp ? "new-password" : "current-password"} hint="Use pelo menos 6 caracteres." disabled={view.busy} aria-invalid={view.passwordInvalid||undefined} aria-describedby={describedBy} value={view.password} onChange={event=>view.setPassword(event.target.value)}/>
      <div className={styles.meta}><Checkbox checked={view.rememberEmail} disabled={view.busy} onChange={event=>view.setRememberEmail(event.target.checked)}>Lembrar email</Checkbox>{!view.isSignUp ? <Button variant="quiet" onClick={()=>void view.sendReset()} disabled={view.busy} busy={view.resetting}>{view.resetting ? "Enviando…" : "Esqueceu a senha?"}</Button> : null}</div>
      {view.error ? <AuthError id="login-error">{view.error}</AuthError> : null}
      {view.message ? <p role="status" className={styles.note}>{view.message}</p> : null}
      <Button type="submit" busy={view.loading} disabled={view.busy}>{view.loading ? view.isSignUp ? "Criando..." : "Entrando..." : view.isSignUp ? "Criar conta" : "Entrar"}</Button>
      <p className={styles.switch}>{view.isSignUp ? "Já tem conta?" : "Não tem conta?"}<Button variant="quiet" disabled={view.busy} onClick={view.switchMode}>{view.isSignUp ? "Entrar" : "Criar conta"}</Button></p>
    </form></>}</AuthFrame>;
}
