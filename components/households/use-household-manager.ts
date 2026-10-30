"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createHousehold, createHouseholdInvite, loadHouseholdInvites, loadHouseholdMembers } from "@/lib/supabase/data";
import type { HouseholdInvite, HouseholdMember, HouseholdSummary } from "@/lib/types";

export type ManagerProps = {
  households: HouseholdSummary[]; activeHousehold: HouseholdSummary; enabled: boolean; onClose: () => void;
  onSelect: (id: string) => Promise<boolean>; onCreated: (id: string) => Promise<boolean>;
  onMembershipChanged: () => Promise<void>; notify: (message: string) => void;
};

export function useHouseholdManager(props: ManagerProps) {
  const { activeHousehold, enabled, onSelect, onCreated, onClose, onMembershipChanged, notify } = props;
  const [members,setMembers] = useState<HouseholdMember[]>([]);
  const [invites,setInvites] = useState<HouseholdInvite[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState(false);
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const [createdLink,setCreatedLink] = useState("");
  const [pendingHouseholdId,setPendingHouseholdId] = useState<string | null>(null);
  const lock = useRef(false);
  const request = useRef(0);
  const canInvite = activeHousehold.role === "owner" || activeHousehold.role === "admin";

  const refresh = useCallback(async () => {
    const version = ++request.current;
    if (!enabled) { setMembers([]); setInvites([]); setLoadError(false); setLoading(false); return; }
    setLoading(true);
    try {
      const [nextMembers,nextInvites] = await Promise.all([loadHouseholdMembers(activeHousehold.id),canInvite ? loadHouseholdInvites(activeHousehold.id) : Promise.resolve([])]);
      if (version !== request.current) return;
      if (!nextMembers || !nextInvites) throw new Error("Household unavailable");
      setMembers(nextMembers); setInvites(nextInvites); setLoadError(false);
    } catch { if (version === request.current) { setMembers([]); setInvites([]); setLoadError(true); } }
    finally { if (version === request.current) setLoading(false); }
  },[activeHousehold.id,canInvite,enabled]);
  useEffect(() => { void refresh(); return () => { request.current++; }; },[refresh]);

  const run = async (job: () => Promise<boolean>, failure: string) => {
    if (lock.current) return false;
    lock.current = true; setBusy(true); setError("");
    try { const ok = await job(); if (!ok) setError(failure); return ok; }
    catch { setError(failure); return false; }
    finally { lock.current = false; setBusy(false); }
  };
  const select = (id: string) => run(async () => { const ok=await onSelect(id); if(ok) onClose(); return ok; },"Não foi possível carregar essa casa. A casa atual foi mantida. Tente novamente.");
  const activateCreated = async (id: string) => {
    const ok = await onCreated(id);
    if (ok) { setPendingHouseholdId(null); onClose(); }
    return ok;
  };
  const create = (name: string) => run(async () => {
    if (pendingHouseholdId) return activateCreated(pendingHouseholdId);
    const id = await createHousehold(name.trim());
    if (!id) return false;
    setPendingHouseholdId(id);
    return activateCreated(id);
  },"Não foi possível criar ou carregar a casa. Se ela já foi criada, tente carregá-la novamente abaixo.");
  const retryCreated = () => pendingHouseholdId ? run(() => activateCreated(pendingHouseholdId),"A casa está pronta, mas não carregou. Tente novamente.") : Promise.resolve(false);
  const perform = (action: () => Promise<boolean>, success: string) => run(async () => {
    if (!await action()) return false;
    notify(success); await refresh(); await onMembershipChanged(); return true;
  },"Não foi possível concluir a alteração. Confira sua permissão e tente novamente.");
  const makeInvite = () => run(async () => {
    const token = await createHouseholdInvite(activeHousehold.id);
    if (!token) return false;
    const link = `${window.location.origin}/app?invite=${encodeURIComponent(token)}`;
    setCreatedLink(link);
    try { await navigator.clipboard.writeText(link); notify("Convite criado e copiado. Ele vale por 14 dias e só pode ser usado uma vez."); }
    catch { notify("Convite criado. Copie o link exibido abaixo; ele vale por 14 dias e só pode ser usado uma vez."); }
    await refresh(); return true;
  },"Não foi possível criar o convite. Confira sua permissão e se já não existem 10 convites ativos.");
  const copyInvite = async () => {
    try { await navigator.clipboard.writeText(createdLink); notify("Convite copiado."); }
    catch { setError("Selecione e copie o link do convite."); }
  };
  const lastOwner = activeHousehold.role === "owner" && members.filter(member => member.role === "owner").length === 1;
  return {members,invites,loading,loadError,error,busy,canInvite,createdLink,setCreatedLink,pendingHouseholdId,refresh,select,create,retryCreated,perform,makeInvite,copyInvite,lastOwner};
}
