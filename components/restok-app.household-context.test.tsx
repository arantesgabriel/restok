/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RemoteContext } from "@/lib/supabase/data";
import type { RestokState } from "@/lib/types";
import { remoteStateStorageKey } from "@/lib/supabase/cache";

const remote = vi.hoisted(() => ({ resolve: vi.fn(), snapshot: vi.fn(), invite: vi.fn(), households: vi.fn(), profile: vi.fn(), authChange: undefined as undefined | ((event: string, session: { user: { id: string } }) => void) }));
vi.mock("@/lib/supabase/config", () => ({ isSupabaseConfigured: true }));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: () => ({ auth: { onAuthStateChange: (callback: typeof remote.authChange) => { remote.authChange = callback; return { data: { subscription: { unsubscribe() {} } } }; } } }) }));
vi.mock("@/lib/supabase/realtime", () => ({ subscribeToShoppingList: () => () => {} }));
vi.mock("@/lib/supabase/data", () => ({
  activeHouseholdStorageKey: (user: string) => `restok-active-household:${user}`,
  resolveRemoteContext: remote.resolve, loadRemoteState: remote.snapshot, acceptHouseholdInvite: remote.invite,
  loadUserHouseholds: remote.households, loadCurrentProfile: remote.profile,
  persistList: vi.fn(), persistProduct: vi.fn(), persistProfileName: vi.fn(), createShoppingListWithItems: vi.fn(),
  loadHouseholdMembers: async () => [], loadHouseholdInvites: async () => [],
}));
import RestokApp from "@/components/restok-app";

const houses = ["a", "b"].map((id) => ({ id, name: `Casa ${id.toUpperCase()}`, role: "owner" as const, createdAt: "2026-01-01" }));
let user = "person-one";
function context(id: string): RemoteContext { return { userId: user, householdId: id, householdName: `Casa ${id.toUpperCase()}`, role: "owner", profileName: "Teste", email: null, client: {} } as RemoteContext; }
function state(id: string): RestokState { return { products: [{ id: `product-${id}`, name: `Somente casa ${id}`, category: "Alimentos", defaultQuantity: 1, active: true }], lists: [] }; }
const preference = () => `restok-active-household:${user}`;
async function open() { render(<RestokApp />); await screen.findByRole("button", { name: "Perfil de Teste" }); }
async function home() { fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]); }

beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear(); user = "person-one";
  window.history.replaceState(null, "", "/app");
  remote.invite.mockResolvedValue(null);
  remote.households.mockResolvedValue(houses);
  remote.profile.mockResolvedValue({ userId: user, displayName: "Teste", email: null });
  remote.resolve.mockImplementation(async (preferred?: string | null) => context(houses.find((house) => house.id === (preferred === undefined ? localStorage.getItem(preference()) : preferred))?.id ?? "a"));
  remote.snapshot.mockImplementation(async (current: RemoteContext) => ({ ...current, state: state(current.householdId) }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe("household boot and activation", () => {
  it("restores the second authorized household after a fresh mount without an invite", async () => {
    localStorage.setItem(preference(), "b");
    await open(); await home();
    expect(screen.getByRole("button", { name: "Editar Somente casa b" })).toBeTruthy();
    expect(remote.resolve).toHaveBeenCalledWith(undefined);
    expect(localStorage.getItem(preference())).toBe("b");
    cleanup(); await open(); await home();
    expect(screen.getByRole("button", { name: "Editar Somente casa b" })).toBeTruthy();
  });

  it.each(["malformed", "a".repeat(36)])("keeps preference for invalid/failed invitation %s and removes it from URL", async (invite) => {
    localStorage.setItem(preference(), "b");
    window.history.replaceState(null, "", `/app?invite=${invite}&flow=onboarding#home`);
    await open();
    expect(screen.getByRole("button", { name: "Editar Somente casa b" })).toBeTruthy();
    expect(screen.getAllByRole("status").some(node=>/Este convite é inválido/.test(node.textContent ?? ""))).toBe(true);
    expect(window.location.search).toBe("");
    expect(remote.invite).toHaveBeenCalledTimes(invite === "malformed" ? 0 : 1);
  });

  it("prioritizes a successfully accepted invitation over saved selection", async () => {
    localStorage.setItem(preference(), "a");
    remote.invite.mockResolvedValue("b");
    window.history.replaceState(null, "", `/app?invite=${"b".repeat(36)}#home`);
    await open();
    expect(remote.resolve).toHaveBeenCalledWith("b");
    expect(screen.getByRole("button", { name: "Editar Somente casa b" })).toBeTruthy();
    expect(localStorage.getItem(preference())).toBe("b");
  });

  it("explains a revoked preference and removes only that user's invalid household cache", async () => {
    localStorage.setItem(preference(), "revoked");
    localStorage.setItem(remoteStateStorageKey(user, "revoked"), "old");
    localStorage.setItem(remoteStateStorageKey("someone-else", "revoked"), "other");
    await open();
    expect(screen.getAllByRole("status").some(node=>/A casa selecionada não está mais disponível/.test(node.textContent ?? ""))).toBe(true);
    expect(localStorage.getItem(remoteStateStorageKey(user, "revoked"))).toBeNull();
    expect(localStorage.getItem(remoteStateStorageKey("someone-else", "revoked"))).toBe("other");
  });

  it("loads remotely with unavailable browser storage", async () => {
    remote.resolve.mockResolvedValue(context("a"));
    const getter = vi.spyOn(window, "localStorage", "get").mockImplementation(() => { throw new Error("blocked"); });
    await open(); await home();
    expect(screen.getByRole("button", { name: "Editar Somente casa a" })).toBeTruthy();
    expect(getter).toHaveBeenCalled();
  });

  it("does not reuse the previous account's preference or cached household", async () => {
    localStorage.setItem(preference(), "b");
    localStorage.setItem(remoteStateStorageKey(user, "a"), JSON.stringify(state("private")));
    user = "person-two";
    await open(); await home();
    expect(screen.getByRole("button", { name: "Editar Somente casa a" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Editar Somente casa private" })).toBeNull();
    expect(localStorage.getItem("restok-active-household:person-one")).toBe("b");
  });

  it.each([false, true])("keeps the selected tenant on snapshot failure (authorized cache %s)", async (cached) => {
    localStorage.setItem(preference(), "b");
    if (cached) localStorage.setItem(remoteStateStorageKey(user, "b"), JSON.stringify(state("b")));
    remote.snapshot.mockResolvedValue(null);
    await open(); await home();
    expect(localStorage.getItem(preference())).toBe("b");
    expect(screen.queryByRole("button", { name: "Editar Somente casa a" })).toBeNull();
    if (cached) expect(screen.getByRole("button", { name: "Editar Somente casa b" })).toBeTruthy();
    else expect(screen.queryByRole("button", { name: "Editar Somente casa b" })).toBeNull();
    expect(screen.getByText(cached ? /Exibindo o cache salvo desta casa/ : /Não foi possível carregar os dados da casa/)).toBeTruthy();
  });

  it("does not activate a new household when its snapshot fails", async () => {
    await open(); await home();
    remote.snapshot.mockResolvedValue(null);
    fireEvent.click(screen.getByRole("button", { name: "Casas e pessoas" }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    await waitFor(()=>expect(screen.getAllByRole("status").some(node=>/A casa atual continua selecionada/.test(node.textContent ?? ""))).toBe(true));
    expect(localStorage.getItem(preference())).toBe("a");
    expect(screen.getByRole("button", { name: "Editar Somente casa a" })).toBeTruthy();
  });

  it("rejects a snapshot belonging to a different account or household", async () => {
    localStorage.setItem(preference(), "b");
    remote.snapshot.mockResolvedValue({ userId: "someone-else", householdId: "a", state: state("private") });
    await open(); await home();
    expect(screen.queryByRole("button", { name: "Editar Somente casa private" })).toBeNull();
    expect(localStorage.getItem(preference())).toBe("b");
  });

  it("shows onboarding with no memberships and no fabricated products", async () => {
    remote.resolve.mockResolvedValue(null);
    remote.households.mockResolvedValue([]);
    render(<RestokApp />);
    expect(await screen.findByRole("heading", { name: "Escolha como começar" })).toBeTruthy();
    expect(remote.snapshot).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Editar Somente casa a" })).toBeNull();
  });

  it("immediately hides old data when auth changes to another account", async () => {
    const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    await open(); await home();
    remote.authChange?.("SIGNED_IN", { user: { id: "person-two" } });
    await waitFor(() => expect(reload).toHaveBeenCalledOnce());
    expect(screen.queryByRole("button", { name: "Editar Somente casa a" })).toBeNull();
    expect(localStorage.getItem(remoteStateStorageKey(user, "a"))).toBeNull();
  });
});
