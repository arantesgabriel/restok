import { setAccountFixture } from "@/tests/support/account";
/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedState } from "@/tests/fixtures/shopping";



function prepareAccountState() {
  const activeList = seedState.lists[0];
  const accountState = {
    ...seedState,
    lists: [
      {
        ...activeList,
        items: [
          { id: "bought-unpriced", name: "Café comprado", category: "Alimentos" as const, quantity: 1, status: "purchased" as const, sortOrder: 0 },
          { id: "already-have", name: "Cebola já temos", category: "Alimentos" as const, quantity: 2, status: "already_have" as const, sortOrder: 1 },
          { id: "pending-item", name: "Leite pendente", category: "Alimentos" as const, quantity: 1, status: "pending" as const, sortOrder: 2 },
        ],
      },
      ...seedState.lists.slice(1),
    ],
  };
  setAccountFixture(accountState);
}

async function renderApp() {
  const { default: RestokApp } = await import("@/components/restok-app");
  render(<RestokApp />);
  await screen.findByRole("button", { name: "Perfil de Ana" });
}

describe("purchase flow", () => {
  beforeEach(() => {
    localStorage.clear();
    prepareAccountState();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.resetModules();
  });

  it("shows registered totals, missing prices, and takes the footer action to pending items", async () => {
    await renderApp();

    expect(screen.getAllByText("Total registrado").length).toBeGreaterThan(0);
    expect(screen.getByText("1 item comprado sem preço")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ver pendentes" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Ver pendentes" }));

    expect(screen.getByRole("button", { name: "Pendente", pressed: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Editar Leite pendente" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Editar Café comprado" })).toBeNull();
  });

  it("explains that a new purchase archives the active list and can search recurring products", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Menu da compra" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Nova compra" }));

    const dialog = await screen.findByRole("dialog", { name: "Nova compra" });
    expect(within(dialog).getByText(/vai encerrar “Compras de Setembro” e movê-la para o histórico/)).toBeTruthy();

    fireEvent.change(within(dialog).getByRole("searchbox", { name: "Buscar produtos da casa" }), { target: { value: "Bucha de Pia" } });
    expect(within(dialog).getByText("Bucha de Pia")).toBeTruthy();
    expect(within(dialog).queryByText("Cebola")).toBeNull();
    expect(within(dialog).getByRole("checkbox")).toBeTruthy();
  });

  it("keeps pending items distinct in the finish confirmation and saved summary", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Menu da compra" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Finalizar compra" }));

    const confirmation = await screen.findByRole("dialog", { name: "Finalizar compra?" });
    expect(within(confirmation).getByText(/Ainda existem 1 itens pendentes/)).toBeTruthy();
    fireEvent.click(within(confirmation).getByRole("button", { name: "Finalizar e salvar" }));

    const summary = await screen.findByRole("dialog", { name: "Compra finalizada" });
    expect(within(summary).getByText("Pendentes").nextElementSibling?.textContent).toBe("1");
    expect(within(summary).getByText("Comprados").nextElementSibling?.textContent).toBe("1");
    expect(within(summary).getByText("Já tínhamos").nextElementSibling?.textContent).toBe("1");
    expect(within(summary).getByText("1 item comprado sem preço")).toBeTruthy();
  });
  it("rejects a negative price without closing the editor or changing the total", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Editar Leite pendente" }));
    const dialog = await screen.findByRole("dialog", { name: "Leite pendente" });
    fireEvent.change(within(dialog).getByLabelText(/Preço unitário/), { target: { value: "-5" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar item" }));
    expect(within(dialog).getByRole("alert").textContent).toContain("preço válido");
    expect(screen.getByRole("dialog", { name: "Leite pendente" })).toBeTruthy();
  });

  it("restores sections from browser navigation without leaving the app", async () => {
    await renderApp();
    fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]);
    expect(window.location.hash).toBe("#home");
    window.history.replaceState(window.history.state, "", "/app#history");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(screen.getByRole("heading", { name: "Histórico" })).toBeTruthy();
    window.history.replaceState(window.history.state, "", "/app#shop");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(screen.getByRole("button", { name: "Editar Leite pendente" })).toBeTruthy();
  });

  it("closes the new-purchase dialog with Escape from its search input", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Menu da compra" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Nova compra" }));
    const search = await screen.findByRole("searchbox", { name: "Buscar produtos da casa" });
    fireEvent.change(search, { target: { value: "Café" } });
    fireEvent.keyDown(search, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Nova compra" })).toBeNull());
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("lets the person provide an identifiable profile name", async () => {
    await renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Perfil de Ana" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Editar meu nome" }));
    const dialog = await screen.findByRole("dialog", { name: "Seu nome" });
    fireEvent.change(within(dialog).getByLabelText("Seu nome"), { target: { value: "Ana Souza" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Salvar nome" }));
    expect(await screen.findByRole("button", { name: "Perfil de Ana Souza" })).toBeTruthy();
  });

});
