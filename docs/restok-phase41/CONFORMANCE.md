# Compra: conformidade com o código original v6

30/10/2026. Comparação solicitada pelo usuário: usar o código de demonstração para
validar tudo que for implementado. Escopo: exclusivamente Fase4.1, Compra.

## Fonte e método

Referência: `docs/restok-demo-v6-handoff/original/dist/`, commit
`f0214b71d9497caa62ccaa3b804579f7cd757959`. Foram examinados `index.html`, `r2.js`,
as folhas carregadas `r2.css/r26.css/r27.css/r28.css/r3.css/r4-consolidated.css`
e o CSS histórico `r25.css`, além do DS/JSON canônicos já lidos nas fundações.
`r25.css` não é carregado pelo HTML final; não foi tratado como cascata ativa.

O runner abre o HTML/JS original e a implementação real lado a lado, com os
mesmos14nomes, quantidades, preços, estados e orçamento da fixture v6. No original,
remove apenas a escala/recorte do laboratório e posiciona `#app` no viewport para
capturá-lo integralmente. A fonte Manrope é fornecida pelo WOFF2 local licenciado
em vez de Google Fonts. Nenhum arquivo original é modificado.

O produto usa o adaptador de teste existente, com serviços substituídos somente
no harness. Requisições fora de localhost são bloqueadas. Os dados da demonstração
não foram importados em código de produção. Categorias de teste são adaptadas ao
vocabulário real; não se cria schema de embalagens/estoque para imitar a prévia.

Manifesto em `evidence/manifest.json`: hashes dos fontes reais e originais,
medições antes das interações, resultados por caso e confirmação de que os fontes
compartilhados de UI/shell e Produtos mantêm os hashes da entrega da Fase3.
Baseline visual anterior reutiliza as capturas da Fase3, preservadas em
`evidence/before/`; não é apresentada como uma nova captura anterior a esta fase.

## Matriz por elemento implementado

| Item | Origem no código original | Implementação / verificação | Classificação |
|---|---|---|---|
| Título e subtítulo | r2.js purchaseView/viewHead; r27.css | Título, contagem de comprados e data real de startedAt; tamanho/peso comparados no navegador | Conforme |
| Line-height/tracking do título | r26.css com overrides r27.css |1.07; tracking-.056em mobile/-.053em desktop; igualdade de estilos computados verificada | Conforme |
| Orçamento e saldo | r2.js purchaseBudget/totals; r26/r27/r28.css | Gasto/saldo/meta, brand/highlight, radius18; valores e fonte comparados; cálculo real preservado | Conforme, com pequenas diferenças de medidas abaixo |
| Barra de orçamento | purchaseBudget; DS §4 | Mantidos6px, faixa canônica5–6px; percentual real, saturação100 e descrição acessível | Exceção aprovada pela especificação canônica; a prévia final usa5px |
| Editar meta | purchaseBudget/modalHtml | Chama BudgetEditorSheet real; meta0 e estado acima da meta verificados nos sete tamanhos | Conforme funcionalmente |
| Busca por nome e categoria | r2.js visibleItems/input handler | useShoppingView agora também busca category; Café e Limpeza comparados ao original | Conforme para vocabulário compartilhado |
| Filtros Todos/Pendentes/Comprados/Já temos | purchaseView/visibleItems | Mesmos nomes, ordem e resultados para cada filtro; teste executado no original e no real | Conforme |
| Ordem inicial | visibleItems/purchaseRows | Lista sem agrupamento, preservando sortOrder real; todos14nomes e posição comparados | Conforme |
| Ordenar de verdade | r2.js data-sort apenas dispara toast | Menu mantém categoria e A–Z reais, adicionando retorno à ordem da compra; indica o modo efetivo | Exceção aprovada: preservar funcionalidades reais, sem copiar ação decorativa |
| Coleção branca | r26.css .items | Uma coleção com borda1px/radius12, divisores; sem card individual por item | Conforme |
| Nome e preço à direita | purchaseRows; r26.css .item-right | Tamanhos/pesos e alturas de linha comparados; unitário subordinado ao total quando qty>1 | Conforme |
| Quantidade/embalagem | purchaseRows usa detail da fixture | Quantidade real visível; produto real não tem detail de embalagem/kg/litros | Exceção aprovada pelo limite de domínio; não há igualdade de conteúdo |
| Checkbox e comprado | purchaseRows/data-purchase-toggle | Mark quadrado22px em alvo44, comprado riscado, aria-pressed; totais e estados comparados ao clicar | Conforme, com área de toque ampliada |
| Já temos em todas as linhas | purchaseRows/data-purchase-have | Presente em pendentes, comprados e Já temos; pode alternar comprado→Já temos e Já temos→comprado/pendente | Conforme |
| Preço ausente/zero | purchaseRows/totals | Sem preço é distinto de0; sem preço não entra no gasto; suíte funcional preservada | Conforme |
| Resumo lateral | asideHtml |9pendentes/4comprados/1Já temos/3sem preço comparados ao original; filtros acionáveis | Conforme nos dados; ações reais adicionais |
| Concluir compra | Não existe persistência/conclusão equivalente na prévia | Menu e botão contextual usam confirmação real, pendências/retry e retorno de sucesso existentes | Exceção aprovada: funcionalidade real preservada |
| Footer mobile | bottomHtml | Pendentes + comprados/Já temos + adicionar; total continua acessível sem duplicação visual | Conforme no conteúdo; geometria do shell preservada |
| Dica da lista | purchaseView/r2-bottom-hint | Texto do original reaproveitado após a coleção | Conforme |
| Vazios/loading/erros e100itens | original só cobre parte dos vazios | Casos reais adicionais renderizados e verificados, sem delay/sucesso artificiais | Conforme ao produto; não há equivalente visual completo no original |

## Medições reproduzidas

Valores computados em CSS px, DPR1. A altura é da primeira row ordinária da mesma
fixture, não de nomes longos ou do histórico de preço adicional do produto real.

| Medida |320 real / original |390 real / original |1440 real / original |
|---|---|---|---|
| Título |22/22px,800/800 |25/25px,800/800 |33/33px,800/800 |
| Valor principal |23/23px |27/27px |34/34px |
| Nome da row |11/11px,700/700 |12/12px,700/700 |13/13px,700/700 |
| Altura da row |57/57px |62/62px |67/67px |
| Altura do orçamento |103,09/102,38px |118,69/118,89px |148,78/145,14px |
| Largura da coleção |296/296px |358/358px |876/850px |

O orçamento desktop conserva padding24px da fundação e alvos44px; a implementação
histórica usa19/21/16px e ação menor. Diferença de altura~3,64px permanece registrada
como **Divergente de medida**, não como igualdade de pixels. No mobile a diferença
de altura medida é menor que1px.

A coleção desktop fica26px mais larga porque o shell aprovado usa gutter24 e
contexto256, enquanto o protótipo usa38/254. A largura compartilhada não foi
alterada para outras telas nesta execução. **Exceção de composição preservada do
shell**, com diferença numérica explícita. O modo1920 não existe no original;
1920×1080 é validação derivada do desktop, sem alegar medição original equivalente.

Texto secundário usa o papel canônico muted (#526452), enquanto partes do CSS
histórico usam subtle (#647768). Não se criou um alias histórico no produto.
Essa diferença de cor e as áreas de toque maiores permanecem explícitas; não há
alegação de igualdade integral de pixels ou de todos os seletores CSS.

## O que impede afirmar “replica tudo” literalmente

- O header global desktop da demonstração foi removido por decisão posterior
  explícita. Laboratório, notas, controles de dispositivo e prévia interativa
  não pertencem ao produto. **Exceção aprovada**.
- Header/nav mobile e sidebar permanecem os componentes das Fases2/3, inclusive
  perfil, alvos de toque e nomes reais. Diferem da moldura/logo/avatar da prévia.
  **Fora da reconstrução exclusiva da Compra; diferenças preservadas e visíveis**.
- O segundo card “Contexto ativo” repete a casa global. Foi omitido conforme a
  diretriz de reduzir duplicações. **Exceção aprovada**.
- Nomes de categorias e campos de embalagem do exemplo não existem como tais no
  domínio real. Não foram transplantados. **Exceção aprovada pelo escopo original**.
- Adicionar com preço preenchido no produto real marca o item como comprado;
  a demo adiciona como pendente. Itens novos persistem na ordem real existente,
  enquanto o original usa unshift. Esses contratos existentes não foram alterados
  na refatoração visual. **Diferenças funcionais de domínio preservadas**, não
  equivalência com o comportamento simulado.
- Editar item/quantidade, seleção da próxima compra, finalizar, gravação, retry,
  auth/permissões e persistência são mais completos no real. A demonstração não
  oferece prova desses contratos. **Não verificado por comparação ao original**;
  há testes locais do produto para os casos executados.
- Sessão Next autenticada, banco/RLS, Safari/Android físicos, teclado virtual real,
  leitor de tela e zoom nativo não receberam nova certificação. **Não verificado**.
- Em320px com nome e valor extremos simultâneos, a primeira row pode exigir
  rolagem para ser lida inteira, inclusive seu preço. O caso ordinário exibe a
  primeira row completa; no stress o conteúdo e a última row continuam alcançáveis
  por scroll. A demo não contém magnitude/nome equivalentes. **Não verificado
  contra a referência nesse estado extremo; limitação de primeira dobra mantida**.

Conclusão: a estrutura e os estados comparáveis de Compra foram reproduzidos e
validados contra a execução do código v6. Não há equivalência integral irrestrita
entre a aplicação real e a demonstração estática. Outras seções não foram
implementadas nem certificadas nesta Fase4.1.
