import type { ShoppingItem } from "@/lib/types";
import { formatBRL } from "@/lib/utils";
import styles from "./history.module.css";

export function HistoryPriceComparison({ item, previousPrice }: { item: ShoppingItem; previousPrice?: number }) {
  if (item.status !== "purchased" || item.unitPrice === undefined || previousPrice === undefined) return null;
  const difference = item.unitPrice - previousPrice;
  // An absolute unit-price difference also works when the previous price is zero.
  return <p className={styles.comparison}>{Math.abs(difference) < .005
    ? `Mesmo preço que a compra anterior (${formatBRL(previousPrice)}/un.)`
    : `${formatBRL(Math.abs(difference))} ${difference > 0 ? "a mais" : "a menos"} por unidade que a compra anterior (${formatBRL(previousPrice)}/un.)`}</p>;
}
