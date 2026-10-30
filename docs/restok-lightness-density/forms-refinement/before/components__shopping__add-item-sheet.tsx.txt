"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { MoneyField } from "@/components/ui/money-field";
import { QuantityField as QuantityStepper } from "@/components/ui/quantity-field";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { parseMoney } from "@/lib/money";
import { isValidQuantity } from "@/lib/quantity";
import { CATEGORY_ORDER,type CategoryName,type ShoppingItem } from "@/lib/types";
import { Plus } from "lucide-react";
import { useId,useState,type FormEvent } from "react";
import styles from "./purchase-sheets.module.css";
const categoryOptions: CategoryName[] = [...CATEGORY_ORDER];
export function AddItemSheet({
  onClose,
  onAdd,
}: {
  onClose: () => boolean;
  onAdd: (item: Omit<ShoppingItem, "id" | "sortOrder">, addToHome: boolean) => void;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<CategoryName>("Outros");
  const [addToHome, setAddToHome] = useState(false);
  const [error, setError] = useState("");
  const parsedPrice = parseMoney(price);
  const numericPrice = parsedPrice.ok ? parsedPrice.value : undefined;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) { setError("Informe o nome do produto."); return; }
    if (!parsedPrice.ok) { setError("Informe um preço válido, igual ou maior que zero, com até duas casas decimais."); return; }
    if (!isValidQuantity(quantity)) return;
    if (!onClose()) return;
    onAdd({ name: name.trim(), quantity: Math.max(1, quantity), category, unitPrice: numericPrice, status: numericPrice !== undefined ? "purchased" : "pending" }, addToHome);
  };
  return <Sheet title="Adicionar item" description="Inclua aquele produto que não estava na lista." onClose={onClose} footer={<Button type="submit" form={formId} className={styles.full}><Plus size={17} />Adicionar à compra</Button>}>
    <form id={formId} onSubmit={submit} className={styles.form}>
      {error && !error.startsWith("Informe um preço") ? <p role="alert" className={styles.error}>{error}</p> : null}
      <Field label="Nome do produto" initialFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Iogurte natural"  />
      <div className={styles.fields}>
        <label className={styles.label}>Quantidade<div className={styles.quantityControl}><QuantityStepper quantity={quantity} onChange={setQuantity} /></div></label>
        <Select label="Categoria" value={category} onChange={(event) => setCategory(event.target.value as CategoryName)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</Select>
      </div>
      <MoneyField label="Preço unitário (opcional)" value={price} onValueChange={(value) => { setPrice(value); setError(""); }} error={error.startsWith("Informe um preço") ? error : undefined} hint="Vazio deixa o item pendente. Zero é um preço conhecido." />
      <Checkbox checked={addToHome} onChange={(event) => setAddToHome(event.target.checked)}>Adicionar aos produtos da casa<span className={styles.hint}>Fica disponível na próxima compra.</span></Checkbox>

    </form>
  </Sheet>;
}

