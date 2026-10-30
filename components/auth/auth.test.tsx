/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const remote=vi.hoisted(()=>({configured:true,update:vi.fn(),save:vi.fn(),replace:vi.fn()}));
vi.mock("next/navigation",()=>({useRouter:()=>({replace:remote.replace})}));
vi.mock("@/lib/supabase/client",()=>({getSupabaseBrowserClient:()=>remote.configured ? {auth:{updateUser:remote.update}} : null}));
vi.mock("@/lib/supabase/data",()=>({persistProfileName:remote.save}));
import { ResetPasswordForm } from "./reset-password-form";
import { ProfileEditorSheet } from "./profile-editor-sheet";
beforeEach(()=>{vi.resetAllMocks();remote.configured=true;remote.update.mockResolvedValue({error:null});remote.save.mockResolvedValue(true);});
afterEach(cleanup);
const reset=()=>{render(<ResetPasswordForm/>);fireEvent.change(screen.getByLabelText("Nova senha"),{target:{value:"apenas-fixture"}});fireEvent.change(screen.getByLabelText("Confirme a nova senha"),{target:{value:"apenas-fixture"}});return screen.getByRole("form",{name:"Escolha uma nova senha"});};
const profile=()=>{const onClose=vi.fn(()=>true),onSaved=vi.fn();render(<ProfileEditorSheet name="Pessoa fictícia" onClose={onClose} onSaved={onSaved}/>);return {onClose,onSaved,form:document.getElementById("profile-name-form")!};};
describe("password reset",()=>{
  it("keeps mismatched passwords local and focuses the error",()=>{
    const form=reset();fireEvent.change(screen.getByLabelText("Confirme a nova senha"),{target:{value:"diferente"}});fireEvent.submit(form);
    expect(screen.getByRole("alert").textContent).toBe("As senhas não coincidem.");expect(document.activeElement).toBe(screen.getByRole("alert"));expect(remote.update).not.toHaveBeenCalled();
  });
  it("preserves password autocomplete, minimum length and independent reveal controls",()=>{
    reset();const input=screen.getByLabelText("Nova senha") as HTMLInputElement;
    expect(input.minLength).toBe(6);expect(input.autocomplete).toBe("new-password");
    fireEvent.click(screen.getByRole("button",{name:"Mostrar nova senha"}));expect(input.type).toBe("text");expect((screen.getByLabelText("Confirme a nova senha") as HTMLInputElement).type).toBe("password");
  });
  it("locks duplicate submissions and only navigates after confirmed update",async()=>{
    let finish!:(value:{error:null})=>void;remote.update.mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));const form=reset();fireEvent.submit(form);fireEvent.submit(form);
    expect(remote.update).toHaveBeenCalledTimes(1);expect(remote.replace).not.toHaveBeenCalled();expect(screen.getByRole("status").textContent).toBe("Salvando…");
    finish({error:null});await waitFor(()=>expect(remote.replace).toHaveBeenCalledWith("/app?flow=onboarding"));
  });
  it("explains expired or used links without leaving and permits retry",async()=>{
    remote.update.mockResolvedValueOnce({error:{message:"expired"}});const form=reset();fireEvent.submit(form);expect((await screen.findByRole("alert")).textContent).toContain("expirou ou já foi usado");expect(remote.replace).not.toHaveBeenCalled();fireEvent.submit(form);await waitFor(()=>expect(remote.replace).toHaveBeenCalledOnce());
  });
  it.each([false,true])("handles unavailable service or transport failure (%s)",async(configured)=>{
    remote.configured=configured;remote.update.mockRejectedValue(new Error("offline"));fireEvent.submit(reset());expect((await screen.findByRole("alert")).textContent).toContain(configured ? "conexão" : "indisponível");expect(remote.replace).not.toHaveBeenCalled();expect((screen.getByRole("button",{name:"Atualizar senha"}) as HTMLButtonElement).disabled).toBe(false);
  });
});
describe("own profile editor",()=>{
  it("rejects whitespace and more than80 characters without a write",()=>{
    const {form}=profile();const input=screen.getByRole("textbox",{name:"Seu nome"});
    for(const value of ["   ","A".repeat(81)]){fireEvent.change(input,{target:{value}});fireEvent.submit(form);expect(screen.getByRole("alert").textContent).toContain("até 80");}expect(remote.save).not.toHaveBeenCalled();
  });
  it("saves exactly80 trimmed characters only after confirmation",async()=>{
    const view=profile();const name="Nome reconhecível ".padEnd(80,"A");fireEvent.change(screen.getByRole("textbox",{name:"Seu nome"}),{target:{value:` ${name} `}});fireEvent.submit(view.form);await waitFor(()=>expect(view.onSaved).toHaveBeenCalledWith(name));expect(remote.save).toHaveBeenCalledWith(name);expect(view.onClose).toHaveBeenCalledOnce();
  });
  it("retains a failed name for retry and does not report success",async()=>{
    remote.save.mockResolvedValueOnce(false);const view=profile();fireEvent.submit(view.form);await screen.findByRole("alert");expect(view.onSaved).not.toHaveBeenCalled();expect(view.onClose).not.toHaveBeenCalled();fireEvent.submit(view.form);await waitFor(()=>expect(view.onSaved).toHaveBeenCalledOnce());
  });
  it("handles thrown transport errors and keeps the editor open",async()=>{
    remote.save.mockRejectedValue(new Error("offline"));const view=profile();fireEvent.submit(view.form);expect((await screen.findByRole("alert")).textContent).toContain("Não foi possível salvar");expect(view.onClose).not.toHaveBeenCalled();
  });
  it("blocks duplicate writes and closing while a save is pending",async()=>{
    let finish!:(value:boolean)=>void;remote.save.mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));const view=profile();fireEvent.submit(view.form);fireEvent.submit(view.form);fireEvent.keyDown(screen.getByRole("dialog"),{key:"Escape"});expect(remote.save).toHaveBeenCalledTimes(1);expect(view.onClose).not.toHaveBeenCalled();finish(true);await waitFor(()=>expect(view.onClose).toHaveBeenCalledOnce());
  });
  it("cancels without changing a profile",()=>{const view=profile();fireEvent.click(screen.getByRole("button",{name:"Cancelar"}));expect(view.onClose).toHaveBeenCalledOnce();expect(remote.save).not.toHaveBeenCalled();});
});
