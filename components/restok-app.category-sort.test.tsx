/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { categoryNameSortKey } from "@/lib/utils";

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: false,
  supabaseUrl: "",
  supabaseAnonKey: "",
}));

vi.mock("@/lib/supabase/realtime", () => ({
  subscribeToShoppingList: () => () => {},
}));

const namesIn = (category: string) => {
  const control = screen.getByRole("button", { name: new RegExp(`^${category} em ordem`) });
  const section = control.closest("section");
  if (!section) throw new Error(`missing ${category} section`);
  return within(section).getAllByText(/.+/).map((node) => node.textContent ?? "").filter((text) => text !== category);
};

describe("house category order", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("lets each category keep its own alphabetical direction", async () => {
    const { default: RestokApp } = await import("@/components/restok-app");
    const view = render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Demonstração" });

    const alimentos = () => namesIn("Alimentos");
    const higiene = () => namesIn("Higiene");
    expect(alimentos().indexOf("Água com gás 1.5L")).toBeLessThan(alimentos().indexOf("Óleo"));
    expect(higiene().indexOf("Bucha de Pia")).toBeLessThan(higiene().indexOf("Shampoo"));

    fireEvent.click(screen.getByRole("button", { name: "Alimentos em ordem A–Z. Alternar ordem alfabética" }));

    expect(screen.getByRole("button", { name: "Alimentos em ordem Z–A. Alternar ordem alfabética" })).toBeTruthy();
    expect(alimentos().indexOf("Óleo")).toBeLessThan(alimentos().indexOf("Água com gás 1.5L"));
    expect(higiene().indexOf("Bucha de Pia")).toBeLessThan(higiene().indexOf("Shampoo"));
    expect(JSON.parse(localStorage.getItem(categoryNameSortKey("demo-household")) ?? "{}")).toEqual({ Alimentos: "desc" });

    fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]);
    expect(namesIn("Alimentos").indexOf("Óleo")).toBeLessThan(namesIn("Alimentos").indexOf("Água com gás 1.5L"));
    expect(namesIn("Higiene").indexOf("Bucha de Pia")).toBeLessThan(namesIn("Higiene").indexOf("Shampoo"));
    fireEvent.click(screen.getAllByRole("button", { name: "Compra" })[0]);
    expect(namesIn("Alimentos").indexOf("Óleo")).toBeLessThan(namesIn("Alimentos").indexOf("Água com gás 1.5L"));
    expect(namesIn("Higiene").indexOf("Bucha de Pia")).toBeLessThan(namesIn("Higiene").indexOf("Shampoo"));

    fireEvent.click(within(screen.getByRole("group", { name: "Ordenar itens da compra" })).getByRole("button", { name: "A–Z" }));
    expect(screen.queryByRole("button", { name: /^Alimentos em ordem/ })).toBeNull();
    const flatNames = screen.getAllByRole("button", { name: /^Editar / }).map((button) => button.getAttribute("aria-label"));
    expect(flatNames.indexOf("Editar Água com gás 1.5L")).toBeLessThan(flatNames.indexOf("Editar Óleo"));
    expect(flatNames.indexOf("Editar Bucha de Pia")).toBeLessThan(flatNames.indexOf("Editar Shampoo"));
    expect(flatNames.indexOf("Editar Bucha de Pia")).toBeLessThan(flatNames.indexOf("Editar Óleo"));

    fireEvent.click(within(screen.getByRole("group", { name: "Ordenar itens da compra" })).getByRole("button", { name: "Categoria" }));
    expect(namesIn("Alimentos").indexOf("Óleo")).toBeLessThan(namesIn("Alimentos").indexOf("Água com gás 1.5L"));

    view.unmount();
    render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Demonstração" });
    fireEvent.click(screen.getAllByRole("button", { name: "Casa" })[0]);
    expect(screen.getByRole("button", { name: "Alimentos em ordem Z–A. Alternar ordem alfabética" })).toBeTruthy();
    expect(namesIn("Alimentos").indexOf("Óleo")).toBeLessThan(namesIn("Alimentos").indexOf("Água com gás 1.5L"));
    expect(namesIn("Higiene").indexOf("Bucha de Pia")).toBeLessThan(namesIn("Higiene").indexOf("Shampoo"));
  });
});
