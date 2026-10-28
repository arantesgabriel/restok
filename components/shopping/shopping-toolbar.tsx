import { ArrowDownAZ, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { statusLabel } from "@/lib/utils";
import type { useShoppingView } from "./use-shopping-view";
import styles from "./shopping.module.css";
export function ShoppingToolbar({view}:{view:ReturnType<typeof useShoppingView>}) {
  return <div className={styles.toolbar}><div className={styles.searchRow}><SearchField label="Buscar na lista" value={view.query} onValueChange={view.setQuery}/><div role="group" aria-label="Ordenar itens da compra" className={styles.modes}><IconButton label="Categoria" aria-pressed={view.shopViewMode==="category"} onClick={()=>view.setShopViewMode("category")}><ListFilter size={19}/></IconButton><IconButton label="A–Z" aria-pressed={view.shopViewMode==="alphabetical"} onClick={()=>view.setShopViewMode("alphabetical")}><ArrowDownAZ size={19}/></IconButton></div></div><div role="group" aria-label="Filtros da lista" className={styles.filters}>{(["all","pending","purchased","already_have"] as const).map(value=><Button key={value} variant="quiet" className={styles.filter} aria-pressed={view.filter===value} onClick={()=>view.setFilter(value)}>{value==="all"?"Todos":statusLabel(value)}</Button>)}</div></div>;
}
