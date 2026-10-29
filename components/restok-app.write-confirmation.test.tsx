/** @vitest-environment happy-dom */
import { setAccountFixture } from "@/tests/support/account";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createShoppingListWithItems, persistList, persistProduct, type RemoteWriteResult } from "@/lib/supabase/data";
import RestokApp from "./restok-app";

beforeEach(()=>{localStorage.clear();vi.clearAllMocks();setAccountFixture();});
afterEach(()=>{cleanup();localStorage.clear();});
async function finish() {
  render(<RestokApp/>);
  await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Menu da compra"}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Finalizar compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Finalizar compra?"});
  fireEvent.click(within(dialog).getByRole("button",{name:"Finalizar e salvar"}));
}
it.each([{ok:false,message:"Falha de teste"},{ok:true,synced:false}] as RemoteWriteResult[])("withholds completion until confirmed and retries the same record (%j)",async result=>{
  let resolve!: (value:RemoteWriteResult)=>void;
  vi.mocked(persistList).mockImplementationOnce(()=>new Promise(done=>{resolve=done;}));
  await finish();
  await waitFor(()=>expect(persistList).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole("dialog",{name:"Compra finalizada"})).toBeNull();
  await act(async()=>resolve(result));
  fireEvent.click(screen.getByText("Alterações sem sincronizar · ver detalhes"));
  expect(screen.queryByRole("dialog",{name:"Compra finalizada"})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Tentar novamente"}));
  await screen.findByRole("dialog",{name:"Compra finalizada"});
  expect(persistList).toHaveBeenCalledTimes(2);
  expect(vi.mocked(persistList).mock.calls[1]).toEqual(vi.mocked(persistList).mock.calls[0]);
});
it("retries purchase creation with the same list and item IDs",async()=>{
  vi.mocked(createShoppingListWithItems).mockResolvedValueOnce({ok:false,message:"Falha de teste"});
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Menu da compra"}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Nova compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Nova compra"});
  fireEvent.click(within(dialog).getByRole("button",{name:/Encerrar atual e começar/}));
  await waitFor(()=>expect(createShoppingListWithItems).toHaveBeenCalledTimes(1));
  await screen.findByText("Alterações sem sincronizar · ver detalhes");
  fireEvent.click(screen.getByText("Alterações sem sincronizar · ver detalhes"));
  fireEvent.click(screen.getByRole("button",{name:"Tentar novamente"}));
  await waitFor(()=>expect(createShoppingListWithItems).toHaveBeenCalledTimes(2));
  expect(vi.mocked(createShoppingListWithItems).mock.calls[1]).toEqual(vi.mocked(createShoppingListWithItems).mock.calls[0]);
});
it("stores an optional catalog product before persisting its linked free item",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getByRole("button",{name:"Adicionar item à compra"}));
  const dialog=await screen.findByRole("dialog",{name:"Adicionar item"});
  fireEvent.change(within(dialog).getByLabelText("Nome do produto"),{target:{value:"Avulso recorrente"}});
  fireEvent.click(within(dialog).getByRole("checkbox"));
  fireEvent.click(within(dialog).getByRole("button",{name:/Adicionar à compra/}));
  await waitFor(()=>expect(persistList).toHaveBeenCalledTimes(1));
  expect(persistProduct).toHaveBeenCalledTimes(1);
  const product=vi.mocked(persistProduct).mock.calls[0][0];
  expect(vi.mocked(persistList).mock.calls[0][0].items.at(-1)?.productId).toBe(product.id);
  expect(vi.mocked(persistProduct).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(persistList).mock.invocationCallOrder[0]);
});
