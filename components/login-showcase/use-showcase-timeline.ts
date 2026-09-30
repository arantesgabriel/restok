"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  deriveShowcaseScene,
  initialShowcaseTimelineState,
  isShowcaseRunning,
  nextCueDelayMs,
  reduceShowcaseTimeline,
  shouldAutoplay,
  type ShowcaseStage,
} from "@/components/login-showcase/showcase-timeline";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const panelQuery = "(min-width: 1024px)";

export function useShowcaseTimeline() {
  const [state, dispatch] = useReducer(reduceShowcaseTimeline, initialShowcaseTimelineState);
  const stateRef = useRef(state);
  const anchorRef = useRef({ startedAt: 0, elapsedMs: 0 });
  stateRef.current = state;

  const elapsedNow = () => {
    const current = stateRef.current;
    if (!isShowcaseRunning(current)) return current.elapsedMs;
    return anchorRef.current.elapsedMs + (performance.now() - anchorRef.current.startedAt);
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia(reducedMotionQuery);
    const panel = window.matchMedia(panelQuery);

    const publish = () => {
      dispatch({
        type: "environment",
        reducedMotion: reducedMotion.matches,
        panelVisible: panel.matches,
        tabVisible: document.visibilityState === "visible",
        elapsedMs: elapsedNow(),
      });
    };

    publish();
    reducedMotion.addEventListener("change", publish);
    panel.addEventListener("change", publish);
    document.addEventListener("visibilitychange", publish);
    return () => {
      reducedMotion.removeEventListener("change", publish);
      panel.removeEventListener("change", publish);
      document.removeEventListener("visibilitychange", publish);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoplay(state)) return;

    let cancelled = false;
    const start = () => {
      if (cancelled || !shouldAutoplay(stateRef.current)) return;
      dispatch({ type: "play" });
    };

    // The first scene change waits for an idle slot so the form can take the first keystrokes.
    const idleId = window.requestIdleCallback?.(start, { timeout: 600 });
    const timeoutId = idleId === undefined ? window.setTimeout(start, 300) : undefined;

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [state]);

  useEffect(() => {
    if (!isShowcaseRunning(state)) return;
    const elapsedMs = state.elapsedMs;
    anchorRef.current = { startedAt: performance.now(), elapsedMs };
    const delay = nextCueDelayMs(elapsedMs);
    const timer = window.setTimeout(() => {
      dispatch({ type: "tick", elapsedMs: elapsedMs + delay });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [state]);

  return {
    scene: deriveShowcaseScene(state),
    play: () => dispatch({ type: "play" }),
    pause: () => dispatch({ type: "pause", elapsedMs: elapsedNow() }),
    restart: () => dispatch({ type: "restart" }),
    interrupt: () => dispatch({ type: "interrupt" }),
    goTo: (stage: ShowcaseStage) => dispatch({ type: "goTo", stage }),
  };
}
