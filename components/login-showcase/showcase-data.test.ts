import { describe, expect, it } from "vitest";
import {
  countStatus,
  demoBudgetCents,
  demoHistoryCents,
  demoItems,
  demoStillItemIds,
  lineCents,
  resolvedCount,
  savedCents,
  spentCents,
} from "@/components/login-showcase/showcase-data";

const item = (id: string) => {
  const found = demoItems.find((entry) => entry.id === id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
};

describe("login showcase dataset", () => {
  it("keeps one purchase that adds up", () => {
    expect(demoItems).toHaveLength(11);
    expect(countStatus(demoItems, "purchased")).toBe(10);
    expect(countStatus(demoItems, "already_have")).toBe(1);
    expect(countStatus(demoItems, "pending")).toBe(0);
    expect(resolvedCount(demoItems)).toBe(11);
    expect(lineCents(item("frango"))).toBe(3290);
    expect(lineCents(item("leite"))).toBe(1298);
    expect(lineCents(item("sabonete"))).toBe(0);
    expect(item("cafe").addedBy).toBe("Maria");
    expect(spentCents(demoItems)).toBe(46_805);
    expect(demoBudgetCents - spentCents(demoItems)).toBe(33_195);
    expect(savedCents(demoItems)).toBe(3_800);
    expect(demoHistoryCents.at(-1)).toBe(spentCents(demoItems));
    expect(demoStillItemIds.every((id) => demoItems.some((entry) => entry.id === id))).toBe(true);
  });
});
