/** @vitest-environment happy-dom */
import { setAccountFixture } from "@/tests/support/account";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import RestokApp from "@/components/restok-app";
import { seedState } from "@/tests/fixtures/shopping";
import { persistList } from "@/lib/supabase/data";
beforeEach(()=>{localStorage.clear();vi.clearAllMocks();setAccountFixture({...seedState,lists:[{...seedState.lists[0],items:[{...seedState.lists[0].items[0],name:"Café grátis",quantity:3,status:"purchased",unitPrice:0},{...seedState.lists[0].items[1],name:"Pão pendente",status:"pending"},{...seedState.lists[0].items[2],name:"Arroz de casa",status:"already_have"}]}]});});
afterEach(()=>{cleanup();localStorage.clear();});
it("shows a known zero total in its row and keeps all four filters actionable",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  const edit=screen.getByRole("button",{name:"Editar Café grátis"});
  expect(edit.querySelector("[data-item-total]")?.textContent).toMatch(/0,00/);
  const filters=within(screen.getByRole("group",{name:"Filtros da lista"}));
  fireEvent.click(filters.getByRole("button",{name:"Já temos"}));
  expect(screen.getByRole("button",{name:"Editar Arroz de casa"})).toBeTruthy();
  expect(screen.queryByRole("button",{name:"Editar Café grátis"})).toBeNull();
  fireEvent.click(filters.getByRole("button",{name:"Comprado"}));
  expect(screen.getByRole("button",{name:"Editar Café grátis"})).toBeTruthy();
  fireEvent.click(filters.getByRole("button",{name:"Pendente"}));
  expect(screen.getByRole("button",{name:"Editar Pão pendente"})).toBeTruthy();
  fireEvent.click(filters.getByRole("button",{name:"Todos"}));
  expect(screen.getByRole("button",{name:"Editar Café grátis"})).toBeTruthy();
  expect(persistList).not.toHaveBeenCalled();
});
it("clears a search without resetting the chosen status or writing data",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(within(screen.getByRole("group",{name:"Filtros da lista"})).getByRole("button",{name:"Comprado"}));
  const input=screen.getByRole("searchbox",{name:"Buscar na lista"});
  fireEvent.change(input,{target:{value:"não existe"}});
  expect(screen.getByRole("heading",{name:"Nenhum item encontrado"})).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Limpar buscar na lista"}));
  expect(document.activeElement).toBe(input);
  expect(screen.getByRole("button",{name:"Editar Café grátis"})).toBeTruthy();
  expect(screen.queryByRole("button",{name:"Editar Pão pendente"})).toBeNull();
  expect(persistList).not.toHaveBeenCalled();
});
it("skips to the current section without replacing its navigation hash",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  fireEvent.click(screen.getAllByRole("button",{name:"Histórico"})[0]);
  expect(location.hash).toBe("#history");
  fireEvent.click(screen.getByRole("link",{name:"Ir para o conteúdo"}));
  expect(location.hash).toBe("#history");
  expect(document.activeElement?.id).toBe("restok-main");
});
