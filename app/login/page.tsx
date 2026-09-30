"use client";

import Link from "next/link";
import { Check, Eye, EyeOff, House, LockKeyhole, Mail, ShoppingBasket, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const rememberedEmailKey = "restok-login-email";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [nextPath, setNextPath] = useState("/app");

  useEffect(() => {
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    if (requestedNext?.startsWith("/") && !requestedNext.startsWith("//")) setNextPath(requestedNext);
    const savedEmail = window.localStorage.getItem(rememberedEmailKey);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const remember = (value: string) => {
    if (rememberEmail) window.localStorage.setItem(rememberedEmailKey, value);
    else window.localStorage.removeItem(rememberedEmailKey);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Configure o Supabase para entrar com email e senha.");
      setLoading(false);
      return;
    }

    const cleanEmail = email.trim();
    const result = isSignUp
      ? await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            data: { full_name: name.trim() },
          },
        })
      : await supabase.auth.signInWithPassword({ email: cleanEmail, password });

    if (result.error) setError(result.error.message);
    else if (isSignUp && !result.data.session) setMessage("Conta criada. Confirme seu email para continuar.");
    else {
      remember(cleanEmail);
      router.push(nextPath);
    }
    setLoading(false);
  };

  const sendReset = async () => {
    setError(null);
    setMessage(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Informe o email para receber o link de redefinição.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Configure o Supabase para redefinir a senha.");
      return;
    }
    setResetting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/login")}`,
    });
    if (resetError) setError(resetError.message);
    else setMessage("Enviamos um link de redefinição para esse email.");
    setResetting(false);
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <Link href="/" className="login-brand">
          <span className="login-mark" aria-hidden="true"><ShoppingBasket size={16} /></span>
          restok<span>.</span>
        </Link>

        <div className="login-main">
          {message && !error && message.startsWith("Conta criada") ? (
            <div className="login-success">
              <span><LockKeyhole size={18} /></span>
              <h1>Quase lá.</h1>
              <p>{message}</p>
              <button type="button" onClick={() => { setMessage(null); setIsSignUp(false); }}>Voltar para o login</button>
            </div>
          ) : (
            <>
              <div className="login-copy">
                <h1>{isSignUp ? "Crie a conta da casa" : "Entre na sua conta"}</h1>
                <p>{isSignUp ? "A lista fica nos dois aparelhos." : "Use o email da casa para continuar a lista."}</p>
              </div>
              <form onSubmit={submit} className="login-form">
                {isSignUp ? (
                  <label className="login-field" htmlFor="name">
                    <span>Seu nome</span>
                    <span className="login-control">
                      <UserRound size={16} aria-hidden="true" />
                      <input id="name" type="text" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Como vocês se chamam" />
                    </span>
                  </label>
                ) : null}
                <label className="login-field" htmlFor="email">
                  <span>Email<span className="login-required" aria-hidden="true">*</span></span>
                  <span className="login-control">
                    <Mail size={16} aria-hidden="true" />
                    <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
                  </span>
                </label>
                <label className="login-field" htmlFor="password">
                  <span>Senha<span className="login-required" aria-hidden="true">*</span></span>
                  <span className="login-control">
                    <LockKeyhole size={16} aria-hidden="true" />
                    <input id="password" type={showPassword ? "text" : "password"} required minLength={6} autoComplete={isSignUp ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" />
                    <button type="button" className="login-reveal" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
                {isSignUp ? null : (
                  <div className="login-meta">
                    <label className="login-remember">
                      <input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} />
                      Lembrar email
                    </label>
                    <button type="button" className="login-forgot" onClick={sendReset} disabled={resetting}>
                      {resetting ? "Enviando…" : "Esqueceu a senha?"}
                    </button>
                  </div>
                )}
                {error ? <p className="login-error" role="alert">{error}</p> : null}
                {message ? <p className="login-note" role="status">{message}</p> : null}
                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? "Aguarde…" : isSignUp ? "Criar conta" : "Entrar"}
                </button>
                <p className="login-switch">
                  {isSignUp ? "Já tem conta?" : "Não tem conta?"}
                  <button type="button" onClick={() => { setError(null); setMessage(null); setIsSignUp((current) => !current); }}>
                    {isSignUp ? "Entrar" : "Criar conta"}
                  </button>
                </p>
                <div className="login-divider"><span />ou<span /></div>
                <Link href="/app" className="login-demo">Experimentar com dados de exemplo</Link>
              </form>
            </>
          )}
        </div>

        <footer className="login-foot">© 2026 RESTOK</footer>
      </section>

      <aside className="login-aside">
        <div className="login-scene" aria-hidden="true">
          <div className="landing-preview">
            <div className="preview-top"><span className="preview-brand">restok<span>.</span></span><span className="preview-user">GB</span></div>
            <div className="preview-heading"><div><span className="preview-kicker">Dentro do mercado</span><strong>Compras de Setembro</strong><small>18 de 32 resolvidos</small></div></div>
            <div className="preview-budget"><div><small>Gasto até agora</small><strong>R$ 483,72</strong></div><span><b>R$ 316,28</b><small>disponíveis</small></span><i><em style={{ width: "61%" }} /></i></div>
            <div className="preview-items">
              <div className="preview-item resolved"><span className="preview-check"><Check size={12} /></span><div><b>Filé de peito de frango</b><small>10 un. · R$ 158,90</small></div></div>
              <div className="preview-item"><span className="preview-symbol">◌</span><div><b>Leite desnatado</b><small>2 un. · Adicionar preço</small></div></div>
              <div className="preview-item resolved"><span className="preview-symbol"><House size={12} /></span><div><b>Sabonete</b><small>3 un. · Já temos</small></div></div>
            </div>
          </div>
        </div>
        <div className="login-caption">
          <p>A lista que vai com vocês até o caixa.</p>
          <ul>
            <li><Check size={14} aria-hidden="true" />Marque sem soltar o carrinho</li>
            <li><Check size={14} aria-hidden="true" />O total segue o preço real</li>
            <li><Check size={14} aria-hidden="true" />“Já temos” fica fora da conta</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
