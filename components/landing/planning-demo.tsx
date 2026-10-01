"use client";

import { useState } from "react";
import { categories, exampleLabel, showcaseItems, showcaseList } from "./demo-data";
import { DemoReset, useDemoReady } from "./demo-controls";

const initialSelection = ["leite", "pao", "banana"];

export function PlanningDemo() {
  const [selected, setSelected] = useState(initialSelection);
  const ready = useDemoReady();
  return <div className="landing-frame">
    <p className="landing-example">{exampleLabel}. Escolha produtos habituais, sem gravar nada nesta página.</p>
    <p className="landing-demo-title">O que precisa repor?</p>
    <ul className="landing-categories" aria-label="Categorias ilustrativas">{categories.map((category) => <li key={category}>{category}</li>)}</ul>
    <fieldset className="landing-demo-fieldset" disabled={!ready}>
      <legend className="sr-only">Produtos para a próxima compra</legend>
      {showcaseItems.map((item) => <label className="landing-product-choice" key={item.id}>
        <input type="checkbox" aria-label={`Selecionar ${item.name}`} checked={selected.includes(item.id)} onChange={(event) => setSelected(event.target.checked ? [...selected, item.id] : selected.filter((id) => id !== item.id))} />
        <span className="landing-row-copy"><span className="landing-row-name">{item.name}</span><span className="landing-row-meta">{item.category}</span></span>
      </label>)}
    </fieldset>
    <p className="landing-budget-note" role="status">{showcaseList.name}: {selected.length} produtos selecionados{selected.includes("tomate") ? ". Tomate entra na próxima compra." : ". Selecione Tomate para incluí-lo."}</p>
    <DemoReset ready={ready} onReset={() => setSelected(initialSelection)} />
  </div>;
}
