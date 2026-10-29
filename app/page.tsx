import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingClosing, LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { JourneyNavigation } from "@/components/landing/journey-navigation";
import { JourneySection } from "@/components/landing/journey-section";
import { HistoryDemo, PlanningDemo, PurchaseDemo, SharingDemo } from "@/components/landing/product-demos";
import styles from "@/components/landing/site.module.css";
const chapters = [
  {id:"planejar",title:"Comece pelo que a casa costuma usar.",body:"Escolha os produtos que precisam de reposição. Eles formam a próxima compra, com as quantidades que você já cadastrou.",action:"Ver o planejamento",Demo:PlanningDemo},
  {id:"compartilhar",aliasId:"para-casa",title:"Cada pessoa com sua conta. A lista é da casa.",body:"Convide por link quem divide as compras com você. Com conexão, as pessoas da casa acompanham as atualizações da mesma lista.",action:"Ver o convite",Demo:SharingDemo},
  {id:"comprar",title:"No mercado, um item de cada vez.",body:"Diferencie o que falta, o que comprou e o que já tem. Quantidades e preços informados compõem o total registrado.",action:"Ver uma compra",Demo:PurchaseDemo},
  {id:"acompanhar",title:"O que aconteceu na compra fica para a próxima.",body:"Consulte os itens, preços e totais das compras concluídas antes de preparar outra reposição.",action:"Ver o histórico",Demo:HistoryDemo},
];
export default function LandingPage() {
  return <div className={`restok-theme ${styles.page}`}>
    <a className={styles.skip} href="#conteudo">Pular para o conteúdo</a>
    <LandingHeader/>
    <main id="conteudo" tabIndex={-1}>
      <LandingHero/>
      <section id="como-funciona" className={styles.intro} aria-labelledby="como-funciona-title"><div className={styles.container}>
        <div className={styles.introCopy}><h2 id="como-funciona-title">Daquilo que falta ao que já foi resolvido.</h2><p>O catálogo da casa é o ponto de partida. A compra registra a passagem pelo mercado. O histórico guarda o contexto.</p></div>
        <JourneyNavigation/>
      </div></section>
      <div id="funcionalidades" className={styles.container}>{chapters.map(chapter=><JourneySection key={chapter.id} id={chapter.id} aliasId={chapter.aliasId} title={chapter.title} body={chapter.body} actionHref={`#demo-${chapter.id}`} actionLabel={chapter.action} demoId={`demo-${chapter.id}`}><chapter.Demo/></JourneySection>)}</div>
      <LandingFaq/><LandingClosing/>
    </main>
    <LandingFooter/>
  </div>;
}
