/**
 * @vitest-environment happy-dom
 */
import { cleanup, render, screen } from "@testing-library/react";
import { act, createElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import { LoginShowcase } from "@/components/login-showcase/login-showcase";
import { showcasePanelQuery, showcaseReducedMotionQuery } from "@/components/login-showcase/use-showcase-timeline";

function installMatchMedia(initial: Record<string, boolean>) {
  const queries = { ...initial };
  const listeners = new Map<string, Set<() => void>>();

  vi.stubGlobal("matchMedia", (query: string) => {
    const bucket = () => {
      const current = listeners.get(query) ?? new Set<() => void>();
      listeners.set(query, current);
      return current;
    };
    return {
      get matches() {
        return queries[query] ?? false;
      },
      media: query,
      onchange: null,
      addListener(listener: () => void) {
        bucket().add(listener);
      },
      removeListener(listener: () => void) {
        listeners.get(query)?.delete(listener);
      },
      addEventListener(type: string, listener: EventListener) {
        if (type === "change") bucket().add(listener as () => void);
      },
      removeEventListener(type: string, listener: EventListener) {
        if (type === "change") listeners.get(query)?.delete(listener as () => void);
      },
      dispatchEvent() {
        return true;
      },
    } as MediaQueryList;
  });

  return {
    set(query: string, matches: boolean) {
      queries[query] = matches;
      listeners.get(query)?.forEach((listener) => listener());
    },
  };
}

function stage() {
  const node = document.querySelector("[data-stage]");
  if (!node) throw new Error("missing showcase stage");
  return node;
}

function enableImmediateAutoplay() {
  vi.stubGlobal("requestIdleCallback", (callback: IdleRequestCallback) => {
    callback({ didTimeout: false, timeRemaining: () => 0 });
    return 1;
  });
  vi.stubGlobal("cancelIdleCallback", () => {});
}

function setTabVisible(visible: boolean) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => (visible ? "visible" : "hidden"),
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("login showcase motion", () => {
  beforeEach(() => {
    setTabVisible(true);
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("plays the planning script when motion and the desktop panel are available", () => {
    enableImmediateAutoplay();
    installMatchMedia({
      [showcaseReducedMotionQuery]: false,
      [showcasePanelQuery]: true,
    });
    render(<LoginShowcase />);
    expect(stage().getAttribute("data-stage")).toBe("planning");
    expect(stage().getAttribute("data-beat")).toBe("planning-start");
    expect(screen.getByText("Lista da casa")).toBeTruthy();
    expect(screen.getByText("10 itens")).toBeTruthy();
  });

  it("stays on the still market frame when reduced motion is requested", async () => {
    enableImmediateAutoplay();
    const quiet = installMatchMedia({
      [showcaseReducedMotionQuery]: true,
      [showcasePanelQuery]: true,
    });
    render(<LoginShowcase />);
    expect(stage().getAttribute("data-stage")).toBe("still");
    expect(stage().getAttribute("data-beat")).toBe("still");
    expect(screen.getByText("Dentro do mercado")).toBeTruthy();
    expect(screen.getByText("Compra concluída")).toBeTruthy();

    await act(async () => {
      quiet.set(showcaseReducedMotionQuery, false);
    });
    expect(stage().getAttribute("data-stage")).toBe("still");

    cleanup();
    enableImmediateAutoplay();
    const playing = installMatchMedia({
      [showcaseReducedMotionQuery]: false,
      [showcasePanelQuery]: true,
    });
    render(<LoginShowcase />);
    expect(stage().getAttribute("data-beat")).toBe("planning-start");
    await act(async () => {
      playing.set(showcaseReducedMotionQuery, true);
    });
    expect(stage().getAttribute("data-stage")).toBe("still");
    expect(screen.getByText("Compra concluída")).toBeTruthy();
  });

  it("starts only on the desktop breakpoint and freezes when the panel is hidden", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    enableImmediateAutoplay();
    const media = installMatchMedia({
      [showcaseReducedMotionQuery]: false,
      [showcasePanelQuery]: false,
    });
    render(<LoginShowcase />);
    expect(stage().getAttribute("data-stage")).toBe("still");

    await act(async () => {
      media.set(showcasePanelQuery, true);
    });
    expect(stage().getAttribute("data-beat")).toBe("planning-start");

    await act(async () => {
      media.set(showcasePanelQuery, false);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20_000);
    });
    expect(stage().getAttribute("data-beat")).toBe("planning-start");

    await act(async () => {
      media.set(showcasePanelQuery, true);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(stage().getAttribute("data-beat")).toBe("item-arroz");
  });

  it("freezes while the tab is in the background and continues when it returns", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    enableImmediateAutoplay();
    installMatchMedia({
      [showcaseReducedMotionQuery]: false,
      [showcasePanelQuery]: true,
    });
    render(<LoginShowcase />);
    expect(stage().getAttribute("data-beat")).toBe("planning-start");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(stage().getAttribute("data-beat")).toBe("item-arroz");

    await act(async () => {
      setTabVisible(false);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20_000);
    });
    expect(stage().getAttribute("data-beat")).toBe("item-arroz");

    await act(async () => {
      setTabVisible(true);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });
    expect(stage().getAttribute("data-beat")).not.toBe("item-arroz");
  });

  it("hydrates the still frame and stays quiet in the console", async () => {
    enableImmediateAutoplay();
    const errors: unknown[][] = [];
    const warnings: unknown[][] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args);
    });
    vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
      warnings.push(args);
    });
    installMatchMedia({
      [showcaseReducedMotionQuery]: true,
      [showcasePanelQuery]: false,
    });

    const html = renderToString(createElement(LoginShowcase));
    expect(html).toContain('data-stage="still"');
    expect(html).toContain("Sua compra, da lista à próxima.");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    let root: Root | undefined;
    act(() => {
      root = hydrateRoot(container, <LoginShowcase />);
    });
    expect(stage().getAttribute("data-stage")).toBe("still");
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    act(() => {
      root?.unmount();
    });
    container.remove();
  });
});
