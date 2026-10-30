import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { RestokTheme } from "@/components/ui/theme";
import styles from "./auth.module.css";
export function AuthFrame({children}:{children:ReactNode}) {
  return <RestokTheme><main className={styles.page}><div className={styles.content}>
    <Link href="/" className={styles.brand} aria-label="Página inicial do Restok"><BrandMark/></Link>
    {children}
    <footer className={styles.footer}>Cada pessoa tem sua conta. Compartilhe a casa por convite.</footer>
  </div></main></RestokTheme>;
}
