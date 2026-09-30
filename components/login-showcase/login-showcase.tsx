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
import {
  planningFrame,
  shoppingFrame,
  showcaseStepId,
  summaryFrame,
  type ShowcaseBeat,
  type ShowcaseStage,
} from "@/components/login-showcase/showcase-timeline";
import type { ItemStatus } from "@/lib/types";
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

  const script = scene.mode === "script" && scene.beat !== null;

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
        {script ? <ScriptScene stage={scene.stage} beat={scene.beat!} /> : (
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

function ScriptScene({ stage, beat }: { stage: ShowcaseStage; beat: ShowcaseBeat }) {
  const planning = stage === "planning" ? planningFrame(beat) : null;
  const shopping = stage === "shopping" ? shoppingFrame(beat) : null;
  const summary = stage === "summary" ? summaryFrame(beat) : null;
  const spent = shopping?.spentCents ?? summary?.spentCents ?? 0;
  const showBudget = shopping !== null || summary !== null;
  const budgetLabel = summary ? summary.label : "Gasto até agora";
  const countText = planning
    ? `${planning.itemCount} itens`
    : shopping
      ? `${shopping.resolved} de ${shopping.total} resolvidos`
      : null;
  const countBumped = planning ? planning.itemCount === planningJoinedItemCount : shopping !== null;
  const kicker = planning ? "Lista da casa" : summary ? "" : "Dentro do mercado";
  const rows = scriptRows(stage, beat);

  return (
    <>
      <article className={collaborationClass(stage, planning?.collaborationVisible ?? false)}>
        <span className="login-showcase-avatar">{demoCollaborator.initials}</span>
        <p><b>{demoCollaborator.name}</b> {demoCollaborator.action}</p>
      </article>

      <article className="login-showcase-list">
        <header className="login-showcase-list-head">
          <p className="login-showcase-kicker">{kicker}</p>
          <h3>{demoListName}</h3>
          {countText ? (
            <p>
              <span key={countText} className={countBumped ? "login-showcase-count is-bumped" : "login-showcase-count"}>
                {countText}
              </span>
            </p>
          ) : null}
        </header>
        {showBudget ? (
          <div className="login-showcase-budget is-script">
            <div className="login-showcase-budget-top">
              <div>
                <small key={budgetLabel}>{budgetLabel}</small>
                <strong key={spent} className={spent > 0 ? "is-bumped" : undefined}>{money(spent)}</strong>
              </div>
              {shopping ? (
                <p>
                  {money(demoBudgetCents - spent)} disponíveis
                  <span>de {money(demoBudgetCents)}</span>
                </p>
              ) : null}
            </div>
            {shopping ? (
              <div className="login-showcase-bar">
                <span style={{ width: `${demoBudgetCents > 0 ? Math.min(100, (spent / demoBudgetCents) * 100) : 0}%` }} />
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={rowsClass(stage)}>
          {rows.map((row) => (
            <ScriptItemRow key={row.item.id} item={row.item} status={row.status} emphasized={row.emphasized} fresh={row.fresh} priced={stage !== "planning"} />
          ))}
        </div>
        {shopping?.checkoutVisible ? (
          <div className="login-showcase-finish">
            <p>Tudo resolvido</p>
            <span>Finalizar compra</span>
          </div>
        ) : null}
        {summary?.metricsVisible ? (
          <div className="login-showcase-metrics">
            <p><b>{summary.purchased}</b><small>Itens comprados</small></p>
            <p><b>{money(summary.savedCents)}</b><small>Economizados</small></p>
            <p className="login-showcase-summary-meta">{summary.alreadyHave} já tínhamos</p>
          </div>
        ) : null}
        {summary && (summary.chartVisible || beat === "metrics") ? (
          <div className={summary.chartVisible ? "login-showcase-chart-block is-shown" : "login-showcase-chart-block"}>
            <HistoryChart totals={demoHistoryCents} scripted drawn={summary.chartVisible} />
            <p className="login-showcase-chart-label">Compras anteriores</p>
          </div>
        ) : null}
      </article>
    </>
  );
}

function collaborationClass(stage: ShowcaseStage, visible: boolean) {
  if (stage !== "planning") return "login-showcase-collab login-showcase-reveal is-dismissed";
  return visible ? "login-showcase-collab login-showcase-reveal is-shown" : "login-showcase-collab login-showcase-reveal";
}

function rowsClass(stage: ShowcaseStage) {
  if (stage === "planning") return "login-showcase-items is-planning";
  if (stage === "summary") return "login-showcase-items is-dismissed";
  return "login-showcase-items";
}

function scriptRows(stage: ShowcaseStage, beat: ShowcaseBeat) {
  if (stage === "planning") {
    const frame = planningFrame(beat);
    return planningSlotIds.flatMap((id) => {
      if (!frame.revealedIds.includes(id)) return [];
      const item = demoItems.find((entry) => entry.id === id);
      return item ? [{ item, status: "pending" as const, emphasized: false, fresh: id === "cafe" }] : [];
    });
  }
  const frame = stage === "summary" ? shoppingFrame("checkout") : shoppingFrame(beat);
  return frame.items.flatMap((row) => {
    const item = demoItems.find((entry) => entry.id === row.id);
    return item ? [{ item, status: row.status, emphasized: row.emphasized, fresh: false }] : [];
  });
}

function ScriptItemRow({
  item,
  status,
  emphasized,
  fresh,
  priced,
}: {
  item: DemoItem;
  status: ItemStatus;
  emphasized: boolean;
  fresh: boolean;
  priced: boolean;
}) {
  const resolved = status !== "pending";
  const classes = ["login-showcase-item"];
  if (resolved) classes.push("is-resolved");
  if (emphasized) classes.push("is-active");
  if (fresh) classes.push("is-fresh");
  return (
    <div className={classes.join(" ")}>
      <span className={`login-showcase-mark is-${status}`}>
        {status === "purchased" ? <Check size={15} strokeWidth={2.5} /> : status === "already_have" ? <House size={14} /> : categoryIcon(item.category)}
      </span>
      <div>
        <b>{item.name}</b>
        <small>{itemDetail(item, status, priced)}</small>
      </div>
    </div>
  );
}

function itemDetail(item: DemoItem, status: ItemStatus, priced: boolean) {
  if (status === "already_have") return `${item.quantity} un. · Já temos`;
  if (status === "purchased") return `${item.quantity} un. · ${money(lineCents(item))}`;
  if (priced && item.id !== "sabonete") return `${item.quantity} un. · ${money(item.unitPriceCents)}`;
  if (priced) return `${item.quantity} un.`;
  return `${item.quantity} un. · Pendente`;
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

function HistoryChart({ totals, scripted = false, drawn = false }: { totals: number[]; scripted?: boolean; drawn?: boolean }) {
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

  const chartClass = scripted
    ? drawn ? "login-showcase-chart is-script is-drawn" : "login-showcase-chart is-script"
    : "login-showcase-chart";

  return (
    <svg className={chartClass} viewBox={`0 0 ${width} ${height}`} role="presentation">
      <polyline pathLength={100} fill="none" points={coords.map((point) => `${point.x},${point.y}`).join(" ")} />
      {scripted && last ? <circle className="login-showcase-chart-halo" cx={last.x} cy={last.y} r="7" /> : null}
      {last ? <circle cx={last.x} cy={last.y} r="3" /> : null}
    </svg>
  );
}
