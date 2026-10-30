import { Plus, Power } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import type { Product } from "@/lib/types";
import styles from "./products.module.css";

export function ProductRow({product,onToggle,onEdit,onAdd}:{product:Product;onToggle:()=>void;onEdit:()=>void;onAdd?:()=>void}) {
  return <article className={styles.row} data-product-row>
    <button type="button" aria-label={`Editar ${product.name}`} onClick={onEdit} className={styles.identity}><span className={styles.name}>{product.name}</span><span className={styles.meta}>{product.active ? product.category : `Inativo · ${product.category}`} · {product.defaultQuantity} un.</span></button>
    <div className={styles.rowActions}><IconButton label={`${product.active ? "Desativar" : "Ativar"} ${product.name}`} variant="bordered" data-product-toggle-id={product.id} onClick={onToggle}><Power size={16}/></IconButton>{product.active && onAdd ? <IconButton className={styles.addToPurchase} label={`Adicionar ${product.name} à compra`} onClick={onAdd}><Plus size={18}/></IconButton> : null}</div>
  </article>;
}
