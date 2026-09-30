"use client";

import { Check, ChevronDown, House, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { VisualSystemDialog } from "@/components/visual-system-dialog";
import { seedState } from "@/lib/seed";
import { CATEGORY_ORDER, type ItemStatus, type Product, type ShoppingItem } from "@/lib/types";
import { formatBRL, latestPriceFor, makeId, statusAfterPrice, statusLabel } from "@/lib/utils";

export type ProofEditor = { kind: "item"; item?: ShoppingItem } | { kind: "product"; product?: Product };

export function VisualSystemEditor({ editor, onClose, onSaveItem, onSaveProduct }: {
  editor: ProofEditor;
  onClose: () => void;
  onSaveItem: (item: ShoppingItem, addToHome: boolean) => void;
  onSaveProduct: (product: Product) => void;
}) {
  const item = editor.kind === "item" ? editor.item : undefined;
  const product = editor.kind === "product" ? editor.product : undefined;
  const [name, setName] = useState(item?.name ?? product?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? product?.category ?? (editor.kind === "product" ? "Alimentos" : "Outros"));
  const [quantity, setQuantity] = useState(item?.quantity ?? product?.defaultQuantity ?? 1);
  const [price, setPrice] = useState(item?.unitPrice?.toFixed(2).replace(".", ",") ?? "");
  const [status, setStatus] = useState<ItemStatus>(item?.status ?? "pending");
  const [addToHome, setAddToHome] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const previous = latestPriceFor(item?.productId, seedState.lists);
  const numericPrice = Number(price.replace(",", "."));
  const title = editor.kind === "product" ? product ? "Editar produto da casa" : "Novo produto da casa" : item?.name ?? "Adicionar item";
  const nameFields = <>
    <label className="proof-field">Nome do produto<input required data-initial-focus={editor.kind === "product" || !item ? "true" : undefined} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "proof-name-error" : undefined} placeholder="Ex.: Café" /></label>
    {errors.name ? <p id="proof-name-error" className="proof-error" role="alert">{errors.name}</p> : null}
    <label className="proof-field">Categoria<select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{CATEGORY_ORDER.map((value) => <option key={value}>{value}</option>)}</select></label>
  </>;

  return <VisualSystemDialog title={title} description={editor.kind === "product" ? "Um ponto de partida para as próximas compras." : "Ajuste quantidade, preço e situação."} onClose={onClose}>
    {(close) => <form className="proof-editor" onSubmit={(event) => {
      event.preventDefault();
      if (!name.trim()) {
        setErrors({ name: "Informe o nome do produto." });
        const field = event.currentTarget.querySelector<HTMLInputElement>("input[required]");
        const details = field?.closest("details");
        if (details) details.open = true;
        field?.focus();
        return;
      }
      if (editor.kind === "item" && (!Number.isFinite(numericPrice) || numericPrice < 0)) { setErrors({ price: "Use um preço como 12,50." }); event.currentTarget.querySelector<HTMLInputElement>('input[inputmode="decimal"]')?.focus(); return; }
      if (editor.kind === "product") onSaveProduct({ id: product?.id ?? makeId("product"), name: name.trim(), category, defaultQuantity: quantity, active: product?.active ?? true });
      else onSaveItem({ id: item?.id ?? makeId("item"), productId: item?.productId, name: name.trim(), category, quantity, sortOrder: item?.sortOrder ?? 0, status: statusAfterPrice(status, numericPrice), unitPrice: numericPrice > 0 ? Number(numericPrice.toFixed(2)) : undefined }, addToHome);
      close();
    }}>
      {editor.kind === "product" || !item ? nameFields : null}
      <label className="proof-field">{editor.kind === "product" ? "Quantidade padrão" : "Quantidade"}<span className="proof-stepper"><button type="button" className="proof-icon" aria-label="Diminuir quantidade" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={18} /></button><input aria-label="Quantidade" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value.replace(/\D/g, "")) || 1))} /><button type="button" className="proof-icon" aria-label="Aumentar quantidade" onClick={() => setQuantity((value) => value + 1)}><Plus size={18} /></button></span></label>
      {editor.kind === "item" ? <>
        <label className="proof-field">Preço unitário <span className="proof-optional">opcional</span><span className="proof-price-input"><span aria-hidden="true">R$</span><input data-initial-focus={item ? "true" : undefined} inputMode="decimal" value={price} onChange={(event) => { setPrice(event.target.value); setErrors({}); }} placeholder="0,00" aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? "proof-price-error" : previous ? "proof-previous-price" : undefined} /></span></label>
        {errors.price ? <p id="proof-price-error" className="proof-error" role="alert">{errors.price}</p> : previous ? <p id="proof-previous-price" className="proof-helper">Último preço: {formatBRL(previous)} por unidade</p> : null}
        <fieldset className="proof-status"><legend>Situação</legend><div>{(["pending", "purchased", "already_have"] as ItemStatus[]).map((value) => <button type="button" key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{value === "purchased" ? <Check size={16} /> : value === "already_have" ? <House size={16} /> : null}{statusLabel(value)}</button>)}</div></fieldset>
        {item ? <details className="proof-details"><summary>Nome e categoria<ChevronDown size={16} /></summary><div>{nameFields}</div></details> : <label className="proof-check-label"><input type="checkbox" checked={addToHome} onChange={(event) => setAddToHome(event.target.checked)} />Guardar nos produtos da casa</label>}
      </> : null}
      <button type="submit" className="proof-button proof-save"><Check size={18} />{editor.kind === "product" ? "Salvar produto" : numericPrice > 0 && status !== "already_have" ? "Adicionar ao carrinho" : "Salvar item"}</button>
    </form>}
  </VisualSystemDialog>;
}
