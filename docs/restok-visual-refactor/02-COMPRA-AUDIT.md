# Compra

Prioridade de implementação após fundações. Comparar [atual mobile](evidence/current/390-844-compra-filled.png), [prévia mobile](evidence/reference/390-844-compra-canvas.png), [atual desktop](evidence/current/1440-900-compra-filled.png) e [prévia desktop](evidence/reference/1440-900-compra-canvas.png). O estado atual utiliza 33 itens e a prévia 14; conteúdo/contagens diferentes não são defeitos.

## C-01: orçamento comprimido e ordem interna divergente

**Tela:** Compra. **Viewport:** 320×640, 390×844, 1280×800, 1440×900. **Severidade:** alta. **Evidência:** pares acima; alturas atuais 95,19px mobile e 105,59px desktop no caso comum. **Componente:** `shopping/budget-summary.tsx:10`, `shopping-controls.module.css:14–25`, `shopping-view.tsx:16` passa compact sempre.

**Problema atual:** compact força padding 8×12px em todos os tamanhos; principal 24px mobile; metadados vêm antes da barra de 4px; só lápis comunica editar. **Referência aprovada:** DS §4, padding 14–16px mobile/20–24px desktop, principal 27–34px, progresso 5–6px antes da meta e editar. **Correção:** reconstruir anatomia responsiva, sem recalcular dinheiro no componente visual. **Especificação sugerida:** padding 16px/24px; valor 32px/800, secundário 20px/600; labels 12px; radius18; trilho action/barra highlight6; meta e botão textual “Editar meta” depois do progresso. Em320 pode usar principal28px, valor dentro da faixa do handoff.

**Aceite:** âncora inequívoca sem expulsar a primeira linha em320; gasto0/meta0/igual/excedido/sem preço corretos; action44px; BRL/tabular; no excedente mostrar diferença positiva. **Impacto:** orçamento editor, dock e demos que reutilizem BudgetSummary, sem alterar domínio. Copy “Total registrado” pode permanecer até aprovar a troca para “Gasto até agora”, pois o total ignora preços ausentes.

## C-02: anatomia de linha coloca ações no eixo de preços

**Tela:** Compra. **Viewport:** seis viewports. **Severidade:** alta. **Evidência:** current/*-compra-filled.png e reference/*-compra-canvas.png. **Componente:** `shopping/item-row.tsx:18–29`, `shopping.module.css:19–29`, `status-toggle.tsx`, `already-have.tsx`.

**Problema:** editar contém nome+preço; marcar comprado/Já temos ficam à direita; a linha não tem controle de estado à esquerda. Preço disputa largura com duas ações, e o selo Pendente ocupa atenção em cada item. Linhas comuns desktop têm72px, acima do alvo58–68px.

**Referência:** DS ShoppingItemRow e prévia: controle esquerdo, conteúdo, preço direito e ação Já temos subordinada; uma superfície branca para a coleção. **Correção/especificação:** grid44px minmax(0,1fr) coluna de preço auto; Já temos com alvo44 e ícone22–24; corpo14/16px600; metadata12px; preço14/16px700 alinhado ao fim; min-height64px ordinária; nomes longos crescem livremente. Envolver grupo em surface com radius12 e divisor line, sem card por produto. Estado via texto acessível e atributo de controle; não inventar checkbox que marca comprado sem executar o handler real.

**Aceite:** marcar, desfazer, Já temos, editar e quantidade continuam funcionando por toque e teclado; preço ausente não vira0; preço anterior unitário conservado; nome80 e total grande legíveis; foco mantido após reordenar/filtrar. **Impacto:** categorias/ordenação/filtros e identificação acessível. Não importar unidades/pacotes/categorias da demo para o schema real.

## C-03: comandos de organização repetidos

**Tela:** Compra. **Viewport:** 320×640, 390×844, 1440×900. **Severidade:** média. **Evidência:** current/320-640-compra-filled.png; código do toolbar/menu/cabeçalho de categoria. **Componente:** `shopping-toolbar.tsx:9`, `shopping-view.tsx:16`, `category-section.tsx`, `shopping.module.css:6–18`.

**Problema:** modo categoria/A–Z aparece no toolbar e no menu da compra; cada grupo também mostra a ordenação local. O estado atual não distingue com clareza modo global e direção por categoria. **Referência:** preview tem busca e uma entrada de ordenação com status discreto; DS exige efeito real.

**Correção/especificação proposta:** uma entrada global44px “Organizar lista”, com modo categoria/nome; cabeçalhos mantêm recolher e direção específica do grupo. Retirar apenas os atalhos globais redundantes do menu, preservando Nova/Finalizar. Status ativo por underline2px e labels12/14px; sem quatro botões volumosos. **Aceite:** ordenação local continua independente e preservada ao alternar o modo; busca+status combinam; limpar não muda dados. **Impacto:** hooks de apresentação e testes de ordenação, sem mudar default funcional silenciosamente.

## C-04: dock fixo desktop e ações distantes da tarefa

**Tela:** Compra. **Viewport:** 768×1024 a1920×1080. **Severidade:** alta por composição, não perda funcional demonstrada. **Evidência:** current/1440-900-compra-filled.png; reference/1440-900-compra-canvas.png. **Componente:** `app-shell.module.css:17,25`, `shopping-dock.tsx:5`, consumidor em `restok-app.tsx`.

**Problema:** desktop usa o mesmo dock mobile flutuando sob a lista; não tem CTA adicionar no cabeçalho nem resumo contextual lateral. **Referência:** DS restringe bottom dock ao mobile e preview move adicionar ao título, resumo ao apoio.

**Correção/especificação:** manter dock e nav mobile; desktop coloca Adicionar no heading e Pendentes/Finalizar em contexto de compra com rótulo visível. Resumo por status e preço ausente deriva das mesmas funções/lista; não criar novas métricas. Apoio256px conforme F-01. **Aceite:** nenhuma ação desaparece; finalizar com pendências continua avisando; resumo somente após confirmação remota existente; nenhuma barra fixa desktop tapa linhas ou rouba espaço. **Impacto:** shell e fluxo de conclusão; decidir layout intermediário por largura útil.

## C-05: números extremos quebram dentro dos dígitos

**Tela:** Compra. **Viewport:** 320×640 e390×844. **Severidade:** média. **Evidência:** current/390-844-compra-stress.png e320 correspondente. **Componente:** `shopping-controls.module.css:17–22`, `shopping.module.css:25`. **Problema:** duas colunas fixas minmax(0,1fr) e overflow-wrap:anywhere cortam o número entre grupos de dígitos.

**Referência:** DS exige preços grandes, legibilidade e sem inventar limite de quantidade. A prévia não cobre a magnitude extrema da fixture. **Correção/especificação proposta:** valor ocupa linha inteira quando o conteúdo não couber; saldo em grupo seguinte; não aplicar ellipsis. BRL/parte inteira/decimal devem ser lidos de forma contínua sempre que possível. 28–32px no dinheiro principal, 20px no saldo; para além da capacidade de representação monetária do Number, registrar questão de domínio em vez de impor teto cosmético.

**Aceite:** usar valores representáveis grandes como R$9.999.999,99 além do stress estrutural; verificar quantidade×unitário com centavos dentro do intervalo seguro; nada de scroll horizontal, NaN, truncamento ou redução de toda a UI. **Impacto:** orçamento/row/dock/editor; esta auditoria não certifica aritmética do stress de quadrilhões.

## Estados e contratos preservados

Capturados: 33 itens, vazio sem compra, filtro/busca sem resultado, edição, stress, orçamento0 com gasto15 e preço ausente, loading controlado, snapshot com erro/retry, Nova com100 produtos e footer, finalizar com pendências e resumo após confirmação simulada. PNGs em current/extra e manifestos. O cenário “sem compra” não equivale à compra ativa vazia fornecida pelo usuário, que tem evidência supplied/U03/U07.

Preservar `use-shopping-view`, `use-purchase-selection`, `runRemoteWrite`, seleção por casa e confirmação `ok && synced`. Os testes write-confirmation, purchase-sheets, money e household-context são contratos, não estilo. Não apagar pendentes ao finalizar, não mostrar sucesso remoto antecipado, não misturar cache entre casas. UI-001 é gate contínuo já atendido no caso comum, não justificativa para esmagar novamente o orçamento.
