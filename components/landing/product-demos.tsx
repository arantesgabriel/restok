import { DemoRow } from "./demo-row";
import { History, House, ShoppingBasket } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import type { ReactNode } from "react";
import { formatBRL, listTotal } from "@/lib/utils";
import {
  exampleLabel,
  historyLists,
  previousBreadPrice,
  showcaseBudget,
  showcaseItems,
  showcaseList,
  showcasePurchasedCount,
  showcaseRegistered,
  showcaseRemaining,
} from "@/components/landing/demo-data";

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

export { PlanningDemo } from "./planning-demo";

export { SharingDemo } from "./sharing-demo";

export { PurchaseDemo } from "./purchase-demo";

export function HistoryDemo() {
  return (
    <div className="landing-frame">
      <ExampleNote>{exampleLabel}. Compras concluídas. Abra uma compra para consultar seus itens e preços.</ExampleNote>
      <ol className="landing-history">
        {historyLists.map((list) => (
          <li key={list.id}>
            <details className="landing-history-detail">
              <summary>
                <span className="landing-row-name">{list.name}</span>
                <span className="landing-row-meta">{list.displayDate} · {list.items.length} itens</span>
                <span className="landing-num">{formatBRL(listTotal(list))}</span>
              </summary>
              <ul className="landing-demo-items" aria-label={`Itens de ${list.name}`}>{list.items.map((item) => <li key={item.id}><DemoRow item={item} /></li>)}</ul>
            </details>
          </li>
        ))}
      </ol>
      {previousBreadPrice !== undefined && <p className="landing-budget-note">Na Feira de sábado, o pão custou {formatBRL(previousBreadPrice)}. Na compra atual, seu preço é {formatBRL(showcaseItems[2].unitPrice!)}.</p>}
    </div>
  );
}
