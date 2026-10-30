"use client";
import {useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {categories,exampleLabel,showcaseItems,showcaseList} from "./demo-data";
import {DemoReset,useDemoReady} from "./demo-controls";
import styles from "./demos.module.css";
const initialSelection=["leite","pao","banana"];
export function PlanningDemo(){
  const [selected,setSelected]=useState(initialSelection),ready=useDemoReady();
  return <div className={styles.frame}><p className={styles.example}>{exampleLabel}. Escolha produtos habituais, sem gravar nada nesta página.</p><h3 className={styles.demoTitle}>O que precisa repor?</h3>
    <ul className={styles.categories} aria-label="Categorias ilustrativas">{categories.map(category=><li key={category}>{category}</li>)}</ul>
    <fieldset className={styles.fieldSet} disabled={!ready}><legend className={styles.sr}>Produtos para a próxima compra</legend>{showcaseItems.map(item=><div key={item.id} className={styles.choice}><Checkbox aria-label={`Selecionar ${item.name}`} checked={selected.includes(item.id)} onChange={event=>setSelected(current=>event.target.checked ? [...current,item.id] : current.filter(id=>id!==item.id))}><span className={styles.rowCopy}><span className={styles.rowName}>{item.name}</span><span className={styles.rowMeta}>{item.category}</span></span></Checkbox></div>)}</fieldset>
    <p className={styles.status} role="status">{showcaseList.name}: {selected.length} produtos selecionados{selected.includes("tomate") ? ". Tomate entra na próxima compra." : ". Selecione Tomate para incluí-lo."}</p><DemoReset ready={ready} onReset={()=>setSelected(initialSelection)}/>
  </div>;
}
