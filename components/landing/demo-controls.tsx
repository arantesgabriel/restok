"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
export function useDemoReady() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function DemoReset({ ready, onReset }: { ready: boolean; onReset: () => void }) {
  return <div className="landing-demo-footer">
    <button type="button" className="landing-demo-button" disabled={!ready} onClick={onReset}>Reiniciar exemplo</button>
    <noscript><p className="landing-budget-note">Ative o JavaScript para experimentar as ações. Os dados continuam disponíveis acima.</p></noscript>
  </div>;
}
