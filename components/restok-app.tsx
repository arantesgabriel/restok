"use client";

import {
  ArrowDown,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  House,
  ListFilter,
  LogOut,
  Menu,
  Minus,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Undo2,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AccessibleDialog } from "@/components/accessible-dialog";
import { seedState } from "@/lib/seed";
import { HouseholdManager } from "@/components/household-manager";
import { HouseholdOnboarding } from "@/components/household-onboarding";
import { subscribeToShoppingList, type RealtimeConnectionStatus } from "@/lib/supabase/realtime";
import { acceptHouseholdInvite, activeHouseholdStorageKey, createShoppingListWithItems, loadCurrentProfile, loadRemoteState, loadUserHouseholds, persistList, persistProduct, resolveRemoteContext, type RemoteWriteResult } from "@/lib/supabase/data";
import { clearRemoteStateCaches, DEMO_STATE_KEY, LEGACY_REMOTE_STATE_KEY, remoteStateStorageKey } from "@/lib/supabase/cache";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CATEGORY_ORDER, type CategoryName, type HouseholdSummary, type ItemStatus, type Product, type RestokState, type ShoppingItem, type ShoppingList } from "@/lib/types";
import {
  categoryIcon,
  categoryNameSortKey,
  cn,
  formatBRL,
  formatPercent,
  groupItems,
  nextSortOrder,
  itemSubtotal,
  latestPriceFor,
  listPending,
  listResolved,
  listTotal,
  monthLabel,
  type NameSortDirection,
  readCategoryNameSorts,
  sortByName,
  statusAfterPrice,
  shortDate,
  statusLabel,
  makeId,
} from "@/lib/utils";

type AppScreen = "shop" | "history" | "home";
type Filter = "all" | "pending" | "purchased" | "already_have";
type ProductViewMode = "category" | "alphabetical";
type WriteOperation = { key: string; token: string; label: string; status: "pending" | "failed"; retry: () => void };

const categoryOptions: CategoryName[] = [...CATEGORY_ORDER];

function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-primary text-white shadow-[0_3px_0_oklch(0.31_0.08_152)] hover:-translate-y-px hover:bg-primary-strong active:translate-y-px",
        variant === "secondary" && "border border-line bg-surface text-ink hover:border-primary/40 hover:bg-sage/50",
        variant === "quiet" && "text-muted hover:bg-sage/60 hover:text-ink",
        variant === "danger" && "border border-terracotta/30 bg-terracotta/10 text-terracotta hover:bg-terracotta/15",
        className,
      )}
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className,
  variant = "quiet",
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "quiet" | "bordered";
}) {
  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-[10px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "quiet" && "text-muted hover:bg-sage hover:text-ink",
        variant === "bordered" && "border border-line bg-surface text-muted hover:border-primary/40 hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Sheet({
  title,
  description,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <AccessibleDialog
      titleId="sheet-title"
      onClose={onClose}
      className="fixed inset-0 z-modal m-0 flex h-dvh w-screen max-h-none max-w-none items-end justify-center overflow-hidden border-0 bg-transparent p-0 backdrop:bg-ink/35 sm:items-center sm:p-6"
    >
      <section
        className={cn(
          "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[22px] border border-line bg-canvas px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 shadow-sheet sm:max-h-[90vh] sm:rounded-[18px] sm:px-7 sm:pb-7",
          wide ? "max-w-2xl" : "max-w-lg",
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="sheet-title" className="text-xl font-semibold tracking-[-0.02em] text-ink">{title}</h2>
            {description ? <p className="mt-1 max-w-md text-sm leading-6 text-muted">{description}</p> : null}
          </div>
          <IconButton label="Fechar" onClick={onClose} variant="bordered"><X size={18} /></IconButton>
        </div>
        {children}
      </section>
    </AccessibleDialog>
  );
}

function QuantityStepper({
  quantity,
  onChange,
  compact = false,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-[10px] border border-line bg-canvas p-0.5", compact && "gap-0")}>
      <button type="button" aria-label="Diminuir quantidade" className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-sage hover:text-ink" onClick={() => onChange(Math.max(1, quantity - 1))}><Minus size={16} /></button>
      <input
        aria-label="Quantidade"
        inputMode="numeric"
        value={quantity}
        onChange={(event) => onChange(Math.max(1, Number(event.target.value.replace(/\D/g, "")) || 1))}
        className="h-10 w-9 bg-transparent text-center text-sm font-semibold text-ink outline-none"
      />
      <button type="button" aria-label="Aumentar quantidade" className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-sage hover:text-ink" onClick={() => onChange(quantity + 1)}><Plus size={16} /></button>
    </div>
  );
}

function AppNavigation({ screen, onChange }: { screen: AppScreen; onChange: (screen: AppScreen) => void }) {
  const items: Array<{ id: AppScreen; label: string; icon: React.ReactNode }> = [
    { id: "shop", label: "Compra", icon: <ShoppingBasket size={19} /> },
    { id: "history", label: "Histórico", icon: <ListFilter size={19} /> },
    { id: "home", label: "Casa", icon: <House size={19} /> },
  ];
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-sticky border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      <div className="mx-auto flex max-w-5xl items-center justify-around px-2 py-2 sm:block sm:space-y-1 sm:px-0 sm:py-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={screen === item.id ? "page" : undefined}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex min-h-12 min-w-20 flex-col items-center justify-center gap-1 rounded-[10px] px-3 text-[11px] font-semibold transition sm:w-full sm:flex-row sm:justify-start sm:gap-3 sm:text-sm",
              screen === item.id ? "bg-primary text-white" : "text-muted hover:bg-sage hover:text-ink",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return <span className={cn("font-semibold tracking-[-0.04em] text-ink", compact ? "text-lg" : "text-[22px]")}>restok<span className="text-primary">.</span></span>;
}

function BudgetSummary({ list, onEdit }: { list: ShoppingList; onEdit: () => void }) {
  const total = listTotal(list);
  const percentage = list.budget > 0 ? Math.min((total / list.budget) * 100, 100) : 0;
  const over = total - list.budget;
  return (
    <section className={cn("rounded-[14px] border border-line bg-surface p-4", over > 0 && "border-terracotta/30 bg-terracotta/5")} aria-label="Resumo do orçamento">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Gasto até agora</p>
          <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-ink">{formatBRL(total)}</p>
        </div>
        <p className={cn("text-right text-sm font-semibold", over > 0 ? "text-terracotta" : "text-muted")}>
          {over > 0 ? `${formatBRL(over)} acima` : `${formatBRL(list.budget - total)} disponíveis`}
          <span className="mt-1 flex items-center justify-end gap-1 text-xs font-normal text-muted">de {formatBRL(list.budget)}<button type="button" onClick={onEdit} className="inline-flex min-h-7 items-center gap-1 rounded-md px-1.5 font-semibold text-primary hover:bg-sage" aria-label="Editar meta da compra" title="Editar meta da compra"><Pencil size={12} />Editar</button></span>
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-sage" aria-hidden="true"><div className={cn("h-full rounded-full transition-all duration-300", over > 0 ? "bg-terracotta" : "bg-primary")} style={{ width: `${percentage}%` }} /></div>
    </section>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  return <span className={cn("status-badge", `status-${status}`)}>{status === "purchased" ? <Check size={12} strokeWidth={3} /> : status === "already_have" ? <House size={12} /> : <Circle size={10} />}{statusLabel(status)}</span>;
}

function PreviousPrice({ item, lists }: { item: ShoppingItem; lists: ShoppingList[] }) {
  const previous = latestPriceFor(item.productId, lists);
  if (!previous || item.unitPrice === undefined) return null;
  const variation = (item.unitPrice - previous) / previous;
  if (Math.abs(variation) < 0.001) return <span className="text-xs text-muted">igual ao anterior</span>;
  return <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", variation > 0 ? "text-terracotta" : "text-primary")}>
    {variation > 0 ? <ArrowUp size={13} /> : <ArrowDown size={13} />}{formatPercent(Math.abs(variation))}
  </span>;
}

function ShoppingItemRow({
  item,
  lists,
  onEdit,
  onPurchased,
  onAlreadyHave,
  onUndo,
}: {
  item: ShoppingItem;
  lists: ShoppingList[];
  onEdit: () => void;
  onPurchased: () => void;
  onAlreadyHave: () => void;
  onUndo: () => void;
}) {
  const subtotal = itemSubtotal(item);
  return (
    <article className={cn("group flex min-h-[78px] items-center gap-3 border-b border-line/80 py-3 transition", item.status !== "pending" && "item-resolved")}>
      <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={onEdit} aria-label={`Editar ${item.name}`}>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border text-sm font-semibold", item.status === "purchased" ? "border-primary/30 bg-sage text-primary" : item.status === "already_have" ? "border-line bg-canvas text-muted" : "border-line bg-canvas text-muted group-hover:border-primary/30 group-hover:bg-sage/40")}>
          {item.status === "purchased" ? <Check size={18} strokeWidth={2.5} /> : item.status === "already_have" ? <House size={17} /> : <span>{categoryIcon(item.category)}</span>}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[15px] font-semibold text-ink", item.status !== "pending" && "text-muted line-through decoration-line/80")}>{item.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span>{item.quantity} un.</span>
            {item.status === "purchased" && item.unitPrice !== undefined ? <><span>·</span><span>{formatBRL(item.unitPrice)} un.</span><PreviousPrice item={item} lists={lists} /></> : <StatusBadge status={item.status} />}
          </span>
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1.5">
        {subtotal > 0 ? <span className="hidden text-right text-sm font-semibold text-ink sm:block">{formatBRL(subtotal)}</span> : null}
        {item.status === "pending" ? <><button type="button" aria-label={`Marcar ${item.name} como comprado`} title="Comprar" onClick={onPurchased} className="grid h-11 w-11 place-items-center rounded-[10px] text-primary transition hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Check size={18} strokeWidth={2.5} /></button><button type="button" aria-label={`Marcar ${item.name} como já temos`} title="Já temos" onClick={onAlreadyHave} className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition hover:bg-sage hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><House size={17} /></button></> : <button type="button" aria-label={`Desfazer situação de ${item.name}`} title="Desfazer" onClick={onUndo} className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition hover:bg-sage hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Undo2 size={17} /></button>}
        <ChevronRight size={17} className="text-line transition group-hover:text-primary" aria-hidden="true" />
      </div>
    </article>
  );
}

function CategorySection({
  category,
  direction,
  items,
  lists,
  onToggleSort,
  onEdit,
  onPurchased,
  onAlreadyHave,
  onUndo,
}: {
  category: CategoryName;
  direction: NameSortDirection;
  items: ShoppingItem[];
  lists: ShoppingList[];
  onToggleSort: () => void;
  onEdit: (item: ShoppingItem) => void;
  onPurchased: (item: ShoppingItem) => void;
  onAlreadyHave: (item: ShoppingItem) => void;
  onUndo: (item: ShoppingItem) => void;
}) {
  const [open, setOpen] = useState(true);
  const resolved = items.filter((item) => item.status !== "pending").length;
  return (
    <section className="border-t border-line pt-3">
      <div className="flex items-center gap-2">
        <button type="button" className="flex min-h-12 min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
          <span className="text-lg font-semibold text-primary">{categoryIcon(category)}</span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{category}</span><span className="block text-xs text-muted">{resolved} de {items.length} resolvidos</span></span>
          {open ? <ChevronDown size={18} className="text-muted" /> : <ChevronRight size={18} className="text-muted" />}
        </button>
        <CategoryNameSortButton category={category} direction={direction} onToggle={onToggleSort} />
      </div>
      {open ? <div className="divide-y-0">{items.map((item) => <ShoppingItemRow key={item.id} item={item} lists={lists} onEdit={() => onEdit(item)} onPurchased={() => onPurchased(item)} onAlreadyHave={() => onAlreadyHave(item)} onUndo={() => onUndo(item)} />)}</div> : null}
    </section>
  );
}

function ItemEditorSheet({
  item,
  lists,
  onClose,
  onSave,
}: {
  item: ShoppingItem;
  lists: ShoppingList[];
  onClose: () => void;
  onSave: (item: ShoppingItem) => void;
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.unitPrice?.toString().replace(".", ",") ?? "");
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<CategoryName>(item.category);
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const previous = latestPriceFor(item.productId, lists);
  const numericPrice = Number(price.replace(",", ".").replace(/[^0-9.]/g, ""));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextStatus = statusAfterPrice(status, numericPrice);
    onSave({ ...item, name: name.trim() || item.name, category, quantity: Math.max(1, quantity), unitPrice: nextStatus === "purchased" && Number.isFinite(numericPrice) && numericPrice > 0 ? Number(numericPrice.toFixed(2)) : undefined, status: nextStatus });
  };

  return <Sheet title={item.name} description="Atualize rápido enquanto você anda pelo mercado." onClose={onClose}>
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-[12px] bg-sage/65 p-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Quantidade</p><p className="mt-1 text-xs text-muted">Ajuste antes de salvar</p></div>
        <QuantityStepper quantity={quantity} onChange={setQuantity} />
      </div>
      <label className="field-label">Preço unitário
        <div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm font-semibold text-muted">R$</span><input autoFocus inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0,00" className="field-input pl-10 text-lg font-semibold" /></div>
        {previous ? <span className="mt-2 block text-xs text-muted">Anterior {formatBRL(previous)} {numericPrice > 0 ? <span className={numericPrice > previous ? "text-terracotta" : "text-primary"}>· {numericPrice > previous ? "mais caro" : "mais barato"}</span> : null}</span> : <span className="mt-2 block text-xs text-muted">Ao informar um preço, o item vira comprado.</span>}
      </label>
      <div>
        <p className="field-label">Situação</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["pending", "purchased", "already_have"] as ItemStatus[]).map((value) => <button type="button" key={value} onClick={() => { setStatus(value); if (value !== "purchased") setPrice(""); }} className={cn("min-h-11 rounded-[10px] border px-2 text-xs font-semibold transition", status === value ? "border-primary bg-sage text-primary" : "border-line bg-surface text-muted hover:border-primary/30")}>{statusLabel(value)}</button>)}
        </div>
      </div>
      <details className="group rounded-[12px] border border-line bg-surface px-4">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink"><span>Mais detalhes</span><ChevronDown size={16} className="text-muted transition group-open:rotate-180" /></summary>
        <div className="space-y-4 border-t border-line pb-4 pt-4">
          <label className="field-label">Nome<input value={name} onChange={(event) => setName(event.target.value)} className="field-input mt-2" /></label>
          <label className="field-label">Categoria<select value={category} onChange={(event) => setCategory(event.target.value as CategoryName)} className="field-input mt-2">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
      </details>
      <Button type="submit" className="w-full">{numericPrice > 0 && status !== "already_have" ? "Adicionar ao carrinho" : status === "purchased" ? "Atualizar carrinho" : "Salvar item"}<Check size={17} /></Button>
    </form>
  </Sheet>;
}

function AddItemSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Omit<ShoppingItem, "id" | "sortOrder">, addToHome: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<CategoryName>("Outros");
  const [addToHome, setAddToHome] = useState(false);
  const numericPrice = Number(price.replace(",", ".").replace(/[^0-9.]/g, ""));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity: Math.max(1, quantity), category, unitPrice: numericPrice > 0 ? Number(numericPrice.toFixed(2)) : undefined, status: numericPrice > 0 ? "purchased" : "pending" }, addToHome);
  };
  return <Sheet title="Adicionar item" description="Inclua aquele produto que não estava na lista." onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <label className="field-label">Nome do produto<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Iogurte natural" className="field-input mt-2" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="field-label">Quantidade<div className="mt-2"><QuantityStepper quantity={quantity} onChange={setQuantity} /></div></label>
        <label className="field-label">Categoria<select value={category} onChange={(event) => setCategory(event.target.value as CategoryName)} className="field-input mt-2">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <label className="field-label">Preço unitário <span className="font-normal text-muted">(opcional)</span><div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm font-semibold text-muted">R$</span><input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0,00" className="field-input pl-10" /></div></label>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border border-line bg-surface px-3 text-sm text-ink"><input type="checkbox" checked={addToHome} onChange={(event) => setAddToHome(event.target.checked)} className="checkbox" /><span><span className="block font-semibold">Adicionar aos produtos da casa</span><span className="block text-xs text-muted">Fica disponível na próxima compra.</span></span></label>
      <Button type="submit" className="w-full"><Plus size={17} />Adicionar à compra</Button>
    </form>
  </Sheet>;
}

function NewPurchaseSheet({
  products,
  onClose,
  onCreate,
}: {
  products: Product[];
  onClose: () => void;
  onCreate: (name: string, budget: number, selectedIds: string[]) => void;
}) {
  const [name, setName] = useState(`Compras de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date())}`);
  const [budget, setBudget] = useState("800");
  const [selected, setSelected] = useState(() => new Set(products.filter((product) => product.active).map((product) => product.id)));
  const activeProducts = products.filter((product) => product.active);
  const toggle = (id: string) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return <Sheet title="Nova compra" description="Comece com os produtos que costumam fazer parte da casa." onClose={onClose} wide>
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <label className="field-label">Nome<input value={name} onChange={(event) => setName(event.target.value)} className="field-input mt-2" /></label>
        <label className="field-label">Orçamento<div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm font-semibold text-muted">R$</span><input inputMode="decimal" value={budget} onChange={(event) => setBudget(event.target.value)} className="field-input pl-10" /></div></label>
      </div>
      <div className="flex items-center justify-between border-b border-line pb-3"><div><p className="text-sm font-semibold text-ink">Produtos da casa</p><p className="mt-1 text-xs text-muted">{selected.size} selecionados</p></div><button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => setSelected(selected.size === activeProducts.length ? new Set() : new Set(activeProducts.map((product) => product.id)))}>{selected.size === activeProducts.length ? "Desmarcar todos" : "Selecionar todos"}</button></div>
      <div className="max-h-[42vh] overflow-y-auto rounded-[12px] border border-line bg-surface px-3">
        {activeProducts.map((product) => <label key={product.id} className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-line/70 last:border-0"><input type="checkbox" checked={selected.has(product.id)} onChange={() => toggle(product.id)} className="checkbox" /><span className="grid h-8 w-8 place-items-center rounded-lg bg-sage text-sm text-primary">{categoryIcon(product.category)}</span><span className="flex-1 text-sm font-semibold text-ink">{product.name}</span><span className="text-xs text-muted">{product.defaultQuantity} un.</span></label>)}
      </div>
      <Button className="w-full" onClick={() => onCreate(name.trim() || "Nova compra", Number(budget.replace(",", ".").replace(/[^0-9.]/g, "")) || 0, [...selected])}>Começar compra <ArrowLeft className="rotate-180" size={17} /></Button>
    </div>
  </Sheet>;
}

function BudgetEditorSheet({ list, onClose, onSave }: { list: ShoppingList; onClose: () => void; onSave: (budget: number) => void }) {
  const [budget, setBudget] = useState(list.budget.toFixed(2).replace(".", ","));
  const numericBudget = Number(budget.replace(",", ".").replace(/[^0-9.]/g, ""));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Number.isFinite(numericBudget) && numericBudget > 0) onSave(Number(numericBudget.toFixed(2)));
  };

  return <Sheet title="Meta da compra" description="Ajuste o limite para esta ida ao mercado." onClose={onClose}>
    <form onSubmit={submit} className="space-y-5">
      <label className="field-label">Orçamento da compra
        <div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm font-semibold text-muted">R$</span><input autoFocus required inputMode="decimal" value={budget} onChange={(event) => setBudget(event.target.value)} className="field-input pl-10 text-lg font-semibold" placeholder="0,00" /></div>
      </label>
      <Button type="submit" className="w-full" disabled={!Number.isFinite(numericBudget) || numericBudget <= 0}>Salvar meta <Check size={17} /></Button>
    </form>
  </Sheet>;
}

function CompleteSheet({ list, onClose, onHistory }: { list: ShoppingList; onClose: () => void; onHistory: () => void }) {
  return <Sheet title="Compra concluída" description="Tudo certo. A casa está um pouco mais abastecida." onClose={onClose}>
    <div className="space-y-5">
      <div className="rounded-[14px] bg-sage p-5"><div className="flex items-center gap-3 text-primary"><span className="grid h-10 w-10 place-items-center rounded-full bg-surface"><Check size={20} strokeWidth={3} /></span><span className="text-sm font-semibold">{list.items.length} produtos resolvidos</span></div><p className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-ink">{formatBRL(listTotal(list))}</p><p className="mt-1 text-sm text-muted">registrados nesta compra</p></div>
      <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-[12px] border border-line p-3"><span className="block text-xs text-muted">Comprados</span><span className="mt-1 block font-semibold text-ink">{list.items.filter((item) => item.status === "purchased").length}</span></div><div className="rounded-[12px] border border-line p-3"><span className="block text-xs text-muted">Já tínhamos</span><span className="mt-1 block font-semibold text-ink">{list.items.filter((item) => item.status === "already_have").length}</span></div></div>
      <Button className="w-full" onClick={onHistory}>Ver histórico</Button>
    </div>
  </Sheet>;
}

function ConfirmFinishSheet({ onClose, onConfirm, pending }: { onClose: () => void; onConfirm: () => void; pending: number }) {
  return <Sheet title="Finalizar compra?" description={pending > 0 ? `Ainda existem ${pending} itens pendentes. Você poderá consultar tudo no histórico depois.` : "Todos os itens foram resolvidos."} onClose={onClose}>
    <div className="space-y-3"><Button className="w-full" onClick={onConfirm}>Finalizar e salvar</Button><Button variant="secondary" className="w-full" onClick={onClose}>Continuar comprando</Button></div>
  </Sheet>;
}

function HistoryView({ lists, onOpen }: { lists: ShoppingList[]; onOpen: (list: ShoppingList) => void }) {
  const completed = lists.filter((list) => list.status === "completed");
  return <div className="space-y-6"><div><p className="text-sm font-semibold text-primary">O que já passou pelo caixa</p><h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-ink">Histórico</h1><p className="mt-2 max-w-md text-sm leading-6 text-muted">Preços anteriores ficam aqui para a próxima compra começar com contexto.</p></div>
    {completed.length ? <div className="divide-y divide-line border-y border-line">{completed.map((list) => <button type="button" key={list.id} onClick={() => onOpen(list)} className="flex min-h-[94px] w-full items-center gap-4 text-left transition hover:bg-sage/35"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[11px] bg-sage text-primary"><CheckCircle2 size={20} /></span><span className="min-w-0 flex-1"><span className="block truncate text-[15px] font-semibold text-ink">{list.name}</span><span className="mt-1 block text-xs text-muted">{monthLabel(list.finishedAt ?? list.startedAt)} · {list.items.length} itens</span></span><span className="text-right"><span className="block text-sm font-semibold text-ink">{formatBRL(listTotal(list))}</span><span className="mt-1 block text-xs text-muted">{shortDate(list.finishedAt ?? list.startedAt)}</span></span><ChevronRight size={17} className="text-line" /></button>)}</div> : <EmptyState icon={<ListFilter size={24} />} title="O histórico começa na próxima compra" description="Finalize sua primeira compra para guardar preços e totais." />}
  </div>;
}

function HistoryDetail({ list, onBack }: { list: ShoppingList; onBack: () => void }) {
  const groups = groupItems(list.items);
  return <div className="space-y-6"><button type="button" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink" onClick={onBack}><ArrowLeft size={17} />Voltar ao histórico</button><div><p className="text-sm font-semibold text-primary">{monthLabel(list.finishedAt ?? list.startedAt)}</p><h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-ink">{list.name}</h1><div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted"><span className="rounded-full bg-sage px-3 py-1.5">{list.items.length} itens</span><span className="rounded-full bg-sage px-3 py-1.5">{formatBRL(listTotal(list))}</span></div></div><div className="divide-y divide-line border-y border-line">{CATEGORY_ORDER.map((category) => groups[category]?.length ? <section key={category} className="py-4"><h2 className="mb-2 text-sm font-semibold text-ink">{category}</h2>{groups[category]?.map((item) => <div key={item.id} className="flex items-center gap-3 py-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-sage text-primary"><Check size={15} /></span><span className="min-w-0 flex-1 truncate text-sm text-ink">{item.name}<span className="ml-2 text-xs text-muted">× {item.quantity}</span></span><span className="text-right text-sm font-semibold text-ink">{item.unitPrice ? formatBRL(itemSubtotal(item)) : "—"}<span className="block text-[11px] font-normal text-muted">{item.unitPrice ? `${formatBRL(item.unitPrice)} un.` : "sem preço"}</span></span></div>)}</section> : null)}</div></div>;
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return <div className="rounded-[14px] border border-dashed border-line bg-surface px-5 py-10 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage text-primary">{icon}</span><h2 className="mt-4 text-base font-semibold text-ink">{title}</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">{description}</p>{action ? <div className="mt-5 flex justify-center">{action}</div> : null}</div>;
}

function ProductsHomeLegacy({ products, lists, onNewPurchase, onAddProduct, onToggleProduct, onEditProduct, onShare }: { products: Product[]; lists: ShoppingList[]; onNewPurchase: () => void; onAddProduct: () => void; onToggleProduct: (id: string) => void; onEditProduct: (product: Product) => void; onShare: () => void }) {
  const active = products.filter((product) => product.active);
  return <div className="space-y-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Casa Gabriel & Brunna</p><h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-ink">Produtos da casa</h1><p className="mt-2 max-w-md text-sm leading-6 text-muted">Sua próxima compra já sabe por onde começar.</p></div><IconButton label="Compartilhar casa" variant="bordered" onClick={onShare}><Users size={18} /></IconButton></div>
    <section className="flex items-center gap-4 rounded-[14px] bg-primary p-4 text-white"><span className="grid h-11 w-11 place-items-center rounded-[11px] bg-white/15"><ShoppingBasket size={21} /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-white/75">Compra em andamento</p><p className="mt-0.5 truncate text-base font-semibold">{lists.find((list) => list.status === "active")?.name ?? "Nenhuma compra aberta"}</p></div><Button variant="secondary" className="border-white/20 bg-white/10 px-3 text-white hover:bg-white/20" onClick={onNewPurchase}>Nova</Button></section>
    <div><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-ink">Itens recorrentes <span className="ml-1 font-normal text-muted">{active.length}</span></h2><button type="button" className="text-sm font-semibold text-primary" onClick={onAddProduct}><Plus size={15} className="mr-1 inline" />Adicionar</button></div><div className="divide-y divide-line border-y border-line">{active.length ? active.map((product) => <div key={product.id} className="flex min-h-[68px] items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sage text-sm text-primary">{categoryIcon(product.category)}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{product.name}</span><span className="mt-1 block text-xs text-muted">{product.category} · {product.defaultQuantity} un.</span></span><IconButton label={`Editar ${product.name}`} onClick={() => onEditProduct(product)}><Pencil size={16} /></IconButton><button type="button" onClick={() => onToggleProduct(product.id)} className="px-2 text-xs font-semibold text-muted hover:text-terracotta">Desativar</button></div>) : <EmptyState icon={<PackagePlus size={23} />} title="Sua lista está vazia" description="Adicione os itens que não podem faltar em casa." action={<Button onClick={onAddProduct}><Plus size={17} />Adicionar item</Button>} />}</div></div>
  </div>;
}

void ProductsHomeLegacy;

function useCategoryNameSort(householdId: string | undefined) {
  const [categorySort, setCategorySort] = useState<Partial<Record<CategoryName, NameSortDirection>>>({});

  useEffect(() => {
    if (!householdId) {
      setCategorySort({});
      return;
    }
    setCategorySort(readCategoryNameSorts(window.localStorage.getItem(categoryNameSortKey(householdId))));
  }, [householdId]);

  const toggleCategorySort = (category: CategoryName) => {
    setCategorySort((current) => {
      const next = { ...current, [category]: (current[category] ?? "asc") === "asc" ? "desc" : "asc" } as Partial<Record<CategoryName, NameSortDirection>>;
      if (householdId) window.localStorage.setItem(categoryNameSortKey(householdId), JSON.stringify(next));
      return next;
    });
  };

  return { categorySort, toggleCategorySort };
}

function CategoryNameSortButton({ category, direction, onToggle }: { category: CategoryName; direction: NameSortDirection; onToggle: () => void }) {
  const label = direction === "desc" ? "Z–A" : "A–Z";
  return <button type="button" onClick={onToggle} aria-pressed={direction === "desc"} aria-label={`${category} em ordem ${label}. Alternar ordem alfabética`} className="inline-flex min-h-9 items-center gap-1 rounded-[7px] px-2 text-xs font-semibold text-muted transition hover:bg-sage hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{direction === "desc" ? <ArrowDownZA size={15} /> : <ArrowDownAZ size={15} />}{label}</button>;
}

function ProductRow({ product, onToggle, onEdit }: { product: Product; onToggle: () => void; onEdit: () => void }) {
  return <div className="flex min-h-[68px] items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sage text-sm text-primary">{categoryIcon(product.category)}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{product.name}</span><span className="mt-1 block text-xs text-muted">{product.category} · {product.defaultQuantity} un.</span></span><IconButton label={`Editar ${product.name}`} onClick={onEdit}><Pencil size={16} /></IconButton><button type="button" onClick={onToggle} className="px-2 text-xs font-semibold text-muted hover:text-terracotta">Desativar</button></div>;
}

function ViewModeToggle({ mode, onChange, label }: { mode: ProductViewMode; onChange: (mode: ProductViewMode) => void; label: string }) {
  return <div className="flex rounded-[9px] border border-line bg-surface p-0.5" role="group" aria-label={label}><button type="button" onClick={() => onChange("category")} aria-pressed={mode === "category"} className={cn("min-h-9 rounded-[7px] px-2.5 text-xs font-semibold transition", mode === "category" ? "bg-sage text-primary" : "text-muted hover:text-ink")}>Categoria</button><button type="button" onClick={() => onChange("alphabetical")} aria-pressed={mode === "alphabetical"} className={cn("min-h-9 rounded-[7px] px-2.5 text-xs font-semibold transition", mode === "alphabetical" ? "bg-sage text-primary" : "text-muted hover:text-ink")}>A–Z</button></div>;
}

function ProductsHome({ products, lists, householdName, categorySort, onToggleCategorySort, onNewPurchase, onAddProduct, onToggleProduct, onEditProduct, onManageHousehold }: { products: Product[]; lists: ShoppingList[]; householdName: string; categorySort: Partial<Record<CategoryName, NameSortDirection>>; onToggleCategorySort: (category: CategoryName) => void; onNewPurchase: () => void; onAddProduct: () => void; onToggleProduct: (id: string) => void; onEditProduct: (product: Product) => void; onManageHousehold: () => void }) {
  const [viewMode, setViewMode] = useState<ProductViewMode>("category");
  const active = products.filter((product) => product.active);
  const sorted = sortByName(active, "asc");
  const grouped = CATEGORY_ORDER.map((category) => {
    const direction = categorySort[category] ?? "asc";
    return { category, direction, products: sortByName(active.filter((product) => product.category === category), direction) };
  }).filter((section) => section.products.length);

  return <div className="space-y-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">{householdName}</p><h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-ink">Produtos da casa</h1><p className="mt-2 max-w-md text-sm leading-6 text-muted">Sua próxima compra já sabe por onde começar.</p></div><IconButton label="Casas e pessoas" variant="bordered" onClick={onManageHousehold}><Users size={18} /></IconButton></div>
    <section className="flex items-center gap-4 rounded-[14px] bg-primary p-4 text-white"><span className="grid h-11 w-11 place-items-center rounded-[11px] bg-white/15"><ShoppingBasket size={21} /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-white/75">Compra em andamento</p><p className="mt-0.5 truncate text-base font-semibold">{lists.find((list) => list.status === "active")?.name ?? "Nenhuma compra aberta"}</p></div><Button variant="secondary" className="border-white/20 bg-white/10 px-3 text-white hover:bg-white/20" onClick={onNewPurchase}>Nova</Button></section>
    <div><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold text-ink">Itens recorrentes <span className="ml-1 font-normal text-muted">{active.length}</span></h2><div className="flex items-center gap-2"><ViewModeToggle mode={viewMode} onChange={setViewMode} label="Ordenar produtos" /><button type="button" className="text-sm font-semibold text-primary" onClick={onAddProduct}><Plus size={15} className="mr-1 inline" />Adicionar</button></div></div>{active.length ? viewMode === "category" ? <div className="space-y-5">{grouped.map((section) => <section key={section.category}><div className="mb-2 flex items-center justify-between gap-3"><h3 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{section.category}</h3><CategoryNameSortButton category={section.category} direction={section.direction} onToggle={() => onToggleCategorySort(section.category)} /></div><div className="divide-y divide-line border-y border-line">{section.products.map((product) => <ProductRow key={product.id} product={product} onEdit={() => onEditProduct(product)} onToggle={() => onToggleProduct(product.id)} />)}</div></section>)}</div> : <div className="divide-y divide-line border-y border-line">{sorted.map((product) => <ProductRow key={product.id} product={product} onEdit={() => onEditProduct(product)} onToggle={() => onToggleProduct(product.id)} />)}</div> : <EmptyState icon={<PackagePlus size={23} />} title="Sua lista está vazia" description="Adicione os itens que não podem faltar em casa." action={<Button onClick={onAddProduct}><Plus size={17} />Adicionar item</Button>} />}</div>
  </div>;
}

function ProductEditorSheet({ product, onClose, onSave }: { product?: Product; onClose: () => void; onSave: (product: Omit<Product, "id" | "active">, id?: string) => void }) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<CategoryName>(product?.category ?? "Alimentos");
  const [quantity, setQuantity] = useState(product?.defaultQuantity ?? 1);
  return <Sheet title={product ? "Editar produto" : "Novo produto da casa"} description="Mantenha a lista recorrente leve e útil." onClose={onClose}>
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSave({ name: name.trim(), category, defaultQuantity: Math.max(1, quantity) }, product?.id); }}>
      <label className="field-label">Nome<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} className="field-input mt-2" placeholder="Ex.: Café" /></label>
      <label className="field-label">Categoria<select value={category} onChange={(event) => setCategory(event.target.value as CategoryName)} className="field-input mt-2">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label className="field-label">Quantidade padrão<div className="mt-2"><QuantityStepper quantity={quantity} onChange={setQuantity} /></div></label>
      <Button type="submit" className="w-full">Salvar produto <Check size={17} /></Button>
    </form>
  </Sheet>;
}

export default function RestokApp() {
  const [state, setState] = useState<RestokState>(seedState);
  const [hydrated, setHydrated] = useState(false);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [households, setHouseholds] = useState<HouseholdSummary[]>([]);
  const [activeHousehold, setActiveHousehold] = useState<HouseholdSummary | null>(null);
  const { categorySort, toggleCategorySort } = useCategoryNameSort(activeHousehold?.id);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardingInvite, setOnboardingInvite] = useState("");
  const [onboardingInviteFailed, setOnboardingInviteFailed] = useState(false);
  const [householdManagerOpen, setHouseholdManagerOpen] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("shop");
  const [shopViewMode, setShopViewMode] = useState<ProductViewMode>("category");
  const [activeListId, setActiveListId] = useState("list-active");
  const [historyDetail, setHistoryDetail] = useState<ShoppingList | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editorItem, setEditorItem] = useState<ShoppingItem | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newPurchaseOpen, setNewPurchaseOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [budgetEditor, setBudgetEditor] = useState<ShoppingList | null>(null);
  const [completeList, setCompleteList] = useState<ShoppingList | null>(null);
  const [productEditor, setProductEditor] = useState<Product | "new" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [writeOperations, setWriteOperations] = useState<WriteOperation[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeConnectionStatus>("connecting");
  const [isOnline, setIsOnline] = useState(true);
  const [snapshotFailed, setSnapshotFailed] = useState(false);
  const [revalidationVersion, setRevalidationVersion] = useState(0);
  const activeUserIdRef = useRef<string | null>(null);
  const activeStorageKeyRef = useRef<string | null>(null);
  const writeOperationsRef = useRef<WriteOperation[]>([]);
  const writeChainsRef = useRef(new Map<string, Promise<RemoteWriteResult>>());
  const writeVersionsRef = useRef(new Map<string, string>());
  const needsRevalidationRef = useRef(false);
  const revalidationInFlightRef = useRef(false);
  const revalidationRetryDelayRef = useRef(2000);
  const revalidationDebounceRef = useRef<number | undefined>(undefined);

  const requestRemoteRevalidation = useCallback(() => {
    needsRevalidationRef.current = true;
    if (revalidationInFlightRef.current) return;
    if (revalidationDebounceRef.current !== undefined) window.clearTimeout(revalidationDebounceRef.current);
    revalidationDebounceRef.current = window.setTimeout(() => {
      revalidationDebounceRef.current = undefined;
      setRevalidationVersion((version) => version + 1);
    }, 120);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateKeyboardState = () => {
      const focused = document.activeElement;
      const editing = focused instanceof HTMLElement && focused.matches("input, textarea, select, [contenteditable='true']");
      setKeyboardOpen(Boolean(editing && window.innerHeight - viewport.height - viewport.offsetTop > 140));
    };
    const updateAfterFocus = () => window.requestAnimationFrame(updateKeyboardState);
    viewport.addEventListener("resize", updateKeyboardState);
    viewport.addEventListener("scroll", updateKeyboardState);
    window.addEventListener("resize", updateKeyboardState);
    document.addEventListener("focusin", updateKeyboardState);
    document.addEventListener("focusout", updateAfterFocus);
    updateKeyboardState();
    return () => {
      viewport.removeEventListener("resize", updateKeyboardState);
      viewport.removeEventListener("scroll", updateKeyboardState);
      window.removeEventListener("resize", updateKeyboardState);
      document.removeEventListener("focusin", updateKeyboardState);
      document.removeEventListener("focusout", updateAfterFocus);
    };
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        if (activeUserIdRef.current) clearRemoteStateCaches(window.localStorage, activeUserIdRef.current);
        window.localStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
        activeUserIdRef.current = null;
        activeStorageKeyRef.current = null;
        setStorageKey(null);
        setState({ products: [], lists: [] });
        setHouseholds([]);
        setActiveHousehold(null);
        setProfileName(null);
        setProfileEmail(null);
        setOnboarding(false);
        setHouseholdManagerOpen(false);
        setHydrated(false);
        setSyncWarning(null);
        window.location.assign("/login");
        return;
      }

      const nextUserId = session?.user.id;
      if (event === "SIGNED_IN" && nextUserId && activeUserIdRef.current && nextUserId !== activeUserIdRef.current) {
        clearRemoteStateCaches(window.localStorage, activeUserIdRef.current);
        activeUserIdRef.current = null;
        activeStorageKeyRef.current = null;
        window.location.reload();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const params = new URLSearchParams(window.location.search);
      const invite = params.get("invite");
      const acceptedHouseholdId = invite && /^[a-f0-9]{36}$/i.test(invite) && isSupabaseConfigured ? await acceptHouseholdInvite(invite) : null;
      const inviteFailed = Boolean(invite && isSupabaseConfigured && !acceptedHouseholdId);
      if (invite || params.has("flow")) {
        const inviteUrl = new URL(window.location.href);
        inviteUrl.searchParams.delete("invite");
        inviteUrl.searchParams.delete("flow");
        window.history.replaceState({}, "", `${inviteUrl.pathname}${inviteUrl.search}${inviteUrl.hash}`);
      }

      if (!isSupabaseConfigured) {
        try {
          const stored = window.localStorage.getItem(DEMO_STATE_KEY);
          if (stored) setState(JSON.parse(stored) as RestokState);
          window.localStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
        } catch { /* demo mode can safely fall back to the seed */ }
        if (!cancelled) {
          activeStorageKeyRef.current = DEMO_STATE_KEY;
          setStorageKey(DEMO_STATE_KEY);
          const demoHousehold = { id: "demo-household", name: "Casa de demonstração", role: "owner" as const, createdAt: "" };
          setHouseholds([demoHousehold]);
          setActiveHousehold(demoHousehold);
          setProfileName(null);
          setProfileEmail(null);
          setOnboarding(false);
          setSyncWarning(null);
          setHydrated(true);
          if (invite) setToast("Convites só funcionam quando a conta está conectada ao servidor.");
        }
        return;
      }

      const context = await resolveRemoteContext(acceptedHouseholdId);
      if (cancelled) return;
      if (!context) {
        const [availableHouseholds, identity] = await Promise.all([loadUserHouseholds(), loadCurrentProfile()]);
        if (cancelled) return;
        if (identity && availableHouseholds?.length === 0) {
          setState({ products: [], lists: [] });
          setHouseholds([]);
          setActiveHousehold(null);
          setProfileName(identity.displayName);
          setProfileEmail(identity.email);
          setOnboardingInvite(inviteFailed ? invite ?? "" : "");
          setOnboardingInviteFailed(inviteFailed);
          setOnboarding(true);
          setStorageKey(null);
          setSyncWarning(null);
          setHydrated(true);
          return;
        }
        setState({ products: [], lists: [] });
        setHouseholds([]);
        setActiveHousehold(null);
        setOnboarding(false);
        setStorageKey(null);
        setSyncWarning("Não foi possível validar sua sessão e carregar os dados da casa. Entre novamente.");
        setHydrated(true);
        if (inviteFailed) setToast("Este convite é inválido, expirou, já foi usado ou foi revogado.");
        return;
      }

      activeUserIdRef.current = context.userId;
      setProfileName(context.profileName);
      setProfileEmail(context.email);
      setOnboarding(false);
      const previouslySelectedHouseholdId = window.localStorage.getItem(activeHouseholdStorageKey(context.userId));
      const scopedKey = remoteStateStorageKey(context.userId, context.householdId);
      activeStorageKeyRef.current = scopedKey;
      setStorageKey(scopedKey);
      window.localStorage.removeItem(LEGACY_REMOTE_STATE_KEY);

      let cached: RestokState | null = null;
      try {
        const stored = window.localStorage.getItem(scopedKey);
        if (stored) {
          cached = JSON.parse(stored) as RestokState;
          setState(cached);
          setActiveListId(cached.lists.find((list) => list.status === "active")?.id ?? "");
        }
      } catch { /* invalid scoped cache is ignored and replaced by remote state */ }

      const remote = await loadRemoteState(context).catch(() => null);
      const availableHouseholds = await loadUserHouseholds();
      if (cancelled) return;
      const activeSummary = availableHouseholds?.find((household) => household.id === context.householdId) ?? {
        id: context.householdId,
        name: context.householdName,
        role: context.role,
        createdAt: new Date().toISOString(),
      };
      if (previouslySelectedHouseholdId && previouslySelectedHouseholdId !== context.householdId && availableHouseholds && !availableHouseholds.some((household) => household.id === previouslySelectedHouseholdId)) {
        window.localStorage.removeItem(remoteStateStorageKey(context.userId, previouslySelectedHouseholdId));
      }
      window.localStorage.setItem(activeHouseholdStorageKey(context.userId), context.householdId);
      setHouseholds(availableHouseholds ?? [activeSummary]);
      setActiveHousehold(activeSummary);
      if (remote && remote.userId === context.userId && remote.householdId === context.householdId) {
        setState(remote.state);
        setActiveListId(remote.state.lists.find((list) => list.status === "active")?.id ?? "");
        setSyncWarning(null);
      } else if (cached) {
        setSyncWarning("Sem conexão com o servidor. Exibindo o cache salvo desta casa.");
      } else {
        setState({ products: [], lists: [] });
        setSyncWarning("Não foi possível carregar os dados da casa. Verifique a conexão e tente novamente.");
      }
      setHydrated(true);
      if (inviteFailed) setToast("Este convite é inválido, expirou, já foi usado ou foi revogado.");
      else if (acceptedHouseholdId) setToast("Convite aceito. Esta casa está selecionada.");
    };
    void boot().catch(() => {
      if (cancelled) return;
      setState({ products: [], lists: [] });
      setHouseholds([]);
      setActiveHousehold(null);
      setStorageKey(null);
      setOnboarding(false);
      setSyncWarning("Não foi possível carregar os dados da casa. Verifique sua conexão e tente novamente.");
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (hydrated && storageKey) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, hydrated, storageKey]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => { writeOperationsRef.current = writeOperations; }, [writeOperations]);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);
    const onOffline = () => setIsOnline(false);
    const onOnline = () => {
      setIsOnline(true);
      window.setTimeout(() => {
        for (const operation of writeOperationsRef.current) {
          if (operation.status === "failed") operation.retry();
        }
        requestRemoteRevalidation();
      }, 400);
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [requestRemoteRevalidation]);

  const activeList = state.lists.find((list) => list.id === activeListId && list.status === "active") ?? state.lists.find((list) => list.status === "active") ?? null;
  const filteredItems = useMemo(() => {
    if (!activeList) return [];
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return activeList.items.filter((item) => (!normalizedQuery || item.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)) && (filter === "all" || item.status === filter));
  }, [activeList, filter, query]);
  const groups = groupItems(filteredItems);
  const alphabeticalItems = sortByName(filteredItems, "asc");
  const resolved = activeList ? listResolved(activeList) : 0;
  const pending = activeList ? listPending(activeList) : 0;
  const activeHouseholdId = activeHousehold?.id;
  const realtimeListId = activeList?.id;

  const runRemoteWrite = (key: string, label: string, write: () => Promise<RemoteWriteResult>, onSuccess?: () => void) => {
    const token = makeId("write");
    writeVersionsRef.current.set(key, token);
    const retry = () => runRemoteWrite(key, label, write, onSuccess);
    setWriteOperations((current) => [
      ...current.filter((operation) => operation.key !== key),
      { key, token, label, status: "pending", retry },
    ]);

    const previous = writeChainsRef.current.get(key) ?? Promise.resolve({ ok: true, synced: true } as const);
    const task = previous.then(() => !isSupabaseConfigured || window.navigator.onLine ? write() : ({ ok: false, message: "Sem conexão com a internet." } as const)).catch(() => ({ ok: false, message: "Não foi possível sincronizar esta alteração." } as const));
    writeChainsRef.current.set(key, task);
    void task.then((result) => {
      if (writeVersionsRef.current.get(key) !== token) return;
      writeChainsRef.current.delete(key);
      if (result.ok) {
        writeVersionsRef.current.delete(key);
        setWriteOperations((current) => current.filter((operation) => operation.token !== token));
        setToast(result.synced ? label : "Salvo neste aparelho");
        onSuccess?.();
        if (result.synced) requestRemoteRevalidation();
      } else {
        setWriteOperations((current) => current.map((operation) => operation.token === token ? { ...operation, status: "failed" } : operation));
        setToast(`${result.message} A alteração ficou neste aparelho; tente novamente.`);
      }
    });
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !activeHouseholdId) {
      setRealtimeStatus("disconnected");
      return;
    }
    return subscribeToShoppingList(realtimeListId, activeHouseholdId, {
      onItemChange: requestRemoteRevalidation,
      onDomainChange: requestRemoteRevalidation,
      onStatus: (status) => {
        setRealtimeStatus(status);
        if (status === "connected" || status === "reconnecting") requestRemoteRevalidation();
      },
    });
  }, [activeHouseholdId, realtimeListId, requestRemoteRevalidation]);

  useEffect(() => {
    if (!isSupabaseConfigured || !isOnline || !activeHouseholdId || writeOperations.length || !needsRevalidationRef.current || revalidationInFlightRef.current) return;
    needsRevalidationRef.current = false;
    revalidationInFlightRef.current = true;
    let cancelled = false;
    let retryTimer: number | undefined;
    const refresh = async () => {
      const context = await resolveRemoteContext(activeHouseholdId).catch(() => null);
      const remote = context ? await loadRemoteState(context).catch(() => null) : null;
      if (cancelled) return;
      if (!remote || remote.householdId !== activeHouseholdId) {
        needsRevalidationRef.current = true;
        setSnapshotFailed(true);
        if (window.navigator.onLine) {
          const delay = revalidationRetryDelayRef.current;
          revalidationRetryDelayRef.current = Math.min(delay * 2, 30000);
          retryTimer = window.setTimeout(() => setRevalidationVersion((version) => version + 1), delay);
        }
      } else {
        setSnapshotFailed(false);
        revalidationRetryDelayRef.current = 2000;
        setState((current) => JSON.stringify(current) === JSON.stringify(remote.state) ? current : remote.state);
      }
      revalidationInFlightRef.current = false;
      if (needsRevalidationRef.current && remote) setRevalidationVersion((version) => version + 1);
    };
    void refresh();
    return () => {
      cancelled = true;
      revalidationInFlightRef.current = false;
      needsRevalidationRef.current = true;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, [activeHouseholdId, isOnline, revalidationVersion, writeOperations.length]);

  const updateActiveItems = (updater: (items: ShoppingItem[]) => ShoppingItem[]) => {
    if (!activeList) return null;
    const updated = { ...activeList, items: updater(activeList.items) };
    setState((current) => ({ ...current, lists: current.lists.map((list) => list.id === activeList.id ? updated : list) }));
    return updated;
  };

  const persistUpdatedList = (list: ShoppingList, label: string) => {
    runRemoteWrite(`list:${list.id}`, label, () => persistList(list, activeHouseholdId));
  };

  const saveItem = (item: ShoppingItem) => {
    const updated = updateActiveItems((items) => items.map((current) => current.id === item.id ? item : current));
    if (updated) persistUpdatedList(updated, item.status === "purchased" ? "Item adicionado ao carrinho" : "Item atualizado");
    setEditorItem(null);
  };

  const setItemStatus = (item: ShoppingItem, status: ItemStatus) => {
    const updated = updateActiveItems((items) => items.map((current) => current.id === item.id ? { ...current, status, unitPrice: status === "purchased" ? current.unitPrice : undefined } : current));
    if (updated) persistUpdatedList(updated, status === "already_have" ? "Marcado como já temos" : status === "purchased" ? "Adicionado ao carrinho" : "Situação desfeita");
  };
  const addItem = (item: Omit<ShoppingItem, "id" | "sortOrder">, addToHome: boolean) => {
    const productId = addToHome ? makeId("product") : undefined;
    const newItem = { ...item, id: makeId("item"), sortOrder: nextSortOrder(activeList?.items ?? []), ...(productId ? { productId } : {}) };
    const updated = updateActiveItems((items) => [...items, newItem]);
    if (!updated) return;
    const newProduct = addToHome && productId ? { id: productId, name: item.name, category: item.category, defaultQuantity: item.quantity, active: true } : null;
    if (newProduct) setState((current) => ({ ...current, products: [...current.products, newProduct] }));
    runRemoteWrite(`list:${updated.id}`, "Item adicionado à compra", async () => {
      if (newProduct) {
        const productResult = await persistProduct(newProduct, activeHouseholdId);
        if (!productResult.ok) return productResult;
      }
      return persistList(updated, activeHouseholdId);
    });
    setAddItemOpen(false);
  };
  const createPurchase = (name: string, budget: number, selectedIds: string[]) => {
    const items: ShoppingItem[] = state.products.filter((product) => selectedIds.includes(product.id)).map((product, index) => ({ id: makeId("item"), productId: product.id, name: product.name, category: product.category, quantity: product.defaultQuantity, status: "pending", sortOrder: index }));
    const list: ShoppingList = { id: makeId("list"), name, budget, status: "active", startedAt: new Date().toISOString(), items };
    const completedAt = new Date().toISOString();
    setState((current) => ({ ...current, lists: [list, ...current.lists.map((currentList): ShoppingList => currentList.status === "active" ? { ...currentList, status: "completed", finishedAt: completedAt } : currentList)] }));
    setActiveListId(list.id); setNewPurchaseOpen(false); setScreen("shop"); setQuery(""); setFilter("all");
    runRemoteWrite(`list:${list.id}`, "Nova compra pronta", () => createShoppingListWithItems(list, activeHouseholdId));
  };
  const finishPurchase = () => {
    if (!activeList) return;
    const finished = { ...activeList, status: "completed" as const, finishedAt: new Date().toISOString() };
    setState((current) => ({ ...current, lists: current.lists.map((list) => list.id === activeList.id ? finished : list) }));
    setFinishOpen(false);
    runRemoteWrite(`list:${finished.id}`, "Compra salva no histórico", () => persistList(finished, activeHouseholdId), () => setCompleteList(finished));
  };
  const saveBudget = (budget: number) => {
    if (!budgetEditor) return;
    const updated = { ...budgetEditor, budget };
    setState((current) => ({ ...current, lists: current.lists.map((list) => list.id === updated.id ? updated : list) }));
    persistUpdatedList(updated, "Meta da compra atualizada");
    setBudgetEditor(null);
  };
  const saveProduct = (product: Omit<Product, "id" | "active">, id?: string) => {
    const savedProduct: Product = id ? { ...state.products.find((item) => item.id === id)!, ...product, id, active: state.products.find((item) => item.id === id)?.active ?? true } : { ...product, id: makeId("product"), active: true };
    setState((current) => ({ ...current, products: id ? current.products.map((item) => item.id === id ? savedProduct : item) : [...current.products, savedProduct] }));
    runRemoteWrite(`product:${savedProduct.id}`, id ? "Produto atualizado" : "Produto adicionado à casa", () => persistProduct(savedProduct, activeHouseholdId));
    setProductEditor(null);
  };
  const toggleProduct = (id: string) => { const product = state.products.find((item) => item.id === id); if (!product) return; const updated = { ...product, active: false }; setState((current) => ({ ...current, products: current.products.map((item) => item.id === id ? updated : item) })); runRemoteWrite(`product:${updated.id}`, "Produto desativado", () => persistProduct(updated, activeHouseholdId)); };
  const activateHousehold = async (householdId: string) => {
    if (!isSupabaseConfigured) return householdId === "demo-household";
    const context = await resolveRemoteContext(householdId).catch(() => null);
    if (!context || context.householdId !== householdId) {
      setToast("Você não tem acesso a essa casa.");
      return false;
    }
    const remote = await loadRemoteState(context).catch(() => null);
    if (!remote || remote.householdId !== householdId || remote.userId !== context.userId) {
      setToast("Não foi possível carregar essa casa. A casa atual continua selecionada.");
      return false;
    }

    const availableHouseholds = await loadUserHouseholds().catch(() => null);
    const summary = availableHouseholds?.find((household) => household.id === householdId) ?? {
      id: context.householdId,
      name: context.householdName,
      role: context.role,
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem(activeHouseholdStorageKey(context.userId), context.householdId);
    activeUserIdRef.current = context.userId;
    const scopedKey = remoteStateStorageKey(context.userId, context.householdId);
    activeStorageKeyRef.current = scopedKey;
    setStorageKey(scopedKey);
    setHouseholds(availableHouseholds ?? [summary]);
    setActiveHousehold(summary);
    setProfileName(context.profileName);
    setProfileEmail(context.email);
    setState(remote.state);
    setActiveListId(remote.state.lists.find((list) => list.status === "active")?.id ?? "");
    setHistoryDetail(null);
    setQuery("");
    setFilter("all");
    setSyncWarning(null);
    setHydrated(true);
    setOnboarding(false);
    setOnboardingInvite("");
    setOnboardingInviteFailed(false);
    return true;
  };
  const refreshMemberships = async () => {
    if (!isSupabaseConfigured) return;
    const availableHouseholds = await loadUserHouseholds().catch(() => null);
    if (!availableHouseholds) {
      setToast("Não foi possível atualizar a lista de casas.");
      return;
    }
    setHouseholds(availableHouseholds);
    if (activeHousehold && availableHouseholds.some((household) => household.id === activeHousehold.id)) {
      setActiveHousehold(availableHouseholds.find((household) => household.id === activeHousehold.id)!);
      return;
    }
    if (activeHousehold && activeUserIdRef.current) {
      window.localStorage.removeItem(remoteStateStorageKey(activeUserIdRef.current, activeHousehold.id));
    }
    if (availableHouseholds.length) {
      await activateHousehold(availableHouseholds[0].id);
      return;
    }
    if (activeHousehold && activeUserIdRef.current) {
      window.localStorage.removeItem(remoteStateStorageKey(activeUserIdRef.current, activeHousehold.id));
    }
    const identity = await loadCurrentProfile().catch(() => null);
    setProfileName(identity?.displayName ?? null);
    setProfileEmail(identity?.email ?? null);
    setActiveHousehold(null);
    setState({ products: [], lists: [] });
    setActiveListId("");
    setStorageKey(null);
    setOnboarding(true);
  };
  const signOut = async () => {
    setProfileOpen(false);
    if (!isSupabaseConfigured) {
      window.localStorage.removeItem(DEMO_STATE_KEY);
      window.localStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
      setState(seedState);
      setActiveListId("list-active");
      setToast("Dados locais da demonstração apagados");
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) return;
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        setToast("Não foi possível encerrar a sessão. Tente novamente.");
        return;
      }
    } catch {
      setToast("Não foi possível encerrar a sessão. Tente novamente.");
      return;
    }

    if (activeUserIdRef.current) clearRemoteStateCaches(window.localStorage, activeUserIdRef.current);
    window.localStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
    activeUserIdRef.current = null;
    activeStorageKeyRef.current = null;
    setStorageKey(null);
    window.location.replace("/login");
  };

    const title = screen === "shop" ? activeList?.name ?? "Modo mercado" : screen === "history" ? "Histórico" : "Produtos da casa";
    const profileLabel = profileName || profileEmail || (isSupabaseConfigured ? "Conta" : "Demonstração");
    const profileInitials = profileName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR") || profileEmail?.[0]?.toLocaleUpperCase("pt-BR") || "D";
    if (!hydrated) return <main className="grid min-h-dvh place-items-center bg-canvas px-5 text-sm text-muted" role="status">Carregando seus dados…</main>;
    if (onboarding) return <HouseholdOnboarding profileName={profileName} email={profileEmail} inviteToken={onboardingInvite} inviteFailed={onboardingInviteFailed} onActivate={activateHousehold} />;
  return <div className="min-h-dvh bg-canvas text-ink">
    <div className="mx-auto flex min-h-dvh max-w-7xl sm:px-5 lg:px-8">
      <aside className="hidden w-60 shrink-0 border-r border-line px-4 py-6 sm:block"><div className="mb-10 px-3"><BrandMark /><p className="mt-1 truncate text-xs text-muted">{activeHousehold?.name ?? "Casa"}</p></div><AppNavigation screen={screen} onChange={(next) => { setScreen(next); setHistoryDetail(null); }} /><div className="mt-auto pt-10"><div className="rounded-[14px] bg-sage p-4"><Sparkles size={18} className="text-primary" /><p className="mt-3 text-sm font-semibold text-ink">Tudo no lugar</p><p className="mt-1 text-xs leading-5 text-muted">Uma compra de cada vez, sem planilha.</p></div></div></aside>
      <main className={cn("min-w-0 flex-1", screen === "shop" && activeList && !historyDetail ? "pb-[calc(15rem+env(safe-area-inset-bottom))]" : "pb-24", "sm:pb-8")}>
        <header className="sticky top-0 z-sticky flex min-h-[68px] items-center justify-between border-b border-line bg-canvas/95 px-4 backdrop-blur sm:px-8"><div className="sm:hidden"><BrandMark compact /></div><div className="hidden min-w-0 sm:block"><p className="truncate text-sm font-semibold text-ink">{title}</p>{screen === "shop" && activeList ? <p className="mt-0.5 text-xs text-muted">{resolved} de {activeList.items.length} resolvidos</p> : null}</div><div className="flex items-center gap-2"><span className="hidden max-w-40 text-right sm:block"><span className="block truncate text-xs font-semibold text-ink">{profileLabel}</span><span className="block truncate text-[11px] text-muted">{profileEmail ?? (isSupabaseConfigured ? "Conta conectada" : "Modo demonstração")}</span></span><div className="relative"><button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-sm font-semibold text-white" aria-label={`Perfil de ${profileLabel}`} aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>{profileInitials}</button>{profileOpen ? <div className="absolute right-0 top-12 z-dropdown w-56 rounded-[12px] border border-line bg-surface p-1.5 shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.12)]"><button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-sage" onClick={() => { setProfileOpen(false); setHouseholdManagerOpen(true); }}><House size={16} />Casas e pessoas</button><button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-sage" onClick={() => { void signOut(); }}><LogOut size={16} />{isSupabaseConfigured ? "Sair da conta" : "Limpar dados locais"}</button></div> : null}</div></div></header>
        {syncWarning ? <div role="status" className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted sm:mx-8"><span>{syncWarning}</span><div className="flex gap-2"><button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-lg border border-line bg-canvas px-3 text-xs font-semibold text-ink">Tentar novamente</button><button type="button" onClick={() => window.location.assign("/login")} className="min-h-11 rounded-lg px-3 text-xs font-semibold text-primary">Ir para login</button></div></div> : null}
        {isSupabaseConfigured && (!isOnline || realtimeStatus !== "connected" || snapshotFailed || writeOperations.length > 0) ? <div role="status" aria-live="polite" className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted sm:mx-8"><div><p className="font-semibold text-ink">{!isOnline ? "Sem conexão com a internet" : writeOperations.some((operation) => operation.status === "failed") ? "Há alterações sem sincronizar" : writeOperations.length ? "Sincronizando alterações…" : snapshotFailed ? "Não foi possível atualizar a lista" : "Reconectando atualizações em tempo real…"}</p><p className="mt-1 text-xs">{!isOnline ? "As alterações ficam neste aparelho. Mantenha o app aberto para tentar novamente ao voltar a conexão." : writeOperations.some((operation) => operation.status === "failed") ? "Você pode tentar enviar as alterações novamente agora." : writeOperations.length ? `${writeOperations.length} alteração(ões) em envio.` : snapshotFailed ? "Vamos tentar carregar os dados novamente." : "A lista será atualizada quando a conexão voltar."}</p>{writeOperations.length ? <p className="mt-1 text-xs font-medium">{writeOperations.map((operation) => operation.label).join(" · ")}</p> : null}</div>{writeOperations.some((operation) => operation.status === "failed") ? <button type="button" onClick={() => writeOperations.filter((operation) => operation.status === "failed").forEach((operation) => operation.retry())} className="min-h-11 rounded-lg border border-line bg-canvas px-3 text-xs font-semibold text-ink">Tentar novamente</button> : null}</div> : null}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
          {historyDetail ? <HistoryDetail list={historyDetail} onBack={() => setHistoryDetail(null)} /> : screen === "history" ? <HistoryView lists={state.lists} onOpen={setHistoryDetail} /> : screen === "home" ? <ProductsHome products={state.products} lists={state.lists} householdName={activeHousehold?.name ?? "Casa"} categorySort={categorySort} onToggleCategorySort={toggleCategorySort} onNewPurchase={() => setNewPurchaseOpen(true)} onAddProduct={() => setProductEditor("new")} onToggleProduct={toggleProduct} onEditProduct={setProductEditor} onManageHousehold={() => setHouseholdManagerOpen(true)} /> : activeList ? <div className="space-y-5">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-primary">Dentro do mercado</p><h1 className="mt-1 break-words text-[25px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">{activeList.name}</h1><p className="mt-1 text-sm text-muted">{resolved} de {activeList.items.length} resolvidos</p></div><div className="relative"><IconButton label="Menu da compra" variant="bordered" onClick={() => setMenuOpen((open) => !open)}><Menu size={19} /></IconButton>{menuOpen ? <div className="absolute right-0 top-12 z-dropdown w-52 rounded-[12px] border border-line bg-surface p-1.5 shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.12)]"><button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-sage" onClick={() => { setMenuOpen(false); setNewPurchaseOpen(true); }}><Plus size={16} />Nova compra</button><button type="button" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-sage" onClick={() => { setMenuOpen(false); setFinishOpen(true); }}><CheckCircle2 size={16} />Finalizar compra</button></div> : null}</div></div>
            <BudgetSummary list={activeList} onEdit={() => setBudgetEditor(activeList)} />
            <div className="space-y-3"><label className="relative block"><Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar na lista" className="field-input h-12 pl-10" /></label><div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{(["all", "pending", "purchased", "already_have"] as Filter[]).map((value) => <button type="button" key={value} onClick={() => setFilter(value)} className={cn("min-h-11 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition", filter === value ? "border-primary bg-primary text-white" : "border-line bg-surface text-muted hover:border-primary/30 hover:text-ink")}>{value === "all" ? "Todos" : statusLabel(value)}</button>)}</div></div>
            {filteredItems.length ? <><div className="flex justify-end"><ViewModeToggle mode={shopViewMode} onChange={setShopViewMode} label="Ordenar itens da compra" /></div>{shopViewMode === "category" ? <div className="space-y-5">{CATEGORY_ORDER.map((category) => groups[category]?.length ? <CategorySection key={category} category={category} direction={categorySort[category] ?? "asc"} items={sortByName(groups[category] ?? [], categorySort[category] ?? "asc")} lists={state.lists} onToggleSort={() => toggleCategorySort(category)} onEdit={setEditorItem} onPurchased={(item) => setItemStatus(item, "purchased")} onAlreadyHave={(item) => setItemStatus(item, "already_have")} onUndo={(item) => setItemStatus(item, "pending")} /> : null)}</div> : <div className="divide-y divide-line border-y border-line">{alphabeticalItems.map((item) => <ShoppingItemRow key={item.id} item={item} lists={state.lists} onEdit={() => setEditorItem(item)} onPurchased={() => setItemStatus(item, "purchased")} onAlreadyHave={() => setItemStatus(item, "already_have")} onUndo={() => setItemStatus(item, "pending")} />)}</div>}</> : <EmptyState icon={<Search size={23} />} title="Nenhum item encontrado" description={query ? `Nada corresponde a “${query}”.` : "Esse filtro ainda não tem itens."} action={<Button variant="secondary" onClick={() => { setQuery(""); setFilter("all"); }}>Limpar filtros</Button>} />}
          </div> : <EmptyState icon={<ShoppingBasket size={23} />} title="Sua próxima compra começa aqui" description="Crie uma compra a partir dos produtos da casa." action={<Button onClick={() => setNewPurchaseOpen(true)}><Plus size={17} />Nova compra</Button>} />}
        </div>
      </main>
    </div>
    {!keyboardOpen ? <div className="sm:hidden"><AppNavigation screen={screen} onChange={(next) => { setScreen(next); setHistoryDetail(null); }} /></div> : null}
    {!keyboardOpen && screen === "shop" && activeList && !historyDetail ? <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-sticky border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:bottom-5 sm:left-auto sm:right-8 sm:w-[300px] sm:rounded-[14px] sm:border sm:shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.12)]"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-ink">{pending} pendentes</p><p className="mt-0.5 text-xs text-muted">{pending ? "A lista fica com você" : "Tudo resolvido"}</p></div><p className="text-sm font-semibold text-ink">{formatBRL(listTotal(activeList))}</p></div><button type="button" onClick={() => pending === 0 ? setFinishOpen(true) : setToast("Resolva ou marque como já temos para finalizar")} className="mt-3 min-h-11 w-full rounded-[10px] bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary-strong">{pending === 0 ? "Finalizar compra" : "Continuar compra"}</button></div> : null}
    {editorItem ? <ItemEditorSheet item={editorItem} lists={state.lists} onClose={() => setEditorItem(null)} onSave={saveItem} /> : null}
    {addItemOpen ? <AddItemSheet onClose={() => setAddItemOpen(false)} onAdd={addItem} /> : null}
    {newPurchaseOpen ? <NewPurchaseSheet products={state.products} onClose={() => setNewPurchaseOpen(false)} onCreate={createPurchase} /> : null}
    {finishOpen ? <ConfirmFinishSheet pending={pending} onClose={() => setFinishOpen(false)} onConfirm={finishPurchase} /> : null}
    {budgetEditor ? <BudgetEditorSheet list={budgetEditor} onClose={() => setBudgetEditor(null)} onSave={saveBudget} /> : null}
    {completeList ? <CompleteSheet list={completeList} onClose={() => setCompleteList(null)} onHistory={() => { setCompleteList(null); setScreen("history"); }} /> : null}
    {productEditor ? <ProductEditorSheet product={productEditor === "new" ? undefined : productEditor} onClose={() => setProductEditor(null)} onSave={saveProduct} /> : null}
    {householdManagerOpen && activeHousehold ? <HouseholdManager key={activeHousehold.id} households={households.length ? households : [activeHousehold]} activeHousehold={activeHousehold} enabled={isSupabaseConfigured} onClose={() => setHouseholdManagerOpen(false)} onSelect={activateHousehold} onCreated={activateHousehold} onMembershipChanged={refreshMemberships} notify={setToast} /> : null}
    {toast && !keyboardOpen ? <div role="status" className="fixed bottom-[calc(142px+env(safe-area-inset-bottom))] left-1/2 z-toast -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.16)] sm:bottom-7">{toast}</div> : null}
    {!keyboardOpen && screen === "shop" && activeList && !historyDetail ? <button type="button" className="fixed bottom-[calc(153px+env(safe-area-inset-bottom))] right-4 z-sticky grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.2)] transition hover:-translate-y-0.5 hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:bottom-8 sm:right-8" onClick={() => setAddItemOpen(true)} aria-label="Adicionar item"><Plus size={24} /></button> : null}
  </div>;
}
