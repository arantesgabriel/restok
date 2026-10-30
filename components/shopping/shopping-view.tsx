import type { RefObject } from "react";
import { CheckCircle2, MoreHorizontal, Plus, Search, ShoppingBasket } from "lucide-react";
import { CATEGORY_ORDER, type CategoryName, type ShoppingItem, type ShoppingList } from "@/lib/types";
import { listResolved, sortByName, statusLabel, type NameSortDirection } from "@/lib/utils";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BudgetSummary } from "./budget-summary";
import { CategorySection } from "./category-section";
import { ShoppingItemRow } from "./item-row";
import { ShoppingToolbar } from "./shopping-toolbar";
import type { useShoppingView } from "./use-shopping-view";
import styles from "./shopping.module.css";

type ShoppingViewProps = {
  list: ShoppingList;
  lists: ShoppingList[];
  view: ReturnType<typeof useShoppingView>;
  categorySort: Partial<Record<CategoryName, NameSortDirection>>;
  pending?: number;
  resultsRef: RefObject<HTMLDivElement | null>;
  onToggleSort: (category: CategoryName) => void;
  onPending?: () => void;
  onNew: () => void;
  onFinish: () => void;
  onBudget: () => void;
  onAdd: () => void;
  onEdit: (item: ShoppingItem) => void;
  onPurchased: (item: ShoppingItem) => void;
  onAlreadyHave: (item: ShoppingItem) => void;
  onUndo: (item: ShoppingItem) => void;
  onDelete?: (item: ShoppingItem) => void;
};

export function ShoppingView({
  list,
  lists,
  view,
  categorySort,
  pending,
  resultsRef,
  onToggleSort,
  onPending,
  onNew,
  onFinish,
  onBudget,
  onAdd,
  onEdit,
  onPurchased,
  onAlreadyHave,
  onUndo,
  onDelete,
}: ShoppingViewProps) {
  const clear = () => {
    view.setQuery("");
    view.setFilter("all");
  };
  const pendingCount = pending ?? list.items.filter((item) => item.status === "pending").length;
  const purchasedCount = list.items.filter(item => item.status === "purchased").length;
  const started = new Date(list.startedAt);
  const formattedDate = Number.isNaN(started.getTime()) ? null : new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(started).replace("-feira","");
  const dateLabel = formattedDate ? formattedDate[0].toLocaleUpperCase("pt-BR") + formattedDate.slice(1) : null;
  const showPending = () => {
    if (onPending) {
      onPending();
      return;
    }
    view.setQuery("");
    view.setFilter("pending");
    resultsRef.current?.scrollIntoView?.({ behavior: "auto", block: "start" });
  };

  return (
    <div data-shopping-view className={styles.view} data-empty-purchase={list.items.length === 0 ? "true" : undefined}>
      <div className={styles.heading}>
        <div>
          <h1 data-purchase-title>{list.name}</h1>
          <p className={styles.headingMeta}>{purchasedCount} de {list.items.length} comprados{dateLabel ? <> · <time dateTime={list.startedAt}>{dateLabel}</time></> : null}</p>
        </div>
        <div className={styles.headingActions}>
          <Button
            variant="quiet"
            data-resolved-count
            className={styles.count}
            disabled={pendingCount === 0}
            aria-label={pendingCount ? `Ver ${pendingCount} ${pendingCount === 1 ? "pendente" : "pendentes"}` : "Nenhum item pendente"}
            onClick={showPending}
          >{pendingCount} {pendingCount === 1 ? "pendente" : "pendentes"}<span className={styles.sr}> · {listResolved(list)} de {list.items.length} resolvidos</span></Button>
          <ActionMenu
            label="Menu da compra"
            triggerClassName={styles.purchaseMenu}
            items={[
              { label: "Nova compra", icon: <Plus size={16} />, onSelect: onNew },
              { label: "Finalizar compra", icon: <CheckCircle2 size={16} />, onSelect: onFinish },
            ]}
          >
            <MoreHorizontal size={20} strokeWidth={1.75} />
          </ActionMenu>
          <Button data-purchase-desktop-add className={styles.desktopAdd} onClick={onAdd}><Plus size={18} />Adicionar item</Button>
          <Button
            variant="quiet"
            data-purchase-desktop-finish
            className={styles.desktopFinish}
            onClick={onFinish}
          >
            Finalizar compra
          </Button>
        </div>
      </div>
      <BudgetSummary list={list} onEdit={onBudget} />
      <ShoppingToolbar view={view} />
      <div ref={resultsRef} data-purchase-results>
        <div className={styles.listHeading}><h2>Produtos <span aria-live="polite">· {view.filteredItems.length} {view.filteredItems.length === 1 ? "item" : "itens"}</span></h2><span>{view.shopViewMode === "category" ? "Por categoria" : view.shopViewMode === "alphabetical" ? "A–Z" : "Ordem da compra"}</span></div>
        {view.filteredItems.length ? (
          view.shopViewMode === "category" ? (
            <div className={styles.groups}>
              {CATEGORY_ORDER.map((category) => view.groups[category]?.length ? (
                <CategorySection
                  key={category}
                  category={category}
                  direction={categorySort[category] ?? "asc"}
                  items={sortByName(view.groups[category] ?? [], categorySort[category] ?? "asc")}
                  lists={lists}
                  onToggleSort={() => onToggleSort(category)}
                  onEdit={onEdit}
                  onPurchased={onPurchased}
                  onAlreadyHave={onAlreadyHave}
                  onUndo={onUndo}
                  onDelete={onDelete}
                />
              ) : null)}
            </div>
          ) : (
            <div data-purchase-list className={`${styles.rowsSurface} ${styles.alphabetical}`}>
              {(view.shopViewMode === "list" ? view.orderedItems : view.alphabeticalItems).map((item) => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  lists={lists}
                  onEdit={() => onEdit(item)}
                  onPurchased={() => onPurchased(item)}
                  onAlreadyHave={() => onAlreadyHave(item)}
                  onUndo={() => onUndo(item)}
                  onDelete={onDelete ? () => onDelete(item) : undefined}
                />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            variant={list.items.length ? "compact" : "first-use"}
            icon={list.items.length ? <Search size={24} /> : <ShoppingBasket size={24} />}
            title={
              !list.items.length
                ? "Sua lista ainda está vazia"
                : view.query.trim()
                  ? "Nenhum item encontrado"
                  : view.filter === "all"
                    ? "Nenhum item encontrado"
                    : `Nenhum item em ${statusLabel(view.filter).toLocaleLowerCase("pt-BR")}`
            }
            description={
              !list.items.length
                ? "Adicione itens para acompanhar a compra."
                : view.query.trim()
                  ? `Nada corresponde a “${view.query.trim()}”.`
                  : "Troque a situação selecionada para ver outros itens."
            }
            action={(
              <Button variant={list.items.length ? "secondary" : "primary"} onClick={list.items.length ? clear : onAdd}>
                {list.items.length
                  ? view.query.trim() ? "Limpar busca e filtros" : "Limpar filtro"
                  : "Adicionar item"}
              </Button>
            )}
          />
        )}
      </div>
      {list.items.length > 0 ? <p className={styles.bottomHint}>Toque na marcação para atualizar a compra. O ícone de casa indica “Já temos”.</p> : null}
    </div>
  );
}
