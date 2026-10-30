# Design System v1 → stack real

28/10/2026 · Proposta de implementação, não executada. Fontes: especificação aprovada e `tokens.v1.json` lidos integralmente; consumidores atuais no documento 01. Nomes de diretório novos nesta página são **destinos propostos**, não arquivos existentes.

## Fundação nova

Criar `styles/tokens.css` (primitivos aprovados, papéis semânticos), `styles/base.css` (reset mínimo, fonte, foco e texto), `styles/motion.css` (timing/curvas/estado reduzido) e `components/ui/*` (aparência e contratos). Criar `docs/design/RESTOK_DESIGN_SYSTEM_V1.md` como norma local e reescrever `DESIGN.md` como entrada curta para essa norma. Não transportar `--primary`, `--sage`, `--terracotta` ou a cascata do protótipo para a nova arquitetura.

No Tailwind 3, `theme.extend.colors` deve consumir variáveis novas com formato de alpha validado, por exemplo canais RGB semânticos e `rgb(var(--color-action-rgb) / <alpha-value>)`, ou tokens hex com modifiers de opacidade testados. Escolher um formato único na implementação. Não colar JSON de referência como `tailwind.config.ts`. Classes novas devem expressar papéis, por exemplo `bg-action`, `text-ink`, `border-line`; não duplicar paleta por componente.

| Papel novo | Referência | Consumidor e validação |
|---|---|---|
| brand.900 / color-brand | `#213F1D` | Card de gasto e identidade; contraste de valor e texto |
| action.700 / color-action | `#2D5A27` | Botão primário, seleção, foco; branco sobre ação |
| highlight.300 / color-highlight | `#B4D3A7` | Saldo/barra sobre brand; nunca texto pequeno sobre branco |
| info.700 / color-info | `#4F7566` | Metadados/comparação; não único sinal de variação |
| canvas | `#F7FAF5` | Fundo, themeColor/viewport |
| surface | `#FFFFFF` | Campos, listas e painéis operacionais |
| ink | `#18251A` | Conteúdo prioritário |
| muted | `#526452` | Conteúdo secundário legível |
| line / lineStrong | `#E1E9DE` / `#C9D9C5` | Divisores / presença adicional; divisores não substituem contraste necessário para identificar controle |
| surfaceSoft | `#F0F5ED` | Hover neutro |
| surfaceBrand | `#E8F2E3` | Seleção discreta |
| surfaceInfo | `#EAF2ED` | Contexto informacional |
| danger.700 / surfaceDanger | `#B94132` / `#FFF2ED` | Erro/destruição, com texto e confirmação |
| warning.700 / surfaceWarning | `#946127` / `#FDF4E5` | Excedente/atenção, nunca somente cor |

Razões da especificação são referências, não medições desta rodada: ink/canvas 15,13:1; branco/action 8,07:1; highlight/brand 7,15:1; info/canvas 4,90:1. Validar pares renderizados, transparências, disabled, focus e ícones em cada componente. Não escurecer a identidade silenciosamente para compensar um uso inadequado de token.

## Tipografia, marca e medidas

- Fonte Manrope 400/500/600/700/800, local com `font-display: swap`, licença junto do asset e fallback system-ui. Preferir subset legítimo que inclua português; reservar métricas para reduzir CLS. Fonte Nexa só com licença e arquivos webfont válidos. Não baixar ou converter fonte nesta execução.
- Escala 12/14/16/20/24/32px como referência; implementar papéis em rem, validar zoom e textos ampliados. Line-height corpo 1.35–1.55, títulos 1.1–1.25. Não herdar o remapeamento de pesos 700/800/900→600 do Tailwind antigo.
- BRL via `formatBRL`, números tabulares no gasto, preço, quantidade e histórico. Não criar contador que atrase o valor real.
- Spacing 4/8/12/16/24/32/48; radius control 8, panel 12, budget 18. Sem sombras em cada linha; elevation só em overlay/toast/popover.
- Manter Lucide em controles e estados. Não reutilizar `categoryIcon` com glifos Unicode como sistema novo de ícones. A marca é asset aprovado, não ícone genérico da biblioteca.
- `BrandMark` aponta hoje para PNG. Planejar troca por SVG aprovado quando recebido; não redesenhar `restok.` nem alterar o ponto por orientação genérica de skill. Master ausente é gate do asset final.

## Mapeamento de componentes

| Origem comprovada | Novo destino proposto | Contrato/estado que permanece e aceite |
|---|---|---|
| Button/IconButton locais e botões repetidos | `components/ui/button.tsx`, `icon-button.tsx` | Primary/secondary/quiet/danger, busy/disabled/foco; alvo frequente ≥44×44; nome acessível |
| `.field-input`, `.login-control`, inputs inline | `components/ui/field.tsx`, `select.tsx`, `search-field.tsx` | Label/description/error, autocomplete, paste, retry; erro persistente junto ao campo |
| Parsing nos sheets | `components/ui/money-field.tsx` + parser em `lib/money.ts` | Vazio≠0, pt-BR `1.234,50`, negativo/inválido, duas casas; parser não grava sozinho |
| QuantityStepper | `components/ui/quantity-field.tsx` | Inteiro ≥1, teclas e stepper; largura para valores longos; limite de domínio explícito |
| StatusBadge e ações da linha | `components/shopping/status-toggle.tsx`, `already-have.tsx` | Três estados, texto/ícone/semântica, undo, foco estável, sem mover item por status |
| BudgetSummary | `components/shopping/budget-summary.tsx` | Card brand, gasto maior, saldo/excedente explícito, editar meta, comprados sem preço e progresso acessível |
| ShoppingItemRow/CategorySection | `components/shopping/item-row.tsx`, `category-section.tsx` | Nome quebra, total à direita, unitário subordinado, sort/collapse, categoria real |
| Busca/filtros/ViewModeToggle | `components/shopping/shopping-toolbar.tsx` | Quatro filtros, A–Z/categoria, categoria A–Z/Z–A; evitar redundância sem retirar comando |
| Sheet/AccessibleDialog | `components/ui/sheet.tsx` + revisão do wrapper existente | Header/body/footer, body rola, ação não some em 33/100 itens; foco inicial/retorno/Escape e cancelamento |
| ActionMenu | `components/ui/action-menu.tsx` | Teclado, menuitem, nomes e retorno; overlay não recortado; aparência nova |
| Toast/EmptyState/loading/banners | `components/ui/toast.tsx`, `empty-state.tsx`, `skeleton.tsx`, `sync-status.tsx` | status/alert, falha durável e retry, loading real; sem timer artificial para mostrar skeleton |
| AppNavigation/header/aside/footer | `components/app/app-shell.tsx`, `navigation.tsx`, `house-switcher.tsx` | Hashes existentes; casa visível; mobile dock sem cobertura; desktop sidebar própria |
| HouseholdManager | `components/households/household-manager.tsx`, `member-row.tsx` | Papéis reais, nome completo antes de ações, confirm dialogs, sem email de terceiro |
| Produtos/histórico/auth | `components/products/*`, `components/history/*`, `components/auth/*` | Preservar callbacks, dados e invariantes; composição descrita nos PRs |
| Landing e demos | `components/landing/*` reconstruídos na fase 5 | Mesmo sistema semântico; exemplos rotulados, links/hashes e no-JS preservados |

Não criar todos os diretórios antecipadamente. Cada componente nasce junto de estados demonstráveis e consumidor migrado. Primitivos novos podem ter preview isolado de desenvolvimento, mas não uma rota que dispense Auth do app real.

## Grid e primeira dobra

| Largura | Hipótese a validar no produto real |
|---|---|
| 320×640 | Gutter 12, título+gasto+toolbar compactos, primeira linha completa antes do dock; não ocultar ações para caber |
| 390×844 | Gutter 16, lista com preço legível, navegação e rodapé reservados; testar teclado virtual |
| 768 | Usar largura útil após conteúdo; não herdar sidebar de 640px automaticamente |
| 1024 | Sidebar se conteúdo e controles não perderem espaço; validar nomes e dinheiro grande |
| 1280×800 | Alvo ≥4 linhas inteiras no core, sidebar 224–232 e contexto opcional 240–280 |
| 1440×900 | Conteúdo flexível limitado por leitura; painel lateral só com informação útil, não métricas de finanças |

Separar altura de header, área rolável, dock e safe area em contratos de layout. Critério geométrico: `row.bottom <= dock.top` com linha acionável integralmente e sem overlay; guardar retângulos no relatório de QA. Testar banners de erro também: não exigir caber todo o feedback ocultando o problema.

## Motion funcional, sem dependência nova

| Evento | Proposta | Reduced motion / aceitação |
|---|---|---|
| Hover/press | 140–160ms; somente onde pointer/hover permitem; scale até .98 | Foco e estado imediato; sem exigir hover no touch |
| Rota/filtro | 180–220ms, `cubic-bezier(.16,1,.3,1)`, deslocamento ≤5px | Sem stagger geral, sem animar digitação; estado final imediato |
| Marcação | 160–220ms, `cubic-bezier(.2,.8,.2,1)` | Sem overshoot que prejudique conferência; manter foco |
| Gasto/progresso | Comparar 220ms com teto de 360ms da demo | Número final imediato, animação apenas da barra; zero sem divisão inválida |
| Sheet | Entrada 220–260ms; saída inicial candidata 160ms | Reduced sem atraso; cancelamento/reabertura repetidos; retorno de foco |
| Toast | 160–180ms; não obstruir primeira linha | Mensagem preservada; erros não desaparecem sozinhos |

AI Motion: máximo dois efeitos por elemento, easing e saída menor são lentes, não obrigação de usar GSAP ou os presets documentais de 400–1200ms. UI Craft Loop: priorizar propósito, interrupção e estado verdadeiro; se repetição prejudicar tarefa, remover movimento. Anti-Webslop: propriedades explícitas e reduced motion. Preferir transitionend com fallback e cancelamento controlado; não substituir o timer de 220 por outro magic number que duplique CSS/JS.

## Contratos monetários a concretizar no PR dedicado

Vazio resulta em `undefined` no domínio e `null` no banco; zero explícito resulta em `0`, nunca fallback por truthiness. Comprado com zero tem subtotal BRL zero e não conta como preço desconhecido. Já temos não soma mesmo com referência de preço. Quantidade × unitário é a base; porcentagem com referência anterior zero não pode dividir por zero: mostrar referência R$0,00 e diferença absoluta, sem percentual indefinido. Meta zero aceita em criar e editar; se gasto>0, excedente igual ao gasto e texto explícito; barra satura com descrição, sem `NaN`/Infinity. Confirmar essas regras com aprovação do roadmap; não são correções já realizadas.

## Migração sem segunda linguagem permanente

Não carregar regras globais antigas sobre componentes novos. Construir fundações em preview isolado, migrar o core por consumidor e restringir temporariamente CSS antigo a consumidores ainda antigos. A restrição temporária tem dono, lista e remoção em PR explícito; não é alias de compatibilidade.

Na fase 4 retirar tokens/globals/utilities legados e fazer os consumidores públicos remanescentes compilar com o sistema novo. Essa integração técnica ocorre após estabilizar o core; a composição completa da landing continua na fase 5. Se a retirada exigir reintroduzir uma paleta ou regressão pública, bloquear o PR e antecipar apenas a integração mínima necessária, sem declarar remoção completa prematuramente. O último gate da fase 5 confirma zero consumidores/arquivos visuais legados ativos.
