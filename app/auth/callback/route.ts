import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { safeInternalPath, signupDestination } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const flow = url.searchParams.get("flow");
  const recovery = flow === "recovery";
  const loginError = (auth: string) => NextResponse.redirect(new URL(`/login?${recovery ? "flow=recovery&" : ""}auth=${auth}`, url));
  const supabase = await getSupabaseServerClient();
  if (!supabase) return loginError("unavailable");
  if (url.searchParams.has("error") || !code) return loginError("invalid-link");

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return loginError("exchange-failed");
  } catch {
    return loginError("exchange-failed");
  }

  const requestedNext = url.searchParams.get("next");
  const next = recovery
    ? "/reset-password"
    : flow === "signup"
      ? signupDestination(requestedNext)
      : safeInternalPath(requestedNext);
  return NextResponse.redirect(new URL(next, request.url));
}
