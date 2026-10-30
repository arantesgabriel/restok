/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { formatBRL } from "@/lib/utils";
import { PurchaseDemo } from "./purchase-demo";

afterEach(cleanup);
const buy = (name: string, value: string) => fireEvent.change(screen.getByLabelText(`Situação de ${name}`), { target: { value } });
it("counts only purchased items and their quantities in the total, and resets", () => {
  render(<PurchaseDemo />);
  expect(screen.getByRole("status").textContent).toContain(formatBRL(12.4));
  buy("Tomate", "purchased");
  expect(screen.getByRole("status").textContent).toContain(formatBRL(21.3));
  buy("Leite", "purchased");
  expect(screen.getByRole("status").textContent).toContain(formatBRL(33.1));
  expect((screen.getByRole("progressbar") as HTMLProgressElement).value).toBe(4);
  buy("Tomate", "already_have");
  expect(screen.getByRole("status").textContent).toContain(formatBRL(24.2));
  expect(screen.getByRole("status").textContent).toContain("3 de 4 comprados · 1 já temos");
  fireEvent.click(screen.getByRole("button", { name: "Reiniciar exemplo" }));
  expect(screen.getByRole("status").textContent).toContain(formatBRL(12.4));
  expect((screen.getByRole("progressbar") as HTMLProgressElement).value).toBe(2);
});
it("keeps an unpriced purchase counted and warns that the registered total is partial", () => {
  render(<PurchaseDemo />);
  buy("Tomate", "purchased");
  fireEvent.change(screen.getByLabelText("Preço unitário de Tomate"), { target: { value: "" } });
  expect(screen.getByRole("status").textContent).toContain(formatBRL(12.4));
  expect(screen.getByRole("status").textContent).toContain("3 de 4 comprados");
  expect(screen.getByRole("status").textContent).toContain("Total parcial");
  fireEvent.change(screen.getByLabelText("Preço unitário de Tomate"), { target: { value: "10" } });
  expect(screen.getByRole("status").textContent).toContain(formatBRL(22.4));
  expect(screen.getByRole("status").textContent).not.toContain("Total parcial");
});
it("keeps zero as a known price and reports a positive exceeded budget",()=>{
  render(<PurchaseDemo/>);buy("Tomate","purchased");
  fireEvent.change(screen.getByLabelText("Preço unitário de Tomate"),{target:{value:"0"}});
  expect(screen.getByRole("status").textContent).toContain(formatBRL(12.4));
  expect(screen.getByRole("status").textContent).not.toContain("Total parcial");
  fireEvent.change(screen.getByLabelText("Preço unitário de Tomate"),{target:{value:"100"}});
  expect(screen.getByRole("status").textContent).toContain(`${formatBRL(32.4)} acima do orçamento`);
  expect(screen.getByRole("status").textContent).not.toContain("disponíveis");
});
it("accepts BRL notation and keeps the last valid total when a draft is invalid",()=>{
  render(<PurchaseDemo/>);buy("Tomate","purchased");
  const input=screen.getByLabelText("Preço unitário de Tomate");
  fireEvent.change(input,{target:{value:"1.234,50"}});
  expect(screen.getByRole("status").textContent).toContain(formatBRL(1246.9));
  fireEvent.change(input,{target:{value:"-10"}});
  expect(screen.getByRole("alert").textContent).toContain("último valor válido");
  expect(screen.getByRole("status").textContent).toContain(formatBRL(1246.9));
  fireEvent.click(screen.getByRole("button",{name:"Reiniciar exemplo"}));
  expect(screen.queryByRole("alert")).toBeNull();
  expect((input as HTMLInputElement).value).toBe("8,90");
});
