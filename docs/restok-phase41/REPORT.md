# Fase4.1: Compra submetida à validação

30/10/2026, America/Sao_Paulo. Autorização: implementar exclusivamente a Fase4.1 e
usar o código de demonstração para validar tudo que for implementado. As três
capturas corrigidas de Compra foram preservadas em `reference-supplied/`.

## Resultado e limites

Compra foi reconstruída a partir de purchaseView/purchaseRows/purchaseBudget e
dos CSS efetivamente carregados no pacote v6. A comparação executa o original,
não depende apenas da interpretação das imagens.

O [relatório de conformidade](CONFORMANCE.md) mostra por elemento o que está
conforme, as exceções necessárias e as diferenças restantes. A [galeria](index.html)
contém referência, baseline anterior e resultado nas quatro resoluções solicitadas,
além dos estados reais. Não se afirma que toda a aplicação replica literalmente
a demonstração; Casa, Histórico e Pessoas ficaram fora da Fase4.1.

## Modificações

- Header com título e contagem de comprados/data; orçamento com a composição e
  tipografia medidas no original; meta e saldos seguem os cálculos existentes.
- Lista plana na ordem da compra ao abrir, com busca por nome/categoria, filtros
  plurais e indicação do modo real. Categoria e A–Z continuam disponíveis.
- Uma coleção branca, borda fina/radius12, rows com medidas da referência, checkbox
  quadrado e comprado riscado. Preço unitário fica abaixo do total à direita.
- Já temos funciona em todas as linhas, incluindo troca direta comprado→Já temos
  e Já temos→comprado. Os callbacks de gravação existentes continuam responsáveis
  pelas alterações; não foi criada simulação no produto.
- Resumo lateral restrito à Compra, derivado dos itens reais, com filtros úteis
  e finalizar. Não se duplica a casa ativa em um card contextual.
- Footer mobile mostra pendentes/comprados/Já temos, com adicionar e reserva de
  espaço existentes. Total continua anunciado para tecnologia assistiva.

## Arquivos desta fase

| Arquivo | Responsabilidade |
|---|---|
| components/shopping/shopping-view.tsx | Header, data/contagens, coleção e dica; demais estados preservados |
| shopping/shopping-toolbar.tsx e use-shopping-view.ts | Busca por categoria e modos list/category/alphabetical sem writes |
| shopping/item-row.tsx | Identidade, preço total/unitário e ação Já temos em todos os estados |
| shopping/status-toggle.tsx e already-have.tsx | Semântica e transições dos controles da referência |
| shopping/budget-summary.tsx e shopping-controls.module.css | Copy original, tipos23/27/34, orçamento compacto e alvos acessíveis |
| shopping/shopping.module.css e category-section.tsx | Grid da Compra, uma superfície por coleção, tipo/altura de rows e grupos opcionais |
| shopping/purchase-context.tsx (novo) | Resumo real, sem nova API ou dados fictícios |
| shopping/shopping-dock.tsx | Contagem da referência sem duplicar valor visualmente |
| components/restok-app.tsx | Conecta o resumo somente em Compra e passa contagens ao dock; serviços intactos |
| shopping/shopping-presentation.test.tsx | Caso novo comprado/Já temos/desfazer com callbacks reais |
| shopping/shopping-view.test.tsx; restok-app.category-sort/purchase.test.tsx | Expectativas atualizadas para ordem inicial, nomes plurais e resumo da referência |
| tests/e2e/validate-phase41.mjs (novo) | Executa original e real; screenshots, métricas, filtros, transições e fluxos locais |
| tests/e2e/build-phase41.mjs (novo) | Build isolado que preserva .next em uso e não copia .env |
| DESIGN.md; docs/restok-phase41/ | Decisão atual, evidências, classificação e fontes |

Os caminhos abreviados na tabela são relativos a `components/`. Nenhuma regra
visual de Casa/Histórico/Pessoas foi editada. Os hashes de UI, shell e Produtos
comparados com o manifesto da Fase3 permanecem iguais, registrados em
`evidence/manifest.json.outsideScope`. Alterações preexistentes foram preservadas.

## Verificações

- 245/245 testes em41 arquivos, execução serial sem ampliar timeouts.
- 192 checks Playwright/Edge156, zero pageerror: original e real, sete larguras.
- Lint, TypeScript e git diff --check aprovados.
- Build Next/webpack isolado: resultado em evidence/build.json e log em build.log.

Viewports:320×640,390×844,768×1024,1024×768,1280×800,1440×900,1920×1080.
Os três modos originais são comparados diretamente;1920 é QA derivado.

Os checks incluem nomes/ordem dos14itens, valor50,68, cores/radius/borda, tipo do
título/valor/nomes, alturas de row, filtros, busca Café e Limpeza, busca sem
resultado e transições pendente/comprado/Já temos nos dois códigos. O resumo
9/4/1/3 também é comparado ao original em1440.

Fluxos reais adicionais no harness: meta0, adicionar com preço ausente, editar
quantidade2×4,50, finalizar com pendentes, confirmação de conclusão, listas0/100,
meta igual/excedida, comprado sem preço, valores extremos, retry após falha,
seleção100produtos com footer alcançável e loading liberado por resposta explícita.
Os dados e respostas são locais; isto não certifica backend/RLS.

Um teste antigo exigia ausência do resumo lateral e foi atualizado para a
referência atual. Ordenação por categoria continua testada após ativá-la no menu,
inclusive sua persistência independente por categoria. A suite mantém testes de
dinheiro, retry/idempotência, permissões, histórico e teclado.

Capturas de referência são do #app integral, sem cortar a borda direita pelo
laboratório. Não se usou pontuação automática de pixels como critério único.

## Prontidão

Entrega pronta para revisão da Compra com as diferenças explicitadas na matriz.
Fase4.2 e demais telas não foram iniciadas. Sessão autenticada e dispositivos
físicos continuam sem nova verificação. Nenhum commit, push, migration, gravação
remota ou deploy foi realizado.

Rollback: reverter somente os diffs e arquivos novos desta Fase4.1, preservando
as fundações, Fases2/3, pacote original e dados.
