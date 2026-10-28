import type { RemoteContext } from "../../lib/supabase/data";
import type { Product, ShoppingList } from "../../lib/types";
import { evidenceState } from "./fixtures";

const scenario = new URLSearchParams(window.location.search).get("scenario") ?? "long";
const state = evidenceState(scenario);
let releaseLoad: (() => void) | undefined;
const loadGate = scenario === "loading" ? new Promise<void>(resolve => { releaseLoad = resolve; }) : Promise.resolve();
export const releaseEvidenceLoad = () => releaseLoad?.();
const context = { userId: "fixture-person", householdId: "fixture-house", householdName: "Casa ilustrativa", profileName: "Pessoa de teste", email: null, role: "owner", client: {} } as RemoteContext;
export const activeHouseholdStorageKey = (userId: string) => `restok-active-household:${userId}`;
export const resolveRemoteContext = async () => context;
export const loadCurrentProfile = async () => ({ userId: context.userId, email: null, displayName: context.profileName });
export const loadUserHouseholds = async () => [{ id: context.householdId, name: context.householdName, role: context.role, createdAt: "2026-01-01" }];
export const loadRemoteState = async () => { await loadGate; return scenario === "error" ? null : ({ ...context, state: structuredClone(state) }); };
export const persistProfileName = async () => true;
export const persistProduct = async (product: Product) => {
  state.products = [...state.products.filter((row) => row.id !== product.id), product];
  return { ok: true, synced: false } as const;
};
export const persistList = async (list: ShoppingList) => {
  state.lists = state.lists.map((row) => row.id === list.id ? list : row);
  return { ok: true, synced: false } as const;
};
export const createShoppingListWithItems = async (list: ShoppingList) => {
  state.lists = [list, ...state.lists.map((row) => ({ ...row, status: "completed" as const }))];
  return { ok: true, synced: false } as const;
};
export const loadHouseholdMembers = async () => [
  { userId: context.userId, displayName: "Pessoa de teste", role: "owner", isSelf: true, joinedAt: "2026-01-01" },
  ...["A", "B"].map((suffix) => ({ userId: `fixture-${suffix}`, displayName: `Participante com nome longo ${"Compartilhado ".repeat(4)}${suffix}`.padEnd(80, suffix).slice(0, 80), role: "member", isSelf: false, joinedAt: "2026-01-01" })),
];
export const loadHouseholdInvites = async () => [];
export const acceptHouseholdInvite = async () => null;
export const createHousehold = async () => null;
export const createHouseholdInvite = async () => null;
export const revokeHouseholdInvite = async () => false;
export const changeHouseholdMemberRole = async () => false;
export const removeHouseholdMember = async () => false;
export const leaveHousehold = async () => false;
export const transferHouseholdOwnership = async () => false;
