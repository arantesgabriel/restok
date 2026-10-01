import "./landing.css";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingClosing, LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { JourneyNavigation } from "@/components/landing/journey-navigation";
import { JourneySection } from "@/components/landing/journey-section";
import { HistoryDemo, PlanningDemo, ProductShowcase, PurchaseDemo, SharingDemo } from "@/components/landing/product-demos";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <a className="landing-skip" href="#conteudo">Pular para o conteúdo</a>
      <LandingHeader />
      <main id="conteudo">
        <LandingHero />
        <ProductShowcase />
        <div className="landing-journey">
          <div className="landing-wrap">
            <JourneyNavigation />
          </div>
          <section id="como-funciona" className="landing-intro" aria-labelledby="como-funciona-title">
            <div className="landing-wrap">
              <h2 id="como-funciona-title">A mesma lista, em quatro momentos</h2>
              <p>O que a casa separa para repor é o que segue compartilhado, resolve no mercado e fica consultável na próxima compra.</p>
            </div>
          </section>
          <div id="funcionalidades">
            <JourneySection
              id="planejar"
              number="01"
              title="Planeje suas compras em poucos cliques."
              body="Parta dos produtos habituais da casa, escolha o que precisa repor e prepare a próxima compra."
              actionHref="#demo-planejar"
              actionLabel="Ver o planejamento"
              demoId="demo-planejar"
            >
              <PlanningDemo />
            </JourneySection>
            <JourneySection
              id="compartilhar"
              aliasId="para-casa"
              number="02"
              title="Compartilhe com quem mora com você."
              body="Convide as pessoas da casa por link e acompanhe as atualizações da mesma lista enquanto vocês compram."
              actionHref="#demo-compartilhar"
              actionLabel="Ver o convite"
              demoId="demo-compartilhar"
              reverse
            >
              <SharingDemo />
            </JourneySection>
            <JourneySection
              id="comprar"
              number="03"
              title="Compre com mais facilidade."
              body="Marque o que comprou, informe quantidades e preços e acompanhe o total registrado em relação ao seu orçamento."
              actionHref="#demo-comprar"
              actionLabel="Ver uma compra"
              demoId="demo-comprar"
            >
              <PurchaseDemo />
            </JourneySection>
            <JourneySection
              id="acompanhar"
              number="04"
              title="Guarde o contexto para a próxima compra."
              body="Consulte compras concluídas, itens e preços anteriores para planejar a próxima reposição."
              actionHref="#demo-acompanhar"
              actionLabel="Ver o histórico"
              demoId="demo-acompanhar"
              reverse
            >
              <HistoryDemo />
            </JourneySection>
          </div>
        </div>
        <LandingFaq />
        <LandingClosing />
      </main>
      <LandingFooter />
    </div>
  );
}
