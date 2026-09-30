"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

export function VisualSystemDialog({ title, description, onClose, children }: {
  title: string;
  description?: string;
  onClose: () => void;
  children: (close: () => void) => ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  closeRef.current = onClose;

  const close = useCallback(() => {
    if (timerRef.current !== null) return;
    setClosing(true);
    const duration = Number.parseFloat(getComputedStyle(dialogRef.current!).getPropertyValue("--restok-motion-fast")) || 0;
    timerRef.current = setTimeout(() => closeRef.current(), duration);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current!;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-initial-focus="true"]')?.focus();
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus.current?.isConnected) previousFocus.current.focus();
      else document.querySelector<HTMLInputElement>('.visual-system input[type="search"]')?.focus();
    };
  }, []);

  return <dialog ref={dialogRef} className="proof-dialog" data-state={closing ? "closing" : "open"} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <section className="proof-sheet">
      <header className="proof-sheet-header"><div><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</div><button type="button" className="proof-icon" aria-label="Fechar" onClick={close}><X size={20} /></button></header>
      {children(close)}
    </section>
  </dialog>;
}
