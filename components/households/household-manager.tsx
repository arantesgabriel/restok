"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { changeHouseholdMemberRole, leaveHousehold, removeHouseholdMember, revokeHouseholdInvite, transferHouseholdOwnership } from "@/lib/supabase/data";
import { MemberRow, type MemberAction } from "./member-row";
import { formatDate, inviteStatus, memberLabel, roleLabel } from "./household-model";
import { useHouseholdManager, type ManagerProps } from "./use-household-manager";
import styles from "./households.module.css";

type Confirmation = MemberAction | {kind:"leave"} | {kind:"revoke"; id:string; createdAt:string};

function ConfirmationView({action,houseName,busy,onConfirm,onCancel}:{action:Confirmation;houseName:string;busy:boolean;onConfirm:()=>void;onCancel:()=>void}) {
  const cancel = useRef<HTMLButtonElement>(null);
  useLayoutEffect(()=>{ cancel.current?.focus(); },[]);
  const title = action.kind === "remove" ? "Remover pessoa" : action.kind === "transfer" ? "Transferir propriedade" : action.kind === "role" ? "Alterar papel" : action.kind === "revoke" ? "Revogar convite" : "Sair desta casa";
  return <section className={styles.confirmation} aria-label="Confirmar alteração de acesso">
    <h3>{title}</h3><p className={styles.meta}>Casa: <strong className={styles.fullName}>{houseName}</strong></p>
    {"member" in action ? <div><p className={styles.name}>{memberLabel(action.member)}</p><p className={styles.meta}>{roleLabel(action.member.role)} · desde {formatDate(action.member.joinedAt)}</p></div> : null}
    <p>{action.kind === "remove" ? "Essa pessoa perderá o acesso aos dados desta casa." : action.kind === "transfer" ? "Essa pessoa será proprietária da casa. Você passará a administrador." : action.kind === "role" ? `O novo papel será ${roleLabel(action.role)}.` : action.kind === "revoke" ? `O convite criado em ${formatDate(action.createdAt)} deixará de funcionar.` : "Você perderá o acesso aos dados desta casa."}</p>
    <div className={styles.actions}><Button ref={cancel} variant="secondary" disabled={busy} onClick={onCancel}>Cancelar</Button><Button variant="danger" busy={busy} onClick={onConfirm}>Confirmar {title.toLocaleLowerCase("pt-BR")}</Button></div>
  </section>;
}

export function HouseholdManager(props:ManagerProps) {
  const view=useHouseholdManager(props);
  const [createOpen,setCreateOpen]=useState(false);
  const [newName,setNewName]=useState("");
  const [confirmation,setConfirmation]=useState<Confirmation | null>(null);
  const trigger=useRef<HTMLElement | null>(null);
  const people=useRef<HTMLHeadingElement>(null);
  const ask=(action:Confirmation,element:HTMLElement)=>{trigger.current=element;setConfirmation(action);};
  const cancel=()=>{setConfirmation(null);queueMicrotask(()=>{(trigger.current?.isConnected ? trigger.current : people.current)?.focus();});};
  const confirm=async()=>{
    if(!confirmation) return;
    const action=confirmation;
    const id=props.activeHousehold.id;
    const ok=await view.perform(()=>action.kind==="role" ? changeHouseholdMemberRole(id,action.member.userId,action.role) : action.kind==="transfer" ? transferHouseholdOwnership(id,action.member.userId) : action.kind==="remove" ? removeHouseholdMember(id,action.member.userId) : action.kind==="revoke" ? revokeHouseholdInvite(action.id) : leaveHousehold(id),action.kind==="role" ? "Papel atualizado." : action.kind==="transfer" ? "Propriedade transferida." : action.kind==="remove" ? "Pessoa removida da casa." : action.kind==="revoke" ? "Convite revogado." : "Você saiu da casa.");
    if(ok){cancel();if(action.kind==="leave")props.onClose();}
  };
  const close=()=>{if(confirmation){if(!view.busy)cancel();}else props.onClose();};
  return <Sheet title="Casas e pessoas" description="Escolha sua casa e gerencie o acesso das pessoas." onClose={close} wide>
    <div className={styles.manager}>
      {view.error ? <p className={styles.error} role="alert">{view.error}</p> : null}
      {confirmation ? <ConfirmationView action={confirmation} houseName={props.activeHousehold.name} busy={view.busy} onCancel={cancel} onConfirm={()=>void confirm()}/> : null}
      <div className={styles.manager} hidden={Boolean(confirmation)} inert={Boolean(confirmation)}>
        <section className={styles.section} aria-label="Casa ativa"><div className={styles.sectionHeading}><h3>Casa ativa</h3>{props.enabled ? <Button variant="quiet" disabled={view.busy || Boolean(view.pendingHouseholdId)} onClick={()=>setCreateOpen(!createOpen)}>{createOpen ? "Cancelar" : "Nova casa"}</Button> : null}</div>
          <p className={styles.name}>{props.activeHousehold.name}</p><Select label="Selecionar casa" value={props.activeHousehold.id} disabled={!props.enabled || view.busy} onChange={event=>void view.select(event.target.value)}>{props.households.map(house=><option key={house.id} value={house.id}>{house.name} · {roleLabel(house.role)}</option>)}</Select>
          {createOpen && props.enabled ? <form className={styles.form} onSubmit={event=>{event.preventDefault();if(newName.trim())void view.create(newName);}}><Field label="Nome da nova casa" required maxLength={80} value={newName} disabled={view.busy || Boolean(view.pendingHouseholdId)} onChange={event=>setNewName(event.target.value)}/><Button type="submit" busy={view.busy} disabled={!newName.trim() || Boolean(view.pendingHouseholdId)}>Criar casa</Button></form> : null}
          {view.pendingHouseholdId ? <Button busy={view.busy} onClick={()=>void view.retryCreated()}>Tentar carregar a casa</Button> : null}
          {!props.enabled ? <p className={styles.meta}>Conecte sua conta para gerenciar casas, pessoas e convites.</p> : null}
        </section>
        <section className={styles.section} aria-label="Pessoas da casa"><div className={styles.sectionHeading}><h3 ref={people} tabIndex={-1}>Pessoas <span>{view.members.length}</span></h3>{view.canInvite && props.enabled ? <Button disabled={view.busy || view.loading || view.loadError} onClick={()=>void view.makeInvite()}>Criar convite</Button> : null}</div>
          {view.createdLink ? <div className={styles.linkPanel}><Field label="Link do convite" readOnly value={view.createdLink} onFocus={event=>event.currentTarget.select()}/><div className={styles.actions}><Button variant="secondary" onClick={()=>void view.copyInvite()}>Copiar</Button><Button variant="quiet" onClick={()=>view.setCreatedLink("")}>Ocultar link</Button></div><p className={styles.meta}>O link fica visível apenas nesta tela.</p></div> : null}
          {!props.enabled ? <p className={styles.meta}>Conecte sua conta para carregar pessoas e convites.</p> : view.loading ? <p role="status" className={styles.meta}>Carregando pessoas…</p> : view.loadError ? <div role="alert" className={styles.error}><p>Não foi possível carregar as pessoas e convites.</p><Button variant="secondary" onClick={()=>void view.refresh()}>Tentar novamente</Button></div> : view.members.length ? <ul className={styles.members}>{view.members.map(member=><MemberRow key={member.userId} member={member} role={props.activeHousehold.role} enabled={props.enabled} busy={view.busy} onAction={ask}/>)}</ul> : <p className={styles.meta}>Nenhuma pessoa encontrada nesta casa.</p>}
          {props.enabled && view.members.some(member=>member.isSelf) ? <Button variant="quiet" className={styles.dangerText} disabled={view.busy || view.lastOwner} onClick={event=>ask({kind:"leave"},event.currentTarget)}>Sair desta casa</Button> : null}
          {view.lastOwner ? <p className={styles.meta}>A última pessoa proprietária precisa transferir a propriedade antes de sair.</p> : null}
        </section>
        {view.canInvite && props.enabled ? <section className={styles.section} aria-label="Convites recentes"><h3>Convites recentes</h3>{view.loading ? <p className={styles.meta}>Carregando convites…</p> : view.loadError ? <p className={styles.meta}>Convites indisponíveis até recarregar as pessoas.</p> : view.invites.length ? <ul className={styles.invites}>{view.invites.map(invite=>{const status=inviteStatus(invite);return <li key={invite.id}><div><p className={styles.name}>{status}</p><p className={styles.meta}>Criado em {formatDate(invite.createdAt)} · vence em {formatDate(invite.expiresAt)}</p></div>{status==="Ativo" ? <Button variant="quiet" disabled={view.busy} onClick={event=>ask({kind:"revoke",id:invite.id,createdAt:invite.createdAt},event.currentTarget)}>Revogar</Button> : null}</li>;})}</ul> : <p className={styles.meta}>Nenhum convite encontrado.</p>}<p className={styles.meta}>Os convites duram 14 dias, só podem ser usados uma vez e seus tokens não aparecem nesta lista.</p></section> : null}
      </div>
    </div>
  </Sheet>;
}
