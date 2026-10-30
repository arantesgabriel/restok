/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ProductsHome } from "./products-home";
import type { Product } from "@/lib/types";

afterEach(cleanup);
const products:Product[]=[
  {id:"coffee",name:"Café",category:"Alimentos",defaultQuantity:2,active:true},
  {id:"rice",name:"Arroz",category:"Alimentos",defaultQuantity:1,active:true},
  {id:"milk",name:"Leite inativo",category:"Bebidas",defaultQuantity:3,active:false},
];
function setup(){const toggle=vi.fn(),edit=vi.fn(),sort=vi.fn();render(<ProductsHome products={products} lists={[]} householdName="Casa" categorySort={{Alimentos:"desc"}} onToggleCategorySort={sort} onNewPurchase={vi.fn()} onAddProduct={vi.fn()} onManageHousehold={vi.fn()} onToggleProduct={toggle} onEditProduct={edit}/>);return {toggle,edit,sort};}
it("searches active and inactive products locally and restores focus when clearing",()=>{
  const {toggle,edit,sort}=setup();const search=screen.getByRole("searchbox");
  fireEvent.change(search,{target:{value:"  LEITE  "}});
  expect(screen.queryByRole("button",{name:"Editar Café"})).toBeNull();
  expect(screen.getByRole("button",{name:"Ativar Leite inativo"})).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("1 produto encontrado");
  fireEvent.click(screen.getByRole("button",{name:/Limpar/}));
  expect(document.activeElement).toBe(search);
  expect(screen.getByRole("button",{name:"Editar Café"})).toBeTruthy();
  expect(toggle).not.toHaveBeenCalled();expect(edit).not.toHaveBeenCalled();expect(sort).not.toHaveBeenCalled();
});
it("keeps category direction while switching to global A–Z and back",()=>{
  setup();const names=()=>screen.getAllByRole("button",{name:/^Editar /}).map(node=>node.getAttribute("aria-label"));
  expect(names().slice(0,2)).toEqual(["Editar Café","Editar Arroz"]);
  fireEvent.click(screen.getByRole("button",{name:"Organizar produtos"})); fireEvent.click(screen.getByRole("menuitem",{name:"Ordenar por nome A–Z"}));
  expect(names().slice(0,2)).toEqual(["Editar Arroz","Editar Café"]);
  fireEvent.click(screen.getByRole("button",{name:"Organizar produtos"})); fireEvent.click(screen.getByRole("menuitem",{name:"Agrupar por categoria"}));
  expect(names().slice(0,2)).toEqual(["Editar Café","Editar Arroz"]);
});
it("keeps empty search distinct from an empty catalog",()=>{
  setup();fireEvent.change(screen.getByRole("searchbox"),{target:{value:"inexistente"}});
  expect(screen.getByRole("heading",{name:"Nenhum produto encontrado"})).toBeTruthy();
  expect(screen.queryByRole("heading",{name:"Sua lista está vazia"})).toBeNull();
});
