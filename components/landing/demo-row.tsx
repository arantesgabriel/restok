import { Check } from "lucide-react";
import type { ShoppingItem } from "@/lib/types";
import { formatBRL, itemSubtotal, statusLabel } from "@/lib/utils";

export function DemoRow({ item }: { item: ShoppingItem }) {
  const subtotal = itemSubtotal(item);
  return (
    <div className="landing-row">
      {item.status === "purchased" ? <Check size={16} aria-hidden="true" /> : <span className="landing-mark" aria-hidden="true" />}
      <span className="landing-row-copy">
        <span className="landing-row-name">{item.name}</span>
        <span className="landing-row-meta">{item.quantity} × {(item.unitPrice === undefined ? "Preço não informado" : formatBRL(item.unitPrice))} · {statusLabel(item.status)}</span>
      </span>
      <span className="landing-num">{item.status === "purchased" && item.unitPrice !== undefined ? formatBRL(subtotal) : "—"}</span>
    </div>
  );
}

