import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { MobileNavigation } from "./mobile-navigation";
import styles from "./site.module.css";
const sections=[{href:"#funcionalidades",label:"Funcionalidades"},{href:"#como-funciona",label:"Como funciona"},{href:"#duvidas",label:"Dúvidas"}];
export function LandingHeader() {
  const links=sections.map(section=><a key={section.href} href={section.href}>{section.label}</a>);
  return <header className={styles.header}><div className={`${styles.container} ${styles.headerBar}`}>
    <Link href="/" className={styles.brand} aria-label="Restok — início"><BrandMark/></Link>
    <nav className={styles.desktopNav} aria-label="Seções">{links}</nav>
    <div className={styles.headerActions}><Link href="/login" className={styles.textLink}>Entrar</Link><MobileNavigation>{links}<Link href="/login">Começar agora</Link></MobileNavigation></div>
  </div></header>;
}
