import {
  countStatus,
  demoItems,
  demoStillStep,
  demoStory,
  lineCents,
  planningBaseItemCount,
  planningJoinedItemCount,
  planningSlotIds,
  resolutionOrder,
  savedCents,
  shoppingWindowIds,
  spentCents,
} from "@/components/login-showcase/showcase-data";
import type { ItemStatus } from "@/lib/types";

/**
 * Roteiro da demonstração de login e o reducer que o executa.
 * Planejamento, mercado e acompanhamento leem o beat. O quadro parado fica para reduced motion.
 *
 * 0.0s planning start
 * 1.0s arroz · 1.6s leite · 2.2s frango
 * 2.8s collaboration · 3.4s café
 * 4.2s shopping
 * 5.0s frango checked · 6.0s leite checked · 7.0s already have
 * 8.0s 7/11 · 8.3s 10/11 · 8.6s 11/11 · 9.0s checkout
 * 10.0s summary · 10.7s metrics · 11.5s chart
 * 13.0s hold · 15.0s restart
 */

export type ShowcaseStage = "planning" | "shopping" | "summary";

export type ShowcaseBeat =
  | "planning-start"
  | "item-arroz"
  | "item-leite"
  | "item-frango"
  | "collaboration"
  | "item-cafe"
  | "to-shopping"
  | "check-frango"
  | "check-leite"
  | "already-have"
  | "accelerate"
  | "accelerate-10"
  | "accelerate-11"
  | "checkout"
  | "summary"
  | "metrics"
  | "chart"
  | "hold";

export type ShowcaseCue = {
  atMs: number;
  stage: ShowcaseStage;
  beat: ShowcaseBeat;
};

export type StoryStepId = (typeof demoStory)[number]["id"];

export const showcaseLoopMs = 15_000;

export const showcaseCues = [
  { atMs: 0, stage: "planning", beat: "planning-start" },
  { atMs: 1_000, stage: "planning", beat: "item-arroz" },
  { atMs: 1_600, stage: "planning", beat: "item-leite" },
  { atMs: 2_200, stage: "planning", beat: "item-frango" },
  { atMs: 2_800, stage: "planning", beat: "collaboration" },
  { atMs: 3_400, stage: "planning", beat: "item-cafe" },
  { atMs: 4_200, stage: "shopping", beat: "to-shopping" },
  { atMs: 5_000, stage: "shopping", beat: "check-frango" },
  { atMs: 6_000, stage: "shopping", beat: "check-leite" },
  { atMs: 7_000, stage: "shopping", beat: "already-have" },
  { atMs: 8_000, stage: "shopping", beat: "accelerate" },
  { atMs: 8_300, stage: "shopping", beat: "accelerate-10" },
  { atMs: 8_600, stage: "shopping", beat: "accelerate-11" },
  { atMs: 9_000, stage: "shopping", beat: "checkout" },
  { atMs: 10_000, stage: "summary", beat: "summary" },
  { atMs: 10_700, stage: "summary", beat: "metrics" },
  { atMs: 11_500, stage: "summary", beat: "chart" },
  { atMs: 13_000, stage: "summary", beat: "hold" },
] as const satisfies readonly ShowcaseCue[];

export type ShowcaseIntent = "idle" | "playing" | "paused" | "stopped";

export type ShowcaseTimelineState = {
  intent: ShowcaseIntent;
  elapsedMs: number;
  reducedMotion: boolean;
  panelVisible: boolean;
  tabVisible: boolean;
};

export type ShowcaseScene = {
  mode: "still" | "script";
  stage: ShowcaseStage;
  beat: ShowcaseBeat | null;
  running: boolean;
};

export type ShowcaseTimelineEvent =
  | { type: "play" }
  | { type: "pause"; elapsedMs: number }
  | { type: "restart" }
  | { type: "interrupt" }
  | { type: "goTo"; stage: ShowcaseStage }
  | { type: "tick"; elapsedMs: number }
  | {
      type: "environment";
      reducedMotion: boolean;
      panelVisible: boolean;
      tabVisible: boolean;
      elapsedMs?: number;
    };

export const initialShowcaseTimelineState: ShowcaseTimelineState = {
  intent: "idle",
  elapsedMs: 0,
  reducedMotion: false,
  panelVisible: false,
  tabVisible: true,
};

const stepByStage: Record<ShowcaseStage, StoryStepId> = {
  planning: "planeje",
  shopping: "compre",
  summary: "acompanhe",
};

/** The loop point is the start of the next pass, not a beat of its own. */
export function normalizeElapsed(elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0 || elapsedMs >= showcaseLoopMs) return 0;
  return elapsedMs;
}

export function sceneFromElapsed(elapsedMs: number): { stage: ShowcaseStage; beat: ShowcaseBeat } {
  const elapsed = normalizeElapsed(elapsedMs);
  let current: ShowcaseCue = showcaseCues[0];
  for (const cue of showcaseCues) {
    if (cue.atMs <= elapsed) current = cue;
    else break;
  }
  return { stage: current.stage, beat: current.beat };
}

export function nextCueDelayMs(elapsedMs: number): number {
  const elapsed = normalizeElapsed(elapsedMs);
  const next = showcaseCues.find((cue) => cue.atMs > elapsed);
  return (next?.atMs ?? showcaseLoopMs) - elapsed;
}

export function elapsedForStage(stage: ShowcaseStage): number {
  const cue = showcaseCues.find((entry) => entry.stage === stage);
  return cue?.atMs ?? 0;
}

export function isShowcaseRunning(state: ShowcaseTimelineState): boolean {
  return state.intent === "playing" && !state.reducedMotion && state.panelVisible && state.tabVisible;
}

export function shouldAutoplay(state: ShowcaseTimelineState): boolean {
  return state.intent === "idle" && !state.reducedMotion && state.panelVisible && state.tabVisible;
}

export function deriveShowcaseScene(state: ShowcaseTimelineState): ShowcaseScene {
  if (state.reducedMotion || state.intent === "idle" || state.intent === "stopped") {
    return { mode: "still", stage: "shopping", beat: null, running: false };
  }
  const cue = sceneFromElapsed(state.elapsedMs);
  return {
    mode: "script",
    stage: cue.stage,
    beat: cue.beat,
    running: isShowcaseRunning(state),
  };
}

export type PlanningFrame = {
  revealedIds: readonly string[];
  itemCount: number;
  collaborationVisible: boolean;
};

const planningRevealCount: Partial<Record<ShowcaseBeat, number>> = {
  "planning-start": 0,
  "item-arroz": 1,
  "item-leite": 2,
  "item-frango": 3,
  collaboration: 3,
  "item-cafe": 4,
};

/** Quadro da cena 1. Fora do planejamento não revela itens: essa função não desenha as cenas seguintes. */
export function planningFrame(beat: ShowcaseBeat | null): PlanningFrame {
  const revealed = beat ? planningRevealCount[beat] ?? 0 : 0;
  return {
    revealedIds: planningSlotIds.slice(0, revealed),
    itemCount: revealed >= planningSlotIds.length ? planningJoinedItemCount : planningBaseItemCount,
    collaborationVisible: beat === "collaboration" || beat === "item-cafe",
  };
}

export type ShoppingItemFrame = {
  id: string;
  status: ItemStatus;
  emphasized: boolean;
};

export type ShoppingFrame = {
  resolved: number;
  total: number;
  spentCents: number;
  checkoutVisible: boolean;
  items: ShoppingItemFrame[];
};

const shoppingResolvedCount: Partial<Record<ShowcaseBeat, number>> = {
  "to-shopping": 0,
  "check-frango": 1,
  "check-leite": 2,
  "already-have": 3,
  accelerate: 7,
  "accelerate-10": 10,
  "accelerate-11": 11,
  checkout: 11,
};

const shoppingEmphasis: Partial<Record<ShowcaseBeat, string>> = {
  "check-frango": "frango",
  "check-leite": "leite",
  "already-have": "sabonete",
};

const demoItemById = new Map(demoItems.map((item) => [item.id, item]));

/** Quadro da cena 2. A progressão 7 → 10 → 11 acelera o contador sem uma ação por produto. */
export function shoppingFrame(beat: ShowcaseBeat): ShoppingFrame {
  const resolvedCount = shoppingResolvedCount[beat] ?? 0;
  const resolvedIds = new Set(resolutionOrder.slice(0, resolvedCount));
  const emphasis = shoppingEmphasis[beat];
  return {
    resolved: resolvedCount,
    total: demoItems.length,
    spentCents: resolutionOrder.slice(0, resolvedCount).reduce((total, id) => {
      const item = demoItemById.get(id);
      return total + (item ? lineCents(item) : 0);
    }, 0),
    checkoutVisible: beat === "checkout",
    items: shoppingWindowIds.map((id) => ({
      id,
      status: !resolvedIds.has(id) ? "pending" : id === "sabonete" ? "already_have" : "purchased",
      emphasized: emphasis === id,
    })),
  };
}

export type SummaryFrame = {
  label: "Compra concluída";
  spentCents: number;
  purchased: number;
  alreadyHave: number;
  savedCents: number;
  metricsVisible: boolean;
  chartVisible: boolean;
};

/** Quadro da cena 3. O total é o da compra inteira; métricas e gráfico entram depois. */
export function summaryFrame(beat: ShowcaseBeat): SummaryFrame {
  const metricsVisible = beat === "metrics" || beat === "chart" || beat === "hold";
  return {
    label: "Compra concluída",
    spentCents: spentCents(demoItems),
    purchased: countStatus(demoItems, "purchased"),
    alreadyHave: countStatus(demoItems, "already_have"),
    savedCents: savedCents(demoItems),
    metricsVisible,
    chartVisible: beat === "chart" || beat === "hold",
  };
}

export function showcaseStepId(scene: ShowcaseScene): StoryStepId {
  if (scene.mode === "still") return demoStillStep;
  return stepByStage[scene.stage];
}

export function reduceShowcaseTimeline(
  state: ShowcaseTimelineState,
  event: ShowcaseTimelineEvent,
): ShowcaseTimelineState {
  switch (event.type) {
    case "play":
      if (state.reducedMotion || state.intent === "playing") return state;
      if (state.intent === "paused") return { ...state, intent: "playing" };
      return { ...state, intent: "playing", elapsedMs: 0 };
    case "pause":
      if (state.intent !== "playing") return state;
      return { ...state, intent: "paused", elapsedMs: normalizeElapsed(event.elapsedMs) };
    case "restart":
      if (state.reducedMotion) {
        if (state.intent === "stopped" && state.elapsedMs === 0) return state;
        return { ...state, intent: "stopped", elapsedMs: 0 };
      }
      return { ...state, intent: "playing", elapsedMs: 0 };
    case "interrupt":
      if (state.intent === "stopped" && state.elapsedMs === 0) return state;
      return { ...state, intent: "stopped", elapsedMs: 0 };
    case "goTo": {
      if (state.reducedMotion) return state;
      const elapsedMs = elapsedForStage(event.stage);
      const intent = state.intent === "paused" ? "paused" : "playing";
      if (state.intent === intent && state.elapsedMs === elapsedMs) return state;
      return { ...state, intent, elapsedMs };
    }
    case "tick": {
      if (!isShowcaseRunning(state)) return state;
      const elapsedMs = normalizeElapsed(event.elapsedMs);
      if (elapsedMs === state.elapsedMs) return state;
      return { ...state, elapsedMs };
    }
    case "environment":
      return applyEnvironment(state, event);
    default:
      return state;
  }
}

function applyEnvironment(
  state: ShowcaseTimelineState,
  event: Extract<ShowcaseTimelineEvent, { type: "environment" }>,
): ShowcaseTimelineState {
  if (event.reducedMotion) {
    if (
      state.reducedMotion &&
      state.intent === "stopped" &&
      state.elapsedMs === 0 &&
      state.panelVisible === event.panelVisible &&
      state.tabVisible === event.tabVisible
    ) {
      return state;
    }
    return {
      ...state,
      reducedMotion: true,
      panelVisible: event.panelVisible,
      tabVisible: event.tabVisible,
      intent: "stopped",
      elapsedMs: 0,
    };
  }

  const sameFlags =
    !state.reducedMotion &&
    state.panelVisible === event.panelVisible &&
    state.tabVisible === event.tabVisible;
  if (sameFlags) return state;

  const next: ShowcaseTimelineState = {
    ...state,
    reducedMotion: false,
    panelVisible: event.panelVisible,
    tabVisible: event.tabVisible,
  };
  const wasRunning = isShowcaseRunning(state);
  const willRun = isShowcaseRunning(next);
  if (wasRunning && !willRun && event.elapsedMs !== undefined) {
    return { ...next, elapsedMs: normalizeElapsed(event.elapsedMs) };
  }
  return next;
}
