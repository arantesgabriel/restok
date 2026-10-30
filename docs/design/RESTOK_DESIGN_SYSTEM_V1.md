# Restok Design System v1 — Raiz & Eucalipto

**Status:** direção visual escolhida em28/10/2026. PR03 implementa fundações isoladas; os consumidores migram nos PRs seguintes. Este documento não certifica aceite de telas ainda não reconstruídas.

**Missão:** tornar a rotina de compras domésticas rápida, clara e confiável. O celular usado no mercado é o cenário prioritário; o desktop precisa usar a largura adicional sem ampliar a interface mobile.

**Referência visual:** [prévia navegável consolidada](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/). Ela usa dados fictícios e não reproduz todas as funcionalidades de produção.

## 0. Escopo da decisão

**Definido:** Raiz & Eucalipto como direção única; card de orçamento verde profundo como âncora; sans geométrica; listas acima de cards decorativos; transições discretas; primeira dobra útil em 320px; layout desktop com navegação e contexto específicos.

**Pendente de validação:** licença/arquivos de Nexa, master SVG do símbolo e wordmark, implementação de todos os estados de produção, testes de motion em dispositivo real, contraste contextual e arquitetura no stack existente.

**Fontes de verdade:** este documento rege a direção visual; `PRODUCT.md`, regras de negócio e código real regem comportamento. O protótipo não autoriza exclusão de funcionalidades.

## 1. Tokens de cor — identidade única

| Token novo | Hex | Função |
|---|---|---|
| `brand.900` | `#213F1D` | Marca, card de gasto, superfícies escuras pontuais |
| `action.700` | `#2D5A27` | Ação primária, foco, seleção |
| `highlight.300` | `#B4D3A7` | Barra e valores destacados **sobre `brand.900`** |
| `info.700` | `#4F7566` | Comparações e informações secundárias |
| `canvas` | `#F7FAF5` | Fundo geral |
| `surface` | `#FFFFFF` | Formulários, listas e painéis operacionais |
| `ink` | `#18251A` | Texto prioritário |
| `muted` | `#526452` | Texto secundário |
| `line` | `#E1E9DE` | Divisores discretos de 1px |
| `line.strong` | `#C9D9C5` | Bordas que precisam de presença adicional |
| `surface.soft` | `#F0F5ED` | Hover e superfície neutra |
| `surface.brand` | `#E8F2E3` | Seleção de baixa ênfase |
| `surface.info` | `#EAF2ED` | Contexto informacional |
| `danger.700` | `#B94132` | Erros e ações destrutivas |
| `surface.danger` | `#FFF2ED` | Fundo de erro |
| `warning.700` | `#946127` | Alerta sobre superfície clara |
| `surface.warning` | `#FDF4E5` | Fundo de alerta |

### Contraste de referência, calculado em sRGB

| Combinação | Razão aproximada |
|---|---:|
| `ink` sobre `canvas` | 15,13:1 |
| Branco sobre `action.700` | 8,07:1 |
| `highlight.300` sobre `brand.900` | 7,15:1 |
| `info.700` sobre `canvas` | 4,90:1 |
| `muted` sobre `canvas` | 6,04:1 |
| `danger.700` sobre branco | 5,43:1 |

Não usar `highlight.300` como texto sobre branco. Validar também estados, foco, ícones e conteúdo em telas reais. Trigo, Pêssego, azul corporativo e gradientes artificiais estão descartados como linguagem de interface.

### CSS semântico de referência (não copiar os aliases legados)

```css
:root {
  --color-brand: #213F1D;
  --color-action: #2D5A27;
  --color-highlight: #B4D3A7;
  --color-info: #4F7566;
  --color-canvas: #F7FAF5;
  --color-surface: #FFFFFF;
  --color-ink: #18251A;
  --color-muted: #526452;
  --color-line: #E1E9DE;
}
```

**Proibido na nova arquitetura:** carregar aliases `--color-lime`, `--color-blue`, nomes das direções descartadas ou manter valores hardcoded espalhados. Esses aliases só existem na demonstração para compatibilidade com sua antiga cascata CSS.

## 2. Tipografia e comunicação

- **Preferida:** Nexa, apenas após confirmação de licença e fornecimento legítimo dos arquivos webfont. Não extrair fonte de imagens.
- **Fonte efetivamente renderizada e fallback:** Manrope 400/500/600/700/800, depois sans-serif do sistema. Sem misturar fontes decorativas em componentes operacionais.
- **Wordmark `restok.`:** substituir aproximação tipográfica pelo master vetorial aprovado quando disponível; preservar proporção e ponto da marca.
- **Pesos:** corpo 400–500, ações e labels 600–700, títulos e dinheiro principal 700–800. Evitar bold pesado em tudo.
- **Escala inicial:** 12 / 14 / 16 / 20 / 24 / 32px; corpo com line-height 1.35–1.55, títulos 1.1–1.25. Ajustar por evidência, nunca por proporção indiscriminada.
- **Valores:** `font-variant-numeric: tabular-nums`; BRL por `Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`.
- **Copy:** concreta, próxima e curta: “Já temos”, “Editar meta”, “Acima da meta”, “Compra da semana”. Sem slogans operacionais.

## 3. Grid, densidade e superfícies

| Viewport | Layout pretendido |
|---|---|
| 320×640 | Uma coluna, gutter 12px; ao menos uma linha inteira acionável antes do dock; zero overflow horizontal |
| 390×844 | Uma coluna, gutter 16px; gasto e filtros compactos, lista protagonista |
| 768 | Intermediário decidido pela largura útil e pelo conteúdo, não por convenção arbitrária |
| 1024 | Sidebar quando houver largura para usá-la com conforto |
| 1280×800 e 1440×900 | Sidebar ~224–232px, conteúdo principal flexível, contexto lateral ~240–280px somente onde ajuda; alvo de 4 linhas completas em 1280×800 |

- Spacing base: **4 / 8 / 12 / 16 / 24 / 32 / 48px**.
- Radius: 6–8px em controles, 10–12px em painéis de apoio, **18px no card de gasto**.
- Bordas: hairlines 1px; não envolver todas as seções em caixas. Sombras somente em popover, sheet e toast.
- Área tocável: preferir mínimo de **44×44px** em ações frequentes, mesmo quando o símbolo interno mede 22–24px.
- Dock mobile respeita `env(safe-area-inset-bottom)`; não encobre lista. Desktop tem navegação lateral própria, sem parecer mobile esticado.
- Uma ação primária por contexto, alinhada à tarefa. Nomes, quantidades e preços são alinhados por escaneabilidade, não centralizados sem intenção.

## 4. Anatomia de componentes

### `BudgetSummary` — componente-âncora

- Fundo `brand.900`, radius 18px, padding 14–16px mobile e 20–24px desktop. Não usar sombra para destacá-lo.
- Ordem: rótulo “Gasto até agora” → valor maior (27–34px) → “Ainda disponíveis” ou “Acima da meta” → progresso 5–6px → meta e ação “Editar meta”.
- Progresso `highlight.300` sobre trilho `action.700`, com números e texto semântico; não usar cor sozinha para comunicar gasto.
- Gasto acima da meta mostra **diferença positiva** e “Acima da meta”, não apenas “R$ 0,00 disponível”; barra satura em 100% com explicação textual.
- Testar orçamento zero, gasto zero, gasto igual à meta, excedente, preços grandes, quantidade × preço e preço ausente.

### `ShoppingItemRow` / `StatusToggle` / `AlreadyHave`

- Uma linha com controle à esquerda, nome/metadados no centro e preço alinhado à direita; altura alvo 58–68px por conteúdo.
- Nome do item primário; quantidade e unidade secundárias; preço total prioritário; unitário subordinado quando a quantidade supera 1.
- Três estados distintos: pendente, comprado, Já temos. Usar texto e estado acessível (`aria-pressed` ou equivalente); preço desconhecido é distinto de zero.
- Checkbox visual 22–24px, área clicável confortável. Reter foco após atualização; animação curta apenas no controle.
- Sem um card individual por item. Divisor de 1px e hover/focus em superfície leve bastam.

### `SearchField` / filtros / ordenação

- Busca antes da lista, campo com label, min-height ~44px, radius 8px e borda discreta.
- Filtros Todos / Pendentes / Comprados / Já temos com underline no ativo e foco visível; não quatro botões grossos.
- Empty state distingue filtro vazio de termo sem correspondência, oferecendo “Limpar busca” ou “Mostrar todos”.
- Menu de ordenação deve mostrar o efeito real, não toast decorativo.

### Botões, navegação, dock e seleção de casa

- Primário: altura ~44px, `action.700` e texto branco, radius 8px, sem sombra.
- Secundário: superfície clara e borda 1px; ícone isolado requer nome acessível e alvo de toque suficiente.
- Bottom dock apenas no mobile e espaço reservado na área rolável; a primeira linha deve aparecer em 320×640 (UI-001).
- Desktop: sidebar, conteúdo e contexto em colunas de largura útil, sem replicar dock/menus desnecessariamente.
- Casa selecionada deve continuar visível após navegação e reload. **UI-013 é um defeito funcional real**, não detalhe apenas visual.

### `Sheet`, `Toast`, `EmptyState`, `Skeleton`

- Mobile: sheet ancorado embaixo; desktop: diálogo compacto com Header/Body/Footer. Foco inicial no primeiro campo, Escape/cancelar devolvem foco ao disparador.
- Ações sensíveis (remover participante e transferir propriedade) exigem confirmação explícita e indicação de permissões.
- Toast breve, textual e acessível (`role=status`); erro de validação fica perto do campo e não desaparece sozinho.
- Skeleton somente na espera verdadeira de dados; proibição de delay artificial para exibir animação.
- Empty state explica a condição real e oferece próxima ação; nenhuma ilustração genérica é necessária.

### Catálogo, histórico, membros e conta

- Catálogo: categoria e quantidade padrão visíveis, editar/ativar/desativar quando o produto real permite; ações adicionar à compra e Já temos distintas.
- Histórico: data, nome, total, quantidade, detalhes e variação de preço **contextualizada por unidade**, sem gráficos financeiros decorativos.
- Pessoas: nome completo e papel antes de controles de acesso, não truncar nomes iguais com prefixo comum (UI-002).
- Conta/auth: preservar criação, login, recuperação, perfil e estados de sessão reais. A demonstração não cobre todos esses fluxos.

## 5. Motion tokens — hipótese de implementação a validar

| Evento | Duração proposta | Easing | Limite |
|---|---:|---|---|
| Hover e press | 140–160ms | `ease-out` | Cor/transform somente; escala máxima .98 |
| Filtro e rota | 180–220ms | `cubic-bezier(.16,1,.3,1)` | Movimento vertical até 5px, sem stagger geral |
| Marcação de item | 160–220ms | `cubic-bezier(.2,.8,.2,1)` | Estado imediato e sem overshoot excessivo |
| Gasto e progresso | Até 360ms na prévia | `cubic-bezier(.2,.8,.2,1)` | Comparar com 220ms em campo; jamais atrasar o dado |
| Bottom sheet | 220–260ms | `cubic-bezier(.16,1,.3,1)` | Entrada de ~16px, sem bounce |
| Toast | 160–180ms | `ease-out` | Não bloquear a tarefa |

- `prefers-reduced-motion` obrigatório. Dados, foco e mensagens devem funcionar sem transição.
- Motion Library é **lente de padrões**, não licença para adicionar dependência; decidir biblioteca só após mapear stack e performance.
- Os tempos da demo não substituem medições reais em aparelho físico. A auditoria v2 recomendava testar 220ms de entrada e 160ms de saída.

## 6. Matriz de estados funcionais a preservar

| Fluxo | Casos que não podem desaparecer durante a refatoração |
|---|---|
| Compra | lista vazia/longa, categorias recolhidas, busca e quatro status, preço anterior/atual, preço zero/ausente, edição de quantidade, orçamento zero/excedido, avulso, concluir compra, offline/retry |
| Produtos da casa | catálogo vazio/cheio, categoria, busca, quantidade padrão, ativo/inativo, edição, adicionar à compra, Já temos |
| Histórico | zero/muitas compras, agrupamento por data, detalhe, BRL, comparação unitária e percentual |
| Casas e pessoas | uma/várias casas, troca/reload, nomes extensos, convites, proprietário/membro, remoção/transferência, negações por permissão |
| Autenticação e conta | login, signup, recuperação de senha, sessão, nome de exibição, loading/error/focus |

**Regra de ouro:** validar isso contra o repositório real. O protótipo ilustra componentes, não cobre conclusão, todas as edições, Supabase, concorrência ou offline.

## 7. Critérios de aceite e evidências

1. Screenshot e vídeo de cada rota/estado, ao menos nos viewports 320×640, 390×844, 768, 1024, 1280×800 e 1440×900, com nomes e timestamps vinculáveis ao achado.
2. Em 320×640, primeira linha completa e clicável acima do dock; zero overflow horizontal (UI-001).
3. Em 1280×800, buscar quatro linhas completas no core; exceções justificadas funcionalmente.
4. Nomes de 80 caracteres e dois participantes com mesmo prefixo distinguíveis (UI-002).
5. Casa ativa preservada após reload real e troca autorizada de sessão (UI-013).
6. BRL correto; `price=null` diferente de `price=0`; `budget=0`, excedente, quantidade × unitário e histórico com preço anterior.
7. Navegação por teclado, foco, Escape, leitor de tela, zoom 200%/400%, texto aumentado, reduced motion e touch em hardware quando possível.
8. Sem serif editorial, sombras pesadas, gradients decorativos, excesso de centralização, cards redundantes ou animação sem informação.
9. QA visual antes/depois e regressão funcional. Não afirmar testes de Safari físico, leitor de tela, performance real ou concorrência sem evidência.

## 8. Substituição total do design legado no repositório real

Este documento **supersede as decisões visuais antigas**. O futuro agente deverá:

1. Inventariar `DESIGN*.md`, prompts, `AGENTS.md` com regras visuais, tokens, Tailwind/theme, CSS global, estilos por página, componentes, assets e fontes, com caminhos e dependências.
2. Planejar **remoção/substituição integral de toda regra visual legada e conflitante**, seguida da criação **do zero** de tokens, documentação e componentes para esta identidade. Não transportar velhos nomes, valores e exceções por inércia.
3. Distinguir regras visuais de especificações factuais de negócio, segurança, acessibilidade e operação. Não apagar `AGENTS.md` ou arquivos compartilhados inteiros sem inventariar responsabilidades e obter aprovação do alvo exato.
4. Não executar exclusões, refatoração, dependências, migrations, PR ou deploy na **fase de planejamento**. Entregar mapeamento por arquivo/PR, risco, regressões e rollback para aprovação.
5. Tratar a cascata CSS da **demo** como referência visual, nunca como código de produção pronto. A implementação deve ser nativa ao stack verdadeiro e sem aliases legados.

## 9. Achados confirmados da auditoria v2

- **P1 UI-013:** reload troca indevidamente a casa ativa.
- **P1 UI-001:** primeira linha encoberta em 320×640.
- **P1 UI-002:** nome de participante comprimido junto às ações.
- **UI-005:** densidade e linhas extensas no desktop.
- **UI-003/004/008/010/011:** semânticas monetárias, quantidade, meta e feedback.
- **Pendências reais:** Safari/iPhone físico, leitor de tela, zoom/texto do SO, concorrência, expiração, recuperação por email e performance de campo.

O pacote `restok-ui-audit-v2.zip` contém evidências com vídeos e capturas redigidas. Recomendações de direção antigas nele são **históricas**: a escolha atual Raiz & Eucalipto é posterior.

## 10. Referências e governança

- [Visor Finance](https://visorfinance.app/) — hierarquia de informação e leitura de valores.
- [AbacatePay](https://www.abacatepay.com/) — contraste e precisão de componentes.
- [Anti-Webslop](https://antiwebslop.cesaroeduardo.com/pt) — remoção de padrões genéricos.
- [AI Motion Library](https://github.com/apenasdouglas/ai-motion-library) — motion de estados.
- [UI Craft Loop](https://github.com/brunobertolini/skills/tree/develop/skills/ui-craft-loop) — ciclo de refinamento.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — referência de acessibilidade.

**Mudança futura exige:** decisão registrada, motivo, screenshot antes/depois, efeito nos tokens e aprovação. Não trocar esta identidade silenciosamente durante a implementação.
