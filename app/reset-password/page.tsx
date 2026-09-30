"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("Este link expirou ou já foi usado. Solicite uma nova redefinição e tente novamente.");
        return;
      }
      router.replace("/app?flow=onboarding");
    } catch {
      setError("Não foi possível atualizar a senha. Verifique sua conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-dvh bg-white">
      <section className="login-panel mx-auto w-full max-w-2xl">
        <Link href="/" className="login-brand">restok<span>.</span></Link>
        <div className="login-main">
          <div className="login-copy">
            <h1>Escolha uma nova senha</h1>
            <p>Use pelo menos 6 caracteres para proteger sua conta.</p>
          </div>
          <form onSubmit={submit} className="login-form">
            <label className="login-field" htmlFor="new-password">
              <span>Nova senha</span>
              <span className="login-control"><input id="new-password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></span>
            </label>
            <label className="login-field" htmlFor="confirm-password">
              <span>Confirme a nova senha</span>
              <span className="login-control"><input id="confirm-password" type="password" required minLength={6} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></span>
            </label>
            {error ? <p className="login-error" role="alert">{error}</p> : null}
            <button type="submit" className="login-submit" disabled={saving}>{saving ? "Salvando…" : "Atualizar senha"}</button>
            <p className="login-switch"><Link href="/login">Voltar para o login</Link></p>
          </form>
        </div>
        <footer className="login-foot">© 2026 RESTOK</footer>
      </section>
    </main>
  );
}
