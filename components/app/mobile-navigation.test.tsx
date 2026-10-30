/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MobileNavigation } from "./mobile-navigation";

const scrollY=Object.getOwnPropertyDescriptor(window,"scrollY");
beforeEach(()=>{Object.defineProperty(window,"scrollY",{configurable:true,value:0});vi.spyOn(window,"matchMedia").mockReturnValue({matches:true} as MediaQueryList);});
afterEach(()=>{cleanup();vi.restoreAllMocks();if(scrollY)Object.defineProperty(window,"scrollY",scrollY);});
function scrollTo(y:number){Object.defineProperty(window,"scrollY",{configurable:true,value:y});fireEvent.scroll(window);}
function setup(){const change=vi.fn();const view=render(<MobileNavigation screen="shop" onChange={change}/>);const island=()=>view.container.querySelector("[data-mobile-navigation]")!;return {...view,change,island};}

it("compacts during user scrolling in both directions and expands on a single navigation click",()=>{
  const {island,change}=setup();
  expect(island().getAttribute("data-mobile-navigation")).toBe("expanded");
  fireEvent.wheel(window);scrollTo(120);
  expect(island().getAttribute("data-mobile-navigation")).toBe("compact");
  fireEvent.click(screen.getByRole("button",{name:"Histórico"}));
  expect(change).toHaveBeenCalledExactlyOnceWith("history");
  expect(island().getAttribute("data-mobile-navigation")).toBe("expanded");
  fireEvent.wheel(window);scrollTo(60);
  expect(island().getAttribute("data-mobile-navigation")).toBe("compact");
  fireEvent.focus(screen.getByRole("button",{name:"Casa"}));
  expect(island().getAttribute("data-mobile-navigation")).toBe("expanded");
});

it("ignores programmatic route scrolling and scroll inside a dialog",()=>{
  const {island}=setup();scrollTo(100);
  expect(island().getAttribute("data-mobile-navigation")).toBe("expanded");
  const dialog=document.createElement("dialog");document.body.append(dialog);
  fireEvent.touchMove(dialog);scrollTo(150);
  expect(island().getAttribute("data-mobile-navigation")).toBe("expanded");dialog.remove();
  fireEvent.touchMove(document.body);scrollTo(180);
  expect(island().getAttribute("data-mobile-navigation")).toBe("compact");
});

it("removes window listeners when the keyboard-aware navigation unmounts",()=>{
  const remove=vi.spyOn(window,"removeEventListener");const {unmount}=setup();unmount();
  for(const event of ["wheel","touchmove","scroll"])expect(remove).toHaveBeenCalledWith(event,expect.any(Function));
});

