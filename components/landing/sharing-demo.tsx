"use client";

import { useState } from "react";
import { exampleLabel, householdPeople, showcaseItems, showcaseList } from "./demo-data";
import { DemoReset, useDemoReady } from "./demo-controls";
import { DemoRow } from "./demo-row";

export function SharingDemo() {
  const [invited, setInvited] = useState(false);
  const [joined, setJoined] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const ready = useDemoReady();
  return <div className="landing-frame">
    <p className="landing-example">{exampleLabel}. Simulação local de convite e atualização com conexão.</p>
    <p className="landing-demo-title">{showcaseList.name}, juntos</p>
    <ul className="landing-people">
      {householdPeople.map((person, index) => <li key={person.initial}>
        <span aria-hidden="true">{person.initial}</span>
        <span>{index === 1 && !joined ? "Pessoa B · aguardando convite" : `Pessoa ${person.initial} · ${person.role}`}</span>
      </li>)}
    </ul>
    <button type="button" className="landing-demo-button" disabled={!ready || invited} onClick={() => setInvited(true)}>Mostrar convite</button>
    {invited && <div className="landing-invitation">
      <p className="landing-budget-note">Convite por link ilustrativo: participe da lista da casa da pessoa A.</p>
      <button type="button" className="landing-demo-button" disabled={joined} onClick={() => setJoined(true)}>Simular entrada pelo convite</button>
    </div>}
    <div className="landing-rows">
      <DemoRow item={{ ...showcaseItems[2], status: purchased ? "purchased" : "pending" }} />
      <DemoRow item={showcaseItems[1]} />
    </div>
    {joined && <button type="button" className="landing-demo-button" disabled={purchased} onClick={() => setPurchased(true)}>Simular Pão comprado</button>}
    <p className="landing-budget-note" role="status">{purchased ? "Pessoa B marcou Pão como comprado. A mesma atualização aparece para a pessoa A." : joined ? "Pessoa B entrou e vê a mesma lista da pessoa A." : "Mostre o convite para simular a entrada da pessoa B."}</p>
    <DemoReset ready={ready} onReset={() => { setInvited(false); setJoined(false); setPurchased(false); }} />
  </div>;
}
