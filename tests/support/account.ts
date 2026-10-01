import { vi } from "vitest";
import type { Product, RestokState, ShoppingList } from "@/lib/types";
import { seedState } from "@/tests/fixtures/shopping";

const account = vi.hoisted(() => ({ state: null as RestokState | null }));
const context = { userId: "test-user", householdId: "test-house", householdName: "Casa", profileName: "Ana", email: "ana@example.com", role: "owner", client: {} };

export function setAccountFixture(state: RestokState = seedState) {
  account.state = structuredClone(state);
  window.history.replaceState(null, "", "/app");
}

vi.mock("@/lib/supabase/config", () => ({ isSupabaseConfigured: true, supabaseUrl: "https://test.supabase.co", supabaseAnonKey: "test-key" }));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: () => ({ auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }), signOut: vi.fn(async () => ({ error: null })) } }) }));
vi.mock("@/lib/supabase/realtime", () => ({ subscribeToShoppingList: () => () => {} }));
vi.mock("@/lib/supabase/data", () => ({
  activeHouseholdStorageKey: (userId: string) => `restok-active-household:${userId}`,
  resolveRemoteContext: vi.fn(async () => context),
  loadRemoteState: vi.fn(async () => ({ ...context, state: account.state ?? seedState })),
  loadCurrentProfile: vi.fn(async () => ({ ...context, displayName: "Ana" })),
  loadUserHouseholds: vi.fn(async () => [{ id: "test-house", name: "Casa", role: "owner", createdAt: "2026-01-01" }]),
  acceptHouseholdInvite: vi.fn(async () => null),
  persistList: vi.fn(async (list: ShoppingList) => {
    const state = account.state ?? seedState;
    account.state = { ...state, lists: state.lists.map((row) => row.id === list.id ? list : row) };
    return { ok: true, synced: true };
  }),
  createShoppingListWithItems: vi.fn(async (list: ShoppingList) => {
    const state = account.state ?? seedState;
    account.state = { ...state, lists: [list, ...state.lists.map((row) => row.status === "active" ? { ...row, status: "completed" as const } : row)] };
    return { ok: true, synced: true };
  }),
  persistProduct: vi.fn(async (product: Product) => {
    const state = account.state ?? seedState;
    account.state = { ...state, products: state.products.some((row) => row.id === product.id) ? state.products.map((row) => row.id === product.id ? product : row) : [...state.products, product] };
    return { ok: true, synced: true };
  }),
}));
