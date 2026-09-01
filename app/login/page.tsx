"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setError(null); setLoading(true);
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) setError(authError.message);
      else setSent(true);
    } else setSent(true);
    setLoading(false);
  };
  const google = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setSent(true); return; }
    setError(null); setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
    if (authError) setError(authError.message);
    setLoading(false);
  };
  return <main className="login-page"><div className="login-panel"><Link href="/" className="login-back"><ArrowLeft size={16} />Voltar para o início</Link><div className="login-brand">restok<span>.</span></div><div className="login-copy"><span className="login-icon"><Sparkles size={18} /></span><h1>Volte para a sua casa.</h1><p>Entre para continuar de onde vocês pararam.</p></div>{sent ? <div className="login-success"><span><Mail size={18} /></span><h2>Link enviado.</h2><p>Se este email já tem uma casa no RESTOK, o acesso chega em instantes.</p><Link href="/app" className="landing-cta">Entrar no modo demonstração <ArrowRight size={17} /></Link></div> : <form onSubmit={submit} className="login-form"><label htmlFor="email">Seu email</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" /><button type="submit" disabled={loading}>{loading ? "Enviando…" : "Receber link de acesso"} {!loading && <ArrowRight size={17} />}</button><button type="button" className="login-google" onClick={google} disabled={loading}>Continuar com Google</button>{error ? <p className="login-error" role="alert">{error}</p> : null}<div className="login-divider"><span />ou<span /></div><Link href="/app" className="demo-link">Experimentar com dados de exemplo <ArrowRight size={16} /></Link><p className="login-legal">Sem senha e sem onboarding longo. Sem Supabase configurado, o modo demonstração funciona localmente.</p></form>}</div><div className="login-aside"><p>“Pegou. Marcou. Próximo.”</p><span>— o jeito mais simples de abastecer a casa.</span></div></main>;
}
