import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";

const sections = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-wrap landing-header-bar">
        <Link href="/" className="landing-brand" aria-label="Restok — início">
          <BrandMark />
        </Link>
        <nav className="landing-desktop-nav" aria-label="Seções">
          {sections.map((section) => (
            <a key={section.href} href={section.href}>{section.label}</a>
          ))}
        </nav>
        <div className="landing-header-actions">
          <Link href="/login" className="landing-text-link">Entrar</Link>
          <Link href="/login" className="landing-cta landing-header-start">Começar agora</Link>
          <details className="landing-menu">
            <summary>Menu</summary>
            <nav aria-label="Seções">
              {sections.map((section) => (
                <a key={section.href} href={section.href}>{section.label}</a>
              ))}
              <Link href="/login" className="landing-cta">Começar agora</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
