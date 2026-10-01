"use client";

import { useState } from "react";
import type { ItemStatus, ShoppingItem } from "@/lib/types";
import { formatBRL, listTotal } from "@/lib/utils";
import { countPurchased, exampleLabel, showcaseItems, showcaseList } from "./demo-data";
import { DemoReset, useDemoReady } from "./demo-controls";
import { DemoRow } from "./demo-row";

export function PurchaseDemo() {
  const [items, setItems] = useState(showcaseItems);
  const ready = useDemoReady();
  const total = listTotal({ ...showcaseList, items });
  const purchased = countPurchased(items);
  const alreadyHave = items.filter((item) => item.status === "already_have").length;
  const missingPrice = items.some((item) => item.status === "purchased" && item.unitPrice === undefined);
  function update(id: string, change: Partial<ShoppingItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...change } : item));
  }
  return <div className="landing-frame">
    <p className="landing-example">{exampleLabel}. Abra um item para experimentar estados e preços.</p>
    <div role="status" aria-atomic="true">
      <div className="landing-budget">
        <p><span>Total registrado</span><strong className="landing-num">{formatBRL(total)}</strong></p>
        <p><span>Orçamento</span><b className="landing-num">{formatBRL(showcaseList.budget)}</b></p>
      </div>
      <p className="landing-budget-note">{formatBRL(showcaseList.budget - total)} disponíveis · {purchased} de {items.length} comprados · {alreadyHave} já temos.</p>
      {missingPrice && <p className="landing-budget-note">Total parcial: há item comprado sem preço informado.</p>}
    </div>
    <progress className="landing-demo-progress" value={purchased} max={items.length} aria-label="Itens comprados" />
    <p className="landing-budget-note">Pendentes e “Já temos” não entram no total.</p>
    <ul className="landing-demo-items">
      {items.map((item) => <li key={item.id}><details className="landing-item-editor">
        <summary><DemoRow item={item} /><span className="landing-edit-hint">Editar item</span></summary>
        <fieldset className="landing-demo-fieldset landing-edit-fields" disabled={!ready}>
          <legend className="sr-only">Editar {item.name}</legend>
          <label>Situação de {item.name}<select value={item.status} onChange={(event) => update(item.id, { status: event.target.value as ItemStatus })}>
            <option value="pending">Pendente</option><option value="purchased">Comprado</option><option value="already_have">Já temos</option>
          </select></label>
          <label>Preço unitário de {item.name}<input type="number" min="0" step="0.01" inputMode="decimal" value={item.unitPrice ?? ""} onChange={(event) => {
            const value = event.target.valueAsNumber;
            if (event.target.value === "" || (Number.isFinite(value) && value >= 0)) update(item.id, { unitPrice: event.target.value === "" ? undefined : value });
          }} /></label>
        </fieldset>
      </details></li>)}
    </ul>
    <DemoReset ready={ready} onReset={() => setItems(showcaseItems)} />
  </div>;
}
