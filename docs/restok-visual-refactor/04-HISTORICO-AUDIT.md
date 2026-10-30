# Histórico

Comparar [atual390](evidence/current/390-844-historico-filled.png), [aprovado390](evidence/reference/390-844-historico-canvas.png), [atual1440](evidence/current/1440-900-historico-filled.png) e [aprovado1440](evidence/reference/1440-900-historico-canvas.png). Cenário adicional: [24 compras](evidence/extra/390-844-history-many.png). Não preencher a tela com métricas decorativas para mascarar ausência de registros.

## R-01: registro mobile divide o eixo de leitura do total

**Tela:**Histórico. **Viewport:**320×640,390×844,1440×900. **Severidade:**média. **Evidência:** current/*-historico-filled.png e extra/*-history-many.png; referência correspondente. **Componente:** `history/history-view.tsx:25–37`, `history.module.css:8–15,29–32`.

**Problema atual:** mobile coloca total em outra linha à esquerda, depois de nome, data e três contagens. Cada compra vira um bloco longo, ainda que todas as quantidades sejam0 em categorias secundárias. Desktop põe total muito longe do nome em uma linha de992px.

**Referência:** nome/data à esquerda, valor destacado à direita e ação discreta, agrupados por mês, em superfície clara. **Correção/especificação proposta:** grid minmax(0,1fr) auto com nome16px600/data12–14px; total16px700 alinhado ao fim; contagens adicionais numa linha secundária expansível ou no detalhe, sem removê-las da consulta; row ordinária72–88px e crescimento livre com nomes longos. Coleção mensal branca/radius12/divisor line. Não trocar cada registro por um card grande isolado.

**Aceite:** nome80 e BRL alto cabem sem cortar; pelo menos3 registros ordinários completos em390 com dados suficientes; total não parece unitário; teclado abre o registro e volta ao mesmo botão. **Impacto:** lista e estilos do detalhe compartilham selectors; revisar ambos ao mudar as colunas.

## R-02: navegação por período e contexto da coleção ausentes

**Tela:**Histórico. **Viewport:**390×844 e1440×900, com24 compras em seis meses. **Severidade:**média, melhoria de apresentação sujeita a D-03. **Evidência:** extra/390-844-history-many.png; reference/390-844-historico-canvas.png e reference-interactions/*-history-filter.png. **Componente:** `history-view.tsx:20–39`, `history-model.ts`, shell.

**Problema:** agrupamento mensal existe, mas localizar um mês exige rolar toda a coleção; header só informa genericamente que são compras concluídas. **Referência:** demo tem filtros de mês e contexto com quantidade/última compra/total registrado.

**Correção/especificação proposta:** filtro local Todos/período derivado dos registros e quantidade de compras; desktop pode usar apoio contextual para última compra e intervalo selecionado. Labels14px, alvos44px, estado selecionado surfaceBrand/underline coerente com o sistema. Se houver soma, nomear “Total registrado no período” e advertir quando existirem compras com preço ausente. Não copiar “Outubro/Setembro” fixos nem calcular média/variação sem necessidade.

**Aceite:** nenhum registro desaparece do modo Todos; datas equivalentes e fuso preservados; filtro vazio tem limpar; hash de detalhe/back continua correto. **Impacto:** somente apresentação; regra de referência estritamente anterior não muda. Sem API, banco ou taxonomia nova.

## R-03: detalhe repete a pilha mobile no desktop

**Tela:**Histórico/detalhe. **Viewport:**390×844,1280×800,1440×900. **Severidade:**média. **Evidência:** current/*-historico-detail.png, extra/*-history-long-detail.png, reference-interactions/*-history-detail.png. **Componente:** `history/history-detail.tsx:20–43`, `history.module.css:16–37`, `history-price-comparison.tsx:7–13`.

**Problema:** voltar, data, título, descrição, resumo e três contagens formam uma sequência extensa; comparação unitária fica numa linha separada em toda a largura mesmo quando poderia ser associada ao preço. A demo não cobre os mesmos estados de produção, portanto sua simplificação não autoriza apagá-los.

**Referência:** DS histórico exige data/nome/total/quantidades e variação por unidade; preview mantém detalhe contextual de compra. **Correção/especificação proposta:** desktop resumo e contagens em apoio, itens como corpo principal; mobile total32px800 e contagens20px600 em faixa compacta, separação24px entre grupos/8px dentro deles. Nome16px600; subtotal16px700; comparação14px/info junto do respectivo preço com quebra livre. **Aceite:** zero, ausente, preço anterior0 e anterior inexistente distintos; total imutável após editar catálogo; voltar restaura foco e localização, inclusive hash direto. **Impacto:** compartilhamento de estilos e colunas do shell, sem trocar `previousHistoryPrice` por `latestPriceFor`.

## Vazio, loading e erros

O vazio supplied/U02/U06 e current/*-historico-empty.png é legítimo; aplicar variante compacta F-04 e orientar finalizar a primeira compra. Não criar “nova compra” que silenciosamente arquive uma lista existente. Loading e falha de snapshot são estados do carregamento compartilhado, não um conjunto de compras0. Erros e retentativas devem permanecer identificáveis.

Preservar `historyMonths`, `historyDate`, `historySummary`, `previousHistoryPrice`, filtros de listas concluídas e navegação `#history/<id>`. Comparação atual usa diferença absoluta unitária; não prometer percentual existente. Se percentual for solicitado posteriormente, base0 exige ramo explícito. Testes atuais já cobrem100 compras; nesta rodada a captura nova longa tem24, não100.
