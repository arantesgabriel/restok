"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, ShoppingBasket, UserRound } from "lucide-react";
import { LoginShowcase } from "@/components/login-showcase/login-showcase";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeInternalPath, signupDestination } from "@/lib/auth/redirect";

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
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeInternalPath(params.get("next")));
    const authError = params.get("auth");
    if (authError === "unavailable") setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");
    else if (authError === "invalid-link" || authError === "exchange-failed") setError("Este link expirou ou já foi usado. Solicite um novo link e tente novamente.");
    else if (authError === "confirmation-failed") setError("Não foi possível confirmar seu email. Solicite um novo link de confirmação.");
    try {
      const savedEmail = window.localStorage.getItem(rememberedEmailKey);
      if (savedEmail) setEmail(savedEmail);
    } catch { /* Login can proceed when browser storage is unavailable. */ }
  }, []);

  const remember = (value: string) => {
    try {
      if (rememberEmail) window.localStorage.setItem(rememberedEmailKey, value);
      else window.localStorage.removeItem(rememberedEmailKey);
    } catch { /* Login can continue when browser storage is unavailable. */ }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setError("Configure o Supabase para entrar com email e senha.");
        return;
      }

      const cleanEmail = email.trim();
      const result = isSignUp
        ? await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?flow=signup&next=${encodeURIComponent(nextPath)}`,
              data: { full_name: name.trim() },
            },
          })
        : await supabase.auth.signInWithPassword({ email: cleanEmail, password });

      if (result.error) setError(isSignUp ? "Não foi possível criar a conta. Confira os dados ou tente entrar se já possui uma conta." : "Email ou senha inválidos. Confira os dados e tente novamente.");
      else if (isSignUp && !result.data.session) {
        remember(cleanEmail);
        setMessage("Conta criada. Confirme seu email para continuar.");
      } else {
        remember(cleanEmail);
        router.push(isSignUp ? signupDestination(nextPath) : nextPath);
      }
    } catch {
      setError("Não foi possível concluir a autenticação. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
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
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/callback?flow=recovery`,
      });
      if (resetError) setError("Não foi possível enviar o link agora. Confira o email e tente novamente.");
      else setMessage("Se esse email estiver cadastrado, enviaremos um link para redefinir a senha.");
    } catch {
      setError("Não foi possível enviar o link. Verifique sua conexão e tente novamente.");
    } finally {
      setResetting(false);
    }
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

      <LoginShowcase />
    </main>
  );
}
