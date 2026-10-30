/** @vitest-environment happy-dom */
import { setAccountFixture } from "@/tests/support/account";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { deleteShoppingItem, persistList } from "@/lib/supabase/data";
import { seedState } from "@/tests/fixtures/shopping";
import RestokApp from "./restok-app";

beforeEach(()=>{localStorage.clear();vi.clearAllMocks();setAccountFixture();});
afterEach(()=>{cleanup();localStorage.clear();});
async function ask(){
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  const item=seedState.lists[0].items[0];
  fireEvent.click(screen.getByRole("button",{name:`Excluir ${item.name}`}));
  return {item,dialog:await screen.findByRole("dialog",{name:"Excluir item da compra?"})};
}
it("cancels deletion without a remote write and preserves the catalog",async()=>{
  const {item,dialog}=await ask();fireEvent.click(within(dialog).getByRole("button",{name:"Cancelar"}));
  expect(deleteShoppingItem).not.toHaveBeenCalled();
  expect(screen.getByRole("button",{name:`Editar ${item.name}`})).toBeTruthy();
});
it("deletes from the active list, saves its reduced snapshot, and survives reload",async()=>{
  const {item,dialog}=await ask();fireEvent.click(within(dialog).getByRole("button",{name:"Excluir item"}));
  await waitFor(()=>expect(deleteShoppingItem).toHaveBeenCalledWith(item.id,seedState.lists[0].id,"test-house"));
  await waitFor(()=>expect(persistList).toHaveBeenCalled());
  expect(vi.mocked(persistList).mock.calls.at(-1)![0].items.some(row=>row.id===item.id)).toBe(false);
  cleanup();render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  expect(screen.queryByRole("button",{name:`Editar ${item.name}`})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Casa e produtos"}));
  expect(screen.getByRole("button",{name:`Editar ${item.name}`})).toBeTruthy();
});
it("retries a failed delete before saving a subsequent edit on the same list",async()=>{
  vi.mocked(deleteShoppingItem).mockResolvedValueOnce({ok:false,message:"Falha simulada"});
  const {item,dialog}=await ask();fireEvent.click(within(dialog).getByRole("button",{name:"Excluir item"}));
  await screen.findByText(/Falha simulada/);
  expect(persistList).not.toHaveBeenCalled();
  const other=seedState.lists[0].items.find(row=>row.id!==item.id)!;
  await act(async()=>fireEvent.click(screen.getByRole("button",{name:`Marcar ${other.name} como comprado`})));
  await waitFor(()=>expect(deleteShoppingItem).toHaveBeenCalledTimes(2));
  await waitFor(()=>expect(persistList).toHaveBeenCalled());
  expect(vi.mocked(persistList).mock.calls.at(-1)![0].items.some(row=>row.id===item.id)).toBe(false);
});
