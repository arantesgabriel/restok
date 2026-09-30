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
    dialog.showModal();
    const initialFocus = dialog.querySelector<HTMLElement>("[data-initial-focus]")
      ?? dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]");
    initialFocus?.focus({ preventScroll: true });

    return () => {
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
