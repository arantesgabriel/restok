"use client";

import { HistoryView } from "@/components/history/history-view";
import { HistoryDetail } from "@/components/history/history-detail";
import { ProductsHome } from "@/components/products/products-home";
import { ProductEditorSheet } from "@/components/products/product-editor-sheet";
import { AppShell } from "@/components/app/app-shell";
import { HouseholdManager } from "@/components/household-manager";
import { HouseholdOnboarding } from "@/components/household-onboarding";
import { AddItemSheet } from "@/components/shopping/add-item-sheet";
import { BudgetEditorSheet } from "@/components/shopping/budget-editor-sheet";
import { CompleteSheet } from "@/components/shopping/complete-sheet";
import { ConfirmFinishSheet } from "@/components/shopping/confirm-finish-sheet";
import { ItemEditorSheet } from "@/components/shopping/item-editor-sheet";
import { NewPurchaseSheet } from "@/components/shopping/new-purchase-sheet";
import { ShoppingDock } from "@/components/shopping/shopping-dock";
import { ShoppingView } from "@/components/shopping/shopping-view";
import { useShoppingView } from "@/components/shopping/use-shopping-view";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SyncStatus } from "@/components/ui/sync-status";
import { Toast as ToastMessage } from "@/components/ui/toast";
import { useDialogClose } from "@/components/ui/use-dialog-close";
import { browserStorage,clearRemoteStateCaches,LEGACY_REMOTE_STATE_KEY,remoteStateStorageKey } from "@/lib/supabase/cache";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { acceptHouseholdInvite,activeHouseholdStorageKey,createShoppingListWithItems,loadCurrentProfile,loadRemoteState,loadUserHouseholds,persistList,persistProduct,persistProfileName,resolveRemoteContext,type RemoteWriteResult } from "@/lib/supabase/data";
import { subscribeToShoppingList,type RealtimeConnectionStatus } from "@/lib/supabase/realtime";
import { type CategoryName,type HouseholdSummary,type ItemStatus,type Product,type RestokState,type ShoppingItem,type ShoppingList } from "@/lib/types";
import {
categoryNameSortKey,
listPending,
listResolved,
listTotal,
makeId,
nextSortOrder,
readCategoryNameSorts,
type NameSortDirection
} from "@/lib/utils";
import {
House,
LogOut,
Pencil,
Plus,
ShoppingBasket,
} from "lucide-react";
import { useCallback,useEffect,useLayoutEffect,useRef,useState } from "react";

type AppScreen = "shop" | "history" | "home";
type WriteOperation = { key: string; token: string; label: string; status: "pending" | "failed"; retry: () => void };



function useCategoryNameSort(householdId: string | undefined) {
  const [categorySort, setCategorySort] = useState<Partial<Record<CategoryName, NameSortDirection>>>({});

  useLayoutEffect(() => {
    if (!householdId) {
      setCategorySort({});
      return;
    }
    setCategorySort(readCategoryNameSorts(browserStorage.getItem(categoryNameSortKey(householdId))));
  }, [householdId]);

  const toggleCategorySort = (category: CategoryName) => {
    setCategorySort((current) => {
      const next = { ...current, [category]: (current[category] ?? "asc") === "asc" ? "desc" : "asc" } as Partial<Record<CategoryName, NameSortDirection>>;
      if (householdId) browserStorage.setItem(categoryNameSortKey(householdId), JSON.stringify(next));
      return next;
    });
  };

  return { categorySort, toggleCategorySort };
}

function ProfileEditorSheet({ name, onClose, onSaved }: { name: string; onClose: () => boolean; onSaved: (name: string) => void }) {
  const [value, setValue] = useState(name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <Sheet title="Seu nome" description="Este nome identifica você para as pessoas da sua casa." onClose={onClose}>
    <form className="space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      if (busy) return;
      if (!value.trim()) { setError("Informe seu nome."); return; }
      setBusy(true); setError("");
      try {
        if (!await persistProfileName(value)) { setError("Não foi possível salvar seu nome. Tente novamente."); return; }
        onSaved(value.trim()); onClose();
      } catch { setError("Não foi possível salvar seu nome. Tente novamente."); }
      finally { setBusy(false); }
    }}>
      <Field label="Seu nome" initialFocus required maxLength={80} autoComplete="name" value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "profile-name-error" : undefined}  />
      {error ? <p id="profile-name-error" role="alert" className="text-sm text-terracotta">{error}</p> : null}
      <Button type="submit" disabled={busy} className="w-full">{busy ? "Salvando…" : "Salvar nome"}</Button>
    </form>
  </Sheet>;
}

export default function RestokApp() {
  const [state, setState] = useState<RestokState>({ products: [], lists: [] });
  const [hydrated, setHydrated] = useState(false);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [households, setHouseholds] = useState<HouseholdSummary[]>([]);
  const [activeHousehold, setActiveHousehold] = useState<HouseholdSummary | null>(null);
  const { categorySort, toggleCategorySort } = useCategoryNameSort(activeHousehold?.id);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardingInvite, setOnboardingInvite] = useState("");
  const [onboardingInviteFailed, setOnboardingInviteFailed] = useState(false);
  const [householdManagerOpen, setHouseholdManagerOpen] = useState(false);
  const [screen, updateScreen] = useState<AppScreen>("shop");
  const [historyReturnId, setHistoryReturnId] = useState<string | null>(null);
  const setScreen = (next: AppScreen) => {
    if (window.location.hash !== `#${next}`) window.history.pushState(window.history.state, "", `#${next}`);
    updateScreen(next);
  };
  useEffect(() => {
    const restore = () => {
      const [section, id] = window.location.hash.slice(1).split("/");
      updateScreen(section === "home" || section === "history" ? section : "shop");
      setHistoryDetailId(section === "history" && id ? id : null);
      if (section === "history" && id) setHistoryReturnId(id);
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore); };
  }, []);
  const [activeListId, setActiveListId] = useState("");
  const [historyDetailId, setHistoryDetailId] = useState<string | null>(null);
  const historyDetail = state.lists.find((list) => list.id === historyDetailId && list.status === "completed") ?? null;
  const setHistoryDetail = (list: ShoppingList | null) => {
    setHistoryDetailId(list?.id ?? null);
    if (list) { setHistoryReturnId(list.id); updateScreen("history"); window.history.pushState(window.history.state, "", `#history/${list.id}`); }
  };
  const [editorItem, setEditorItem] = useState<ShoppingItem | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newPurchaseOpen, setNewPurchaseOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [budgetEditor, setBudgetEditor] = useState<ShoppingList | null>(null);
  const [completeList, setCompleteList] = useState<ShoppingList | null>(null);
  const [finishResult, setFinishResult] = useState<ShoppingList | null>(null);
  const [productEditor, setProductEditor] = useState<Product | "new" | null>(null);
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
  const purchaseResultsRef = useRef<HTMLDivElement>(null);

  const requestRemoteRevalidation = useCallback(() => {
    needsRevalidationRef.current = true;
    if (revalidationInFlightRef.current) return;
    if (revalidationDebounceRef.current !== undefined) window.clearTimeout(revalidationDebounceRef.current);
    revalidationDebounceRef.current = window.setTimeout(() => {
      revalidationDebounceRef.current = undefined;
      setRevalidationVersion((version) => version + 1);
    }, 120);
  }, []);

  const requestSheetClose = useDialogClose();

  useEffect(() => {
    if (finishOpen || !finishResult) return;
    setCompleteList(finishResult);
    setFinishResult(null);
  }, [finishOpen, finishResult]);

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
    if (!hydrated) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        if (activeUserIdRef.current) clearRemoteStateCaches(browserStorage, activeUserIdRef.current);
        browserStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
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
        clearRemoteStateCaches(browserStorage, activeUserIdRef.current);
        activeUserIdRef.current = null;
        activeStorageKeyRef.current = null;
        setStorageKey(null);
        setState({ products: [], lists: [] });
        setHouseholds([]);
        setActiveHousehold(null);
        setProfileName(null);
        setProfileEmail(null);
        setHouseholdManagerOpen(false);
        setHydrated(false);
        window.location.reload();
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrated]);

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

      const context = await resolveRemoteContext(acceptedHouseholdId ?? undefined);
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
      const previouslySelectedHouseholdId = browserStorage.getItem(activeHouseholdStorageKey(context.userId));
      const scopedKey = remoteStateStorageKey(context.userId, context.householdId);
      activeStorageKeyRef.current = scopedKey;
      setStorageKey(scopedKey);
      browserStorage.removeItem(LEGACY_REMOTE_STATE_KEY);

      let cached: RestokState | null = null;
      try {
        const stored = browserStorage.getItem(scopedKey);
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
        browserStorage.removeItem(remoteStateStorageKey(context.userId, previouslySelectedHouseholdId));
      }
      browserStorage.setItem(activeHouseholdStorageKey(context.userId), context.householdId);
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
      else if (previouslySelectedHouseholdId && previouslySelectedHouseholdId !== context.householdId) setToast(`A casa selecionada não está mais disponível. Mostrando ${context.householdName}.`);
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
    if (hydrated && storageKey) browserStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, hydrated, storageKey]);

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
  const shoppingView = useShoppingView(activeList);
  const { setQuery, setFilter } = shoppingView;
  const resolved = activeList ? listResolved(activeList) : 0;
  const pending = activeList ? listPending(activeList) : 0;
  const showPendingItems = () => {
    setQuery("");
    setFilter("pending");
    purchaseResultsRef.current?.scrollIntoView?.({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
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
    const task = previous.then(() => !isSupabaseConfigured ? ({ ok: false, message: "O servidor está indisponível." } as const) : window.navigator.onLine ? write() : ({ ok: false, message: "Sem conexão com a internet." } as const)).catch(() => ({ ok: false, message: "Não foi possível sincronizar esta alteração." } as const));
    writeChainsRef.current.set(key, task);
    void task.then((result) => {
      if (writeVersionsRef.current.get(key) !== token) return;
      writeChainsRef.current.delete(key);
      if (result.ok && result.synced) {
        writeVersionsRef.current.delete(key);
        setWriteOperations((current) => current.filter((operation) => operation.token !== token));
        setToast(label);
        onSuccess?.();
        requestRemoteRevalidation();
      } else {
        setWriteOperations((current) => current.map((operation) => operation.token === token ? { ...operation, status: "failed" } : operation));
        const message = result.ok ? "O servidor ainda não confirmou esta alteração." : result.message;
        setToast(`${message} A alteração ficou neste aparelho; tente novamente.`);
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
  };
  const createPurchase = (name: string, budget: number, selectedIds: string[]) => {
    const items: ShoppingItem[] = state.products.filter((product) => selectedIds.includes(product.id)).map((product, index) => ({ id: makeId("item"), productId: product.id, name: product.name, category: product.category, quantity: product.defaultQuantity, status: "pending", sortOrder: index }));
    const list: ShoppingList = { id: makeId("list"), name, budget, status: "active", startedAt: new Date().toISOString(), items };
    const completedAt = new Date().toISOString();
    setState((current) => ({ ...current, lists: [list, ...current.lists.map((currentList): ShoppingList => currentList.status === "active" ? { ...currentList, status: "completed", finishedAt: completedAt } : currentList)] }));
    setActiveListId(list.id); setScreen("shop"); setQuery(""); setFilter("all");
    runRemoteWrite(`list:${list.id}`, "Nova compra pronta", () => createShoppingListWithItems(list, activeHouseholdId));
  };
  const finishPurchase = () => {
    if (!activeList) return;
    const finished = { ...activeList, status: "completed" as const, finishedAt: new Date().toISOString() };
    setState((current) => ({ ...current, lists: current.lists.map((list) => list.id === activeList.id ? finished : list) }));
    runRemoteWrite(`list:${finished.id}`, "Compra salva no histórico", () => persistList(finished, activeHouseholdId), () => setFinishResult(finished));
  };
  const saveBudget = (budget: number) => {
    if (!budgetEditor) return;
    const updated = { ...budgetEditor, budget };
    setState((current) => ({ ...current, lists: current.lists.map((list) => list.id === updated.id ? updated : list) }));
    persistUpdatedList(updated, "Meta da compra atualizada");
  };
  const saveProduct = (product: Omit<Product, "id" | "active">, id?: string) => {
    const savedProduct: Product = id ? { ...state.products.find((item) => item.id === id)!, ...product, id, active: state.products.find((item) => item.id === id)?.active ?? true } : { ...product, id: makeId("product"), active: true };
    setState((current) => ({ ...current, products: id ? current.products.map((item) => item.id === id ? savedProduct : item) : [...current.products, savedProduct] }));
    runRemoteWrite(`product:${savedProduct.id}`, id ? "Produto atualizado" : "Produto adicionado à casa", () => persistProduct(savedProduct, activeHouseholdId));
  };
  const toggleProduct = (id: string) => {
    const product = state.products.find((item) => item.id === id);
    if (!product) return;
    const focusedToggle = document.activeElement instanceof HTMLElement && document.activeElement.dataset.productToggleId === id;
    const updated = { ...product, active: !product.active };
    setState((current) => ({ ...current, products: current.products.map((item) => item.id === id ? updated : item) }));
    if (focusedToggle) window.requestAnimationFrame(() => {
      const productToggles = [...document.querySelectorAll<HTMLButtonElement>("[data-product-toggle-id]")];
      const nextToggle = productToggles.find((button) => button.dataset.productToggleId === id);
      const destination = updated.active ? nextToggle : document.querySelector<HTMLElement>("[data-inactive-products-summary]");
      (destination ?? document.querySelector<HTMLElement>("[data-products-heading]"))?.focus();
    });
    runRemoteWrite(`product:${updated.id}`, updated.active ? "Produto ativado" : "Produto desativado", () => persistProduct(updated, activeHouseholdId));
  };
  const activateHousehold = async (householdId: string) => {
    if (!isSupabaseConfigured) return false;
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
    browserStorage.setItem(activeHouseholdStorageKey(context.userId), context.householdId);
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
      browserStorage.removeItem(remoteStateStorageKey(activeUserIdRef.current, activeHousehold.id));
    }
    if (availableHouseholds.length) {
      await activateHousehold(availableHouseholds[0].id);
      return;
    }
    if (activeHousehold && activeUserIdRef.current) {
      browserStorage.removeItem(remoteStateStorageKey(activeUserIdRef.current, activeHousehold.id));
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

    if (activeUserIdRef.current) clearRemoteStateCaches(browserStorage, activeUserIdRef.current);
    browserStorage.removeItem(LEGACY_REMOTE_STATE_KEY);
    activeUserIdRef.current = null;
    activeStorageKeyRef.current = null;
    setStorageKey(null);
    window.location.replace("/login");
  };

    const profileLabel = profileName || profileEmail || "Conta";
    const profileInitials = profileName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("pt-BR") || profileEmail?.[0]?.toLocaleUpperCase("pt-BR") || "C";
    if (!hydrated) return <main className="mx-auto max-w-lg px-5"><Skeleton label="Carregando seus dados…" rows={4}/></main>;
    if (onboarding) return <HouseholdOnboarding profileName={profileName} email={profileEmail} inviteToken={onboardingInvite} inviteFailed={onboardingInviteFailed} onActivate={activateHousehold} />;
  return <AppShell screen={screen} onChange={next=>{setScreen(next);setHistoryDetail(null);}} houseName={activeHousehold?.name ?? "Casa"} onHouseOpen={()=>setHouseholdManagerOpen(true)} keyboardOpen={keyboardOpen}
    noticeTitle={syncWarning ? "Dados da casa sem atualização · ver aviso" : isSupabaseConfigured && (!isOnline || realtimeStatus !== "connected" || snapshotFailed || writeOperations.length > 0) ? !isOnline ? "Sem conexão · ver detalhes" : snapshotFailed || writeOperations.some(operation=>operation.status === "failed") ? "Alterações sem sincronizar · ver detalhes" : "Atualizações em andamento · ver detalhes" : undefined}
    feedback={toast && !keyboardOpen ? <ToastMessage inline key={toast} message={toast} onDismiss={()=>setToast(null)}/> : null}
    profile={<ActionMenu
          label={`Perfil de ${profileLabel}`}

          items={[
            { label: "Editar meu nome", icon: <Pencil size={16} />, onSelect: () => setProfileEditorOpen(true) },
            { label: "Casas e pessoas", icon: <House size={16} />, onSelect: () => setHouseholdManagerOpen(true) },
            { label: "Sair da conta", icon: <LogOut size={16} />, onSelect: () => { void signOut(); } },
          ]}
        >{profileInitials}</ActionMenu>}
    notices={<>{syncWarning ? <div role="status" className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted sm:mx-8"><span>{syncWarning}</span><div className="flex gap-2"><button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-lg border border-line bg-canvas px-3 text-xs font-semibold text-ink">Tentar novamente</button><button type="button" onClick={() => window.location.assign("/login")} className="min-h-11 rounded-lg px-3 text-xs font-semibold text-primary">Ir para login</button></div></div> : null}
        {isSupabaseConfigured && (!isOnline || realtimeStatus !== "connected" || snapshotFailed || writeOperations.length > 0) ? <SyncStatus state={snapshotFailed || writeOperations.some(operation=>operation.status === "failed") ? "error" : "pending"} message={<div><p>{!isOnline ? "Sem conexão com a internet" : writeOperations.some((operation) => operation.status === "failed") ? "Há alterações sem sincronizar" : writeOperations.length ? "Sincronizando alterações…" : snapshotFailed ? "Não foi possível atualizar a lista" : "Reconectando atualizações em tempo real…"}</p><p>{!isOnline ? "As alterações ficam neste aparelho. Mantenha o app aberto para tentar novamente ao voltar a conexão." : writeOperations.some((operation) => operation.status === "failed") ? "Você pode tentar enviar as alterações novamente agora." : writeOperations.length ? `${writeOperations.length} alteração(ões) em envio.` : snapshotFailed ? "Vamos tentar carregar os dados novamente." : "A lista será atualizada quando a conexão voltar."}</p>{writeOperations.length ? <p>{writeOperations.map((operation) => operation.label).join(" · ")}</p> : null}</div>} onRetry={writeOperations.some(operation=>operation.status === "failed") ? ()=>writeOperations.filter(operation=>operation.status === "failed").forEach(operation=>operation.retry()) : undefined}/> : null}</>}
    dock={!keyboardOpen && screen === "shop" && activeList && !historyDetail ? <ShoppingDock pending={pending} total={listTotal(activeList)} resolved={resolved} count={activeList.items.length} onPending={showPendingItems} onFinish={()=>setFinishOpen(true)} onAdd={()=>setAddItemOpen(true)}/> : undefined}
    overlays={<>{profileEditorOpen ? <ProfileEditorSheet name={profileName ?? ""} onClose={() => requestSheetClose(() => setProfileEditorOpen(false))} onSaved={(name) => { setProfileName(name); setToast("Nome atualizado."); }} /> : null}
    {editorItem ? <ItemEditorSheet item={editorItem} lists={state.lists} onClose={() => requestSheetClose(() => setEditorItem(null))} onSave={saveItem} /> : null}
    {addItemOpen ? <AddItemSheet onClose={() => requestSheetClose(() => setAddItemOpen(false))} onAdd={addItem} /> : null}
    {newPurchaseOpen ? <NewPurchaseSheet products={state.products} activeList={activeList} onClose={() => requestSheetClose(() => setNewPurchaseOpen(false))} onCreate={createPurchase} /> : null}
    {finishOpen ? <ConfirmFinishSheet pending={pending} onClose={() => requestSheetClose(() => setFinishOpen(false))} onConfirm={finishPurchase} /> : null}
    {budgetEditor ? <BudgetEditorSheet list={budgetEditor} onClose={() => requestSheetClose(() => setBudgetEditor(null))} onSave={saveBudget} /> : null}
    {completeList ? <CompleteSheet list={completeList} onClose={() => requestSheetClose(() => setCompleteList(null))} onHistory={() => requestSheetClose(() => { setCompleteList(null); setScreen("history"); })} /> : null}
    {productEditor ? <ProductEditorSheet product={productEditor === "new" ? undefined : productEditor} onClose={() => requestSheetClose(() => setProductEditor(null))} onSave={saveProduct} /> : null}
    {householdManagerOpen && activeHousehold ? <HouseholdManager key={activeHousehold.id} households={households.length ? households : [activeHousehold]} activeHousehold={activeHousehold} enabled={isSupabaseConfigured} onClose={() => requestSheetClose(() => setHouseholdManagerOpen(false))} onSelect={activateHousehold} onCreated={activateHousehold} onMembershipChanged={refreshMemberships} notify={setToast} /> : null}
</>}
  >{historyDetail ? <HistoryDetail list={historyDetail} lists={state.lists} onBack={() => { setHistoryDetail(null); setScreen("history"); }} /> : screen === "history" ? <HistoryView lists={state.lists} onOpen={setHistoryDetail} returnToId={historyReturnId} /> : screen === "home" ? <ProductsHome products={state.products} lists={state.lists} householdName={activeHousehold?.name ?? "Casa"} categorySort={categorySort} onToggleCategorySort={toggleCategorySort} onNewPurchase={() => setNewPurchaseOpen(true)} onAddProduct={() => setProductEditor("new")} onToggleProduct={toggleProduct} onEditProduct={setProductEditor} onManageHousehold={() => setHouseholdManagerOpen(true)} /> : activeList ? <ShoppingView list={activeList} lists={state.lists} view={shoppingView} categorySort={categorySort} resultsRef={purchaseResultsRef} onToggleSort={toggleCategorySort} onNew={()=>setNewPurchaseOpen(true)} onFinish={()=>setFinishOpen(true)} onBudget={()=>setBudgetEditor(activeList)} onAdd={()=>setAddItemOpen(true)} onEdit={setEditorItem} onPurchased={item=>setItemStatus(item,"purchased")} onAlreadyHave={item=>setItemStatus(item,"already_have")} onUndo={item=>setItemStatus(item,"pending")}/> : <EmptyState icon={<ShoppingBasket size={23}/>} title="Sua próxima compra começa aqui" description="Crie uma compra a partir dos produtos da casa." action={<Button onClick={()=>setNewPurchaseOpen(true)}><Plus size={17}/>Nova compra</Button>}/>}</AppShell>;
}
