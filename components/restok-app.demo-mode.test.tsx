/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_STATE_KEY, LEGACY_REMOTE_STATE_KEY, remoteStateStorageKey } from "@/lib/supabase/cache";

const remote = vi.hoisted(() => ({
  getClient: vi.fn(),
  subscribe: vi.fn(() => () => {}),
  acceptInvite: vi.fn(),
  createList: vi.fn(),
  loadProfile: vi.fn(),
  loadRemote: vi.fn(),
  loadHouseholds: vi.fn(),
  persistList: vi.fn(),
  persistProduct: vi.fn(),
  resolveContext: vi.fn(),
  loadMembers: vi.fn(),
  loadInvites: vi.fn(),
  changeRole: vi.fn(),
  createHousehold: vi.fn(),
  createInvite: vi.fn(),
  leaveHousehold: vi.fn(),
  removeMember: vi.fn(),
  revokeInvite: vi.fn(),
  transferOwnership: vi.fn(),
}));

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: true,
  supabaseUrl: "https://example.supabase.co",
  supabaseAnonKey: "test-anon-key",
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: remote.getClient,
}));

vi.mock("@/lib/supabase/realtime", () => ({
  subscribeToShoppingList: remote.subscribe,
}));

vi.mock("@/lib/supabase/data", () => ({
  acceptHouseholdInvite: remote.acceptInvite,
  activeHouseholdStorageKey: (userId: string) => `restok-active-household:${encodeURIComponent(userId)}`,
  changeHouseholdMemberRole: remote.changeRole,
  createHousehold: remote.createHousehold,
  createHouseholdInvite: remote.createInvite,
  createShoppingListWithItems: remote.createList,
  leaveHousehold: remote.leaveHousehold,
  loadCurrentProfile: remote.loadProfile,
  loadHouseholdInvites: remote.loadInvites,
  loadHouseholdMembers: remote.loadMembers,
  loadRemoteState: remote.loadRemote,
  loadUserHouseholds: remote.loadHouseholds,
  persistList: remote.persistList,
  persistProduct: remote.persistProduct,
  removeHouseholdMember: remote.removeMember,
  resolveRemoteContext: remote.resolveContext,
  revokeHouseholdInvite: remote.revokeInvite,
  transferHouseholdOwnership: remote.transferOwnership,
}));

async function renderConfiguredDemo() {
  window.history.replaceState(null, "", "/app?demo=1");
  const { default: RestokApp } = await import("@/components/restok-app");
  render(<RestokApp />);
  await screen.findByRole("button", { name: "Perfil de Demonstração" });
}

describe("configured demo mode", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    window.history.replaceState(null, "", "/app?demo=1");
    Object.values(remote).forEach((spy) => spy.mockClear());
    remote.subscribe.mockReturnValue(() => {});
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("opens as a local demo without loading account or household data", async () => {
    await renderConfiguredDemo();

    expect(screen.getByRole("button", { name: "Perfil de Demonstração" })).toBeTruthy();
    expect(remote.getClient).not.toHaveBeenCalled();
    expect(remote.resolveContext).not.toHaveBeenCalled();
    expect(remote.loadRemote).not.toHaveBeenCalled();
    expect(remote.loadProfile).not.toHaveBeenCalled();
    expect(remote.loadHouseholds).not.toHaveBeenCalled();
    expect(remote.acceptInvite).not.toHaveBeenCalled();
    expect(remote.subscribe).not.toHaveBeenCalled();
  });

  it("saves demo edits locally without sending them to Supabase", async () => {
    await renderConfiguredDemo();
    fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]);
    fireEvent.click(await screen.findByRole("button", { name: "Desativar Café" }));

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem(DEMO_STATE_KEY) ?? "{}") as { products?: Array<{ name: string; active: boolean }> };
      expect(saved.products?.find((product) => product.name === "Café")?.active).toBe(false);
    });
    expect(await screen.findByText("Salvo neste aparelho")).toBeTruthy();
    expect(remote.persistProduct).not.toHaveBeenCalled();
    expect(remote.persistList).not.toHaveBeenCalled();
  });

  it("keeps collaboration unavailable in demo and preserves account caches when clearing demo data", async () => {
    const accountCacheKey = remoteStateStorageKey("user-1", "house-1");
    localStorage.setItem(LEGACY_REMOTE_STATE_KEY, "legacy-account-data");
    localStorage.setItem(accountCacheKey, "scoped-account-data");
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify({ products: [{ id: "custom-demo", name: "custom-demo" }], lists: [] }));
    await renderConfiguredDemo();

    fireEvent.click(screen.getByRole("button", { name: "Perfil de Demonstração" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Casas e pessoas" }));
    expect(await screen.findByRole("dialog", { name: "Casas e pessoas" })).toBeTruthy();
    expect(screen.getByText("Pessoas e convites ficam indisponíveis nesta demonstração.")).toBeTruthy();
    expect(remote.loadMembers).not.toHaveBeenCalled();
    expect(remote.loadInvites).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.click(screen.getByRole("button", { name: "Perfil de Demonstração" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Limpar dados locais" }));

    expect(await screen.findByText("Dados locais da demonstração apagados")).toBeTruthy();
    expect(localStorage.getItem(DEMO_STATE_KEY) ?? "").not.toContain("custom-demo");
    expect(localStorage.getItem(LEGACY_REMOTE_STATE_KEY)).toBe("legacy-account-data");
    expect(localStorage.getItem(accountCacheKey)).toBe("scoped-account-data");
    expect(remote.getClient).not.toHaveBeenCalled();
  });
});
