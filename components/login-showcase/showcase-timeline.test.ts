import { describe, expect, it } from "vitest";
import {
  deriveShowcaseScene,
  elapsedForStage,
  initialShowcaseTimelineState,
  isShowcaseRunning,
  nextCueDelayMs,
  reduceShowcaseTimeline,
  sceneFromElapsed,
  showcaseCues,
  showcaseLoopMs,
  showcaseStepId,
  shouldAutoplay,
  type ShowcaseBeat,
  type ShowcaseStage,
  type ShowcaseTimelineState,
} from "@/components/login-showcase/showcase-timeline";

const marks = [
  [0, "planning", "planning-start"],
  [999, "planning", "planning-start"],
  [1000, "planning", "item-arroz"],
  [1599, "planning", "item-arroz"],
  [1600, "planning", "item-leite"],
  [2199, "planning", "item-leite"],
  [2200, "planning", "item-frango"],
  [2799, "planning", "item-frango"],
  [2800, "planning", "collaboration"],
  [3399, "planning", "collaboration"],
  [3400, "planning", "item-cafe"],
  [4199, "planning", "item-cafe"],
  [4200, "shopping", "to-shopping"],
  [4999, "shopping", "to-shopping"],
  [5000, "shopping", "check-frango"],
  [5999, "shopping", "check-frango"],
  [6000, "shopping", "check-leite"],
  [6999, "shopping", "check-leite"],
  [7000, "shopping", "already-have"],
  [7999, "shopping", "already-have"],
  [8000, "shopping", "accelerate"],
  [8999, "shopping", "accelerate"],
  [9000, "shopping", "checkout"],
  [9999, "shopping", "checkout"],
  [10000, "summary", "summary"],
  [10699, "summary", "summary"],
  [10700, "summary", "metrics"],
  [11499, "summary", "metrics"],
  [11500, "summary", "chart"],
  [12999, "summary", "chart"],
  [13000, "summary", "hold"],
  [14999, "summary", "hold"],
  [15000, "planning", "planning-start"],
] as const satisfies ReadonlyArray<readonly [number, ShowcaseStage, ShowcaseBeat]>;

const playingAt = (elapsedMs: number): ShowcaseTimelineState => ({
  intent: "playing",
  elapsedMs,
  reducedMotion: false,
  panelVisible: true,
  tabVisible: true,
});

const desktop = {
  type: "environment" as const,
  reducedMotion: false,
  panelVisible: true,
  tabVisible: true,
};

describe("showcase timeline script", () => {
  it("keeps one increasing script that holds and then restarts", () => {
    const times = showcaseCues.map((cue) => cue.atMs);
    expect(times[0]).toBe(0);
    expect(new Set(times).size).toBe(times.length);
    for (let index = 1; index < times.length; index += 1) {
      expect(times[index]).toBeGreaterThan(times[index - 1]);
    }
    expect(showcaseCues.at(-1)).toMatchObject({ atMs: 13_000, beat: "hold", stage: "summary" });
    expect(showcaseLoopMs).toBe(15_000);
    expect(nextCueDelayMs(0)).toBe(1_000);
    expect(nextCueDelayMs(4_500)).toBe(500);
    expect(nextCueDelayMs(13_000)).toBe(2_000);
    expect(nextCueDelayMs(15_000)).toBe(1_000);
    expect(elapsedForStage("planning")).toBe(0);
    expect(elapsedForStage("shopping")).toBe(4_200);
    expect(elapsedForStage("summary")).toBe(10_000);
  });

  it.each(marks)("at %sms is %s / %s", (elapsedMs, stage, beat) => {
    expect(sceneFromElapsed(elapsedMs)).toEqual({ stage, beat });
  });
});

describe("showcase timeline controls", () => {
  it("starts on the still frame and autoplays only when the panel can run", () => {
    const still = deriveShowcaseScene(initialShowcaseTimelineState);
    expect(still).toMatchObject({ mode: "still", stage: "shopping", beat: null, running: false });
    expect(showcaseStepId(still)).toBe("compre");
    expect(shouldAutoplay(initialShowcaseTimelineState)).toBe(false);

    const ready = reduceShowcaseTimeline(initialShowcaseTimelineState, desktop);
    expect(shouldAutoplay(ready)).toBe(true);
    const started = reduceShowcaseTimeline(ready, { type: "play" });
    expect(started).toMatchObject({ intent: "playing", elapsedMs: 0 });
    expect(showcaseStepId(deriveShowcaseScene(started))).toBe("planeje");
    expect(isShowcaseRunning(started)).toBe(true);
  });

  it("pauses, resumes, seeks, restarts, and wraps without stacking a play", () => {
    const atFrango = playingAt(2_200);
    expect(reduceShowcaseTimeline(atFrango, { type: "play" })).toBe(atFrango);

    const paused = reduceShowcaseTimeline(atFrango, { type: "pause", elapsedMs: 2_450 });
    expect(paused).toMatchObject({ intent: "paused", elapsedMs: 2_450 });
    expect(isShowcaseRunning(paused)).toBe(false);
    expect(reduceShowcaseTimeline(paused, { type: "tick", elapsedMs: 5_000 })).toBe(paused);
    expect(showcaseStepId(deriveShowcaseScene(paused))).toBe("planeje");

    const resumed = reduceShowcaseTimeline(paused, { type: "play" });
    expect(resumed).toMatchObject({ intent: "playing", elapsedMs: 2_450 });

    const summary = reduceShowcaseTimeline(resumed, { type: "goTo", stage: "summary" });
    expect(summary).toMatchObject({ intent: "playing", elapsedMs: 10_000 });
    expect(showcaseStepId(deriveShowcaseScene(summary))).toBe("acompanhe");

    const pausedSeek = reduceShowcaseTimeline(paused, { type: "goTo", stage: "shopping" });
    expect(pausedSeek).toMatchObject({ intent: "paused", elapsedMs: 4_200 });
    expect(showcaseStepId(deriveShowcaseScene(pausedSeek))).toBe("compre");

    const restarted = reduceShowcaseTimeline(summary, { type: "restart" });
    expect(restarted).toMatchObject({ intent: "playing", elapsedMs: 0 });

    const held = playingAt(13_000);
    const wrapped = reduceShowcaseTimeline(held, { type: "tick", elapsedMs: 15_000 });
    expect(wrapped.elapsedMs).toBe(0);
    expect(deriveShowcaseScene(wrapped).beat).toBe("planning-start");
  });

  it("interrupts back to the still frame and does not autoplay again", () => {
    const stopped = reduceShowcaseTimeline(playingAt(6_000), { type: "interrupt" });
    expect(stopped).toMatchObject({ intent: "stopped", elapsedMs: 0 });
    expect(deriveShowcaseScene(stopped).mode).toBe("still");
    expect(shouldAutoplay(stopped)).toBe(false);
    expect(reduceShowcaseTimeline(stopped, { type: "tick", elapsedMs: 1_000 })).toBe(stopped);
    expect(reduceShowcaseTimeline(stopped, { type: "interrupt" })).toBe(stopped);
  });

  it("freezes while the tab or the panel is hidden and commits the elapsed time", () => {
    const playing = playingAt(1_000);
    const hiddenTab = reduceShowcaseTimeline(playing, {
      type: "environment",
      reducedMotion: false,
      panelVisible: true,
      tabVisible: false,
      elapsedMs: 1_800,
    });
    expect(hiddenTab).toMatchObject({ intent: "playing", elapsedMs: 1_800, tabVisible: false });
    expect(isShowcaseRunning(hiddenTab)).toBe(false);
    expect(reduceShowcaseTimeline(hiddenTab, { type: "tick", elapsedMs: 4_200 })).toBe(hiddenTab);

    const visible = reduceShowcaseTimeline(hiddenTab, desktop);
    expect(visible.elapsedMs).toBe(1_800);
    expect(isShowcaseRunning(visible)).toBe(true);

    const narrow = reduceShowcaseTimeline(playing, {
      type: "environment",
      reducedMotion: false,
      panelVisible: false,
      tabVisible: true,
    });
    expect(narrow.elapsedMs).toBe(1_000);
    expect(isShowcaseRunning(narrow)).toBe(false);
    expect(reduceShowcaseTimeline(playing, desktop)).toBe(playing);
  });

  it("stays on the still frame while reduced motion is requested", () => {
    const stopped = reduceShowcaseTimeline(playingAt(5_000), {
      type: "environment",
      reducedMotion: true,
      panelVisible: true,
      tabVisible: true,
      elapsedMs: 5_400,
    });
    expect(deriveShowcaseScene(stopped)).toMatchObject({ mode: "still", stage: "shopping", beat: null, running: false });
    expect(showcaseStepId(deriveShowcaseScene(stopped))).toBe("compre");
    expect(reduceShowcaseTimeline(stopped, { type: "play" })).toBe(stopped);
    expect(reduceShowcaseTimeline(stopped, { type: "restart" })).toBe(stopped);
    expect(reduceShowcaseTimeline(stopped, { type: "goTo", stage: "summary" })).toBe(stopped);

    const allowed = reduceShowcaseTimeline(stopped, desktop);
    expect(allowed.intent).toBe("stopped");
    expect(shouldAutoplay(allowed)).toBe(false);
    expect(reduceShowcaseTimeline(allowed, { type: "play" })).toMatchObject({ intent: "playing", elapsedMs: 0 });
  });
});
