"use client";

import { FormEvent, useState } from "react";
import { House, Users } from "lucide-react";
import { acceptHouseholdInvite, createHousehold } from "@/lib/supabase/data";

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
    if (!cleanName || busy) return;
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
      setBusy(null);
    }
  };

  const submitInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken || busy) return;
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
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl items-center px-4 py-10 sm:px-8">
      <section className="w-full rounded-[20px] border border-line bg-surface p-5 shadow-sheet sm:p-8">
        <div className="mb-7">
          <p className="text-sm font-semibold text-primary">{profileName || email || "Sua conta"}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Escolha como começar</h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-muted">Crie uma casa ou entre em uma com convite. A primeira lista fica por sua conta e pode ser criada quando quiser.</p>
        </div>

        {error ? <p className="mb-5 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta" role="alert">{error}</p> : null}

        {pendingHouseholdId ? <button type="button" disabled={busy !== null} onClick={() => void activate(pendingHouseholdId)} className="mb-6 min-h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60">{busy === "activate" ? "Carregando casa…" : "Tentar carregar a casa"}</button> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <form className="rounded-2xl border border-line bg-canvas p-4 sm:p-5" onSubmit={submitCreate}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-primary"><House size={19} /></span>
            <h2 className="mt-4 text-base font-semibold text-ink">Criar uma casa</h2>
            <p className="mt-1 text-sm leading-5 text-muted">Você será a pessoa proprietária e poderá convidar outras pessoas.</p>
            <label className="field-label mt-4">Nome da casa<input required maxLength={80} value={householdName} onChange={(event) => setHouseholdName(event.target.value)} className="field-input mt-2" /></label>
            <button type="submit" disabled={busy !== null || Boolean(pendingHouseholdId) || !householdName.trim()} className="mt-4 min-h-11 w-full rounded-[10px] bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">{busy === "create" ? "Criando…" : "Criar casa"}</button>
          </form>

          <form className="rounded-2xl border border-line bg-canvas p-4 sm:p-5" onSubmit={submitInvite}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-primary"><Users size={19} /></span>
            <h2 className="mt-4 text-base font-semibold text-ink">Entrar com convite</h2>
            <p className="mt-1 text-sm leading-5 text-muted">Cole o código do convite recebido de alguém da casa.</p>
            <label className="field-label mt-4">Código do convite<input value={token} onChange={(event) => setToken(event.target.value)} className="field-input mt-2" autoComplete="off" /></label>
            <button type="submit" disabled={busy !== null || Boolean(pendingHouseholdId) || !token.trim()} className="mt-4 min-h-11 w-full rounded-[10px] border border-line bg-surface px-4 text-sm font-semibold text-ink disabled:opacity-50">{busy === "invite" ? "Validando…" : "Entrar na casa"}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
