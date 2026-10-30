import { Check, Circle, House } from "lucide-react";
import type { ItemStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { OptionGroup } from "@/components/ui/option-group";
import styles from "./shopping-controls.module.css";
import shoppingStyles from "./shopping.module.css";

export function StatusToggle({ value, onChange }: { value: ItemStatus; onChange: (value: ItemStatus) => void }) {
  return (
    <div className="restok-theme">
      <p>Situação</p>
      <OptionGroup
        label="Situação"
        value={value}
        onChange={onChange}
        options={(["pending", "purchased", "already_have"] as const).map((status) => ({ value: status, label: statusLabel(status) }))}
      />
    </div>
  );
}

export function ShoppingStatusButton({
  name,
  status,
  onPurchased,
  onUndo,
}: {
  name: string;
  status: ItemStatus;
  onPurchased: () => void;
  onUndo: () => void;
}) {
  const Icon = status === "already_have" ? House : Check;
  const label = status === "purchased" ? `Desfazer situação de ${name}` : `Marcar ${name} como comprado`;

  return (
    <IconButton
      className={shoppingStyles.statusButton}
      label={label}
      aria-pressed={status === "purchased"}
      onClick={status === "purchased" ? onUndo : onPurchased}
    >
      <span className={shoppingStyles.statusMark}><Icon size={15} strokeWidth={1.75} aria-hidden="true" /></span>
    </IconButton>
  );
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const Icon = status === "purchased" ? Check : status === "already_have" ? House : Circle;

  return (
    <span className={`restok-theme ${styles.badge}`} data-status={status}>
      <Icon size={14} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}
