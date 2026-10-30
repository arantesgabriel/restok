/** @vitest-environment happy-dom */
import {cleanup,fireEvent,render,screen,within} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {MobileNavigation} from "./mobile-navigation";
import {SharingDemo} from "./sharing-demo";
import {PlanningDemo} from "./planning-demo";
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it("closes mobile navigation on Escape and on an anchor selection",()=>{
  render(<MobileNavigation><a href="#duvidas"><span>Dúvidas</span></a></MobileNavigation>);
  const details=document.querySelector("details")!,summary=details.querySelector("summary")!;
  details.open=true;screen.getByRole("link").focus();fireEvent.keyDown(screen.getByRole("link"),{key:"Escape"});
  expect(details.open).toBe(false);expect(document.activeElement).toBe(summary);
  details.open=true;fireEvent.click(screen.getByText("Dúvidas"));expect(details.open).toBe(false);
});
it("keeps public selection and invitations local and reflects the example in both views",()=>{
  const fetch=vi.spyOn(globalThis,"fetch").mockRejectedValue(new Error("Unexpected network"));
  const storage=vi.spyOn(Storage.prototype,"setItem");
  const planning=render(<PlanningDemo/>);fireEvent.click(screen.getByRole("checkbox",{name:"Selecionar Tomate"}));planning.unmount();
  render(<SharingDemo/>);fireEvent.click(screen.getByRole("button",{name:"Mostrar convite"}));fireEvent.click(screen.getByRole("button",{name:"Simular entrada pelo convite"}));fireEvent.click(screen.getByRole("button",{name:"Simular Pão comprado"}));
  for(const name of ["Lista da pessoa A","Lista da pessoa B"]){const region=screen.getByRole("region",{name});expect(within(region).getByText(/Comprado/)).toBeTruthy();}
  expect(fetch).not.toHaveBeenCalled();expect(storage).not.toHaveBeenCalled();
});
