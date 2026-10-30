/** @vitest-environment happy-dom */
import { setAccountFixture } from "@/tests/support/account";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import RestokApp from "@/components/restok-app";
import { seedState } from "@/tests/fixtures/shopping";
import { persistList } from "@/lib/supabase/data";
beforeEach(()=>{localStorage.clear();vi.clearAllMocks();setAccountFixture({...seedState,lists:[{...seedState.lists[0],items:[{...seedState.lists[0].items[0],name:"Café grátis",quantity:3,status:"purchased",unitPrice:0},{...seedState.lists[0].items[1],name:"Pão pendente",status:"pending"},{...seedState.lists[0].items[2],name:"Arroz de casa",status:"already_have"}]}]});});
afterEach(()=>{cleanup();localStorage.clear();});
it("keeps a single first-item action and preserves finish in the menu for an empty purchase",async()=>{
  setAccountFixture({...seedState,lists:[{...seedState.lists[0],items:[]}]});
  const {container}=render(<RestokApp/>);
  await screen.findByRole("button",{name:"Perfil de Ana"});
  expect(container.querySelector("[data-shopping-dock]")).toBeNull();
  expect(screen.queryByRole("complementary",{name:"Contexto da tela"})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Menu da compra"}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Finalizar compra"}));
  expect(await screen.findByRole("dialog")).toBeTruthy();
  expect(persistList).not.toHaveBeenCalled();
});
it("shows a known zero total in its row and keeps all four filters actionable",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  const edit=screen.getByRole("button",{name:"Editar Café grátis"});
  const row=edit.closest("[data-shopping-row]");
  expect(row?.querySelector("[data-item-total]")?.textContent).toMatch(/0,00/);
  expect(within(row as HTMLElement).getByRole("button",{name:"Desfazer situação de Café grátis"}).getAttribute("aria-pressed")).toBe("true");
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
it("keeps one global organization menu and retains each category direction locally",async()=>{
  const {container}=render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  expect(container.querySelectorAll("[data-category-section]").length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button",{name:/Organizar lista/}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Ordenar por nome A–Z"}));
  expect(container.querySelector("[data-category-section]")).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:/Organizar lista/}));
  fireEvent.click(screen.getByRole("menuitem",{name:"Agrupar por categoria"}));
  expect(container.querySelectorAll("[data-category-section]").length).toBeGreaterThan(0);
  expect(persistList).not.toHaveBeenCalled();
});
it("keeps progress and finish in the purchase header without a redundant summary panel",async()=>{
  render(<RestokApp/>);await screen.findByRole("button",{name:"Perfil de Ana"});
  expect(screen.queryByRole("complementary",{name:"Contexto da tela"})).toBeNull();
  fireEvent.click(screen.getByRole("button",{name:"Ver 1 pendente"}));
  expect(within(screen.getByRole("group",{name:"Filtros da lista"})).getByRole("button",{name:"Pendente"}).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getAllByRole("button",{name:"Finalizar compra"})[0]);
  const dialog=await screen.findByRole("dialog");
  expect(within(dialog).getByText(/Ainda existem 1 itens pendentes/)).toBeTruthy();
  expect(persistList).not.toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole("button",{name:"Continuar comprando"}));
  await waitFor(()=>expect(dialog.hasAttribute("open")).toBe(false));
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

it("mounts each global control once in the shared responsive navigation region",async()=>{
  const {container}=render(<RestokApp/>);
  const profile=await screen.findByRole("button",{name:"Perfil de Ana"});
  expect(screen.getAllByRole("button",{name:"Perfil de Ana"})).toHaveLength(1);
  expect(container.querySelectorAll('button[aria-label^="Casas e pessoas:"]')).toHaveLength(0);
  expect(profile.closest("[data-global-controls]")?.closest("[data-app-sidebar]")).toBeTruthy();
  expect(container.querySelector("#restok-main > header")).toBeNull();
  fireEvent.click(profile);
  fireEvent.click(screen.getByRole("menuitem",{name:"Editar meu nome"}));
  expect(await screen.findByRole("dialog")).toBeTruthy();
});
