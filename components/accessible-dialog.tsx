"use client";

import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from "react";

export function AccessibleDialog({
  titleId,
  onClose,
  className,
  children,
}: {
  titleId: string;
  onClose: () => void;
  className: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const initialFocus = dialog.querySelector<HTMLElement>("[data-initial-focus]")
      ?? dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]");
    initialFocus?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      const returnTarget = previouslyFocused?.isConnected
        ? previouslyFocused
        : document.querySelector<HTMLElement>("[data-dialog-return-focus]");
      returnTarget?.focus();
    };
  }, []);

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onCloseRef.current();
  }

  return (
    <dialog
      ref={dialogRef}
      data-state="open"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onCloseRef.current(); }
        if (event.key === "Tab") {
          const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
          )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0 && !element.closest("[hidden], [inert]"));
          const first = focusable[0];
          const last = focusable.at(-1);
          if (!first) { event.preventDefault(); return; }
          if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement as HTMLElement))) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
          }
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
      onClick={closeFromBackdrop}
      className={className}
    >
      {children}
    </dialog>
  );
}
