import { setAccountFixture } from "@/tests/support/account";
/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";



describe("recurring products", () => {
  beforeEach(() => {
    localStorage.clear();
    setAccountFixture();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.resetModules();
  });

  it("restores an inactive product to the next purchase selection", async () => {
    const { default: RestokApp } = await import("@/components/restok-app");
    render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Ana" });

    fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]);
    const deactivate = screen.getByRole("button", { name: "Desativar Café" });
    deactivate.focus();
    fireEvent.click(deactivate);

    expect(screen.queryByRole("button", { name: "Desativar Café" })).toBeNull();
    const inactiveSummary = screen.getByText("Produtos inativos").closest("summary")!;
    await waitFor(() => expect(document.activeElement).toBe(inactiveSummary));
    fireEvent.click(inactiveSummary);
    const activate = screen.getByRole("button", { name: "Ativar Café" });
    activate.focus();
    fireEvent.click(activate);
    const activeToggle = await screen.findByRole("button", { name: "Desativar Café" });
    await waitFor(() => expect(document.activeElement).toBe(activeToggle));

    fireEvent.click(screen.getAllByRole("button", { name: "Compra" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Menu da compra" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Nova compra" }));

    const dialog = await screen.findByRole("dialog", { name: "Nova compra" });
    const search = within(dialog).getByRole("searchbox", { name: "Buscar produtos da casa" });
    fireEvent.change(search, { target: { value: "Café" } });
    expect((within(dialog).getByRole("checkbox", { name: /Café/ }) as HTMLInputElement).checked).toBe(true);
    expect(within(dialog).getByText("44 de 44 selecionados")).toBeTruthy();
  });
});
