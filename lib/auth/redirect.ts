const SAFE_ORIGIN = "https://restok.invalid";
const SAFE_PATHS = new Set(["/", "/app", "/login", "/reset-password"]);

function hasControlCharacters(value: string) {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 31 || code === 127) return true;
  }
  return false;
}

function safeAppQuery(params: URLSearchParams) {
  const result = new URLSearchParams();
  const invite = params.get("invite");
  const flow = params.get("flow");
  if (invite && /^[a-f0-9]{36}$/i.test(invite)) result.set("invite", invite);
  if (flow === "onboarding") result.set("flow", flow);
  return result;
}

function safeLoginQuery(params: URLSearchParams) {
  const result = new URLSearchParams();
  if (params.get("flow") === "recovery") result.set("flow", "recovery");
  const auth = params.get("auth");
  if (auth && ["unavailable", "invalid-link", "exchange-failed", "confirmation-failed"].includes(auth)) {
    result.set("auth", auth);
  }
  return result;
}

/** Restrict auth redirects to known local routes and reconstruct allowed query values. */
export function safeInternalPath(value: string | null | undefined, fallback = "/app") {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /%(?:2f|5c)/i.test(value) ||
    hasControlCharacters(value)
  ) return fallback;

  try {
    const url = new URL(value, SAFE_ORIGIN);
    if (url.origin !== SAFE_ORIGIN || !SAFE_PATHS.has(url.pathname)) return fallback;

    if (url.pathname === "/app") {
      const query = safeAppQuery(url.searchParams).toString();
      return query ? `/app?${query}` : "/app";
    }
    if (url.pathname === "/login") {
      const query = safeLoginQuery(url.searchParams).toString();
      return query ? `/login?${query}` : "/login";
    }
    return url.pathname;
  } catch {
    return fallback;
  }
}

export function signupDestination(value: string | null | undefined) {
  const next = safeInternalPath(value, "/app?flow=onboarding");
  return next === "/" || next === "/login" || next === "/reset-password" ? "/app?flow=onboarding" : next;
}
