# Roadmap de implementação

Plano para aprovação. Ordem obrigatória: **0 → 1 → 2 → 3 → 4 → 5**, com aceite explícito do bloco anterior antes de iniciar o seguinte. A existência deste plano não autoriza os seis blocos. Entregar diffs locais rastreáveis; commits/PRs/deploy dependem da instrução vigente da execução futura.

## Contrato comum

Stack: Next16/React19, TypeScript, CSS Modules, Tailwind3 semântico, Lucide e Supabase. Composição da demo, dimensões do DS/tokens, comportamento do produto/testes/PRODUCT. Reutilizar primitives existentes, sem instalar kit ou motion por conveniência. Não mudar schema, API, Auth, RLS/RPC, filas, cache, idempotência, categorias ou dados remotos para obter fidelidade visual.

Antes de editar: conferir git status, instruções locais e preservar alterações preexistentes em package/lock/next-env/tsconfig/seed. Resolver D-01 a D-03 no bloco afetado. Não apagar normas históricas nem AGENTS inteiros. Cada bloco exige testes pertinentes, lint/typecheck e render real; build apenas sem prejudicar dev ativo. Aprovação visual não decorre de checks verdes.

## Bloco 0: fundações compartilhadas

| Campo | Plano |
|---|---|
| Objetivo | Resolver contratos de grid, cascata, gutter, controles e variantes necessários às quatro telas |
| Pré-requisitos | Autorização0; confrontar F-05 no Next autenticado/target seguro; baseline dos quatro fluxos |
| Arquivos envolvidos | components/app/app-shell.tsx e CSS, navigation.module.css; ui/controls.module.css, feedback.module.css, empty-state.tsx, sheet.tsx, overlay.module.css, theme.tsx; styles/base/tokens só com causa; DESIGN.md para decisão |
| Alterar | Região lateral opcional, comportamento intermediário, gutter12/16/24, borda lineStrong, variantes compacta/primeiro uso, contrato de tema sem depender da ordem de import |
| Preservar | Paleta, fonte, escala/radius, handlers, alvos44, Lucide, AccessibleDialog, exit-lifecycle, feedback e seleção por casa |
| Problemas | F-01 a F-05; preparar C-04 sem retirar dock antes de realocar ações |
| Especificação | Sidebar232, apoio256 quando couber, gaps24/32; controles8/painéis12/orçamento18; surface branca, foco action2px/offset3 |
| Mobile/desktop | 320 gutter12;390 gutter16;768 por largura útil; desktop gutter24 e contexto opcional |
| Estados | default/hover/focus/pressed/disabled/busy; vazio/busca/filtro; loading/erro; sheet curto/longo; feedback |
| Interações | Navegação, switcher, perfil, abertura/Escape/retorno, campos/clear, notices e rolagem |
| Testes | primitives, tokens, global-migration, motion-keyboard, exit-lifecycle; smoke auth/landing por efeito global |
| Evidências | Quatro telas nos seis viewports e folha de estados; estilos computados Next/Vite; primeira linha e rodapé |
| Aceite | Sem variação de tema por imports, overflow0, alvos44, gutters corretos, nenhum handler perdido |
| Dependências | Nenhuma tela começa antes do aceite0 |
| Riscos | Reset global afeta auth/landing; breakpoint comprime campos; footer encobre conteúdo; foco/top layer |
| Pronto/rollback | Diff de fundações aprovado, evidências/checks disponíveis; reversão integral da unidade sem dados |

## Bloco 1: Compra

| Campo | Plano |
|---|---|
| Objetivo | Estabelecer craft final com orçamento, lista e ações reconstruídos |
| Pré-requisitos | Autorização1 e aceite0; referência visível; decidir copy do orçamento |
| Arquivos envolvidos | shopping-view/toolbar/budget-summary/item-row/status-toggle/already-have/category-section/shopping-dock e CSS em components/shopping; sheets apenas apresentação; restok-app.tsx |
| Alterar | Anatomia de orçamento/rows, superfície da coleção, organização global, ações desktop, números longos |
| Preservar | Hooks de view/seleção, money/quantity/utils, runRemoteWrite, ok&&synced; categorias/status/edições/conclusão |
| Problemas | C-01 a C-05 e F-04 |
| Especificação | Orçamento padding16/24, valor28–32/32, barra6/radius18; row comum64, símbolo22–24/alvo44, preço ao fim |
| Mobile/desktop | Dock só mobile; desktop Adicionar no heading e Finalizar/pendentes no contexto; apoio recolhe antes de comprimir nomes |
| Estados |0/33/100 itens; categorias; quatro filtros; busca0; nome80; preço0/ausente/alto; meta0/igual/excedente; loading/error/offline/retry; edição/conclusão |
| Interações | Marcar/desfazer/Já temos, preço/quantidade, busca+filtro, ordem global/local, avulso, Nova/seleção, finalizar com pendentes/retry |
| Testes | shopping-view, purchase-sheets, money, seleção, write-confirmation, purchase/category-sort/household-context; novos casos só para risco real |
| Evidências | Seis viewports antes/depois; primeira/última row; dinheiro e erro; vídeo real editar/marcar/filtrar/finalizar com seeks verificados |
| Aceite | ≥1 row inteira320 e≥4 em1280; dinheiro/status corretos; sem sucesso remoto antecipado ou corte de dígitos; overflow0 |
| Dependências | Casa só após aceite1 |
| Riscos | Foco ao mover controles, dupla marcação, ponto de scroll, números extremos, snapshot errado ao concluir |
| Pronto/rollback | Compra aprovada visual/funcionalmente; reverter apresentação e consumidores juntos, sem banco |

## Bloco 2: Casa

| Campo | Plano |
|---|---|
| Objetivo | Catálogo protagonista, busca e rows úteis no celular |
| Pré-requisitos | Autorização2/aceite1; D-02 resolvida |
| Arquivos envolvidos | products-home, product-row, product-editor-sheet, products.module.css; restok-app e EmptyState |
| Alterar | Heading/contexto, compra em andamento subordinada, toolbar, densidade adaptativa, ações/vazios/inativos |
| Preservar | use-product-view, editar/active/defaultQuantity, callbacks, categorias/snapshots; Nova como preparação real |
| Problemas | H-01 a H-03 e F-01/F-04 |
| Especificação | Heading24/32, contexto14, busca44; row64–80 comum e crescimento para80 caracteres; coleção branca/divisores; uma primária |
| Mobile/desktop | Mobile dados primeiro e ações sem hover obrigatório; desktop contexto fora da pilha quando útil |
| Estados |0/33/100; ativos/inativos/todos inativos; nome80 A/B, quantidade999999; busca0/alguns; categoria/A–Z; editor/error/busy |
| Interações | Buscar/limpar, ordenar por grupo, editar ativo/inativo, ativar/desativar com foco, criar produto/preparar compra |
| Testes | products-home/product-edit/products/category-sort/seleção/snapshots/history |
| Evidências | Seis tamanhos, primeira/última row, nomes/menu/teclado/erro; referência rotulada sem copiar estoque |
| Aceite | Row integral320, alvo y≤360 em320/390, duas rows comuns390, nomes íntegros/foco correto, histórico imutável |
| Dependências | Primitives0 e densidade1; sem orçamento/dock da Compra |
| Riscos | Menu torna ação inacessível; item some da busca/foco; confundir ativo com Já temos; arquivamento implícito |
| Pronto/rollback | Casa aprovada com operações reais e D-02 registrada; reverter UI sem desfazer dados |

## Bloco 3: Histórico

| Campo | Plano |
|---|---|
| Objetivo | Localizar compras e ler valores com cronologia e comparação confiáveis |
| Pré-requisitos | Autorização3/aceite2; D-03 resolvida sobre filtro/contexto |
| Arquivos envolvidos | history-view/history-detail/history.module.css; modelos consultados; restok-app só integração visual |
| Alterar | Registro, filtro local/contexto aprovados, vazio e composição de detalhe |
| Preservar | historyMonths/historyDate/historySummary/previousHistoryPrice, hashes/back/foco, concluídas e todos status/preços |
| Problemas | R-01 a R-03 e F-04 |
| Especificação | Registro72–88 normal, nome16/600/total16/700, metadata12/14; coleção branca; detalhe total32/800 e stats20/600 |
| Mobile/desktop | Total legível sem comprimir nome; desktop resumo separado dos itens; sem gráficos decorativos |
| Estados |0/1/24/100; meses; nome80/BRL alto;0/ausente; anterior0/inexistente/igual/mais/menos; hash direto |
| Interações | Filtro aprovado, abrir/voltar/back/forward, foco/scroll, limpar filtro, navegação mensal |
| Testes | history/restok-app.history/money/snapshots; referência estritamente anterior e offsets |
| Evidências | Seis viewports lista/detalhe/vazio; registros extensos/dinheiro; vídeo de navegação/foco |
| Aceite | Dados imutáveis; filtro não perde registros; comparação por unidade;0 sem percentual inválido;≥3 registros comuns390; hash/retorno corretos |
| Dependências | Shell0 e linguagem1–2; nenhuma API nova |
| Riscos | Total de período ambíguo, lista ativa no histórico, referência futura/própria, foco/scroll após filtro |
| Pronto/rollback | Visual e semântica aprovados; reverter apenas apresentação/filtro, preservar snapshots |

## Bloco 4: Casas e pessoas

| Campo | Plano |
|---|---|
| Objetivo | Casa/acesso claros, identidade íntegra, grupos compactos e confirmação sensível |
| Pré-requisitos | Autorização4/aceite3; D-01 resolvida; target/contas/ações autorizados para integração se necessária |
| Arquivos envolvidos | households/household-manager, member-row, households.module.css; variante de Sheet específica se necessária |
| Alterar | Grupo da casa, ações adaptativas, convites/seções e posição de Sair |
| Preservar | useHouseholdManager/memberPermissions, confirmação, owner/admin/member/self, último owner, convites/retry, AccessibleDialog/exit-lifecycle |
| Problemas | P-01 a P-03 e verificação F-05 |
| Especificação | Dialog≤704/90dvh, sheet≤94dvh, header20/700, nome16/600, metadata14, grupos24, alvos44 |
| Mobile/desktop | Sheet inferior sem drag obrigatório; dialog desktop; Papel compacto desktop/linha própria mobile |
| Estados |1/várias casas, papéis/self;80 A/B;0/muitos convites, expirado/usado/revogado/limite; loading/erro/retry/confirm/busy/negação |
| Interações | Troca/reload, criar/retry, convidar/copiar/ocultar/revogar, papel/transferir/remover/sair, cancelar/retorno |
| Testes | households/household-manager/household-context/sessão/primitives/exit; RLS só no ambiente que a guarda permite |
| Evidências | Seis tamanhos top/bottom/erro/confirm, nomes/teclado; vídeo sem tokens; separar fixture de integração |
| Aceite | Alvo/identidade/permissões corretos; último owner bloqueado; troca só após sucesso; primeira/última ação acessível; foco/Escape |
| Dependências | Variantes0 e D-01; onboarding só smoke |
| Riscos | Variante quebra outros sheets, confirmação fecha gestão, troca cruza tenants, token em vídeo, nomes comprimidos |
| Pronto/rollback | Visual/gates de acesso aprovados; rollback de UI jamais desfaz memberships/papéis no banco |

## Bloco 5: validação transversal

| Campo | Plano |
|---|---|
| Objetivo | Demonstrar fidelidade/consistência e preservar comportamento após os quatro blocos |
| Pré-requisitos | Autorização5/aceites0–4; decisões resolvidas e evidências disponíveis |
| Arquivos envolvidos | Quatro módulos, shell/primitives/testes afetados por defeitos; documentação/manifestos |
| Alterar | Somente divergências confirmadas, reabrindo consumidores de cada correção |
| Preservar | Identidade e todos os contratos; sem terceiro redesign ou novo escopo público |
| Problemas | Todos os IDs e gates, inclusive F-05 e UI-001/002/013 como regressão |
| Especificação | Papéis/tokens coerentes, grid por tarefa, densidade demonstrada; golden sem escala artificial |
| Mobile/desktop | Seis viewports mais1024 para transição; zoom200/400, texto, safe area e teclado físico/virtual |
| Estados | Matriz08 completa; controles default/hover/focus/disabled/busy/erro e conteúdo extenso |
| Interações | Catálogo→compra→concluir→histórico, casa/reload, foco/scroll, offline/retry e sessão autorizados |
| Testes | Suíte completa/lint/typecheck/build seguro; integração sem enfraquecer guardas; reader/dispositivo separados |
| Evidências | PNG/manifesto commit/diff/engine/viewport/canvas e vídeo com seeks reais; antes/referência/depois/esperado; limites explícitos |
| Aceite | Nenhuma falha alta/crítica sem solução ou decisão; critérios dos blocos verificados; nada de atribuir teste não executado |
| Dependências | Todos aceites; autorização própria para dados remotos/produção quando aplicável |
| Riscos | Correção global regressiva, equivalência falsa Vite/Next, golden com outros dados, mock atribuído a backend |
| Pronto/rollback | Pacote final revisável e decisão humana; sem deploy implícito; reverter apenas correção causadora/dependentes, preservar dados |
