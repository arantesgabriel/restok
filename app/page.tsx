import Link from "next/link";
import { ArrowRight, Check, House, ShoppingBasket } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export default function LandingPage() {
  return <div className="public-page">
    <header className="public-nav"><Link href="/" aria-label="Restok — início"><BrandMark /></Link><nav aria-label="Sobre o Restok"><a href="#como-funciona">Como funciona</a><a href="#para-casa">Para a casa</a></nav><Link href="/login" className="public-link">Entrar<ArrowRight size={16} /></Link></header>
    <main>
      <section className="public-hero"><div><h1>A lista da casa, pronta para o mercado.</h1><p>Prepare a compra com os produtos habituais, acompanhe o que foi comprado e guarde os preços para a próxima vez.</p><Link href="/login" className="public-primary">Começar agora<ArrowRight size={18} /></Link></div><div className="public-cycle" id="como-funciona"><h2>Uma rotina que continua</h2><ol><li><House size={22} /><div><h3>Prepare em casa</h3><p>Escolha o que precisa repor a partir dos produtos recorrentes.</p></div></li><li><ShoppingBasket size={22} /><div><h3>Resolva no mercado</h3><p>Marque o que comprou, ajuste quantidades e acompanhe o total registrado.</p></div></li><li><Check size={22} /><div><h3>Guarde o contexto</h3><p>Consulte os preços e os itens da compra no histórico.</p></div></li></ol></div></section>
      <section className="public-house" id="para-casa"><h2>Uma lista para quem divide a casa.</h2><p>Convide as pessoas da casa para acompanhar a mesma lista. As atualizações chegam enquanto vocês fazem a compra.</p><Link href="/login" className="public-link">Organizar a próxima compra<ArrowRight size={18} /></Link></section>
    </main>
    <footer className="public-footer"><BrandMark compact /><span>A lista que vai ao mercado com você.</span><span>© 2026 RESTOK</span></footer>
  </div>;
}
