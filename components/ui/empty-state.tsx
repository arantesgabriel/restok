import type { ReactNode } from "react";
import "@/styles/base.css";
import styles from "./feedback.module.css";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: "first-use" | "compact";
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "first-use",
}: EmptyStateProps) {
  const variantClass = variant === "compact" ? styles.compact : styles.firstUse;

  return (
    <div data-empty-state data-variant={variant} className={`restok-theme ${styles.empty} ${variantClass}`}>
      <span aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
