const questions = [
  {
    question: "Posso usar com outras pessoas da casa?",
    answer: "Sim. Convide por link para participar da casa e acompanhar a lista compartilhada.",
  },
  {
    question: "Como o total é calculado?",
    answer: "Pelos itens marcados como comprados com preço informado, multiplicado pela quantidade. Itens “Já temos” não aumentam o total.",
  },
  {
    question: "O que fica no histórico?",
    answer: "Compras concluídas, itens, quantidades e preços registrados.",
  },
  {
    question: "Preciso instalar um aplicativo?",
    answer: "O Restok atual funciona no navegador, no celular e no computador.",
  },
  {
    question: "O Restok controla minha despensa?",
    answer: "Ele organiza os produtos habituais e a lista de compras; não mede o estoque físico da casa.",
  },
];

export function LandingFaq() {
  return (
    <section id="duvidas" className="landing-faq" aria-labelledby="duvidas-title">
      <div className="landing-wrap landing-faq-grid">
        <h2 id="duvidas-title">Dúvidas</h2>
        <div className="landing-faq-list">
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
