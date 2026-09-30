/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedState } from "@/lib/seed";
import { DEMO_STATE_KEY } from "@/lib/supabase/cache";

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: false,
  supabaseUrl: "",
  supabaseAnonKey: "",
}));

vi.mock("@/lib/supabase/realtime", () => ({
  subscribeToShoppingList: () => () => {},
}));

function prepareHistoryState() {
  const recentPurchase = {
    id: "history-recent",
    name: "Compra recente",
    budget: 500,
    status: "completed" as const,
    startedAt: "2026-09-28T10:00:00.000Z",
    finishedAt: "2026-09-28T11:00:00.000Z",
    items: [
      { id: "recent-onion", productId: "product-3", name: "Cebola", category: "Alimentos" as const, quantity: 2, unitPrice: 4.5, status: "purchased" as const, sortOrder: 0 },
      { id: "recent-unpriced", productId: "product-10", name: "Feijão sem preço", category: "Alimentos" as const, quantity: 1, status: "purchased" as const, sortOrder: 1 },
      { id: "recent-have", name: "Alho que já temos", category: "Alimentos" as const, quantity: 1, status: "already_have" as const, sortOrder: 2 },
      { id: "recent-pending", name: "Arroz pendente", category: "Alimentos" as const, quantity: 2, status: "pending" as const, sortOrder: 3 },
    ],
  };
  const previousPurchase = {
    id: "history-previous",
    name: "Compra anterior",
    budget: 500,
    status: "completed" as const,
    startedAt: "2026-08-04T10:00:00.000Z",
    finishedAt: "2026-08-04T11:25:00.000Z",
    items: [
      { id: "previous-onion", productId: "product-3", name: "Cebola", category: "Alimentos" as const, quantity: 1, unitPrice: 3.96, status: "purchased" as const, sortOrder: 0 },
    ],
  };
  localStorage.setItem(DEMO_STATE_KEY, JSON.stringify({
    ...seedState,
    lists: [seedState.lists[0], recentPurchase, previousPurchase],
  }));
}

describe("purchase history", () => {
  beforeEach(() => {
    localStorage.clear();
    prepareHistoryState();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.resetModules();
  });

  it("shows true item statuses, registered totals, missing prices, and prior unit-price comparison", async () => {
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Demonstração" });

    fireEvent.click(screen.getAllByRole("button", { name: "Histórico" })[0]);
    const recent = screen.getByRole("button", { name: /Compra recente/ });
    expect(within(recent).getByText("2 comprados")).toBeTruthy();
    expect(within(recent).getByText("1 já tínhamos")).toBeTruthy();
    expect(within(recent).getByText("1 pendentes")).toBeTruthy();
    expect(within(recent).getByText("1 comprado sem preço")).toBeTruthy();
    expect(within(recent).getByText("Total registrado")).toBeTruthy();

    fireEvent.click(recent);
    expect(screen.getByRole("heading", { name: "Compra recente" })).toBeTruthy();
    expect(screen.getAllByText("R$ 9,00").length).toBe(2);
    expect(screen.getByText("1 item comprado sem preço")).toBeTruthy();
    expect(screen.getAllByText("Comprado").length).toBe(2);
    expect(screen.getByText("Já temos")).toBeTruthy();
    expect(screen.getByText("Pendente")).toBeTruthy();
    expect(screen.getByText("R$ 0,54 a mais por unidade que a compra anterior (R$ 3,96/un.)")).toBeTruthy();
  });
});
