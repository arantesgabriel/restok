import { createRoot } from "react-dom/client";
import { useState } from "react";
import { ShoppingBasket, Check, House } from "lucide-react";
import { RestokTheme } from "../../components/ui/theme";
import { Field } from "../../components/ui/field";
import { MoneyField } from "../../components/ui/money-field";
import { QuantityField } from "../../components/ui/quantity-field";
import { Button } from "../../components/ui/button";
import "./foundations.css";

const roles = ["brand", "action", "highlight", "info", "canvas", "surface", "ink", "muted", "line", "line-strong", "surface-soft", "surface-brand", "surface-info", "danger", "surface-danger", "warning", "surface-warning"];
function StateSamples() {
  const [price, setPrice] = useState("18,90");
  const [quantity, setQuantity] = useState(1);
  return <section aria-label="Estados dos fundamentos"><h2>Estados e ícones</h2>
    <div className="foundation-icons" aria-label="Ícones Lucide, traço 1,75"><ShoppingBasket aria-hidden="true" /><Check aria-hidden="true" /><House aria-hidden="true" /></div>
    <div className="foundation-states"><Button variant="secondary">Editar meta</Button><Button disabled>Indisponível</Button><Button busy>Salvando</Button></div>
    <div className="foundation-fields"><Field label="Produto" defaultValue="Arroz integral" /><Field label="Preço inválido" defaultValue="-1" error="Informe um preço válido." /><Field label="Campo indisponível" disabled defaultValue="Nossa Casa" />
      <MoneyField label="Preço unitário" value={price} onValueChange={setPrice} />
      <QuantityField quantity={quantity} onChange={setQuantity} />
    </div>
  </section>;
}
createRoot(document.getElementById("root")!).render(<RestokTheme className="foundation-preview">
  <header><p>Restok · preview de desenvolvimento</p><h1>Raiz & Eucalipto</h1><p>Fundações isoladas. Produtos, pessoas e valores ilustrativos.</p></header>
  <section aria-label="Tipografia"><h2>Clareza para cuidar da casa</h2><p>Reposição, açúcar, pão, café e organização. A fonte Manrope mantém pesos reais de 400 a 800.</p>{[400,500,600,700,800].map((weight) => <p key={weight} style={{ fontWeight: weight }}>{weight} · Próxima compra R$ 1.234,50</p>)}</section>
  <section aria-label="Cores"><h2>Cores por função</h2><div className="foundation-swatches">{roles.map((role) => <div key={role}><span style={{ background: `var(--color-${role})` }} /><span>{role}</span></div>)}</div></section>
  <section aria-label="Amostra de contraste"><h2>Ações e leitura</h2><button className="foundation-sample-button" type="button">Começar compra</button><label className="foundation-sample-label">Nome da compra<input className="foundation-sample-input" defaultValue="Compra da semana" /></label><p className="foundation-error">Confira o preço antes de salvar.</p><div className="foundation-inverse"><p>Disponível para a compra</p><strong>R$ 320,00</strong><p className="foundation-highlight">Valor de exemplo sobre brand</p></div></section>
  <StateSamples />
  <footer>Marca final aguarda master vetorial. Nenhuma tela do produto foi reconstruída neste preview.</footer>
</RestokTheme>);
