import type { HTMLAttributes } from "react";
import "@/styles/base.css";
import "@/styles/motion.css";

export function RestokTheme({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`restok-theme ${className}`} />;
}
