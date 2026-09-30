# RESTOK

## Registro do produto

- **Tipo:** produto digital, em estágio de MVP
- **Plataforma atual:** aplicação web responsiva, mobile-first
- **Idioma e contexto atuais:** português do Brasil, compras em reais (R$)
- **Data desta descrição:** 30/09/2026

## O que é o RESTOK

RESTOK é uma lista recorrente e compartilhada de compras para quem cuida do abastecimento de uma casa. O produto acompanha o ciclo entre perceber o que está faltando, preparar a próxima compra, resolver os itens no supermercado e guardar preços e totais para a próxima ida.

Seu principal modo de uso é a tela de compra no celular, dentro do mercado. Ela ajuda a pessoa a encontrar o próximo item, registrar quanto comprou e quanto pagou, distinguir o que já foi comprado do que a casa já tem e acompanhar o gasto em relação a um orçamento definido para aquela compra. A lista também pode ser compartilhada entre pessoas da mesma casa quando a aplicação está conectada ao Supabase.

RESTOK é uma ferramenta prática para a rotina doméstica. Ele organiza listas, itens recorrentes, quantidades, preços informados e histórico de compras. Não controla o estoque físico da despensa nem realiza a compra ou o pagamento.

### Definição em uma frase

**A lista da casa que acompanha as pessoas do planejamento da compra ao mercado, guardando o contexto para a próxima reposição.**

## Para quem e em que momento

- Pessoas que dividem com alguém a responsabilidade de lembrar, planejar ou fazer as compras da casa.
- Quem costuma repor produtos recorrentes e quer começar a compra a partir de uma lista já conhecida.
- Quem consulta a lista enquanto caminha pelo supermercado, às vezes com pouco tempo e uma mão ocupada.
- Pessoas que querem manter o gasto visível e lembrar quanto um produto custou na compra anterior.

O produto pode servir a casais, familiares ou colegas que compartilham uma casa. A experiência atual usa linguagem doméstica e colaborativa; ela não depende de uma configuração familiar específica.

## Necessidade que atende

As tarefas de abastecer uma casa ficam espalhadas entre a memória, mensagens e listas improvisadas. No mercado, é fácil esquecer um item, perder o ponto em que a lista está ou não saber quanto a compra já está custando. Quando duas pessoas fazem a compra juntas ou em momentos diferentes, também é útil que ambas vejam a mesma lista.

RESTOK reúne esses passos em uma lista contínua: os produtos habituais formam o ponto de partida, a compra registra o que aconteceu e o histórico conserva preços e totais para a próxima vez.

## Como o produto funciona hoje

### 1. Produtos da casa

Na seção **Casa**, a pessoa mantém o catálogo de itens que costumam entrar nas compras. Pode adicionar e editar nome, categoria e quantidade padrão, desativar produtos que não usa mais e visualizar os ativos por categoria ou em ordem alfabética. As categorias atuais são **Alimentos, Bebidas, Higiene, Limpeza e Outros**.

Um item adicionado durante uma compra também pode ser incluído nos produtos da casa para aparecer em compras futuras.

### 2. Preparação de uma compra

Uma nova compra recebe nome e orçamento. A pessoa escolhe quais produtos ativos da casa quer incluir; pode selecionar todos ou apenas alguns. Os itens começam com a quantidade padrão cadastrada e com situação pendente, e essa quantidade pode ser ajustada durante a compra.

O aplicativo trabalha a partir de uma lista ativa por vez. Ao iniciar outra compra, a lista ativa anterior é concluída e fica no histórico.

### 3. Modo mercado

A tela **Compra** organiza os itens nas categorias da casa. A pessoa pode buscar pelo nome, filtrar todos os itens ou apenas pendentes, comprados e marcados como “Já temos”, e recolher categorias para percorrer a lista com mais facilidade.

Ao abrir um item, pode alterar quantidade, nome, categoria e situação. As situações disponíveis são:

- **Pendente:** ainda não foi resolvido durante esta compra.
- **Comprado:** foi comprado; quando há preço unitário registrado, quantidade × preço compõe o total da compra.
- **Já temos:** a casa já tem o item, então ele deixa de ser pendência e não aumenta o total.

Também é possível adicionar um item avulso diretamente à compra, informando nome, quantidade e categoria e, opcionalmente, o preço unitário. Se o item avulso for adicionado com preço, ele entra como comprado. A tela mostra o total registrado, o orçamento, o valor disponível ou excedido e o número de itens pendentes. O orçamento pode ser editado durante a compra.

Para produtos recorrentes com preço registrado em uma compra concluída anterior, a tela pode mostrar o preço anterior e a variação percentual em relação ao preço atual.

### 4. Conclusão e histórico

A pessoa pode finalizar a compra e salvar o resultado mesmo que ainda existam itens pendentes. A conclusão resume a quantidade de itens da lista, quantos aparecem como comprados, quantos a casa já tinha e o total calculado a partir dos itens comprados com preço registrado.

Em **Histórico**, ficam as compras concluídas, com nome, data, quantidade de itens e total. Cada registro pode ser aberto para consultar os itens, suas quantidades e os preços registrados. Esses dados dão contexto para compras futuras e alimentam a comparação de preços de produtos recorrentes.

### 5. Conta e colaboração

Quando Supabase está configurado, a aplicação oferece criação de conta e entrada com email e senha, solicitação de redefinição de senha e sessão autenticada. Na seção Casa, é possível criar e copiar um link de convite. Uma pessoa que abre o convite autenticada pode participar da casa. Alterações nos itens da lista ativa podem ser recebidas em tempo real por outra pessoa conectada à mesma lista.

Sem credenciais do Supabase, `/app` funciona em modo de demonstração no navegador: usa dados de exemplo e guarda alterações no `localStorage` daquele navegador. Esse modo permite explorar o fluxo sem criar uma conta, mas não sincroniza a lista entre pessoas ou dispositivos.

## Ciclo principal

**Manter produtos habituais → escolher o que entra na próxima compra → resolver itens no mercado e anotar quantidades e preços → concluir a compra → consultar o histórico na próxima reposição.**

O valor do RESTOK está na continuidade desse ciclo e na colaboração doméstica. A lista permanece útil antes e durante a ida ao mercado, e os preços registrados evitam começar toda compra sem contexto.

## Princípios de experiência

- Tornar a lista de compra rápida de percorrer e legível em telas pequenas.
- Deixar total, orçamento e pendências visíveis durante a compra.
- Dar destaque a ações compreensíveis com uma mão e em movimento.
- Tratar “Já temos” como uma resolução válida, sem somar esse item ao gasto.
- Usar preço anterior como referência contextual, sem sugerir uma comparação automática entre lojas.
- Manter o histórico útil para a próxima compra, sem transformá-lo em uma ferramenta de finanças pessoais.
- Comunicar os estados por texto e ícone; não depender apenas de cor.

## Identidade e orientação para o logo

O nome **RESTOK** remete a *restock* — repor o que a casa precisa. A marca deve representar uma rotina doméstica que se organiza e segue adiante: cuidado com a casa, lista pronta, compra compartilhada e reposição sem atrito.

O tom adequado é **prático, próximo, confiável e sereno**. A identidade precisa parecer útil no corredor do mercado e familiar no cotidiano da casa. Pode equilibrar a clareza de uma ferramenta com o calor de uma rotina compartilhada; não deve parecer um sistema corporativo de estoque ou um produto financeiro.

O logo precisa funcionar como assinatura ao lado do nome e como símbolo pequeno em ícone de aplicativo, favicon e interface móvel. Deve continuar legível em tamanhos reduzidos e em versões monocromáticas. A interface atual escreve o nome em minúsculas como **restok.** e usa verde profundo, tons de sálvia e fundos claros. Essas são referências da identidade visual existente; o logo pode refiná-las sem depender de detalhes que desapareçam quando reduzidos.

Territórios de significado que podem inspirar a exploração visual:

- reposição e continuidade;
- casa e cuidado cotidiano;
- lista, organização e conclusão;
- colaboração entre pessoas que compartilham a compra.

Esses territórios orientam o conceito, sem exigir um desenho literal de cesta, carrinho, casa ou caixa de seleção. O símbolo deve ser simples, distintivo e reconhecível sem reproduzir apenas um ícone genérico de supermercado.

## Limites e estado atual

Para que a descrição do logo e do produto permaneça fiel ao aplicativo de hoje:

- RESTOK organiza listas e histórico; **não mede nem atualiza o estoque físico** da despensa.
- Preços são informados pelas pessoas. **Não há leitura de código de barras, catálogo de preços de lojas, comparação entre supermercados, cupons ou compra e entrega pelo aplicativo.**
- O orçamento é definido pela pessoa para cada lista. O produto soma os itens marcados como comprados que têm preço; **não é conta bancária, divisão de despesas ou previsão financeira.**
- A referência de preço vem do histórico da própria casa para produtos recorrentes com registro anterior. **Não é pesquisa de preço de mercado.**
- A colaboração entre dispositivos depende da configuração do Supabase e de uma sessão autenticada. O modo local de demonstração persiste apenas no navegador e não é uma experiência offline sincronizada.
- A aplicação atual é web responsiva; o código não caracteriza um aplicativo nativo para iOS ou Android.
- Textos como “Casa Gabriel & Brunna”, iniciais “GB” e valores vistos em prévias são conteúdo fixo ou demonstrativo da interface, não o nome, público ou identidade oficial do produto.
- A vitrine de login é uma apresentação estática. Elementos demonstrativos nela, como resumo de economia e gráfico de compras, não correspondem a telas de análise disponíveis no aplicativo autenticado.
