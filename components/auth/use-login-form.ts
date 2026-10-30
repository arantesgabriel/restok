"use client";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeInternalPath, signupDestination } from "@/lib/auth/redirect";
const rememberedEmailKey="restok-login-email";
const credentialError="Email ou senha inválidos. Confira os dados e tente novamente.";
const signupError="Não foi possível criar a conta. Confira os dados ou tente entrar se já possui uma conta.";
const missingEmailError="Informe o email para receber o link de redefinição.";
export function useLoginForm() {
  const router=useRouter();
  const lock=useRef(false);
  const successTitleRef=useRef<HTMLHeadingElement>(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [rememberEmail,setRememberEmail]=useState(true);
  const [isSignUp,setIsSignUp]=useState(false);
  const [message,setMessage]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const [resetting,setResetting]=useState(false);
  const [accountCreated,setAccountCreated]=useState(false);
  const [nextPath,setNextPath]=useState("/app");
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    setNextPath(safeInternalPath(params.get("next")));
    const code=params.get("auth");
    if(code==="unavailable")setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");
    else if(code==="invalid-link"||code==="exchange-failed")setError("Este link expirou ou já foi usado. Solicite um novo link e tente novamente.");
    else if(code==="confirmation-failed")setError("Não foi possível confirmar seu email. Solicite um novo link de confirmação.");
    try{const saved=window.localStorage.getItem(rememberedEmailKey);if(saved)setEmail(saved);}catch{/* Optional storage. */}
  },[]);
  useEffect(()=>{if(accountCreated)successTitleRef.current?.focus();},[accountCreated]);
  const remember=(value:string)=>{try{if(rememberEmail)window.localStorage.setItem(rememberedEmailKey,value);else window.localStorage.removeItem(rememberedEmailKey);}catch{/* Optional storage. */}};
  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();if(lock.current)return;
    setError(null);setMessage(null);
    if(isSignUp&&(!name.trim()||name.trim().length>80)){setError("Informe seu nome com até 80 caracteres.");return;}
    lock.current=true;setLoading(true);let navigating=false;
    try{
      const client=getSupabaseBrowserClient();
      if(!client){setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");return;}
      const cleanEmail=email.trim();
      const result=isSignUp ? await client.auth.signUp({email:cleanEmail,password,options:{emailRedirectTo:`${window.location.origin}/auth/callback?flow=signup&next=${encodeURIComponent(nextPath)}`,data:{full_name:name.trim()}}}) : await client.auth.signInWithPassword({email:cleanEmail,password});
      if(result.error||(!isSignUp&&!result.data.session))setError(isSignUp ? signupError : credentialError);
      else if(isSignUp&&!result.data.session){remember(cleanEmail);setMessage("Conta criada. Confirme seu email para continuar.");setAccountCreated(true);setPassword("");}
      else{remember(cleanEmail);navigating=true;router.push(isSignUp ? signupDestination(nextPath) : nextPath);}
    }catch{setError("Não foi possível concluir a autenticação. Verifique sua conexão e tente novamente.");}
    finally{if(!navigating){lock.current=false;setLoading(false);}}
  };
  const sendReset=async()=>{
    if(lock.current)return;setError(null);setMessage(null);
    const cleanEmail=email.trim();
    if(!cleanEmail){setError(missingEmailError);return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)){setError("Informe um email válido para receber o link de redefinição.");return;}
    lock.current=true;setResetting(true);
    try{
      const client=getSupabaseBrowserClient();
      if(!client){setError("A autenticação está indisponível no momento. Tente novamente mais tarde.");return;}
      const result=await client.auth.resetPasswordForEmail(cleanEmail,{redirectTo:`${window.location.origin}/auth/callback?flow=recovery`});
      if(result.error)setError("Não foi possível enviar o link agora. Confira o email e tente novamente.");
      else setMessage("Se esse email estiver cadastrado, enviaremos um link para redefinir a senha.");
    }catch{setError("Não foi possível enviar o link. Verifique sua conexão e tente novamente.");}
    finally{lock.current=false;setResetting(false);}
  };
  const switchMode=()=>{if(lock.current)return;setError(null);setMessage(null);setAccountCreated(false);setIsSignUp(!isSignUp);setPassword("");};
  return {email,setEmail,password,setPassword,name,setName,rememberEmail,setRememberEmail,isSignUp,message,error,loading,resetting,accountCreated,successTitleRef,submit,sendReset,switchMode,
    busy:loading||resetting,emailInvalid:error===missingEmailError||error===credentialError||error===signupError||Boolean(error?.startsWith("Informe um email válido")),passwordInvalid:error===credentialError||error===signupError};
}
