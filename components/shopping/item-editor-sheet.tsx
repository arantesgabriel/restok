"use client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { MoneyField } from "@/components/ui/money-field";
import { QuantityField as QuantityStepper } from "@/components/ui/quantity-field";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { moneyInput,parseMoney } from "@/lib/money";
import { isValidQuantity } from "@/lib/quantity";
import { CATEGORY_ORDER,type CategoryName,type ItemStatus,type ShoppingItem,type ShoppingList } from "@/lib/types";
import { formatBRL,latestPriceFor,statusAfterPrice } from "@/lib/utils";
import { Check,ChevronDown } from "lucide-react";
import { useId,useState,type FormEvent } from "react";
import styles from "./purchase-sheets.module.css";
import { StatusToggle } from "./status-toggle";
const categoryOptions: CategoryName[] = [...CATEGORY_ORDER];
export function ItemEditorSheet({
  item,
  lists,
  onClose,
  onSave,
}: {
  item: ShoppingItem;
  lists: ShoppingList[];
  onClose: () => boolean;
  onSave: (item: ShoppingItem) => void;
}) {
  const formId = useId();
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(moneyInput(item.unitPrice));
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<CategoryName>(item.category);
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const [error, setError] = useState("");
  const [statusChanged, setStatusChanged] = useState(false);
  const previous = latestPriceFor(item.productId, lists);
  const parsedPrice = parseMoney(price);
  const numericPrice = parsedPrice.ok ? parsedPrice.value : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!parsedPrice.ok) { setError("Informe um preço válido, igual ou maior que zero, com até duas casas decimais."); return; }
    if (!isValidQuantity(quantity)) return;
    if (!onClose()) return;
    const nextStatus = statusChanged ? status : statusAfterPrice(status, numericPrice);
    onSave({ ...item, name: name.trim() || item.name, category, quantity: Math.max(1, quantity), unitPrice: numericPrice, status: nextStatus });
  };

  return <Sheet formLayout title={item.name} description="Atualize rápido enquanto você anda pelo mercado." onClose={onClose} footer={<Button type="submit" form={formId} className={styles.full}>{!statusChanged && numericPrice !== undefined && parsedPrice.ok && status === "pending" ? "Adicionar ao carrinho" : status === "purchased" ? "Atualizar carrinho" : "Salvar item"}<Check size={17} /></Button>}>
    <form id={formId} onSubmit={submit} className={styles.form}>
      {error && !error.startsWith("Informe um preço") ? <p role="alert" className={styles.error}>{error}</p> : null}
      <div className={styles.quantity}>
        <div><p className={styles.label}>Quantidade</p><p className={styles.hint}>Ajuste antes de salvar</p></div>
        <QuantityStepper quantity={quantity} onChange={setQuantity} />
      </div>
      <MoneyField label="Preço unitário" value={price} onValueChange={(value) => { setPrice(value); setError(""); }} initialFocus error={error.startsWith("Informe um preço") ? error : undefined} hint={previous !== undefined ? `Anterior ${formatBRL(previous)} por unidade. Ao informar um preço, o item vira comprado.` : "Ao informar um preço, inclusive zero, o item vira comprado."} />
      <StatusToggle value={status} onChange={(value) => { setStatus(value); setStatusChanged(true); }}/>
      <details className={styles.details}>
        <summary className={styles.summary}><span>Mais detalhes</span><ChevronDown size={16} className={styles.chevron} /></summary>
        <div className={styles.detailFields}>
          <Field label="Nome" value={name} onChange={(event) => setName(event.target.value)}  />
          <Select label="Categoria" value={category} onChange={(event) => setCategory(event.target.value as CategoryName)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</Select>
        </div>
      </details>

    </form>
  </Sheet>;
}

