"use client";

import { Check, House } from "lucide-react";
import { formatBRL, categoryIcon } from "@/lib/utils";
import {
  countStatus,
  demoBudgetCents,
  demoCollaborator,
  demoHistoryCents,
  demoItems,
  demoListName,
  demoStillItemIds,
  demoStory,
  lineCents,
  planningJoinedItemCount,
  planningSlotIds,
  resolvedCount,
  savedCents,
  spentCents,
  type DemoItem,
} from "@/components/login-showcase/showcase-data";
import { planningFrame, showcaseStepId, type ShowcaseBeat } from "@/components/login-showcase/showcase-timeline";
import { useShowcaseTimeline } from "@/components/login-showcase/use-showcase-timeline";

const money = (cents: number) => formatBRL(cents / 100);

const stillItems = demoStillItemIds.flatMap((id) => {
  const found = demoItems.find((item) => item.id === id);
  return found ? [found] : [];
});

export function LoginShowcase() {
  const { scene } = useShowcaseTimeline();
  const stepId = showcaseStepId(scene);
  const spent = spentCents(demoItems);
  const remaining = demoBudgetCents - spent;
  const saved = savedCents(demoItems);
  const purchased = countStatus(demoItems, "purchased");
  const alreadyHave = countStatus(demoItems, "already_have");
  const ratio = demoBudgetCents > 0 ? Math.min(100, (spent / demoBudgetCents) * 100) : 0;

  const planning = scene.mode === "script" && scene.stage === "planning" && scene.beat !== null;

  return (
    <aside className="login-showcase" aria-labelledby="login-showcase-title">
      <header className="login-showcase-copy">
        <h2 id="login-showcase-title">Sua compra, da lista à próxima.</h2>
        <p>Vocês planejam juntos, acompanham o gasto no mercado e levam o total para a próxima compra.</p>
      </header>

      <div
        className="login-showcase-stage"
        data-stage={scene.mode === "still" ? "still" : scene.stage}
        data-beat={scene.beat ?? "still"}
        aria-hidden="true"
      >
        {planning ? <PlanningScene beat={scene.beat!} /> : (
          <StillScene
            spent={spent}
            remaining={remaining}
            saved={saved}
            purchased={purchased}
            alreadyHave={alreadyHave}
            ratio={ratio}
          />
        )}
      </div>

      <ol className="login-showcase-steps" aria-hidden="true">
        {demoStory.map((step) => (
          <li key={step.id} className={step.id === stepId ? "is-current" : undefined}>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function StillScene({
  spent,
  remaining,
  saved,
  purchased,
  alreadyHave,
  ratio,
}: {
  spent: number;
  remaining: number;
  saved: number;
  purchased: number;
  alreadyHave: number;
  ratio: number;
}) {
  return (
    <>
      <article className="login-showcase-collab">
        <span className="login-showcase-avatar">{demoCollaborator.initials}</span>
        <p><b>{demoCollaborator.name}</b> {demoCollaborator.action}</p>
      </article>

      <article className="login-showcase-list">
        <header className="login-showcase-list-head">
          <p className="login-showcase-kicker">Dentro do mercado</p>
          <h3>{demoListName}</h3>
          <p>{resolvedCount(demoItems)} de {demoItems.length} resolvidos</p>
        </header>
        <div className="login-showcase-budget">
          <div className="login-showcase-budget-top">
            <div>
              <small>Gasto até agora</small>
              <strong>{money(spent)}</strong>
            </div>
            <p>
              {money(remaining)} disponíveis
              <span>de {money(demoBudgetCents)}</span>
            </p>
          </div>
          <div className="login-showcase-bar"><span style={{ width: `${ratio}%` }} /></div>
        </div>
        <div className="login-showcase-items">
          {stillItems.map((item) => <DemoItemRow key={item.id} item={item} />)}
        </div>
      </article>

      <article className="login-showcase-summary">
        <p className="login-showcase-kicker">Compra concluída</p>
        <p className="login-showcase-total">{money(spent)}</p>
        <p className="login-showcase-summary-meta">{purchased} comprados · {alreadyHave} já tínhamos</p>
        <p className="login-showcase-saved"><b>{money(saved)}</b> economizados</p>
        <HistoryChart totals={demoHistoryCents} />
        <p className="login-showcase-chart-label">Compras anteriores</p>
      </article>
    </>
  );
}

function PlanningScene({ beat }: { beat: ShowcaseBeat }) {
  const frame = planningFrame(beat);
  const slots = planningSlotIds.flatMap((id) => {
    const found = demoItems.find((item) => item.id === id);
    return found ? [found] : [];
  });

  return (
    <>
      <article className={frame.collaborationVisible ? "login-showcase-collab login-showcase-reveal is-shown" : "login-showcase-collab login-showcase-reveal"}>
        <span className="login-showcase-avatar">{demoCollaborator.initials}</span>
        <p><b>{demoCollaborator.name}</b> {demoCollaborator.action}</p>
      </article>

      <article className="login-showcase-list">
        <header className="login-showcase-list-head">
          <p className="login-showcase-kicker">Lista da casa</p>
          <h3>{demoListName}</h3>
          <p>
            <span className={frame.itemCount === planningJoinedItemCount ? "login-showcase-count is-bumped" : "login-showcase-count"}>
              {frame.itemCount} itens
            </span>
          </p>
        </header>
        <div className="login-showcase-items is-planning">
          {slots.filter((item) => frame.revealedIds.includes(item.id)).map((item) => (
            <div key={item.id} className={item.id === "cafe" ? "login-showcase-item is-fresh" : "login-showcase-item"}>
              <PlanningItemRow item={item} />
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

function PlanningItemRow({ item }: { item: DemoItem }) {
  return (
    <>
      <span className="login-showcase-mark">{categoryIcon(item.category)}</span>
      <div>
        <b>{item.name}</b>
        <small>{item.quantity} un. · Pendente</small>
      </div>
    </>
  );
}

function DemoItemRow({ item }: { item: DemoItem }) {
  const resolved = item.status !== "pending";
  return (
    <div className={resolved ? "login-showcase-item is-resolved" : "login-showcase-item"}>
      <span className={`login-showcase-mark is-${item.status}`}>
        {item.status === "purchased" ? <Check size={15} strokeWidth={2.5} /> : item.status === "already_have" ? <House size={14} /> : categoryIcon(item.category)}
      </span>
      <div>
        <b>{item.name}</b>
        <small>
          {item.quantity} un.
          {item.status === "purchased" ? ` · ${money(item.unitPriceCents)} un.` : null}
          {item.status === "already_have" ? " · Já temos" : null}
          {item.status === "pending" ? " · Pendente" : null}
        </small>
      </div>
      {lineCents(item) > 0 ? <strong>{money(lineCents(item))}</strong> : null}
    </div>
  );
}

function HistoryChart({ totals }: { totals: number[] }) {
  const width = 220;
  const height = 36;
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const span = max - min || 1;
  const coords = totals.map((value, index) => {
    const x = totals.length === 1 ? width / 2 : (index / (totals.length - 1)) * width;
    const y = height - 4 - ((value - min) / span) * (height - 8);
    return { x, y };
  });
  const last = coords[coords.length - 1];

  return (
    <svg className="login-showcase-chart" viewBox={`0 0 ${width} ${height}`} role="presentation">
      <polyline fill="none" points={coords.map((point) => `${point.x},${point.y}`).join(" ")} />
      {last ? <circle cx={last.x} cy={last.y} r="3" /> : null}
    </svg>
  );
}
