/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

afterEach(cleanup);
const base = { screen:"shop" as const, onChange:vi.fn(), profile:<button>Minha conta</button>, notices:null, overlays:null, keyboardOpen:false, children:<h1>Compra</h1> };

it("keeps the active house in the global region and opens its real management callback", () => {
  const onHouseOpen=vi.fn();
  render(<AppShell {...base} houseName="Casa da família" onHouseOpen={onHouseOpen}/>);
  const selector=screen.getByRole("button",{name:"Casas e pessoas: Casa da família"});
  expect(selector.closest("[data-app-sidebar]")).toBeTruthy();
  fireEvent.click(selector);expect(onHouseOpen).toHaveBeenCalledOnce();
  expect(document.querySelector("[data-app-context]")).toBeNull();
});

it("keeps a failed sync actionable globally and returns focus when its notice closes", () => {
  const retry=vi.fn();
  render(<AppShell {...base} noticeTitle="Alterações sem sincronizar" noticeUrgent notices={<button onClick={retry}>Tentar novamente</button>}/>);
  const details=document.querySelector<HTMLDetailsElement>("[data-global-notice]")!;
  expect(details.open).toBe(true);
  const button=screen.getByRole("button",{name:"Tentar novamente"});fireEvent.click(button);expect(retry).toHaveBeenCalledOnce();
  fireEvent.keyDown(button,{key:"Escape"});expect(details.open).toBe(false);
  expect(document.activeElement).toBe(details.querySelector("summary"));
});

it("preserves skip navigation, useful optional context, and keyboard-aware fixed controls", () => {
  const view=render(<AppShell {...base} context={<p>Contexto útil</p>} dock={<button>Adicionar</button>}/>);
  fireEvent.click(screen.getByRole("link",{name:"Ir para o conteúdo"}));
  expect(document.activeElement).toBe(document.querySelector("#restok-main"));
  expect(screen.getByRole("complementary",{name:"Contexto da tela"})).toBeTruthy();
  view.rerender(<AppShell {...base} keyboardOpen/>);
  expect(document.querySelectorAll('nav[aria-label="Navegação principal"]')).toHaveLength(1);
  expect(document.querySelector("[data-shopping-dock]")).toBeNull();
});
