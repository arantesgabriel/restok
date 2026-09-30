/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEMO_STATE_KEY, LEGACY_REMOTE_STATE_KEY } from "@/lib/supabase/cache";

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: false,
  supabaseUrl: "",
  supabaseAnonKey: "",
}));

vi.mock("@/lib/supabase/realtime", () => ({
  subscribeToShoppingList: () => () => {},
}));

describe("demo sign out", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("clears local demo data without calling the auth server", async () => {
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp />);
    const profile = await screen.findByRole("button", { name: "Perfil de Demonstração" });
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify({ products: [{ id: "custom" }], lists: [] }));
    localStorage.setItem(LEGACY_REMOTE_STATE_KEY, "legacy");

    fireEvent.click(profile);
    fireEvent.click(screen.getByRole("button", { name: "Limpar dados locais" }));

    expect(await screen.findByText("Dados locais da demonstração apagados")).toBeTruthy();
    expect(localStorage.getItem(LEGACY_REMOTE_STATE_KEY)).toBeNull();
    expect(localStorage.getItem(DEMO_STATE_KEY) ?? "").not.toContain("custom");
  });
});
