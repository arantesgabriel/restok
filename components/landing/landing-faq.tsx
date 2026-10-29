import {ChevronDown} from "lucide-react";
import styles from "./site.module.css";
const questions=[
  {question:"Posso usar com outras pessoas da casa?",answer:"Sim. Cada pessoa usa sua própria conta e entra na casa por convite. Com conexão, vocês acompanham a mesma lista."},
  {question:"Como o total é calculado?",answer:"Pelos itens marcados como comprados com preço informado, multiplicado pela quantidade. Itens “Já temos” não aumentam o total. Um item comprado sem preço deixa o total parcial."},
  {question:"O que fica no histórico?",answer:"Compras concluídas, itens, quantidades e preços registrados."},
  {question:"Preciso instalar um aplicativo?",answer:"O Restok atual funciona no navegador, no celular e no computador."},
  {question:"O Restok controla minha despensa?",answer:"Ele organiza os produtos habituais e a lista de compras; não mede o estoque físico da casa."},
];
export function LandingFaq(){return <section id="duvidas" className={styles.faq} aria-labelledby="duvidas-title"><div className={`${styles.container} ${styles.faqLayout}`}><div><h2 id="duvidas-title">Dúvidas, antes de começar.</h2><p className={styles.faqIntro}>O que a lista registra e como ela acompanha sua casa.</p></div><div className={styles.questions}>{questions.map(item=><details key={item.question}><summary>{item.question}<ChevronDown size={17} aria-hidden="true"/></summary><p>{item.answer}</p></details>)}</div></div></section>;}
