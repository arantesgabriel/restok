/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HouseholdInvite, HouseholdMember } from "@/lib/types";
import { HouseholdManager } from "./household-manager";
import { HouseholdOnboarding } from "./household-onboarding";
import { inviteStatus } from "./household-model";
import type { ManagerProps } from "./use-household-manager";

const data=vi.hoisted(()=>({members:vi.fn(),invites:vi.fn(),role:vi.fn(),transfer:vi.fn(),remove:vi.fn(),leave:vi.fn(),revoke:vi.fn(),create:vi.fn(),makeInvite:vi.fn(),accept:vi.fn()}));
vi.mock("@/lib/supabase/data",()=>({loadHouseholdMembers:data.members,loadHouseholdInvites:data.invites,changeHouseholdMemberRole:data.role,transferHouseholdOwnership:data.transfer,removeHouseholdMember:data.remove,leaveHousehold:data.leave,revokeHouseholdInvite:data.revoke,createHousehold:data.create,createHouseholdInvite:data.makeInvite,acceptHouseholdInvite:data.accept}));
const house={id:"house-a",name:"Casa de teste",role:"owner" as const,createdAt:"2026-01-01"};
const prefix="Participante com nome extenso compartilhado ".padEnd(79,"A");
const self:HouseholdMember={userId:"self-id",displayName:prefix+"A",isSelf:true,role:"owner",joinedAt:"2026-01-01T12:00:00Z"};
const other:HouseholdMember={userId:"other-id",displayName:prefix+"B",isSelf:false,role:"member",joinedAt:"2026-01-01T12:00:00Z"};
const invite:HouseholdInvite={id:"invite-1",createdBy:"self-id",createdAt:"2026-01-01T12:00:00Z",expiresAt:"2099-01-01T12:00:00Z",consumedAt:null,consumedBy:null,revokedAt:null};
const props=():ManagerProps=>({households:[house,{...house,id:"house-b",name:"Outra casa"}],activeHousehold:house,enabled:true,onClose:vi.fn(),onSelect:vi.fn(async()=>true),onCreated:vi.fn(async()=>true),onMembershipChanged:vi.fn(async()=>{}),notify:vi.fn()});

beforeEach(()=>{vi.resetAllMocks();data.members.mockResolvedValue([self,other]);data.invites.mockResolvedValue([]);for(const fn of [data.role,data.transfer,data.remove,data.leave,data.revoke])fn.mockResolvedValue(true);data.create.mockResolvedValue("created-house");data.makeInvite.mockResolvedValue("fixture-token");data.accept.mockResolvedValue("joined-house");Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:vi.fn(async()=>{})}});});
afterEach(cleanup);

describe("household access and identity",()=>{
  it("shows both complete 80-character names, including self, without exposing IDs",async()=>{
    render(<HouseholdManager {...props()}/>);
    expect(await screen.findByText(other.displayName!)).toBeTruthy();
    expect(screen.getByText(self.displayName!)).toBeTruthy();
    expect(screen.getByText("Você")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/self-id|other-id/);
  });

  it("requires an explicit confirmation for removal and restores focus on cancel",async()=>{
    render(<HouseholdManager {...props()}/>);
    const trigger=await screen.findByRole("button",{name:/^Remover /});
    fireEvent.click(trigger);
    const confirmation=screen.getByRole("region",{name:"Confirmar alteração de acesso"});
    expect(within(confirmation).getByText(other.displayName!)).toBeTruthy();
    expect(document.activeElement).toBe(within(confirmation).getByRole("button",{name:"Cancelar"}));
    expect(data.remove).not.toHaveBeenCalled();
    fireEvent.click(within(confirmation).getByRole("button",{name:"Cancelar"}));
    await waitFor(()=>expect(document.activeElement).toBe(trigger));
    expect(data.remove).not.toHaveBeenCalled();
  });

  it("keeps a failed removal visible and retries only the identified household/member",async()=>{
    data.remove.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const input=props();render(<HouseholdManager {...input}/>);
    fireEvent.click(await screen.findByRole("button",{name:/^Remover /}));
    fireEvent.click(screen.getByRole("button",{name:"Confirmar remover pessoa"}));
    expect(await screen.findByText(/Não foi possível concluir a alteração/)).toBeTruthy();
    expect(screen.getByRole("region",{name:"Confirmar alteração de acesso"})).toBeTruthy();
    expect(input.notify).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button",{name:"Confirmar remover pessoa"}));
    await waitFor(()=>expect(input.notify).toHaveBeenCalledWith("Pessoa removida da casa."));
    expect(data.remove.mock.calls).toEqual([[house.id,other.userId],[house.id,other.userId]]);
  });

  it("confirms promotion before sending the new role",async()=>{
    render(<HouseholdManager {...props()}/>);
    fireEvent.change(await screen.findByRole("combobox",{name:/^Papel de /}),{target:{value:"admin"}});
    expect(data.role).not.toHaveBeenCalled();
    expect(screen.getByText("O novo papel será Administrador.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button",{name:"Confirmar alterar papel"}));
    await waitFor(()=>expect(data.role).toHaveBeenCalledWith(house.id,other.userId,"admin"));
  });

  it("confirms transfer with the full name and the resulting owner role",async()=>{
    render(<HouseholdManager {...props()}/>);
    fireEvent.click(await screen.findByRole("button",{name:/^Transferir propriedade para/}));
    const panel=screen.getByRole("region",{name:"Confirmar alteração de acesso"});
    expect(within(panel).getByText(other.displayName!)).toBeTruthy();
    expect(within(panel).getByText(/Você passará a administrador/)).toBeTruthy();
    fireEvent.click(within(panel).getByRole("button",{name:"Confirmar transferir propriedade"}));
    await waitFor(()=>expect(data.transfer).toHaveBeenCalledWith(house.id,other.userId));
  });

  it.each(["admin","member"] as const)("restricts %s controls while preserving identity",async role=>{
    data.members.mockResolvedValue([{...self,role},{...other,role:"owner"},{...other,userId:"member-2",displayName:"Pessoa membro"}]);
    render(<HouseholdManager {...props()} activeHousehold={{...house,role}}/>);
    await screen.findByText("Pessoa membro");
    expect(screen.queryByRole("combobox",{name:/^Papel de /})).toBeNull();
    expect(screen.queryByRole("button",{name:/^Transferir propriedade/})).toBeNull();
    expect(screen.queryByRole("button",{name:new RegExp(`^Remover ${prefix}`)})).toBeNull();
    expect(screen.queryByRole("button",{name:/^Remover Pessoa membro/})!==null).toBe(role==="admin");
    expect(screen.queryByRole("button",{name:"Criar convite"})!==null).toBe(role==="admin");
    if(role==="member")expect(data.invites).not.toHaveBeenCalled();
  });

  it("protects the last owner and confirms a member's exit",async()=>{
    const input=props();const {rerender}=render(<HouseholdManager {...input}/>);
    await screen.findByText(other.displayName!);
    expect((screen.getByRole("button",{name:"Sair desta casa"}) as HTMLButtonElement).disabled).toBe(true);
    expect(data.leave).not.toHaveBeenCalled();
    data.members.mockResolvedValue([{...self,role:"member"}]);
    rerender(<HouseholdManager {...input} activeHousehold={{...house,role:"member"}}/>);
    await waitFor(()=>expect((screen.getByRole("button",{name:"Sair desta casa"}) as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(screen.getByRole("button",{name:"Sair desta casa"}));
    fireEvent.click(screen.getByRole("button",{name:"Confirmar sair desta casa"}));
    await waitFor(()=>expect(data.leave).toHaveBeenCalledWith(house.id));
    expect(input.onClose).toHaveBeenCalled();
  });

  it("keeps the current household after a failed switch and prevents concurrent selections",async()=>{
    const input=props();let release!:(value:boolean)=>void;
    input.onSelect=vi.fn(()=>new Promise<boolean>(resolve=>{release=resolve;}));
    render(<HouseholdManager {...input}/>);
    fireEvent.change(screen.getByRole("combobox",{name:"Selecionar casa"}),{target:{value:"house-b"}});
    fireEvent.change(screen.getByRole("combobox",{name:"Selecionar casa"}),{target:{value:"house-b"}});
    expect(input.onSelect).toHaveBeenCalledTimes(1);
    release(false);
    expect(await screen.findByText(/A casa atual foi mantida/)).toBeTruthy();
    expect((screen.getByRole("combobox",{name:"Selecionar casa"}) as HTMLSelectElement).value).toBe("house-a");
    expect(input.onClose).not.toHaveBeenCalled();
  });

  it("retries loading a newly created household without creating it twice",async()=>{
    const input=props();input.onCreated=vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<HouseholdManager {...input}/>);
    fireEvent.click(screen.getByRole("button",{name:"Nova casa"}));
    fireEvent.change(screen.getByRole("textbox",{name:"Nome da nova casa"}),{target:{value:"  Casa nova  "}});
    fireEvent.click(screen.getByRole("button",{name:"Criar casa"}));
    fireEvent.click(await screen.findByRole("button",{name:"Tentar carregar a casa"}));
    await waitFor(()=>expect(input.onClose).toHaveBeenCalled());
    expect(data.create.mock.calls).toEqual([["Casa nova"]]);
    expect(vi.mocked(input.onCreated).mock.calls).toEqual([["created-house"],["created-house"]]);
  });
});

describe("household invitations",()=>{
  it("handles zero, active, used, expired and revoked invitations without rendering tokens",async()=>{
    data.invites.mockResolvedValue([invite,{...invite,id:"used",consumedAt:"2026-01-02",consumedBy:"other-id"},{...invite,id:"expired",expiresAt:"2020-01-01"},{...invite,id:"revoked",revokedAt:"2026-01-02"}]);
    render(<HouseholdManager {...props()}/>);
    for(const status of ["Ativo","Usado","Expirado","Revogado"])expect(await screen.findByText(status)).toBeTruthy();
    expect(screen.getAllByRole("button",{name:"Revogar"})).toHaveLength(1);
    expect(document.body.textContent).not.toContain("fixture-token");
    expect(inviteStatus(invite,Date.parse(invite.expiresAt))).toBe("Expirado");
  });

  it("shows clipboard fallback, hides the new token, and confirms revocation",async()=>{
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error("clipboard blocked"));
    data.invites.mockResolvedValue([invite]);
    const input=props();render(<HouseholdManager {...input}/>);
    await screen.findByText("Ativo");
    fireEvent.click(screen.getByRole("button",{name:"Criar convite"}));
    const link=await screen.findByRole("textbox",{name:"Link do convite"});
    expect((link as HTMLInputElement).value).toContain("fixture-token");
    await waitFor(()=>expect(input.notify).toHaveBeenCalledWith(expect.stringContaining("Copie o link")));
    fireEvent.click(screen.getByRole("button",{name:"Ocultar link"}));
    expect(screen.queryByRole("textbox",{name:"Link do convite"})).toBeNull();
    fireEvent.click(screen.getByRole("button",{name:"Revogar"}));
    expect(data.revoke).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button",{name:"Confirmar revogar convite"}));
    await waitFor(()=>expect(data.revoke).toHaveBeenCalledWith(invite.id));
  });

  it("keeps the ten-invite limit failure explicit without inventing a link",async()=>{
    data.invites.mockResolvedValue(Array.from({length:10},(_,index)=>({...invite,id:`invite-${index}`})));
    data.makeInvite.mockResolvedValue(null);
    render(<HouseholdManager {...props()}/>);
    await screen.findAllByText("Ativo");
    fireEvent.click(screen.getByRole("button",{name:"Criar convite"}));
    expect(await screen.findByText(/10 convites ativos/)).toBeTruthy();
    expect(screen.queryByRole("textbox",{name:"Link do convite"})).toBeNull();
  });
});

describe("household onboarding",()=>{
  const onboarding=()=>({profileName:"Pessoa de teste",email:null,inviteToken:"",inviteFailed:false,onActivate:vi.fn(async()=>true)});
  it("creates once, preserves the returned ID after loading fails, and retries activation",async()=>{
    const input=onboarding();input.onActivate=vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<HouseholdOnboarding {...input}/>);
    fireEvent.click(screen.getByRole("button",{name:"Criar casa"}));
    fireEvent.click(await screen.findByRole("button",{name:"Tentar carregar a casa"}));
    await waitFor(()=>expect(input.onActivate).toHaveBeenCalledTimes(2));
    expect(data.create).toHaveBeenCalledTimes(1);
    expect(input.onActivate.mock.calls).toEqual([["created-house"],["created-house"]]);
  });
  it("accepts an invitation and does not consume it again when activation is retried",async()=>{
    const input=onboarding();input.onActivate=vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(true);
    render(<HouseholdOnboarding {...input}/>);
    fireEvent.change(screen.getByRole("textbox",{name:"Código do convite"}),{target:{value:"fixture-token"}});
    fireEvent.click(screen.getByRole("button",{name:"Entrar na casa"}));
    fireEvent.click(await screen.findByRole("button",{name:"Tentar carregar a casa"}));
    await waitFor(()=>expect(input.onActivate).toHaveBeenCalledTimes(2));
    expect(data.accept.mock.calls).toEqual([["fixture-token"]]);
  });
  it("keeps invalid/expired/used/revoked invitation failure visible and permits a new code",async()=>{
    data.accept.mockResolvedValueOnce(null).mockResolvedValueOnce("joined-house");
    const input=onboarding();render(<HouseholdOnboarding {...input}/>);
    const field=screen.getByRole("textbox",{name:"Código do convite"});
    fireEvent.change(field,{target:{value:"bad-token"}});fireEvent.click(screen.getByRole("button",{name:"Entrar na casa"}));
    expect(await screen.findByText(/inválido, expirou, já foi usado ou foi revogado/)).toBeTruthy();
    expect(input.onActivate).not.toHaveBeenCalled();
    fireEvent.change(field,{target:{value:"new-token"}});fireEvent.click(screen.getByRole("button",{name:"Entrar na casa"}));
    await waitFor(()=>expect(input.onActivate).toHaveBeenCalledWith("joined-house"));
  });
});
