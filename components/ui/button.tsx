"use client";
import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import "@/styles/base.css";
import "@/styles/motion.css";
import styles from "./controls.module.css";
export type ButtonProps = ComponentPropsWithRef<"button"> & { variant?: "primary" | "secondary" | "quiet" | "danger"; busy?: boolean };
export function Button({variant="primary",busy=false,disabled,type="button",className,children,...props}:ButtonProps) {
  return <button {...props} type={type} disabled={disabled || busy} aria-busy={busy || undefined} className={cn("restok-theme",styles.button,styles[variant],className)}>{busy ? <span aria-hidden="true" className={styles.spinner} /> : null}{children}</button>;
}
