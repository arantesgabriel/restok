import { setAccountFixture } from "@/tests/support/account";
/**
 * @vitest-environment happy-dom
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";



import RestokApp from "@/components/restok-app";

let viewportHeight = 500;
let visualViewport: VisualViewport;

describe("mobile keyboard and reduced-motion behavior", () => {
  beforeEach(() => {
    localStorage.clear();
    setAccountFixture();
    viewportHeight = 500;
    visualViewport = new EventTarget() as VisualViewport;
    Object.defineProperties(visualViewport, {
      height: { configurable: true, get: () => viewportHeight },
      offsetTop: { configurable: true, get: () => 0 },
    });
    Object.defineProperty(window, "visualViewport", { configurable: true, value: visualViewport });
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
    Reflect.deleteProperty(window, "visualViewport");
  });

  it("hides fixed shopping controls while a reduced visual viewport indicates an open keyboard", async () => {
    render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Ana" });
    const search = screen.getByRole("searchbox", { name: "Buscar na lista" });

    const navigationCount = () => document.querySelectorAll('nav[aria-label="Navegação principal"]').length;
    expect(navigationCount()).toBe(2);
    search.focus();
    await waitFor(() => {
      expect(navigationCount()).toBe(1);
      expect(screen.queryByRole("region", { name: "Ações da compra e total registrado" })).toBeNull();
    });

    viewportHeight = 768;
    act(() => visualViewport.dispatchEvent(new Event("resize")));
    await waitFor(() => expect(navigationCount()).toBe(2));
    expect(screen.queryByRole("region", { name: "Ações da compra e total registrado" })).toBeTruthy();
  });

  it("closes a sheet without the exit delay when reduced motion is enabled", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    render(<RestokApp />);
    await screen.findByRole("button", { name: "Perfil de Ana" });
    fireEvent.click(screen.getByRole("button", { name: "Editar Água com gás 1.5L" }));

    const dialog = await screen.findByRole("dialog", { name: "Água com gás 1.5L" });
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Água com gás 1.5L" })).toBeNull());
    expect(dialog.isConnected).toBe(false);
  });
});
