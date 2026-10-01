import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const footerLinks = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function LandingClosing() {
  return (
    <section className="landing-closing" aria-labelledby="closing-title">
      <div className="landing-wrap">
        <h2 id="closing-title">A próxima compra começa com a lista da casa.</h2>
        <p>Organize os produtos habituais e leve a lista com você para o mercado.</p>
        <Link href="/login" className="landing-cta landing-cta-inverse">Começar agora<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-wrap landing-footer-bar">
        <BrandMark compact />
        <p>A lista que vai ao mercado com você.</p>
        <nav aria-label="Rodapé">
          {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          <Link href="/login">Entrar</Link>
        </nav>
        <small>© 2026 RESTOK</small>
      </div>
    </footer>
  );
}
