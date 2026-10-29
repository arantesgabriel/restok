"use client";
import { Button } from "@/components/ui/button";
import { MoneyField } from "@/components/ui/money-field";
import { Sheet } from "@/components/ui/sheet";
import { moneyInput,parseMoney } from "@/lib/money";
import { type ShoppingList } from "@/lib/types";
import { Check } from "lucide-react";
import { useId,useState,type FormEvent } from "react";
import styles from "./purchase-sheets.module.css";
export function BudgetEditorSheet({ list, onClose, onSave }: { list: ShoppingList; onClose: () => boolean; onSave: (budget: number) => void }) {
  const formId = useId();
  const [budget, setBudget] = useState(moneyInput(list.budget));
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = parseMoney(budget);
    if (!parsed.ok || parsed.value === undefined) { setError("Informe um orçamento válido, igual ou maior que zero."); return; }
    if (onClose()) onSave(parsed.value);
  };
  return <Sheet title="Meta da compra" description="Ajuste o limite para esta ida ao mercado." onClose={onClose} footer={<Button type="submit" form={formId} className={styles.full}>Salvar meta <Check size={17} /></Button>}>
    <form id={formId} onSubmit={submit} noValidate className={styles.form}>
      <MoneyField label="Orçamento da compra" value={budget} onValueChange={(value) => { setBudget(value); setError(""); }} required initialFocus error={error || undefined} />

    </form>
  </Sheet>;
}

