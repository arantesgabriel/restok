"use client";
import { useId } from "react";
import { RestokTheme } from "./theme";
import styles from "./numeric-fields.module.css";

export function MoneyField({ label, value, onValueChange, error, hint, required = false, initialFocus = false }: {
  label: string; value: string; onValueChange: (value: string) => void; error?: string; hint?: string; required?: boolean; initialFocus?: boolean;
}) {
  const id = useId();
  const description = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <RestokTheme className={styles.field}>
    <label htmlFor={id}>{label}</label>
    {hint ? <span id={`${id}-hint`} className={styles.hint}>{hint}</span> : null}
    <div className={styles.control}><span className={styles.prefix} aria-hidden="true">R$</span><input id={id} name={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={(event) => onValueChange(event.target.value)} required={required} data-initial-focus={initialFocus || undefined} aria-invalid={Boolean(error)} aria-describedby={description} placeholder="0,00" className={styles.input} /></div>
    {error ? <p id={`${id}-error`} role="alert" className={styles.error}>{error}</p> : null}
  </RestokTheme>;
}
