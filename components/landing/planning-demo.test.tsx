/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PlanningDemo } from "./planning-demo";

afterEach(cleanup);
it("selects habitual products and resets the local example", () => {
  render(<PlanningDemo />);
  fireEvent.click(screen.getByRole("checkbox", { name: /Tomate/ }));
  expect(screen.getByRole("status").textContent).toContain("4 produtos selecionados");
  fireEvent.click(screen.getByRole("button", { name: "Reiniciar exemplo" }));
  expect((screen.getByRole("checkbox", { name: /Tomate/ }) as HTMLInputElement).checked).toBe(false);
  expect(screen.getByRole("status").textContent).toContain("3 produtos selecionados");
});
