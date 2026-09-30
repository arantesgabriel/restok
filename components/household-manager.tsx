"use client";

import { useEffect, useState } from "react";
import {
  changeHouseholdMemberRole,
  createHousehold,
  createHouseholdInvite,
  leaveHousehold,
  loadHouseholdInvites,
  loadHouseholdMembers,
  removeHouseholdMember,
  revokeHouseholdInvite,
  transferHouseholdOwnership,
} from "@/lib/supabase/data";
import type { HouseholdInvite, HouseholdMember, HouseholdRole, HouseholdSummary } from "@/lib/types";

function roleLabel(role: HouseholdRole) {
  return role === "owner" ? "Proprietário" : role === "admin" ? "Administrador" : "Membro";
}

function memberLabel(member: HouseholdMember, index: number) {
  return member.isSelf ? "Você" : `Membro ${index} · ${member.userId.slice(0, 8)}`;
}

function inviteStatus(invite: HouseholdInvite) {
  if (invite.revokedAt) return "Revogado";
  if (invite.consumedAt) return "Usado";
  if (Date.parse(invite.expiresAt) <= Date.now()) return "Expirado";
  return "Ativo";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export function HouseholdManager({
  households,
  activeHousehold,
  enabled,
  onClose,
  onSelect,
  onCreated,
  onMembershipChanged,
  notify,
}: {
  households: HouseholdSummary[];
  activeHousehold: HouseholdSummary;
  enabled: boolean;
  onClose: () => void;
  onSelect: (householdId: string) => Promise<boolean>;
  onCreated: (householdId: string) => Promise<boolean>;
  onMembershipChanged: () => Promise<void>;
  notify: (message: string) => void;
}) {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [invites, setInvites] = useState<HouseholdInvite[]>([]);
  const [newName, setNewName] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const canInvite = activeHousehold.role === "owner" || activeHousehold.role === "admin";

  const refresh = async () => {
    setLoading(true);
    const [nextMembers, nextInvites] = await Promise.all([
      loadHouseholdMembers(activeHousehold.id),
      canInvite ? loadHouseholdInvites(activeHousehold.id) : Promise.resolve([]),
    ]);
    setMembers(nextMembers ?? []);
    setInvites(nextInvites ?? []);
    setLoading(false);
  };

  useEffect(() => { void refresh(); }, [activeHousehold.id, activeHousehold.role]);

  const perform = async (action: () => Promise<boolean>, successMessage: string) => {
    setBusy(true);
    try {
      const succeeded = await action();
      if (!succeeded) {
        notify("Não foi possível concluir a alteração. Confira sua permissão e tente novamente.");
        return false;
      }
      notify(successMessage);
      await refresh();
      await onMembershipChanged();
      return true;
    } catch {
      notify("Não foi possível concluir a alteração. Confira sua permissão e tente novamente.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    try {
      const householdId = await createHousehold(name);
      if (!householdId) {
        notify("Não foi possível criar a casa. Tente novamente.");
        return;
      }
      const activated = await onCreated(householdId);
      if (!activated) notify("A casa foi criada, mas não foi possível carregá-la. Recarregue a página para tentar novamente.");
      if (activated) onClose();
    } catch {
      notify("Não foi possível criar a casa. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  const makeInvite = async () => {
    setBusy(true);
    try {
      const token = await createHouseholdInvite(activeHousehold.id);
      if (!token) {
        notify("Não foi possível criar o convite. Confira sua permissão e se já não existem 10 convites ativos.");
        return;
      }
      const link = `${window.location.origin}/app?invite=${encodeURIComponent(token)}`;
      setCreatedLink(link);
      try {
        await navigator.clipboard.writeText(link);
        notify("Convite criado e copiado. Ele vale por 14 dias e só pode ser usado uma vez.");
      } catch {
        notify("Convite criado. Copie o link exibido abaixo; ele vale por 14 dias e só pode ser usado uma vez.");
      }
      await refresh();
    } catch {
      notify("Não foi possível criar o convite. Confira sua permissão e se já não existem 10 convites ativos.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-center bg-ink/35 p-0 sm:items-center sm:p-6" role="presentation">
      <button className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="household-manager-title" className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[22px] border border-line bg-canvas px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 shadow-sheet sm:max-h-[90vh] sm:rounded-[18px] sm:px-7 sm:pb-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="household-manager-title" className="text-xl font-semibold tracking-[-0.02em] text-ink">Casas e pessoas</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Escolha uma casa, gerencie quem participa e controle os convites.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-lg text-muted" aria-label="Fechar">×</button>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Casa ativa</h3>
              {enabled ? <button type="button" onClick={() => setCreateOpen((open) => !open)} className="min-h-10 px-2 text-sm font-semibold text-primary">{createOpen ? "Cancelar" : "＋ Nova casa"}</button> : null}
            </div>
            <label className="sr-only" htmlFor="active-household">Selecionar casa</label>
            <select id="active-household" value={activeHousehold.id} disabled={!enabled || busy} onChange={(event) => { void onSelect(event.target.value).then((loaded) => { if (loaded) onClose(); }); }} className="field-input">
              {households.map((household) => <option key={household.id} value={household.id}>{household.name} · {roleLabel(household.role)}</option>)}
            </select>
            {createOpen && enabled ? <form className="flex flex-col gap-2 sm:flex-row" onSubmit={submitCreate}>
              <label htmlFor="new-household-name" className="sr-only">Nome da nova casa</label>
              <input id="new-household-name" required maxLength={80} value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nome da casa" className="field-input min-w-0 flex-1" />
              <button type="submit" disabled={busy || !newName.trim()} className="min-h-11 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">Criar casa</button>
            </form> : null}
            {!enabled ? <p className="text-xs leading-5 text-muted">Casas e convites ficam disponíveis quando a conta estiver conectada ao servidor.</p> : null}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Pessoas <span className="font-normal text-muted">{members.length}</span></h3>
              {canInvite && enabled ? <button type="button" disabled={busy} onClick={() => void makeInvite()} className="min-h-10 rounded-[9px] bg-primary px-3 text-xs font-semibold text-white disabled:opacity-50">Criar convite</button> : null}
            </div>
            {createdLink ? <div className="mb-3 rounded-[10px] border border-primary/20 bg-sage/50 p-3"><p className="text-xs font-semibold text-ink">Link do convite (visível só nesta tela)</p><div className="mt-2 flex gap-2"><input readOnly value={createdLink} onFocus={(event) => event.currentTarget.select()} className="field-input min-w-0 flex-1 text-xs" aria-label="Link do convite" /><button type="button" onClick={() => { void (async () => { try { await navigator.clipboard.writeText(createdLink); notify("Convite copiado."); } catch { notify("Selecione e copie o link do convite."); } })(); }} className="min-h-11 rounded-[9px] border border-line bg-surface px-3 text-xs font-semibold text-ink">Copiar</button></div></div> : null}
            {!enabled ? <p className="py-4 text-sm text-muted">A lista de pessoas aparece quando a conta estiver conectada ao servidor.</p> : loading ? <p className="py-4 text-sm text-muted">Carregando pessoas…</p> : members.length ? <ul className="divide-y divide-line rounded-[10px] border border-line bg-surface">
              {members.map((member, index) => <li key={member.userId} className="flex flex-wrap items-center gap-2 px-3 py-3">
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{memberLabel(member, index + 1)}</span><span className="mt-0.5 block text-xs text-muted">{roleLabel(member.role)} · desde {formatDate(member.joinedAt)}</span></span>
                {enabled && activeHousehold.role === "owner" && member.role !== "owner" ? <>
                  <select aria-label={`Papel de ${memberLabel(member, index + 1)}`} disabled={busy} value={member.role} onChange={(event) => { const role = event.target.value as HouseholdRole; void perform(() => changeHouseholdMemberRole(activeHousehold.id, member.userId, role), "Papel atualizado."); }} className="min-h-10 rounded-[8px] border border-line bg-canvas px-2 text-xs text-ink"><option value="member">Membro</option><option value="admin">Administrador</option></select>
                  <button type="button" disabled={busy} onClick={() => { if (window.confirm(`Transferir a propriedade para ${memberLabel(member, index + 1)}? Você passará a administrador.`)) void perform(() => transferHouseholdOwnership(activeHousehold.id, member.userId), "Propriedade transferida."); }} className="min-h-10 px-2 text-xs font-semibold text-primary">Transferir</button>
                  <button type="button" disabled={busy} onClick={() => { if (window.confirm(`Remover ${memberLabel(member, index + 1)} desta casa?`)) void perform(() => removeHouseholdMember(activeHousehold.id, member.userId), "Pessoa removida da casa."); }} className="min-h-10 px-2 text-xs font-semibold text-terracotta">Remover</button>
                </> : enabled && activeHousehold.role === "admin" && member.role === "member" && !member.isSelf ? <button type="button" disabled={busy} onClick={() => { if (window.confirm(`Remover ${memberLabel(member, index + 1)} desta casa?`)) void perform(() => removeHouseholdMember(activeHousehold.id, member.userId), "Pessoa removida da casa."); }} className="min-h-10 px-2 text-xs font-semibold text-terracotta">Remover</button> : null}
              </li>)}
            </ul> : <p className="py-4 text-sm text-muted">Não foi possível carregar as pessoas desta casa.</p>}
            {enabled && members.some((member) => member.isSelf) ? <button type="button" disabled={busy} onClick={() => { if (window.confirm("Sair desta casa? Seu acesso aos dados será removido.")) void perform(() => leaveHousehold(activeHousehold.id), "Você saiu da casa.").then((left) => { if (left) onClose(); }); }} className="mt-3 min-h-11 text-sm font-semibold text-terracotta">Sair desta casa</button> : null}
            {activeHousehold.role === "owner" && members.filter((member) => member.role === "owner").length === 1 ? <p className="mt-2 text-xs leading-5 text-muted">A última pessoa proprietária precisa transferir a propriedade antes de sair.</p> : null}
          </section>

          {canInvite && enabled ? <section>
            <h3 className="mb-3 text-sm font-semibold text-ink">Convites recentes</h3>
            {invites.length ? <ul className="divide-y divide-line rounded-[10px] border border-line bg-surface">
              {invites.map((invite) => {
                const status = inviteStatus(invite);
                return <li key={invite.id} className="flex items-center gap-3 px-3 py-3"><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{status}</span><span className="mt-0.5 block text-xs text-muted">Criado em {formatDate(invite.createdAt)} · vence em {formatDate(invite.expiresAt)}</span></span>{status === "Ativo" ? <button type="button" disabled={busy} onClick={() => void perform(() => revokeHouseholdInvite(invite.id), "Convite revogado.")} className="min-h-10 px-2 text-xs font-semibold text-terracotta">Revogar</button> : null}</li>;
              })}
            </ul> : <p className="text-sm text-muted">Nenhum convite encontrado.</p>}
            <p className="mt-2 text-xs leading-5 text-muted">Os convites duram 14 dias, só podem ser usados uma vez e seus tokens não aparecem nesta lista.</p>
          </section> : null}
        </div>
      </section>
    </div>
  );
}
