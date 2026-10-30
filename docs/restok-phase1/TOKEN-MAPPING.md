# Fase 1: mapeamento da referência v6

30/10/2026. Fonte: `../restok-demo-v6-handoff/original/dist/handoff/tokens.v1.json`.
Commit de referência: `f0214b71d9497caa62ccaa3b804579f7cd757959`.
O pedido atual prevalece sobre os nomes e a ordem dos blocos dos roadmaps antigos.

## Cores preservadas e verificadas no navegador

As 17 cores já estavam corretas. Os canais RGB nativos permitem alpha no Tailwind;
não são aliases da paleta descartada da demonstração.

| Referência | Token CSS em styles/tokens.css | Valor |
|---|---|---|
| brand.900 | --color-brand | #213F1D |
| action.700 | --color-action | #2D5A27 |
| highlight.300 | --color-highlight | #B4D3A7 |
| info.700 | --color-info | #4F7566 |
| canvas | --color-canvas | #F7FAF5 |
| surface | --color-surface | #FFFFFF |
| ink | --color-ink | #18251A |
| muted | --color-muted | #526452 |
| line | --color-line | #E1E9DE |
| lineStrong | --color-line-strong | #C9D9C5 |
| surfaceSoft | --color-surface-soft | #F0F5ED |
| surfaceBrand | --color-surface-brand | #E8F2E3 |
| surfaceInfo | --color-surface-info | #EAF2ED |
| danger.700 | --color-danger | #B94132 |
| surfaceDanger | --color-surface-danger | #FFF2ED |
| warning.700 | --color-warning | #946127 |
| surfaceWarning | --color-surface-warning | #FDF4E5 |

Novos papéis derivados: `--color-on-brand` e `--color-on-action` referenciam
surface; `--color-focus` referencia action. Nenhuma nova cor ou segunda paleta.

## Dimensões, fonte e estados

| Origem | Implementação | Situação nesta fase |
|---|---|---|
| spacing 1/2/3/4/6/8/12 | --space-* = 4/8/12/16/24/32/48px em rem | Preservado |
| radius control/panel/budget | --radius-* = 8/12/18px em rem | Preservado |
| Manrope 400–800 | --font-body e duas fontes WOFF2 locais, OFL | Preservado; glifos reais verificados por CDP |
| scalePx 12/14/16/20/24/32 | --text-xs/sm/body/title/heading/value | Preservado |
| fontWeights 400/500/600/700/800 | --weight-regular/medium/semibold/bold/extrabold | Nomeados nesta fase; sem remapear font-bold |
| Corpo/títulos | --leading-body 1.5; --leading-title 1.2 | Preservado |
| Refinamento de títulos | --tracking-heading -.02em | Extraído da amostra existente; sem aplicar a todos os títulos |
| Hairline / foco do diagnóstico | --border-width 1px; --focus-width 2px; --focus-offset 3px | Nomeados; foco consumido em base.css e numeric-fields |
| Lucide já usado no app | --icon-small/default/status 16/20/24px; --icon-stroke 1.75 | Tamanhos preparados; traço aplicado sem alterar geometrias |
| Alvo de toque | --touch-target 44px | Preservado |
| Gutter DS §3 | --layout-gutter 12px, 16px desde390, 24px desde1024 | Preparado; só o preview consome nesta fase |
| Z-index por papel | dropdown20/dock30/dialog40/toast50 | Preservado |
| Overlay | --shadow-overlay, duas camadas discretas | Preservado; sem sombra nova em listas |

`1024px` é a transição preparada para o token de gutter desktop, conforme o DS,
não uma certificação de breakpoint do shell. A Fase 2 decidirá a navegação pela
largura útil. `1920×1080` continua QA derivado; nenhum token exclusivo foi criado.

Tailwind: cores/alpha e raios já estavam disponíveis. Foram acrescentados
`text-body/title/heading/value`, `p-gutter` (e demais utilities de spacing) e
`min-h-touch`, com variáveis compartilhadas. Os tamanhos padrão de Tailwind e os
pesos reais não foram remapeados. CSS Modules permanece o meio principal do app.

## Movimento preservado

| JSON da demonstração | Produção existente | Justificativa |
|---|---|---|
| quickMs160 | feedback140 / exit160 | Faixa140–160 do markdown canônico |
| routeMs180 | state220 | Faixa180–220 do markdown |
| sheetMs260 | enter220 | Faixa220–260 do markdown |
| budgetPreviewMs360 | state220 | 360 é limite exploratório da prévia; diagnóstico recomenda não trocar arbitrariamente |
| easingEnter / easingValue | --ease-enter / --ease-feedback | Mesmas curvas |
| reducedMotion | quatro durações0ms + reset global | Verificado no navegador |

Não se adicionou animação, delay, dependência ou alteração de ciclo de fechamento.

## Substituição incremental do legado

- Removido o foco global de campos com `outline:none` e halo info de13%.
- O wrapper monetário/quantidade substitui seu halo info por foco action2px/offset3
  apenas quando o input recebe foco visível. Botões do stepper mantêm seu foco
  próprio; o erro conserva a borda danger.
- O preview deixou de usar borda info em seu campo de amostra e usa lineStrong.
- Não foram reimportados CSS/aliases `lime`, `blue`, moldura ou dados da demo no produto.
- Valores literais restantes nos componentes estão inventariados em
  `evidence/legacy-inventory.json`. O inventário não considera todo literal um defeito:
  composição e estados dos componentes serão avaliados nas fases próprias.
- Sidebar, header, containers, rows, cards, controles compartilhados e landing
  preservam sua composição atual. Nenhuma retirada indiscriminada de CSS foi feita.
