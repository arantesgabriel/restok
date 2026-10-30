"use client";
import { useEffect, useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { isValidQuantity, parseQuantity } from "@/lib/quantity";
import { RestokTheme } from "./theme";
import styles from "./numeric-fields.module.css";

export function QuantityField({ quantity, onChange, compact: _compact }: { quantity: number; onChange: (quantity: number) => void; compact?: boolean }) {
  const [raw, setRaw] = useState(String(quantity));
  const id = useId();
  useEffect(() => { if (isValidQuantity(quantity)) setRaw(String(quantity)); }, [quantity]);
  const valid = isValidQuantity(parseQuantity(raw));
  return <RestokTheme className={styles.field}>
    <div className={styles.quantity}>
      <button className={styles.step} type="button" aria-label="Diminuir quantidade" disabled={!valid || quantity <= 1} onClick={() => onChange(quantity - 1)}><Minus size={18} aria-hidden="true" /></button>
      <input id={id} name={id} aria-label="Quantidade" inputMode="numeric" autoComplete="off" value={raw} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} className={styles.input} onChange={(event) => { setRaw(event.target.value); onChange(parseQuantity(event.target.value)); }} />
      <button className={styles.step} type="button" aria-label="Aumentar quantidade" disabled={!valid || !isValidQuantity(quantity + 1)} onClick={() => onChange(quantity + 1)}><Plus size={18} aria-hidden="true" /></button>
    </div>
    {!valid ? <p id={`${id}-error`} role="alert" className={styles.error}>Use uma quantidade inteira a partir de 1, dentro da precisão numérica.</p> : null}
  </RestokTheme>;
}
