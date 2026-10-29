import type { HouseholdInvite, HouseholdMember, HouseholdRole } from "@/lib/types";

export const roleLabel = (role: HouseholdRole) => role === "owner" ? "Proprietário" : role === "admin" ? "Administrador" : "Membro";
export const formatDate = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
export const memberLabel = (member: HouseholdMember) => member.isSelf ? "Você" : member.displayName?.trim() || "Nome não informado";
export const memberContext = (member: HouseholdMember) => `${memberLabel(member)} · ${roleLabel(member.role)} · desde ${formatDate(member.joinedAt)}`;

export function memberPermissions(role: HouseholdRole, member: HouseholdMember) {
  const identified = Boolean(member.displayName?.trim());
  return {
    changeRole: role === "owner" && !member.isSelf && identified && member.role !== "owner",
    transfer: role === "owner" && !member.isSelf && identified && member.role !== "owner",
    remove: !member.isSelf && identified && (role === "owner" && member.role !== "owner" || role === "admin" && member.role === "member"),
  };
}

export function inviteStatus(invite: HouseholdInvite, now = Date.now()) {
  if (invite.revokedAt) return "Revogado";
  if (invite.consumedAt) return "Usado";
  return Date.parse(invite.expiresAt) <= now ? "Expirado" : "Ativo";
}
