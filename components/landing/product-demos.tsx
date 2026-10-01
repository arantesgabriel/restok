import { Check, History, House, ShoppingBasket } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
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
  const navigation = [
    { label: "Compra", icon: ShoppingBasket },
    { label: "Histórico", icon: History },
    { label: "Casa", icon: House },
  ];
  return (
    <section className="landing-showcase" aria-labelledby="showcase-title">
      <div className="landing-wrap">
        <figure className="landing-product-window">
          <div className="landing-browser-bar" aria-hidden="true">
            <span className="landing-browser-dots"><i /><i /><i /></span>
            <span>Uma lista para a casa</span>
          </div>
          <figcaption className="landing-preview-caption">{exampleLabel} · A lista que vai ao mercado com você.</figcaption>
          <div className="landing-preview-layout">
            <div className="landing-preview-main">
              <div className="landing-preview-heading">
                <p>Na compra</p>
                <h2 id="showcase-title">{showcaseList.name}</h2>
                <p>{showcaseItems.length} itens · Uma lista compartilhada</p>
              </div>
              <div className="landing-preview-content">
                <div>
                  <ul className="landing-preview-filters" aria-label="Filtros ilustrativos">
                    <li>Todos ({showcaseItems.length})</li>
                    <li>Pendentes ({showcaseItems.length - showcasePurchasedCount})</li>
                    <li>Comprados ({showcasePurchasedCount})</li>
                  </ul>
                  <ul className="landing-preview-items" aria-label="Itens da compra ilustrativa">
                    {showcaseItems.map((item) => <li key={item.id}><DemoRow item={item} /></li>)}
                  </ul>
                </div>
                <div className="landing-total-block landing-preview-summary">
                  <p>Total registrado</p>
                  <strong className="landing-num">{formatBRL(showcaseRegistered)}</strong>
                  <p>{showcasePurchasedCount} de {showcaseItems.length} comprados</p>
                  <div className="landing-progress" aria-hidden="true">
                    <span style={{ transform: `scaleX(${showcasePurchasedCount / showcaseItems.length})` }} />
                  </div>
                  <dl className="landing-preview-budget">
                    <div><dt>Orçamento</dt><dd className="landing-num">{formatBRL(showcaseBudget)}</dd></div>
                    <div><dt>Disponível</dt><dd className="landing-num">{formatBRL(showcaseRemaining)}</dd></div>
                  </dl>
                  <p className="landing-preview-note">Só os itens comprados entram no total.</p>
                </div>
              </div>
            </div>
            <div className="landing-preview-sidebar">
              <div className="landing-preview-brand" aria-hidden="true"><BrandMark compact /></div>
              <ul className="landing-preview-navigation" aria-label="Navegação ilustrativa do produto">
                {navigation.map(({ label, icon: Icon }, index) => (
                  <li key={label} data-selected={index === 0}><Icon size={18} aria-hidden="true" /><span>{label}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </figure>
        <p className="landing-showcase-caption">Vocês preparam em casa. A mesma lista segue para o mercado.</p>
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
