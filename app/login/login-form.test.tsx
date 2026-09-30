/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act, createElement, type ReactNode } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import { LoginForm } from "@/app/login/login-form";
import LoginPage from "@/app/login/page";

const rememberedEmailKey = "restok-login-email";
const credentialError = "Email ou senha inválidos. Confira os dados e tente novamente.";
const networkError = "Não foi possível concluir a autenticação. Verifique sua conexão e tente novamente.";

const push = vi.hoisted(() => vi.fn());
const auth = vi.hoisted(() => ({
  configured: true,
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resetPasswordForEmail: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("next/link", async () => {
  const { createElement: create } = await import("react");
  return {
    default: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) =>
      create("a", { href, className }, children),
  };
});

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => (auth.configured ? { auth } : null),
}));

const signedIn = { data: { session: { user: { id: "user-1" } } }, error: null };
const rejected = { data: { session: null }, error: { message: "invalid" } };

function openLogin(search = "") {
  window.history.replaceState(null, "", `/login${search}`);
}

function emailInput() {
  const input = document.getElementById("email");
  if (!(input instanceof HTMLInputElement)) throw new Error("missing email");
  return input;
}

function passwordInput() {
  const input = document.getElementById("password");
  if (!(input instanceof HTMLInputElement)) throw new Error("missing password");
  return input;
}

function fillCredentials(email = "casa@example.com", password = "segredo") {
  fireEvent.change(emailInput(), { target: { value: email } });
  fireEvent.change(passwordInput(), { target: { value: password } });
}

describe("login form", () => {
  beforeEach(() => {
    auth.configured = true;
    auth.signInWithPassword.mockReset();
    auth.signUp.mockReset();
    auth.resetPasswordForEmail.mockReset();
    push.mockReset();
    localStorage.clear();
    openLogin();
  });

  afterEach(() => {
    cleanup();
  });

  it("requires an email and a password of at least 6 characters", () => {
    render(<LoginForm />);
    const email = emailInput();
    const password = passwordInput();
    expect(email.required).toBe(true);
    expect(email.type).toBe("email");
    expect(password.required).toBe(true);
    expect(password.minLength).toBe(6);

    fireEvent.change(password, { target: { value: "12345" } });
    expect(password.validity.tooShort).toBe(true);
    fireEvent.change(password, { target: { value: "123456" } });
    expect(password.validity.tooShort).toBe(false);

    fireEvent.change(email, { target: { value: "" } });
    fireEvent.change(password, { target: { value: "" } });
    const form = screen.getByRole("form", { name: "Entre na sua conta" });
    if (!(form instanceof HTMLFormElement)) throw new Error("missing form");
    form.requestSubmit();
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("signs in, remembers the email, and follows a safe next path", async () => {
    openLogin(`?next=${encodeURIComponent(`/app?invite=${"ab".repeat(18)}`)}`);
    auth.signInWithPassword.mockResolvedValue(signedIn);
    render(<LoginForm />);
    fillCredentials("  casa@example.com  ");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith(`/app?invite=${"ab".repeat(18)}`));
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: "casa@example.com", password: "segredo" });
    expect(localStorage.getItem(rememberedEmailKey)).toBe("casa@example.com");
  });

  it("ignores an external next path", async () => {
    openLogin("?next=https://evil.test");
    auth.signInWithPassword.mockResolvedValue(signedIn);
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/app"));
  });

  it("shows the credential error and lets the person try again", async () => {
    auth.signInWithPassword.mockResolvedValue(rejected);
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(credentialError));
    expect(push).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Entrar" }) as HTMLButtonElement).disabled).toBe(false);
    expect(emailInput().getAttribute("aria-invalid")).toBe("true");
    expect(passwordInput().getAttribute("aria-invalid")).toBe("true");
  });

  it("keeps the submit locked while the request is in flight", async () => {
    let finish: (value: typeof signedIn) => void = () => {};
    auth.signInWithPassword.mockImplementation(() => new Promise<typeof signedIn>((resolve) => { finish = resolve; }));
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const pending = await screen.findByRole("button", { name: "Entrando..." });
    expect((pending as HTMLButtonElement).disabled).toBe(true);
    expect(pending.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("Entrando...");
    fireEvent.click(pending);
    expect(auth.signInWithPassword).toHaveBeenCalledTimes(1);

    finish(signedIn);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/app"));
  });

  it("reports a network failure and unlocks the form", async () => {
    auth.signInWithPassword.mockRejectedValue(new Error("failed to fetch"));
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(networkError));
    expect(push).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Entrar" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("creates an account that still needs email confirmation", async () => {
    auth.signUp.mockResolvedValue({ data: { session: null }, error: null });
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect((screen.getByLabelText("Seu nome") as HTMLInputElement).required).toBe(true);
    expect(screen.queryByRole("button", { name: "Esqueceu a senha?" })).toBeNull();

    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: " Ana " } });
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByRole("heading", { name: "Quase lá." })).toBe(document.activeElement);
    expect(screen.getByText("Conta criada. Confirme seu email para continuar.")).toBeTruthy();
    expect(auth.signUp).toHaveBeenCalledWith({
      email: "casa@example.com",
      password: "segredo",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?flow=signup&next=${encodeURIComponent("/app")}`,
        data: { full_name: "Ana" },
      },
    });
    expect(localStorage.getItem(rememberedEmailKey)).toBe("casa@example.com");
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Voltar para o login" }));
    expect(screen.getByRole("heading", { name: "Entre na sua conta" })).toBeTruthy();
  });

  it("sends a confirmed signup into onboarding when the next path is not the app", async () => {
    openLogin("?next=/login");
    auth.signUp.mockResolvedValue(signedIn);
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Ana" } });
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/app?flow=onboarding"));
  });

  it("shows a signup failure without leaving the form", async () => {
    auth.signUp.mockResolvedValue(rejected);
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Ana" } });
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(
      "Não foi possível criar a conta. Confira os dados ou tente entrar se já possui uma conta.",
    ));
    expect(screen.getByRole("heading", { name: "Crie a conta da casa" })).toBeTruthy();
  });

  it("asks for an email before sending a reset link", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "Esqueceu a senha?" }));
    expect(screen.getByRole("alert").textContent).toBe("Informe o email para receber o link de redefinição.");
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled();
    expect(emailInput().getAttribute("aria-invalid")).toBe("true");
  });

  it("sends one reset link and ignores a second click while it is sending", async () => {
    let finish: (value: { error: null }) => void = () => {};
    auth.resetPasswordForEmail.mockImplementation(() => new Promise<{ error: null }>((resolve) => { finish = resolve; }));
    render(<LoginForm />);
    fireEvent.change(emailInput(), { target: { value: " casa@example.com " } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueceu a senha?" }));

    const pending = await screen.findByRole("button", { name: "Enviando…" });
    expect((pending as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(pending);
    expect(auth.resetPasswordForEmail).toHaveBeenCalledTimes(1);
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith("casa@example.com", {
      redirectTo: `${window.location.origin}/auth/callback?flow=recovery`,
    });

    finish({ error: null });
    expect(await screen.findByText(
      "Se esse email estiver cadastrado, enviaremos um link para redefinir a senha.",
    )).toBeTruthy();
  });

  it("reports a reset failure and a network failure", async () => {
    auth.resetPasswordForEmail.mockResolvedValue({ error: { message: "rate limit" } });
    render(<LoginForm />);
    fireEvent.change(emailInput(), { target: { value: "casa@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueceu a senha?" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(
      "Não foi possível enviar o link agora. Confira o email e tente novamente.",
    ));

    cleanup();
    auth.resetPasswordForEmail.mockRejectedValue(new Error("offline"));
    render(<LoginForm />);
    fireEvent.change(emailInput(), { target: { value: "casa@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueceu a senha?" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(
      "Não foi possível enviar o link. Verifique sua conexão e tente novamente.",
    ));
  });

  it("restores the remembered email and forgets it when the box is unchecked", async () => {
    localStorage.setItem(rememberedEmailKey, "casa@example.com");
    auth.signInWithPassword.mockResolvedValue(signedIn);
    render(<LoginForm />);
    expect(emailInput().value).toBe("casa@example.com");

    fireEvent.click(screen.getByRole("checkbox", { name: "Lembrar email" }));
    fillCredentials("outra@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/app"));
    expect(localStorage.getItem(rememberedEmailKey)).toBeNull();
  });

  it("still signs in when browser storage is blocked", async () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    auth.signInWithPassword.mockResolvedValue(signedIn);
    render(<LoginForm />);
    expect(emailInput().value).toBe("");
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/app"));
    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("offers the demo account and the mobile story on the form", () => {
    render(<LoginForm />);
    expect(screen.getByRole("link", { name: "Experimentar com dados de exemplo" }).getAttribute("href")).toBe("/app");
    expect(screen.getByText("Planeje, compre e acompanhe.")).toBeTruthy();
    expect(screen.getByText("Planeje")).toBeTruthy();
    expect(screen.getByText("Compre")).toBeTruthy();
    expect(screen.getByText("Acompanhe")).toBeTruthy();
  });

  it.each([
    ["unavailable", "A autenticação está indisponível no momento. Tente novamente mais tarde."],
    ["invalid-link", "Este link expirou ou já foi usado. Solicite um novo link e tente novamente."],
    ["exchange-failed", "Este link expirou ou já foi usado. Solicite um novo link e tente novamente."],
    ["confirmation-failed", "Não foi possível confirmar seu email. Solicite um novo link de confirmação."],
  ])("explains an auth=%s return", (code, message) => {
    openLogin(`?auth=${code}`);
    render(<LoginForm />);
    expect(screen.getByRole("alert").textContent).toBe(message);
  });

  it("explains when Supabase is not configured", async () => {
    auth.configured = false;
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(
      "Configure o Supabase para entrar com email e senha.",
    ));

    fireEvent.change(emailInput(), { target: { value: "casa@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Esqueceu a senha?" }));
    expect(screen.getByRole("alert").textContent).toBe("Configure o Supabase para redefinir a senha.");
  });

  it("clears an auth error when switching between login and signup", async () => {
    auth.signInWithPassword.mockResolvedValue(rejected);
    render(<LoginForm />);
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("heading", { name: "Crie a conta da casa" })).toBeTruthy();
  });

  it("hydrates without the remembered email and restores it on the client", async () => {
    localStorage.setItem(rememberedEmailKey, "casa@example.com");
    const html = renderToString(createElement(LoginForm));
    expect(html).toContain("Entre na sua conta");
    expect(html).not.toContain("casa@example.com");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    let root: Root | undefined;
    act(() => {
      root = hydrateRoot(container, <LoginForm />);
    });
    expect(emailInput().value).toBe("casa@example.com");
    act(() => {
      root?.unmount();
    });
    container.remove();
  });

  it("server-renders the login page without throwing", () => {
    const html = renderToString(createElement(LoginPage));
    expect(html).toContain("login-page");
    expect(html).toContain("Entre na sua conta");
    expect(html).toContain("Experimentar com dados de exemplo");
  });
});
