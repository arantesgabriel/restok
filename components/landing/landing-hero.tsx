import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-leaves landing-hero-leaves-left" aria-hidden="true">
        <Image src="/landing/pantry-leaves.svg" alt="" width={180} height={320} sizes="160px" />
      </div>
      <div className="landing-hero-leaves landing-hero-leaves-right" aria-hidden="true">
        <Image src="/landing/pantry-leaves.svg" alt="" width={180} height={320} sizes="160px" />
      </div>
      <div className="landing-wrap">
        <p className="landing-eyebrow">Compras de casa sem complicação</p>
        <h1><span>Planeje. Compartilhe.</span>{" "}<span>Compre. Acompanhe.</span></h1>
        <p className="landing-hero-description">Organize a próxima compra, compartilhe a lista com quem mora com você e acompanhe os valores registrados no mercado.</p>
        <div className="landing-hero-actions">
          <Link href="/login" className="landing-cta">Começar agora<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href="#como-funciona" className="landing-cta landing-cta-secondary">Ver como funciona<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
