"use client";
import { useId, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { QuantityField } from "@/components/ui/quantity-field";
import { CATEGORY_ORDER, type CategoryName, type Product } from "@/lib/types";
import { isValidQuantity } from "@/lib/quantity";
import styles from "./products.module.css";

export function ProductEditorSheet({product,onClose,onSave}:{product?:Product;onClose:()=>boolean;onSave:(product:Omit<Product,"id"|"active">,id?:string)=>void}) {
  const formId=useId();
  const [name,setName]=useState(product?.name??"");
  const [category,setCategory]=useState<CategoryName>(product?.category??"Alimentos");
  const [quantity,setQuantity]=useState(product?.defaultQuantity??1);
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(name.trim()&&isValidQuantity(quantity)&&onClose())onSave({name:name.trim(),category,defaultQuantity:quantity},product?.id);};
  return <Sheet title={product?"Editar produto":"Novo produto da casa"} description="Nome, categoria e quantidade para as próximas compras." onClose={onClose} footer={<Button className={styles.full} type="submit" form={formId}>Salvar produto <Check size={17}/></Button>}>
    <form id={formId} className={styles.form} onSubmit={submit}><Field label="Nome" initialFocus required value={name} onChange={event=>setName(event.target.value)} placeholder="Ex.: Café"/><Select label="Categoria" value={category} onChange={event=>setCategory(event.target.value as CategoryName)}>{CATEGORY_ORDER.map(option=><option key={option}>{option}</option>)}</Select><div><p className={styles.quantityLabel}>Quantidade padrão</p><QuantityField quantity={quantity} onChange={setQuantity}/></div></form>
  </Sheet>;
}
