"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ActionMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
};

export function ActionMenu({
  label,
  children,
  items,
  triggerClassName,
  menuClassName,
}: {
  label: string;
  children: ReactNode;
  items: ActionMenuItem[];
  triggerClassName: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "Tab") {
        setOpen(false);
      }
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [open]);

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    const menuItems = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? []);
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
    if (!menuItems.length) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? menuItems.length - 1
          : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + menuItems.length) % menuItems.length;
      menuItems[nextIndex]?.focus();
    }
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        title={label}
        className={triggerClassName}
        onClick={() => setOpen((current) => !current)}
      >
        {children}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        hidden={!open}
        onKeyDown={moveFocus}
        className={cn("absolute right-0 top-12 z-dropdown w-56 rounded-[12px] border border-line bg-surface p-1.5 shadow-[0_4px_8px_oklch(0.18_0.02_145_/_0.12)]", menuClassName)}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-ink hover:bg-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
              item.onSelect();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
