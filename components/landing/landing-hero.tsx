import { ArrowRight } from "lucide-react";
import { ProductShowcase } from "./product-demos";
import { SiteLink } from "./site-link";
import styles from "./site.module.css";
export function LandingHero() {
  return <section className={styles.hero} aria-labelledby="hero-title"><div className={styles.container}><div className={styles.heroLayout}>
    <div className={styles.heroCopy}><h1 id="hero-title">A lista da casa.<br/><span>Do plano ao mercado.</span></h1>
      <p className={styles.heroDescription}>Planeje o que falta, divida a lista por convite e acompanhe o total enquanto compra.</p>
      <div className={styles.heroActions}><SiteLink href="/login">Começar agora<ArrowRight size={18} aria-hidden="true"/></SiteLink><a href="#como-funciona" className={styles.textLink}>Ver como funciona<ArrowRight size={16} aria-hidden="true"/></a></div>
    </div><ProductShowcase/>
  </div></div></section>;
}
