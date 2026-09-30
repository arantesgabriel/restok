import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { showcasePanelQuery, showcaseReducedMotionQuery } from "@/components/login-showcase/use-showcase-timeline";

const css = readFileSync(fileURLToPath(new URL("../../app/globals.css", import.meta.url)), "utf8");

function mediaBlock(header: string, needle?: string) {
  let from = 0;
  while (from < css.length) {
    const start = css.indexOf(header, from);
    if (start < 0) break;
    const open = css.indexOf("{", start);
    let depth = 0;
    for (let index = open; index < css.length; index += 1) {
      if (css[index] === "{") depth += 1;
      else if (css[index] === "}") {
        depth -= 1;
        if (depth === 0) {
          const block = css.slice(start, index + 1);
          if (!needle || block.includes(needle)) return block;
          break;
        }
      }
    }
    from = start + header.length;
  }
  throw new Error(`missing ${header}`);
}

describe("login breakpoints", () => {
  it("pairs the desktop showcase with the single-column login below 1024px", () => {
    const minWidth = Number(showcasePanelQuery.match(/(\d+)px/)?.[1]);
    expect(minWidth).toBe(1024);
    const compact = mediaBlock(`@media (max-width: ${minWidth - 1}px)`);
    expect(compact).toContain(".login-page { grid-template-columns: 1fr;");
    expect(compact).toContain(".login-showcase { display: none;");
    expect(compact).toContain(".login-mobile-story { display: flex;");
    expect(compact).toContain(".login-panel { display: flex;");
  });

  it("tightens the showcase when the viewport is short", () => {
    const short = mediaBlock("@media (max-height: 820px)", ".login-showcase");
    expect(short).toContain(".login-showcase { gap: 12px;");
    expect(short).toContain("min-height: 430px;");
  });

  it("keeps the login panel readable on a narrow phone", () => {
    const phone = mediaBlock("@media (max-width: 430px)");
    expect(phone).toContain(".login-panel { padding-inline: 20px;");
    expect(phone).toContain(".login-copy h1, .login-success h1 { font-size: 1.45rem;");
  });

  it("turns showcase motion off when reduced motion is requested", () => {
    expect(showcaseReducedMotionQuery).toBe("(prefers-reduced-motion: reduce)");
    const reduced = mediaBlock(`@media ${showcaseReducedMotionQuery}`, ".login-showcase-pass.is-leaving");
    expect(reduced).toContain("animation: none;");
    expect(reduced).toContain(".login-showcase-pass.is-leaving { display: none;");
    expect(reduced).toContain("transition: none;");
  });
});
