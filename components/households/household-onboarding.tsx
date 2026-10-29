"use client";

import { FormEvent, useRef, useState } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { RestokTheme } from "@/components/ui/theme";
import { acceptHouseholdInvite, createHousehold } from "@/lib/supabase/data";
import styles from "./households.module.css";

export function HouseholdOnboarding({
  profileName,
  email,
  inviteToken,
  inviteFailed,
  onActivate,
}: {
  profileName: string | null;
  email: string | null;
  inviteToken: string;
  inviteFailed: boolean;
  onActivate: (householdId: string) => Promise<boolean>;
}) {
  const firstName = profileName?.trim().split(/\s+/)[0];
  const [householdName, setHouseholdName] = useState(firstName ? `Casa de ${firstName}` : "Minha casa");
  const [token, setToken] = useState(inviteToken);
  const [pendingHouseholdId, setPendingHouseholdId] = useState<string | null>(null);
  const [busy, setBusy] = useState<"create" | "invite" | "activate" | null>(null);
  const [error, setError] = useState<string | null>(inviteFailed ? "Não foi possível aceitar esse convite. Confira o link ou cole um convite válido abaixo." : null);
  const lock = useRef(false);

  const activate = async (householdId: string) => {
    setPendingHouseholdId(householdId);
    setBusy("activate");
    setError(null);
    try {
      if (!(await onActivate(householdId))) {
        setError("A casa está pronta, mas não carregou. Tente novamente.");
        return;
      }
      setPendingHouseholdId(null);
    } catch {
      setError("A casa está pronta, mas não carregou. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(null);
    }
  };

  const submitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = householdName.trim();
    if (!cleanName || lock.current || pendingHouseholdId) return;
    lock.current = true;
    setBusy("create");
    setError(null);
    try {
      const householdId = await createHousehold(cleanName);
      if (!householdId) {
        setError("Não foi possível criar a casa. Confira o nome e tente novamente.");
        return;
      }
      await activate(householdId);
    } catch {
      setError("Não foi possível criar a casa. Verifique sua conexão e tente novamente.");
    } finally {
      lock.current = false;
      setBusy(null);
    }
  };

  const submitInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken || lock.current || pendingHouseholdId) return;
    lock.current = true;
    setBusy("invite");
    setError(null);
    try {
      const householdId = await acceptHouseholdInvite(cleanToken);
      setToken("");
      if (!householdId) {
        setError("Esse convite é inválido, expirou, já foi usado ou foi revogado.");
        return;
      }
      await activate(householdId);
    } catch {
      setError("Não foi possível validar o convite. Verifique sua conexão e tente novamente.");
    } finally {
      lock.current = false;
      setBusy(null);
    }
  };

  return (
    <RestokTheme><main className={styles.onboarding}>
      <section className={styles.onboardingContent}>
        <BrandMark />
        <div className={styles.onboardingHeading}>
          <p className={styles.meta}>{profileName || email || "Sua conta"}</p>
          <h1>Escolha como começar</h1>
          <p className={styles.meta}>Crie uma casa ou entre em uma com convite. Depois, prepare sua primeira compra.</p>
        </div>

        {error ? <p className={styles.error} role="alert">{error}</p> : null}

        {pendingHouseholdId ? <div className={styles.retry}><p>A casa está pronta. Tente carregá-la sem criar outra.</p><Button disabled={busy !== null} onClick={() => { if(lock.current)return; lock.current=true; void activate(pendingHouseholdId).finally(()=>{lock.current=false;}); }}>{busy === "activate" ? "Carregando casa…" : "Tentar carregar a casa"}</Button></div> : null}

        <div className={styles.choices}>
          <form className={styles.choice} onSubmit={submitCreate}>
            <h2>Criar uma casa</h2>
            <p className={styles.meta}>Você será a pessoa proprietária e poderá convidar outras pessoas.</p>
            <Field label="Nome da casa" required maxLength={80} value={householdName} disabled={busy !== null || Boolean(pendingHouseholdId)} onChange={(event) => setHouseholdName(event.target.value)}/>
            <Button type="submit" disabled={busy !== null || Boolean(pendingHouseholdId) || !householdName.trim()}>{busy === "create" ? "Criando…" : "Criar casa"}</Button>
          </form>

          <form className={styles.choice} onSubmit={submitInvite}>
            <h2>Entrar com convite</h2>
            <p className={styles.meta}>Cole o código do convite recebido de alguém da casa.</p>
            <Field label="Código do convite" value={token} disabled={busy !== null || Boolean(pendingHouseholdId)} onChange={(event) => setToken(event.target.value)} autoComplete="off"/>
            <Button type="submit" variant="secondary" disabled={busy !== null || Boolean(pendingHouseholdId) || !token.trim()}>{busy === "invite" ? "Validando…" : "Entrar na casa"}</Button>
          </form>
        </div>
      </section>
    </main></RestokTheme>
  );
}
