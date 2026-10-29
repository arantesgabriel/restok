import { Pencil } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import styles from "./products.module.css";

export function ProductRow({product,onToggle,onEdit}:{product:Product;onToggle:()=>void;onEdit:()=>void}) {
  return <article className={styles.row} data-product-row>
    <div className={styles.identity}><p className={styles.name}>{product.name}</p><p className={styles.meta}>{product.active ? product.category : `Inativo · ${product.category}`} · {product.defaultQuantity} un.</p></div>
    <div className={styles.rowActions}><IconButton label={`Editar ${product.name}`} onClick={onEdit}><Pencil size={17}/></IconButton><Button variant="secondary" data-product-toggle-id={product.id} aria-label={`${product.active ? "Desativar" : "Ativar"} ${product.name}`} onClick={onToggle}>{product.active ? "Desativar" : "Ativar"}</Button></div>
  </article>;
}
