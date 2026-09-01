import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleCheck, House, Menu, Search, ShoppingBasket, Users } from "lucide-react";

function PreviewList() {
  const items = [
    ["Filé de peito de frango", "10 un.", "R$ 158,90", "purchased"],
    ["Leite desnatado", "2 un.", "Adicionar preço", "pending"],
    ["Sabonete", "3 un.", "Já temos", "already"],
    ["Molho de tomate", "4 un.", "R$ 7,56", "purchased"],
  ];
  return <div className="landing-preview" aria-label="Prévia do modo mercado">
    <div className="preview-top"><span className="preview-brand">restok<span>.</span></span><span className="preview-user">GB</span></div>
    <div className="preview-heading"><div><span className="preview-kicker">Dentro do mercado</span><strong>Compras de Setembro</strong><small>18 de 32 resolvidos</small></div><span className="preview-menu"><Menu size={16} /></span></div>
    <div className="preview-budget"><div><small>Gasto até agora</small><strong>R$ 483,72</strong></div><span><b>R$ 316,28</b><small>disponíveis</small></span><i><em /></i></div>
    <div className="preview-search"><Search size={14} />Buscar na lista</div>
    <div className="preview-filters"><span className="selected">Todos</span><span>Pendentes</span><span>Comprados</span></div>
    <div className="preview-category"><span className="preview-dot">◌</span><div><b>Alimentos</b><small>12 de 18 resolvidos</small></div><ChevronRight size={15} /></div>
    <div className="preview-items">{items.map(([name, qty, price, state]) => <div className={state !== "pending" ? "preview-item resolved" : "preview-item"} key={name}><span className={state === "purchased" ? "preview-check" : "preview-symbol"}>{state === "purchased" ? <Check size={12} /> : state === "already" ? <House size={12} /> : "◌"}</span><div><b>{name}</b><small>{qty} · {price}</small></div><ChevronRight size={14} /></div>)}</div>
    <div className="preview-bottom"><span><b>12 pendentes</b><small>A lista fica com você</small></span><strong>R$ 483,72</strong></div>
  </div>;
}

export default function LandingPage() {
  return <div className="landing-page">
    <header className="landing-nav"><Link href="/" className="landing-wordmark">restok<span>.</span></Link><nav><a href="#como-funciona">Como funciona</a><a href="#para-casa">Para a casa</a></nav><Link href="/login" className="landing-login">Entrar <ArrowRight size={16} /></Link><button type="button" className="landing-mobile-menu" aria-label="Abrir menu"><Menu size={20} /></button></header>
    <main>
      <section className="landing-hero"><div className="hero-copy"><p className="hero-kicker"><span className="kicker-dot" />Lista viva para a vida real</p><h1>Sua casa,<br /><em>sempre abastecida.</em></h1><p className="hero-lede">A lista de compras que acompanha você do que está acabando até o caixa — sem planilha, sem esquecer o essencial.</p><div className="hero-actions"><Link href="/login" className="landing-cta">Começar agora <ArrowRight size={18} /></Link><a href="#como-funciona" className="landing-text-link">Ver como funciona <ChevronRight size={16} /></a></div><div className="hero-note"><Users size={15} /> Vocês adicionam. Vocês compram. A lista acompanha.</div></div><div className="hero-product"><div className="hero-line" /><PreviewList /><span className="hero-caption">Um mercado inteiro,<br />na palma da mão.</span></div></section>
      <section id="como-funciona" className="landing-section flow-section"><div className="section-lede"><span className="section-number">01</span><h2>Da lista ao carrinho, sem sair do ritmo.</h2><p>RESTOK tira a fricção do momento em que você mais precisa de clareza: com uma mão no carrinho e a outra procurando o próximo item.</p></div><div className="flow-steps"><div className="flow-step"><span>01</span><div><ShoppingBasket size={20} /><h3>Prepare</h3><p>Comece com os produtos que fazem parte da casa.</p></div></div><div className="flow-step"><span>02</span><div><Check size={20} /><h3>Compre</h3><p>Marque, ajuste quantidade e registre o preço em segundos.</p></div></div><div className="flow-step"><span>03</span><div><CircleCheck size={20} /><h3>Acompanhe</h3><p>Veja o total e o orçamento antes de chegar no caixa.</p></div></div></div></section>
      <section id="para-casa" className="landing-section split-section"><div className="split-art"><div className="pantry-art"><div className="pantry-shelf shelf-one" /><div className="pantry-shelf shelf-two" /><span className="jar jar-one" /><span className="jar jar-two" /><span className="jar jar-three" /><span className="leaf leaf-one" /><span className="leaf leaf-two" /></div></div><div className="split-copy"><span className="section-number">02</span><h2>Uma lista que mora com vocês.</h2><p>Quando alguém marca o arroz como comprado, a outra pessoa sabe. A casa segue no mesmo compasso — mesmo quando vocês estão em corredores diferentes.</p><div className="quote-line"><span className="quote-avatars"><i>G</i><i>B</i></span><span>Feita para dividir a compra, não a atenção.</span></div></div></section>
      <section className="landing-section budget-section"><div className="budget-copy"><span className="section-number">03</span><h2>O caixa não precisa ser uma surpresa.</h2><p>O total se atualiza enquanto você compra. O preço anterior ajuda a perceber mudanças. E o orçamento fica sempre a um olhar de distância.</p><Link href="/login" className="landing-text-link">Começar uma lista <ArrowRight size={16} /></Link></div><div className="budget-art"><div className="budget-paper"><div><small>Orçamento da compra</small><strong>R$ 800,00</strong></div><div className="budget-rule"><span style={{ width: "61%" }} /></div><div className="budget-foot"><span>R$ 483,72 gastos</span><b>R$ 316,28 disponíveis</b></div><div className="price-row"><span>Filé de peito de frango</span><b>R$ 17,20 <small>↑ 8,2%</small></b></div><div className="price-row"><span>Arroz</span><b>R$ 15,89 <small className="down">↓ 4,1%</small></b></div></div></div></section>
      <section className="landing-section final-section"><div><House size={21} className="final-icon" /><h2>Sua próxima compra<br /><em>já começa pronta.</em></h2><p>Comece pelo que a casa já conhece. O resto aparece no caminho.</p><Link href="/login" className="landing-cta">Começar seu próximo restok <ArrowRight size={18} /></Link></div></section>
    </main>
    <footer className="landing-footer"><Link href="/" className="landing-wordmark">restok<span>.</span></Link><span>A lista que vai ao mercado com você.</span><span>© 2026 RESTOK</span></footer>
  </div>;
}
