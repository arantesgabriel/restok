/** @vitest-environment happy-dom */
import { setAccountFixture } from "@/tests/support/account";
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import RestokApp from "./restok-app";
import { createShoppingListWithItems, persistList } from "@/lib/supabase/data";
import { seedState } from "@/tests/fixtures/shopping";

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); setAccountFixture({...seedState,lists:[{...seedState.lists[0],items:[{...seedState.lists[0].items[0],name:"Produto recorrente",quantity:3,unitPrice:undefined}]},{...seedState.lists[1],items:[{...seedState.lists[1].items[0],unitPrice:0}]}]}); });
afterEach(() => { cleanup(); localStorage.clear(); });
async function openEditor() {
  render(<RestokApp />); await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Editar Produto recorrente"}));
  return screen.findByRole("dialog",{name:"Produto recorrente"});
}
it.each([["0,00",0],["1.234,50",1234.5]])("saves %s as a known purchased price", async (raw,value) => {
  const dialog=await openEditor();
  expect(within(dialog).getByText(/Anterior R\$/)).toBeTruthy();
  fireEvent.change(within(dialog).getByLabelText("Preço unitário"),{target:{value:raw}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Adicionar ao carrinho/}));
  await waitFor(()=>expect(persistList).toHaveBeenCalled());
  const saved=vi.mocked(persistList).mock.calls[0][0].items[0];
  expect(saved).toMatchObject({unitPrice:value,status:"purchased",quantity:3});
  expect(screen.queryByText(/item comprado sem preço/)).toBeNull();
  expect(document.body.textContent).not.toMatch(/NaN|Infinity/);
});
it("keeps invalid input in the dialog and never writes it",async()=>{
  const dialog=await openEditor();
  const input=within(dialog).getByLabelText("Preço unitário");
  fireEvent.change(input,{target:{value:"1.23,45"}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Salvar item/}));
  expect(within(dialog).getByRole("alert").textContent).toContain("preço válido");
  expect((input as HTMLInputElement).value).toBe("1.23,45");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(persistList).not.toHaveBeenCalled();
});
it("does not save a fractional quantity using the previous valid value",async()=>{
  const dialog=await openEditor();
  fireEvent.change(within(dialog).getByLabelText("Quantidade"),{target:{value:"1.5"}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Salvar item/}));
  expect(within(dialog).getByRole("alert").textContent).toContain("quantidade inteira");
  expect(persistList).not.toHaveBeenCalled();
});
it("allows changing budget to zero",async()=>{
  render(<RestokApp />); await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Editar meta da compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Meta da compra"});
  fireEvent.change(within(dialog).getByLabelText("Orçamento da compra"),{target:{value:"0,00"}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Salvar meta/}));
  await waitFor(()=>expect(persistList).toHaveBeenCalled());
  expect(vi.mocked(persistList).mock.calls[0][0].budget).toBe(0);
});
it("adds a free item with a known zero price as purchased",async()=>{
  render(<RestokApp />); await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Adicionar item à compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Adicionar item"});
  fireEvent.change(within(dialog).getByLabelText("Nome do produto"),{target:{value:"Amostra grátis"}});
  fireEvent.change(within(dialog).getByLabelText("Preço unitário (opcional)"),{target:{value:"0"}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Adicionar à compra/}));
  await waitFor(()=>expect(persistList).toHaveBeenCalled());
  expect(vi.mocked(persistList).mock.calls[0][0].items.at(-1)).toMatchObject({name:"Amostra grátis",unitPrice:0,status:"purchased"});
});
it("rejects an empty new budget then creates a purchase with zero",async()=>{
  render(<RestokApp />); await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Menu da compra"}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Nova compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Nova compra"});
  const budget=within(dialog).getByLabelText("Orçamento");
  fireEvent.change(budget,{target:{value:""}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Encerrar atual e começar/}));
  expect(within(dialog).getByRole("alert")).toBeTruthy();
  expect(createShoppingListWithItems).not.toHaveBeenCalled();
  fireEvent.change(budget,{target:{value:"0,00"}});
  fireEvent.click(within(dialog).getByRole("button",{name:/Encerrar atual e começar/}));
  await waitFor(()=>expect(createShoppingListWithItems).toHaveBeenCalled());
  expect(vi.mocked(createShoppingListWithItems).mock.calls[0][0].budget).toBe(0);
});
