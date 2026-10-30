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
  it("keeps every local anchor resolvable and native disclosure content available in SSR",()=>{
    const markup=renderToStaticMarkup(createElement(LandingPage));
    const doc=new DOMParser().parseFromString(markup,"text/html");
    const ids=[...doc.querySelectorAll("[id]")].map(node=>node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for(const anchor of doc.querySelectorAll('a[href^="#"]'))expect(ids).toContain(anchor.getAttribute("href")!.slice(1));
    expect(doc.querySelectorAll('section#duvidas details')).toHaveLength(5);
    expect(doc.querySelectorAll('#demo-acompanhar details')).toHaveLength(3);
    expect(doc.querySelectorAll('summary > div')).toHaveLength(0);
    expect(doc.querySelector('#demo-planejar fieldset')?.hasAttribute("disabled")).toBe(true);
    expect(doc.querySelectorAll('noscript').length).toBeGreaterThanOrEqual(3);
    expect(markup).toContain("Cada pessoa com sua conta");
    expect(markup).not.toContain("pantry-leaves");
    expect(markup).not.toContain("landing-browser");
  });
});
