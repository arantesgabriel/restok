// One terminal path for CSS completion, cancellation, reduced motion and timeout.
export function waitForExit(dialog: HTMLDialogElement, complete: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const token = getComputedStyle(dialog).getPropertyValue("--duration-exit").trim();
  const parsed = token.endsWith("ms") ? parseFloat(token) : parseFloat(token) * 1000;
  const duration = Number.isFinite(parsed) ? Math.max(0, parsed) : 160;
  let active = true;
  let timer: number | undefined;
  let expectedAnimation = "";
  const panel = dialog.querySelector("[data-sheet-panel]") ?? dialog;
  const cleanup = () => {
    window.clearTimeout(timer);
    dialog.removeEventListener("animationend", ended);
    dialog.removeEventListener("animationcancel", ended);
    media.removeEventListener?.("change", preference);
  };
  const finish = () => { if (!active) return; active = false; cleanup(); if (dialog.isConnected) complete(); };
  const ended = (event: Event) => {
    const name = (event as AnimationEvent).animationName;
    if (name && expectedAnimation && expectedAnimation !== "none" && name !== expectedAnimation) return;
    if (event.target === panel) finish();
  };
  const preference = () => { if (media.matches) finish(); };
  dialog.dataset.state = "closing";
  expectedAnimation = getComputedStyle(panel).animationName;
  if (media.matches || duration === 0) finish();
  else {
    dialog.addEventListener("animationend", ended);
    dialog.addEventListener("animationcancel", ended);
    media.addEventListener?.("change", preference);
    timer = window.setTimeout(finish, duration);
  }
  return () => { active = false; cleanup(); };
}
