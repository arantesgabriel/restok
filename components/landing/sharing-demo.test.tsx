/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { SharingDemo } from "./sharing-demo";

afterEach(cleanup);
it("simulates invitation, joining and a shared update without persisting them", () => {
  render(<SharingDemo />);
  expect(screen.queryByRole("button", { name: "Simular Pão comprado" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Mostrar convite" }));
  fireEvent.click(screen.getByRole("button", { name: "Simular entrada pelo convite" }));
  expect(screen.getByRole("status").textContent).toContain("Pessoa B entrou");
  fireEvent.click(screen.getByRole("button", { name: "Simular Pão comprado" }));
  expect(screen.getByRole("status").textContent).toContain("Pessoa B marcou Pão como comprado");
  fireEvent.click(screen.getByRole("button", { name: "Reiniciar exemplo" }));
  expect(screen.queryByRole("button", { name: "Simular entrada pelo convite" })).toBeNull();
  expect(screen.getByRole("status").textContent).toContain("Mostre o convite");
});
