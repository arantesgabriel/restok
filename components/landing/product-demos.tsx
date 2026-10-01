import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { ShoppingItem } from "@/lib/types";
import { formatBRL, itemSubtotal, listTotal, statusLabel } from "@/lib/utils";
import {
  categories,
  exampleLabel,
  historyLists,
  householdPeople,
  previousBreadPrice,
  showcaseBudget,
  showcaseItems,
  showcaseList,
  showcasePurchasedCount,
  showcaseRegistered,
  showcaseRemaining,
} from "@/components/landing/demo-data";

function DemoRow({ item }: { item: ShoppingItem }) {
  const subtotal = itemSubtotal(item);
  return (
    <div className="landing-row">
      {item.status === "purchased" ? <Check size={16} aria-hidden="true" /> : <span className="landing-mark" aria-hidden="true" />}
      <span className="landing-row-copy">
        <span className="landing-row-name">{item.name}</span>
        <span className="landing-row-meta">{item.quantity} × {formatBRL(item.unitPrice ?? 0)} · {statusLabel(item.status)}</span>
      </span>
      <span className="landing-num">{subtotal > 0 ? formatBRL(subtotal) : "—"}</span>
    </div>
  );
}

function ExampleNote({ children }: { children: ReactNode }) {
  return <p className="landing-example">{children}</p>;
}

export function ProductShowcase() {
  return (
    <section className="landing-showcase" aria-labelledby="showcase-title">
      <div className="landing-wrap">
        <div className="landing-frame">
          <div>
            <ExampleNote>{exampleLabel}. Visão da compra, no caminho Compra, Histórico e Casa.</ExampleNote>
            <h2 id="showcase-title">{showcaseList.name}</h2>
            <div className="landing-rows">
              {showcaseItems.map((item) => <DemoRow key={item.id} item={item} />)}
            </div>
          </div>
          <div className="landing-total-block">
            <p>Total registrado</p>
            <strong className="landing-num">{formatBRL(showcaseRegistered)}</strong>
            <p>{showcasePurchasedCount} de {showcaseItems.length} comprados</p>
            <div className="landing-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${showcasePurchasedCount / showcaseItems.length})` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlanningDemo() {
  return (
    <div className="landing-frame">
      <ExampleNote>{exampleLabel}. Produtos habituais da casa, sem gravar nada nesta página.</ExampleNote>
      <p className="landing-demo-title">Tomate entra na próxima compra</p>
      <ul className="landing-categories">
        {categories.map((category) => (
          <li key={category} className={category === "Alimentos" ? "is-selected" : undefined}>{category}</li>
        ))}
      </ul>
      <div className="landing-rows">
        <DemoRow item={showcaseItems[0]} />
      </div>
    </div>
  );
}

export function SharingDemo() {
  const sharedItems = [showcaseItems[2], showcaseItems[1]];
  return (
    <div className="landing-frame">
      <ExampleNote>{exampleLabel}. Duas pessoas da casa veem a mesma lista quando há conexão.</ExampleNote>
      <ul className="landing-people">
        {householdPeople.map((person) => (
          <li key={person.initial}>
            <span aria-hidden="true">{person.initial}</span>
            <span>{person.role}</span>
          </li>
        ))}
      </ul>
      <div className="landing-rows">
        {sharedItems.map((item) => <DemoRow key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export function PurchaseDemo() {
  return (
    <div className="landing-frame">
      <ExampleNote>{exampleLabel}. O total soma só itens comprados com preço.</ExampleNote>
      <div className="landing-budget">
        <p><span>Total registrado</span><strong className="landing-num">{formatBRL(showcaseRegistered)}</strong></p>
        <p><span>Orçamento</span><b className="landing-num">{formatBRL(showcaseBudget)}</b></p>
      </div>
      <p className="landing-budget-note">{formatBRL(showcaseRemaining)} ainda disponíveis · {showcasePurchasedCount} de {showcaseItems.length} comprados. Itens pendentes e “Já temos” não entram no total.</p>
      <div className="landing-rows">
        {showcaseItems.map((item) => <DemoRow key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export function HistoryDemo() {
  return (
    <div className="landing-frame">
      <ExampleNote>{exampleLabel}. Compras concluídas, com data e total registrado.</ExampleNote>
      <ol className="landing-history">
        {historyLists.map((list) => (
          <li key={list.id}>
            <span className="landing-row-name">{list.name}</span>
            <span className="landing-row-meta">{list.displayDate} · {list.items.length} itens</span>
            <span className="landing-num">{formatBRL(listTotal(list))}</span>
          </li>
        ))}
      </ol>
      <p className="landing-budget-note">Na compra anterior, o pão custou {formatBRL(previousBreadPrice)}.</p>
    </div>
  );
}
