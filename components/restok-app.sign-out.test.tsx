/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEGACY_REMOTE_STATE_KEY, remoteStateStorageKey } from "@/lib/supabase/cache";

const replace = vi.hoisted(() => vi.fn());
const signOut = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: true,
  supabaseUrl: "https://example.supabase.co",
  supabaseAnonKey: "test-anon-key",
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      signOut,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  }),
}));

vi.mock("@/lib/supabase/realtime", () => ({
  subscribeToShoppingList: () => () => {},
}));

vi.mock("@/lib/supabase/data", () => ({
  acceptHouseholdInvite: vi.fn(async () => null),
  activeHouseholdStorageKey: (userId: string) => `restok-active-household:${encodeURIComponent(userId)}`,
  createShoppingListWithItems: vi.fn(),
  loadCurrentProfile: vi.fn(async () => null),
  loadRemoteState: vi.fn(async () => ({
    userId: "user-1",
    householdId: "house-1",
    state: { products: [], lists: [] },
  })),
  loadUserHouseholds: vi.fn(async () => [
    { id: "house-1", name: "Casa", role: "owner", createdAt: "2026-01-01T00:00:00.000Z" },
  ]),
  persistList: vi.fn(),
  persistProduct: vi.fn(),
  resolveRemoteContext: vi.fn(async () => ({
    userId: "user-1",
    email: "ana@example.com",
    profileName: "Ana",
    householdId: "house-1",
    householdName: "Casa",
    role: "owner",
    client: {},
  })),
}));

async function openAccountMenu() {
  const { default: RestokApp } = await import("@/components/restok-app");
  render(<RestokApp />);
  fireEvent.click(await screen.findByRole("button", { name: "Perfil de Ana" }));
  return screen.getByRole("button", { name: "Sair da conta" });
}

describe("account sign out", () => {
  beforeEach(() => {
    signOut.mockReset();
    replace.mockReset();
    localStorage.clear();
    vi.spyOn(window.location, "replace").mockImplementation(replace);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("ends the session, clears that user's cache, and returns to login", async () => {
    signOut.mockResolvedValue({ error: null });
    const cacheKey = remoteStateStorageKey("user-1", "house-1");
    localStorage.setItem(cacheKey, "cache");
    localStorage.setItem(LEGACY_REMOTE_STATE_KEY, "legacy");

    fireEvent.click(await openAccountMenu());

    await vi.waitFor(() => expect(signOut).toHaveBeenCalledOnce());
    expect(localStorage.getItem(cacheKey)).toBeNull();
    expect(localStorage.getItem(LEGACY_REMOTE_STATE_KEY)).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("stays on the account when sign out fails or the network drops", async () => {
    signOut.mockResolvedValueOnce({ error: { message: "nope" } });
    fireEvent.click(await openAccountMenu());
    expect(await screen.findByText("Não foi possível encerrar a sessão. Tente novamente.")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();

    cleanup();
    signOut.mockRejectedValueOnce(new Error("offline"));
    fireEvent.click(await openAccountMenu());
    expect(await screen.findByText("Não foi possível encerrar a sessão. Tente novamente.")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });
});
