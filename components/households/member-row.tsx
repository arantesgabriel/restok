import type { HouseholdMember, HouseholdRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatDate, memberContext, memberLabel, memberPermissions, roleLabel } from "./household-model";
import styles from "./households.module.css";

export type MemberAction = { kind: "remove" | "transfer"; member: HouseholdMember } | { kind: "role"; member: HouseholdMember; role: HouseholdRole };

export function MemberRow({ member, role, busy, enabled, onAction }: { member: HouseholdMember; role: HouseholdRole; busy: boolean; enabled: boolean; onAction: (action: MemberAction, trigger: HTMLElement) => void }) {
  const permissions = memberPermissions(role, member);
  const context = memberContext(member);
  return <li className={styles.member}>
    <div className={styles.identity}><p className={styles.name}>{member.isSelf && member.displayName?.trim() ? member.displayName.trim() : memberLabel(member)}</p><p className={styles.meta}>{member.isSelf && member.displayName?.trim() ? <><span>Você</span> · </> : null}{roleLabel(member.role)} · desde {formatDate(member.joinedAt)}</p></div>
    {!member.isSelf && !member.displayName?.trim() ? <p className={styles.meta}>Peça à pessoa que complete o nome no perfil antes de alterar seu acesso.</p> : null}
    {enabled && (permissions.changeRole || permissions.remove || permissions.transfer) ? <div className={styles.memberActions}>
      {permissions.changeRole ? <div className={styles.roleControl}><Select label="Papel" aria-label={`Papel de ${context}`} disabled={busy} value={member.role} onChange={event => onAction({kind:"role",member,role:event.target.value as HouseholdRole},event.currentTarget)}><option value="member">Membro</option><option value="admin">Administrador</option></Select></div> : null}
      {permissions.transfer ? <Button variant="secondary" disabled={busy} aria-label={`Transferir propriedade para ${context}`} onClick={event => onAction({kind:"transfer",member},event.currentTarget)}>Transferir</Button> : null}
      {permissions.remove ? <Button variant="quiet" className={styles.dangerText} disabled={busy} aria-label={`Remover ${context} desta casa`} onClick={event => onAction({kind:"remove",member},event.currentTarget)}>Remover</Button> : null}
    </div> : null}
  </li>;
}
