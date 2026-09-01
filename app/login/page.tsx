"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Configure o Supabase para criar uma conta com email e senha.");
      setLoading(false);
      return;
    }

    const result = isSignUp
      ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/auth/callback`, data: { full_name: name.trim() } } })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (result.error) setError(result.error.message);
    else if (isSignUp && !result.data.session) setMessage("Conta criada. Confirme seu email para continuar.");
    else router.push("/app");
    setLoading(false);
  };

  return <main className="login-page"><div className="login-panel"><Link href="/" className="login-back"><ArrowLeft size={16} />Voltar para o início</Link><div className="login-brand">restok<span>.</span></div><div className="login-copy"><span className="login-icon"><Sparkles size={18} /></span><h1>{isSignUp ? "Crie a casa de vocês." : "Volte para a sua casa."}</h1><p>{isSignUp ? "Comece uma lista compartilhada para o mercado." : "Entre para continuar de onde vocês pararam."}</p></div>{message ? <div className="login-success"><span><LockKeyhole size={18} /></span><h2>Quase lá.</h2><p>{message}</p><button type="button" className="landing-cta" onClick={() => { setMessage(null); setIsSignUp(false); }}>Voltar para o login <ArrowRight size={17} /></button></div> : <form onSubmit={submit} className="login-form">{isSignUp ? <><label htmlFor="name">Seu nome</label><input id="name" type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /></> : null}<label htmlFor="email">Seu email</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" /><label htmlFor="password">Senha</label><input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 6 caracteres" /><button type="submit" disabled={loading}>{loading ? "Aguarde…" : isSignUp ? "Criar minha conta" : "Entrar"} {!loading && <ArrowRight size={17} />}</button>{error ? <p className="login-error" role="alert">{error}</p> : null}<button type="button" className="demo-link" onClick={() => { setError(null); setIsSignUp((current) => !current); }}>{isSignUp ? "Já tenho uma conta" : "Criar uma conta nova"}</button><div className="login-divider"><span />ou<span /></div><Link href="/app" className="demo-link">Experimentar com dados de exemplo <ArrowRight size={16} /></Link><p className="login-legal">Use o mesmo app nos dois aparelhos para manter a lista da casa sincronizada.</p></form>}</div><div className="login-aside"><p>“Pegou. Marcou. Próximo.”</p><span>— o jeito mais simples de abastecer a casa.</span></div></main>;
}
