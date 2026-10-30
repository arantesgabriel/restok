import { expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import config from "../../tailwind.raiz.config";

it("compiles semantic opacity modifiers without silently remapping font weights", async () => {
  const result = await postcss([tailwindcss({ ...config, content: [{ raw: "bg-action/50 font-bold font-extrabold" }] })]).process("@tailwind utilities;", { from: undefined });
  expect(result.css).toContain("rgb(var(--color-action-rgb) / 0.5)");
  expect(result.css).toContain("font-weight: 700");
  expect(result.css).toContain("font-weight: 800");
  expect(result.css).not.toContain("--primary");
});
