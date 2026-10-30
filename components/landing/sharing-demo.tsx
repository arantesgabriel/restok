"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {exampleLabel,householdPeople,showcaseItems,showcaseList} from "./demo-data";
import {DemoReset,useDemoReady} from "./demo-controls";
import {DemoRow} from "./demo-row";
import styles from "./demos.module.css";
export function SharingDemo(){
  const [invited,setInvited]=useState(false),[joined,setJoined]=useState(false),[purchased,setPurchased]=useState(false),ready=useDemoReady();
  const rows=<><DemoRow item={{...showcaseItems[2],status:purchased ? "purchased" : "pending"}}/><DemoRow item={showcaseItems[1]}/></>;
  return <div className={styles.frame}><p className={styles.example}>{exampleLabel}. Simulação local de convite e atualização com conexão.</p><h3 className={styles.demoTitle}>{showcaseList.name}, juntos</h3>
    <ul className={styles.people}>{householdPeople.map((person,index)=><li key={person.initial}><strong>Pessoa {person.initial}</strong><span className={styles.rowMeta}>{index===1&&!joined ? "Aguardando convite" : person.role}</span></li>)}</ul>
    <Button variant="secondary" disabled={!ready||invited} onClick={()=>setInvited(true)}>Mostrar convite</Button>
    {invited ? <div className={styles.invitation}><p className={styles.note}>Convite por link ilustrativo: participe da lista da casa da pessoa A.</p><Button variant="secondary" disabled={joined} onClick={()=>setJoined(true)}>Simular entrada pelo convite</Button></div> : null}
    <div className={styles.sharedLists}><section aria-label="Lista da pessoa A"><h4>Pessoa A</h4>{rows}</section>{joined ? <section aria-label="Lista da pessoa B"><h4>Pessoa B</h4>{rows}</section> : <p className={styles.note}>A pessoa B verá a lista depois de entrar na casa.</p>}</div>
    {joined ? <Button variant="secondary" disabled={purchased} onClick={()=>setPurchased(true)}>Simular Pão comprado</Button> : null}
    <p className={styles.status} role="status">{purchased ? "Pessoa B marcou Pão como comprado. A mesma atualização aparece para a pessoa A." : joined ? "Pessoa B entrou e vê a mesma lista da pessoa A." : "Mostre o convite para simular a entrada da pessoa B."}</p><DemoReset ready={ready} onReset={()=>{setInvited(false);setJoined(false);setPurchased(false);}}/>
  </div>;
}
