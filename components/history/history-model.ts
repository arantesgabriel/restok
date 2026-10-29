import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { latestPriceFor, listTotal, monthLabel } from "@/lib/utils";

export const historyDate = (list: ShoppingList) => list.finishedAt ?? list.startedAt;

export function completedHistory(lists: ShoppingList[]) {
  return lists.filter(list => list.status === "completed")
    .sort((a, b) => +new Date(historyDate(b)) - +new Date(historyDate(a)));
}

export function historyMonths(lists: ShoppingList[]) {
  const months: Array<{ label: string; lists: ShoppingList[] }> = [];
  for (const list of completedHistory(lists)) {
    const label = monthLabel(historyDate(list));
    const last = months.at(-1);
    if (last?.label === label) last.lists.push(list);
    else months.push({ label, lists: [list] });
  }
  return months;
}

export function historySummary(list: ShoppingList) {
  return {
    purchased: list.items.filter(item => item.status === "purchased").length,
    alreadyHave: list.items.filter(item => item.status === "already_have").length,
    pending: list.items.filter(item => item.status === "pending").length,
    withoutPrice: list.items.filter(item => item.status === "purchased" && item.unitPrice === undefined).length,
    total: listTotal(list),
  };
}

export function previousHistoryPrice(item: ShoppingItem, list: ShoppingList, lists: ShoppingList[]) {
  const date = +new Date(historyDate(list));
  return latestPriceFor(item.productId, lists.filter(candidate => candidate.status === "completed"
    && candidate.id !== list.id && +new Date(historyDate(candidate)) < date));
}
