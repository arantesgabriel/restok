import { ArrowDownAZ, ListFilter } from "lucide-react";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { statusLabel } from "@/lib/utils";
import type { useShoppingView } from "./use-shopping-view";
import styles from "./shopping.module.css";

export function ShoppingToolbar({ view }: { view: ReturnType<typeof useShoppingView> }) {
  const modeIsCategory = view.shopViewMode === "category";

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchRow}>
        <SearchField label="Buscar na lista" value={view.query} onValueChange={view.setQuery} />
        <ActionMenu
          label={`Organizar lista — atualmente ${modeIsCategory ? "por categoria" : "por nome A–Z"}`}
          triggerClassName={styles.organize}
          items={[
            modeIsCategory
              ? { label: "Ordenar por nome A–Z", icon: <ArrowDownAZ size={16} />, onSelect: () => view.setShopViewMode("alphabetical") }
              : { label: "Agrupar por categoria", icon: <ListFilter size={16} />, onSelect: () => view.setShopViewMode("category") },
          ]}
        >
          {modeIsCategory ? <ListFilter size={18} aria-hidden="true" /> : <ArrowDownAZ size={18} aria-hidden="true" />}
          <span>Organizar</span>
        </ActionMenu>
      </div>
      <div role="group" aria-label="Filtros da lista" className={styles.filters}>
        {(["all", "pending", "purchased", "already_have"] as const).map((value) => (
          <Button
            key={value}
            variant="quiet"
            className={styles.filter}
            aria-pressed={view.filter === value}
            onClick={() => view.setFilter(value)}
          >
            {value === "all" ? "Todos" : statusLabel(value)}
          </Button>
        ))}
      </div>
    </div>
  );
}
