/**
 * @vitest-environment happy-dom
 */
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", async () => {
  const { createElement: create } = await import("react");
  return { default: ({ alt }: { alt: string }) => create("img", { alt }) };
});

vi.mock("next/link", async () => {
  const { createElement: create } = await import("react");
  return { default: ({ href, children, ...props }: { href: string; children: ReactNode }) => create("a", { href, ...props }, children) };
});

import LandingPage from "@/app/page";

describe("landing page destinations", () => {
  it("sends entry actions to login and keeps the previous section hashes", () => {
    const markup = renderToStaticMarkup(createElement(LandingPage));

    expect(markup).toContain('href="/login"');
    expect(markup).not.toContain('href="/signup"');
    expect(markup).not.toContain('href="/app"');
    expect(markup).not.toContain("Preços");
    expect(markup).toContain('id="como-funciona"');
    expect(markup).toContain('id="para-casa"');
    expect(markup).toContain('id="funcionalidades"');
    expect(markup).toContain('id="duvidas"');
    expect(markup).toContain('id="demo-planejar"');
    expect(markup).toContain("12,40");
    expect(markup.match(/<h1[\s>]/g)).toHaveLength(1);
  });
});
