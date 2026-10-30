import { setAccountFixture } from "@/tests/support/account";
/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedState } from "@/tests/fixtures/shopping";



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
  setAccountFixture({
    ...seedState,
    lists: [seedState.lists[0], recentPurchase, previousPurchase],
  });
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
    await screen.findByRole("button", { name: "Perfil de Ana" });

    fireEvent.click(screen.getAllByRole("button", { name: "Histórico" })[0]);
    const recent = screen.getByRole("button", { name: /Compra recente/ });
    expect(within(recent).getByText("2 comprados")).toBeTruthy();
    expect(within(recent).getByText("1 já tínhamos")).toBeTruthy();
    expect(within(recent).getByText("1 pendente")).toBeTruthy();
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

  it("restores the detail hash, focuses its heading and returns to the selected purchase through browser navigation", async () => {
    window.history.replaceState(null, "", "/app#history/history-recent");
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp/>);
    const heading = await screen.findByRole("heading", {name:"Compra recente"});
    expect(document.activeElement).toBe(heading);
    fireEvent.click(screen.getByRole("button", {name:"Voltar ao histórico"}));
    expect(window.location.hash).toBe("#history");
    expect(document.activeElement).toBe(screen.getByRole("button", {name:/Compra recente/}));
    window.history.replaceState(null, "", "/app#history/history-previous");
    fireEvent.popState(window);
    await screen.findByRole("heading", {name:"Compra anterior"});
    window.history.replaceState(null, "", "/app#history");
    fireEvent(window, new Event("hashchange"));
    await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole("button", {name:/Compra anterior/})));
  });

  it("does not expose an active purchase as historical detail through a forged hash", async () => {
    window.history.replaceState(null, "", `/app#history/${seedState.lists[0].id}`);
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp/>);
    await screen.findByRole("button", {name:/Compra recente/});
    expect(screen.queryByRole("heading", {name:seedState.lists[0].name})).toBeNull();
    expect(screen.getByRole("heading", {name:"Compras anteriores"})).toBeTruthy();
  });

  it("keeps completed snapshots after editing and deactivating the recurring product", async () => {
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp/>);
    await screen.findByRole("button", {name:"Perfil de Ana"});
    fireEvent.click(screen.getAllByRole("button", {name:"Casa"})[0]);
    fireEvent.click(screen.getByRole("button", {name:"Editar Cebola"}));
    const dialog = await screen.findByRole("dialog", {name:"Editar produto"});
    fireEvent.change(within(dialog).getByLabelText("Nome"), {target:{value:"Catálogo atualizado"}});
    fireEvent.change(within(dialog).getByLabelText("Categoria"), {target:{value:"Bebidas"}});
    fireEvent.change(within(dialog).getByLabelText("Quantidade"), {target:{value:"999"}});
    fireEvent.click(within(dialog).getByRole("button", {name:"Salvar produto"}));
    await waitFor(()=>expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", {name:"Desativar Catálogo atualizado"}));
    fireEvent.click(screen.getAllByRole("button", {name:"Histórico"})[0]);
    fireEvent.click(screen.getByRole("button", {name:/Compra recente/}));
    expect(screen.getByRole("heading", {name:"Cebola"})).toBeTruthy();
    expect(within(screen.getByRole("heading", {name:"Cebola"}).closest("li")!).getByText("Quantidade: 2")).toBeTruthy();
    expect(screen.getByText("R$ 4,50 / un.")).toBeTruthy();
    expect(screen.queryByText("Catálogo atualizado")).toBeNull();
  });
});
