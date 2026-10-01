import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-wrap">
        <p className="landing-eyebrow">Compras de casa sem complicação</p>
        <h1>Planeje. Compartilhe. Compre. Acompanhe.</h1>
        <p>Organize a próxima compra, compartilhe a lista com quem mora com você e acompanhe os valores registrados no mercado.</p>
        <div className="landing-hero-actions">
          <Link href="/login" className="landing-cta">Começar agora<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href="#como-funciona" className="landing-cta landing-cta-secondary">Ver como funciona<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
