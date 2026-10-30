/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { seedState } from "@/tests/fixtures/shopping";
import { NewPurchaseSheet } from "./new-purchase-sheet";

afterEach(cleanup);
it.each([33,100])("preserves selection outside search results among %i products", count => {
  const products = Array.from({length:count},(_,i)=>({...seedState.products[0],id:`p${i}`,name:`Produto ${i}`,active:i!==count-1}));
  const create = vi.fn();
  render(<NewPurchaseSheet products={products} activeList={seedState.lists[0]} onClose={()=>true} onCreate={create}/>);
  expect(screen.getByText(`${count-1} de ${count-1} selecionados`)).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Desmarcar resultados"}));
  expect(screen.getByText(`0 de ${count-1} selecionados`)).toBeTruthy();
  fireEvent.change(screen.getByRole("searchbox"),{target:{value:"Produto 0"}});
  fireEvent.click(screen.getByRole("button",{name:"Selecionar resultados"}));
  fireEvent.click(screen.getByRole("button",{name:/Limpar/}));
  expect(screen.getByText(`1 de ${count-1} selecionados`)).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:/Encerrar atual e começar/}));
  expect(create.mock.calls[0][2]).toEqual(["p0"]);
});
it("allows an empty purchase and excludes inactive products from select all",()=>{
  const create=vi.fn();
  render(<NewPurchaseSheet products={seedState.products} activeList={null} onClose={()=>true} onCreate={create}/>);
  fireEvent.click(screen.getByRole("button",{name:"Desmarcar resultados"}));
  fireEvent.click(screen.getByRole("button",{name:/Começar compra/}));
  expect(create.mock.calls[0][2]).toEqual([]);
});
