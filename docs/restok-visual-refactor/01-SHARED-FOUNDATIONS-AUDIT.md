# Fundações compartilhadas

Escopo: AppShell, navegação, HouseSwitcher, fonte, botões, campos, listas, EmptyState, Sheet, menus, feedback e motion. Caminho ativo: `app/layout.tsx` importa globals; globals agrega base/tokens/motion/reset; `components/restok-app.tsx` compõe AppShell e módulos das quatro telas. Reexports antigos não são usados como uma segunda identidade.

## Mapa de responsabilidades

| Fundação | Fontes ativas | Consumidores/risco |
|---|---|---|
| Tokens/fonte/reset | styles/tokens.css, base.css, motion.css, reset.css, tailwind.raiz.config.ts | Todas as telas, auth e landing; não reescrever globalmente para resolver uma única tela |
| Shell/house/nav | components/app/app-shell.tsx, app-shell.module.css, navigation.tsx, navigation.module.css, house-switcher.tsx | Quatro telas, seleção e notificações; controlar reserva do rodapé |
| Controles | components/ui/button.tsx, icon-button.tsx, field.tsx, search-field.tsx, select.tsx, option-group.tsx, controls.module.css | Core e formulários; foco, busy, disabled e erros preservados |
| Listas/feedback | ui/list.tsx, empty-state.tsx, skeleton.tsx, toast.tsx, sync-status.tsx, feedback.module.css | Compra, Casa, Histórico e estados de espera/erro |
| Overlay | ui/sheet.tsx, overlay.module.css, use-dialog-close.ts, exit-lifecycle.ts; accessible-dialog.tsx | Todos os editores e gestão; top layer, foco, Escape, scroll lock e retorno não podem regredir |
| Linha especializada | shopping/item-row.tsx; products/product-row.tsx; history/history-view.tsx; households/member-row.tsx | Anatomia específica; compartilhar tokens sem impor mesma altura a todas |

## F-01: shell desktop preserva composição de coluna única

**Tela:** Compra, Casa, Histórico e gestão no shell. **Viewport:** 768×1024, 1280×800, 1440×900 e 1920×1080. **Severidade:** alta por fidelidade/composição. **Evidência:** current/1440-900-compra-filled.png e reference/1440-900-compra-canvas.png; Casa e Histórico homônimos na galeria.

**Componente:** `components/app/app-shell.module.css:2,12,25`, `app-shell.tsx:9`, módulos de página. **Problema:** frame máximo 1280px e lista de 992px sem contexto lateral; sidebar surge já em 640px. Em 768 a área da lista tem 488px e recebe regras desktop. A prévia desktop diferencia navegação, trabalho e contexto em colunas; não é apenas uma largura maior.

**Referência aprovada:** DS §3 e preview desktop. **Correção:** suportar região lateral opcional no shell/página e escolher navegação pela largura útil. **Especificação sugerida:** sidebar 232px; gaps 24/32px; apoio 256px apenas quando restarem ao menos 560px de trabalho (limite proposto, não token aprovado); abaixo disso, contexto recolhível e uma coluna. Proposta: manter navegação mobile/intermediária até aproximadamente 1024px, validada com conteúdo. Não adicionar painéis vazios em Casa/Histórico para preencher espaço.

**Aceite:** quatro linhas de Compra completas em 1280×800, nomes/ações utilizáveis em 768, zero overflow nos seis tamanhos, contexto útil derivado de dados existentes. **Impacto:** todas as telas; testar auth/landing porque tokens são globais, sem redesign fora do core.

## F-02: gutter mobile não acompanha a largura aprovada

**Tela:** Compra, Casa e Histórico. **Viewport:** 390×844. **Severidade:** média. **Evidência:** geometria atual mostra x=12px e largura=366px em Compra e Casa. **Componente:** `app-shell.module.css:6,12,17`.

**Problema:** o gutter de 12px é fixo até 640px. **Referência:** DS §3 determina 12px em 320 e 16px em 390. **Correção/especificação:** manter 12px em 320, subir a 16px em 390 e alinhar header, conteúdo e dock ao mesmo trilho; 24px no desktop. Definir adaptação em componente/token responsivo, sem mudar a escala base de spacing.

**Aceite:** medir bordas de título, busca, lista e orçamento nos dois tamanhos, tolerância 1px, sem encurtar alvos de 44px. **Impacto:** quatro telas e sheets se herdarem o mesmo gutter; sheets mantêm padding próprio.

## F-03: bordas operacionais usam cor informacional em excesso

**Tela:** quatro telas. **Viewport:** 320×640, 390×844, 1440×900; também capturas fornecidas. **Severidade:** média. **Evidência:** current/390-844-casa-filled.png, supplied/U01/U05; reference/390-844-casa-canvas.png. **Componente:** `components/ui/controls.module.css:3,15`.

**Problema:** inputs e secundários em repouso usam `--color-info` (#4F7566); busca, switcher, perfil e filtros competem com o conteúdo. **Referência:** DS §1/§4 e campos da prévia usam limites discretos, com verde de ação em foco/seleção.

**Correção/especificação:** borda padrão `lineStrong` de 1px em campo e secundário; foco action 2px offset 3px; erro danger; informação continua info. Controles 44px mínimos, radius 8px, texto 14px nos botões e 16px nos campos. **Aceite:** tabulação mostra foco inequívoco; repouso não usa borda informacional em todos os controles; erro e disabled continuam distintos. **Impacto:** editores, onboarding e auth; smoke fora do escopo visual necessário, sem redesenhá-los.

## F-04: EmptyState universal produz caixas grandes e repetidas

**Tela:** Compra, Casa e Histórico. **Viewport:** 320×640, 390×844, 1440×900 e capturas fornecidas. **Severidade:** média. **Evidência:** current/*-compra-empty.png, *-casa-empty.png, *-historico-empty.png; supplied/U01/U02/U03/U05/U06/U07. A demonstração não fornece todos esses vazios.

**Componente:** `ui/feedback.module.css:1–4`, `ui/empty-state.tsx:4`, consumidores. **Problema:** padding vertical 32px, superfície tintada, tudo centralizado e mesmo tratamento para primeira compra, catálogo vazio e busca sem resultados. Casa ainda repete CTA primário no toolbar e no vazio.

**Referência:** DS §4 exige condição real e próxima ação, sem caixa decorativa obrigatória. **Correção/especificação proposta:** variante compacta de resultado sem correspondência, alinhada à lista, padding 16px, título 16px/600, descrição 14px, limpar explícito; primeiro uso com padding 24px, título 20px/700 e uma ação primária. Sem altura mínima artificial ou ilustração genérica. Não declarar esses valores como pixels medidos de um vazio da demo.

**Aceite:** cada vazio comunica ausência correta; busca limpa por ação visível; não há três botões primários para adicionar no mesmo viewport; mensagem de erro nunca vira vazio. **Impacto:** Compra/Casa/Histórico, preservando estados específicos e foco.

## F-05: risco de cascata confirmado no harness, não confirmado no Next

**Tela:** Compra e componentes de status. **Viewport:** seis tamanhos do harness. **Severidade:** alta para confiabilidade da evidência; risco de produto a confirmar. **Evidência:** current/320-640-compra-filled.png mostra texto ink sobre brand; supplied/U03/U07 mostra texto branco. **Componente relacionado:** `styles/base.css:23` (`.restok-theme` define cor/font), `shopping/budget-summary.tsx:10`, `shopping-controls.module.css:4`; StatusBadge também reaplica restok-theme.

**Problema:** a ordem de injeção do Vite deixa a classe de tema sobrescrever a cor do orçamento. Uma afirmação de contraste de produção baseada só nisso seria falsa. **Correção proposta:** primeiro comparar estilo computado/ordem no Next autenticado. No Bloco 0, estabelecer contrato de escopo/cascata que não dependa da ordem dos imports; nenhuma regra global com `!important` para esconder o conflito. **Especificação:** valor/rótulo claros sobre brand; highlight só sobre escuro; tamanhos dos badges vêm do componente, sem reset local inesperado.

**Aceite:** mesmas cores e papéis tipográficos no harness e Next em carregamento direto e após navegar entre as três telas. **Impacto:** todas as primitives que reaplicam tema. Não modificar testes ou aplicação nesta auditoria para fabricar essa equivalência.

## Preservar e delimitar o Bloco 0

Paleta, fonte Manrope licenciada, escala de spacing/radius, Lucide, alvos 44px, focus-visible, top layer do dialog e reduced motion já têm fundações válidas. Não recriar tokens por inércia nem importar aliases da demonstração. Motion atual 220ms entrada/160ms saída e zero em reduced é compatível com a faixa do markdown. Atualização de estado deve permanecer imediata.

Bloco 0 pode ajustar contratos de layout/cascata/controles e introduzir variantes documentadas. O orçamento/linhas específicos ficam no Bloco 1; composição de Casa no 2; filtros e resumos do Histórico no 3; agrupamento da gestão no 4. Não aplicar uma transformação de densidade a todas as rows indiscriminadamente.
