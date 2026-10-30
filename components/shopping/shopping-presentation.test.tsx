/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BudgetSummary } from "./budget-summary";
import { ShoppingItemRow } from "./item-row";
import { seedState } from "@/tests/fixtures/shopping";
import { formatBRL } from "@/lib/utils";

afterEach(cleanup);
it("matches the demo's purchased-to-owned and owned-to-purchased shortcuts without inventing writes",()=>{
  const onPurchased=vi.fn(),onAlreadyHave=vi.fn(),onUndo=vi.fn();
  const item={...seedState.lists[0].items[0],name:"Arroz",status:"purchased" as const};
  const props={lists:[],onEdit:vi.fn(),onPurchased,onAlreadyHave,onUndo};
  const view=render(<ShoppingItemRow {...props} item={item}/>);
  fireEvent.click(screen.getByRole("button",{name:"Marcar Arroz como já temos"}));expect(onAlreadyHave).toHaveBeenCalledOnce();
  view.rerender(<ShoppingItemRow {...props} item={{...item,status:"already_have"}}/>);
  expect(screen.getByRole("button",{name:"Retirar Arroz de Já temos"}).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button",{name:"Marcar Arroz como comprado"}));expect(onPurchased).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button",{name:"Retirar Arroz de Já temos"}));expect(onUndo).toHaveBeenCalledOnce();
});

function purchase(budget: number) {
  const source = seedState.lists[0].items[2];
  return {
    ...seedState.lists[0],
    budget,
    items: [
      { ...source, id: "priced", name: "Cebola", quantity: 3, status: "purchased" as const, unitPrice: 5 },
      { ...source, id: "unpriced", name: "Item comprado sem preço", status: "purchased" as const, unitPrice: undefined },
    ],
  };
}

it("orders the budget summary, keeps unknown prices out of the total, and exposes edit", () => {
  const onEdit = vi.fn();
  const { container } = render(<BudgetSummary list={purchase(15)} onEdit={onEdit} />);
  const budget = container.querySelector("[data-budget-summary]");
  const progress = screen.getByRole("progressbar", { name: "Uso do orçamento" });

  expect(budget?.getAttribute("data-budget-over")).toBe("false");
  expect(budget?.querySelector("strong")?.textContent).toBe(formatBRL(15));
  expect(progress.getAttribute("aria-valuenow")).toBe("100");
  expect(container.textContent).toContain("Ainda disponíveis");
  expect(container.textContent).toContain("1 item comprado sem preço");
  fireEvent.click(screen.getByRole("button", { name: "Editar meta da compra" }));
  expect(onEdit).toHaveBeenCalledOnce();
});

it("names the positive over-budget difference without changing its calculation", () => {
  const { container } = render(<BudgetSummary list={purchase(10)} onEdit={vi.fn()} />);
  const budget = container.querySelector("[data-budget-summary]");
  const progress = screen.getByRole("progressbar", { name: "Uso do orçamento" });

  expect(budget?.getAttribute("data-budget-over")).toBe("true");
  expect(container.textContent).toContain("Acima da meta");
  expect(progress.getAttribute("aria-valuetext")).toContain(`excedente de ${formatBRL(5)}`);
});

it("keeps status, already-have, edit, zero price, and undo actions separate", () => {
  const item = { ...seedState.lists[0].items[2], id: "status-row", name: "Cebola", status: "pending" as const, unitPrice: undefined };
  const onPurchased = vi.fn();
  const onAlreadyHave = vi.fn();
  const onUndo = vi.fn();
  const { container, rerender } = render(
    <ShoppingItemRow item={item} lists={[]} onEdit={vi.fn()} onPurchased={onPurchased} onAlreadyHave={onAlreadyHave} onUndo={onUndo} />,
  );
  let row = container.querySelector("[data-shopping-row]");
  expect(row?.firstElementChild?.getAttribute("aria-label")).toBe("Marcar Cebola como comprado");
  expect(row?.firstElementChild?.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(within(row as HTMLElement).getByRole("button", { name: "Marcar Cebola como comprado" }));
  fireEvent.click(within(row as HTMLElement).getByRole("button", { name: "Marcar Cebola como já temos" }));
  expect(onPurchased).toHaveBeenCalledOnce();
  expect(onAlreadyHave).toHaveBeenCalledOnce();

  const purchased = { ...item, status: "purchased" as const, unitPrice: 0 };
  rerender(<ShoppingItemRow item={purchased} lists={[]} onEdit={vi.fn()} onPurchased={onPurchased} onAlreadyHave={onAlreadyHave} onUndo={onUndo} />);
  row = container.querySelector("[data-shopping-row]");
  expect(row?.querySelector("[data-item-total]")?.textContent).toBe(formatBRL(0));
  expect(row?.firstElementChild?.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(within(row as HTMLElement).getByRole("button", { name: "Desfazer situação de Cebola" }));
  expect(onUndo).toHaveBeenCalledOnce();
});

it("keeps a purchased item without price explicit and aligned apart from zero", () => {
  const item = { ...seedState.lists[0].items[2], id: "unpriced-row", name: "Sem preço", status: "purchased" as const, unitPrice: undefined };
  const { container } = render(
    <ShoppingItemRow item={item} lists={[]} onEdit={vi.fn()} onPurchased={vi.fn()} onAlreadyHave={vi.fn()} onUndo={vi.fn()} />,
  );
  const row = container.querySelector("[data-shopping-row]");
  const label = row?.querySelector("[data-item-price-missing-label]");
  expect(row?.getAttribute("data-item-price-missing")).toBe("true");
  expect(label?.textContent).toBe("Sem preço");
  expect(row?.querySelector("[data-item-total]")).toBeNull();
});
