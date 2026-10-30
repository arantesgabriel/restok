# Roadmap Inside-Out: proposta para aprovação

28/10/2026 · **Nenhum PR/tarefa foi criado. Nenhuma fase foi executada.** Números abaixo são limites de trabalho futuro, não itens enviados a GitHub/Linear. Fontes: arquitetura01, matriz02, evidências03 e contratos04.

## Estratégia e estimativa

Unidade relativa: XS=1, S=2, M=3, L=5 pontos, sem converter em dias sem conhecer equipe/disponibilidade. Esforço de testes físicos/mailbox é dependência externa, não folga implícita. Não migrar stack nem Supabase para resolver apresentação.

Branch futura `codex/restok-raiz-eucalipto-<escopo>` após autorização. Não misturar mudanças locais prévias do usuário no commit. Capturar hashes/diff em vez de usar reset/stash destrutivo. Usar pequenos commits/PRs que possam ser revertidos em ordem inversa. Nunca reverter migrations de segurança para reverter UI. Mudança de regras monetárias exige leitura de0 antigo e null, sem transformação destrutiva de dados.

## Ordem e dependências

| Ordem | Fase / escopo de PR proposto | Depende de | Esforço | Gate principal |
|---|---|---|---|---|
| 01 | 0A: baseline, check de tooling, harness de evidências/fixtures | Aprovação do plano | M3 | Checks verdes e reprodutíveis; sem banco remoto |
| 02 | 0B: UI-013, restauração da casa autorizada | 01 | S2 | Duas contas × duas casas, reload e convites |
| 03 | 1: fundamentos novos e norma local | 01 | M3 | Tokens/fonte legal/foco/contraste em preview isolado |
| 04 | 2A: campos e contrato monetário UI-003/004/008/010 | 02,03 | M3 | Vazio/0/positivo, BRL e histórico sem regressão |
| 05 | 2B: controles, overlay, feedback e navegação | 03,04 | L5 | Estado/foco/reduced, sem atraso de dado |
| 06 | 3A: shell + Compra + P1 UI-001/desktop UI-005 | 02,04,05 | L5 | Primeira dobra320 e quatro linhas1280 |
| 07 | 3B: preparar/adicionar/editar/concluir compra | 06 | M3 | Footer longo, gravação real, contagens e retry |
| 08 | 3C: Produtos da casa e busca UI-009 | 07 | M3 | Editar/ativo/inativo/seleção preservados |
| 09 | 3D: Histórico e detalhe | 07 | M3 | Cronologia, snapshots e unitário anterior |
| 10 | 3E: Casas e pessoas + P1 UI-002 + onboarding | 06,08 | M3 | Identidade íntegra e permissões reais |
| 11 | 3F: Conta/auth/perfil + UI-006 | 05,10 | M3 | Guarda e todos os ramos de formulário |
| 12 | 4A: motion funcional e acessibilidade cruzada | 06–11 | M3 | Foco, interrupção, reduced, reader/zoom registrados |
| 13 | 4B: retirada do legado core/global, integração pública mínima | 12 | M3 | Nenhum alias global antigo/segunda paleta ativa |
| 14 | 5A: reconstrução composta da landing e demos | 13 e core estável | L5 | Conteúdo factual, no-JS, hashes e seis larguras |
| 15 | 5B: limpeza final, QA de conjunto e pacote de aprovação | 14 | M3 | Zero consumidores visuais antigos; release gates explícitos |

Total inicial **50 pontos relativos**, incluindo baseline e QA técnico; pode mudar com achados medidos. Cada L deve ser dividido se não couber em revisão clara. Estimativa não inclui aquisição/licenciamento da fonte, master de marca, hardware/mailbox nem criação de infraestrutura externa. O PR02 é gate funcional antes do polish; PR06 e PR10 encerram os outros P1 antes de ampliar linguagem pública.

## Fase 0: baseline e proteção

**Objetivo:** tornar regressão mensurável e corrigir contexto antes de estética.

**Arquivos comprovados:** `vitest.config.ts`, `package.json`, `package-lock.json`, `tests/fixtures/shopping.ts`, `tests/support/account.ts`, `tests/supabase/README.md`, `components/restok-app.tsx`, `lib/supabase/data.ts`, `lib/supabase/cache.ts` e seus testes. Destinos novos propostos: `tests/e2e/`, documentação de evidências e testes de contexto. Não criar bypass de `/app`.

- **PR01:** registrar commit/diff/stack e baseline por rota/estado; resolver TS2769 no config compatível com Vitest5, sem apagar config do typecheck; separar correção necessária de alteração de dependência. Harness com fixtures locais rotuladas, sem backend compartilhado. Capturas e vídeos com seeks, conforme06. Caso E2E exija ferramenta ausente, adicionar somente com escopo aprovado, justificar custo de tooling e isolar do bundle.
- **PR02:** corrigir chamada `resolveRemoteContext(acceptedHouseholdId)` quando não há convite aceito; validar membership antes de escolher; manter fallback seguro e explicar contexto invalidado. Cobrir storage indisponível, sessão alterada e snapshots falhos. A correção não deve copiar a persistência fictícia da demo.

**Aceite:** lint/typecheck/test/build verdes no estado-base; P1 registrados com paths/reprodução; UI-013 reproduzido antes e verde depois em duas sessões reais de teste autorizadas; guards e cache por usuário/casa preservados. Se ambiente integrado faltar, não declarar gate integrado verde.

**Automação:** testes de seleção e cache, tabela de convites ausente/inválido/válido, membros revogados e sem memberships. **Manual:** dois browsers/contextos e reload real; inspeção visual da identidade da casa. **Riscos:** writes automáticos de profile/categorias durante carga; separar target descartável antes de abrir o app. **Rollback:** reverter apenas PR02/config se falhar; nenhuma alteração de banco necessária. Não apagar caches de outros usuários. Guardar baseline fora de dados privados.

## Fase 1: fundações do zero

**Objetivo:** uma norma nova e tokens utilizáveis no Tailwind3, sem sobrepor CSS legado.

**PR03 / arquivos comprovados:** `DESIGN.md`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `public/fonts/*`, `components/brand-mark.tsx`. Novos destinos `styles/tokens.css`, `base.css`, `motion.css`, norma local em `docs/design/RESTOK_DESIGN_SYSTEM_V1.md` e preview isolado para desenvolvimento.

**Entregáveis:** 17 papéis de cor do04, spacing/raios/tipo, z-index por papel, foco/contraste, fonte legal e política do master vetorial. Reescrever documentação visual, preservando fatos de PRODUCT. Não copiar classes de protótipo nem valores antigos. Preparar imports novos sem ativar base global sobre páginas antigas.

**Aceite:** tokens coerentes em estados renderizados; branco/action e highlight/brand legíveis; superfícies claras distintas; tipografia com pesos reais e português; números tabulares; sem fetch de fonte durante build; pacote de licença presente. Asset de marca final aguarda master; placeholder transitório deve estar identificado e não receber aceite final de marca.

**Automação:** validar chaves/formato, contraste de pares usados e compilação de utilities/alpha; sem teste que apenas repete cada literal. **Manual:** amostra de controles em320/390/1440 e zoom, fonte real e fallback. **Riscos:** herança global, métrica de fonte e CLS. **Rollback:** reverter imports/tokens novos ainda isolados; manter backend/cache. Sem flag pública ou tema duplicado permanente.

## Fase 2: componentes atômicos e contratos

**Objetivo:** aparência nova com estados completos antes da composição das telas.

**PR04:** de `ItemEditorSheet`, `AddItemSheet`, `NewPurchaseSheet`, `BudgetEditorSheet`, `QuantityStepper`, `PreviousPrice` e utilitários para `components/ui/money-field.tsx`, `quantity-field.tsx`, `lib/money.ts`. É correção funcional deliberada: vazio→undefined/null, zero→0, parsing pt-BR e orçamento0 consistentes. Não mudar valores existentes no banco. Quantidade extrema exige largura/validação compatível com tipo SQL e regra atual; se novo teto for necessário, decidir antes de bloquear entrada hoje válida.

**PR05:** reconstruir Button/IconButton/Field/Select/Checkbox/StatusToggle/AlreadyHave/filtros/tabs/listas/BudgetSummary/Sheet/Toast/Skeleton/EmptyState/nav/HouseSwitcher nos destinos04. Primitivos de dialog/menu preservam contratos, mesmo com implementação visual nova. Skeleton só espera real. Ações de acesso exigem confirmação e identidade clara.

**Aceite PR04:** inputs aceitam `1.234,50`, `1234,50`, `0,00` e vazio conforme contrato; inválido/negativo não grava nem fecha; comprado0 não vira desconhecido; `3×5=15`, `3×6=18`, preço anterior0 sem divisão inválida; orçamento criar/editar0 consistente; nenhum NaN/Infinity.

**Aceite PR05:** matriz default/hover/focus/active/disabled/busy/error/success/empty quando aplicável; alvo44 em ações frequentes, conteúdo rolável com header/footer; Escape/Tab/foco de volta; erro persistente, toast sem obstrução; fechar/reabrir sem leaks ou timer desencontrado. Aparência totalmente nova, sem classes antigas como fallback permanente.

**Automação:** parser e transições funcionais, render por estado, teclado de overlay/menu e regressões de quantidades/dinheiro. **Manual:** contraste contextual, toque, sobreposição e leitor. **Riscos:** alterar status ao digitar preço, perder foco ao filtrar, confundir0 histórico. **Rollback:** PRs independentes, leitura de0 compatível com schema; reverter UI não pode “corrigir” dados0 para null. Se rollback funcional interpretar0 errado, manter correção de domínio e reverter somente apresentação.

## Fase 3: core, mobile e desktop

**Objetivo:** reconstruir telas na ordem de uso, com domínio contínuo e P1 tratados.

| PR | Origem comprovada → destino proposto | Entregáveis e critérios de aceite | Automação / manual / rollback |
|---|---|---|---|
| 06 Compra/shell | `restok-app.tsx` header/AppNavigation/BudgetSummary/CategorySection/ShoppingItemRow e `ui.css` → `components/app/*`, `shopping/*` | Lista primeiro; card novo; casa visível; primeira linha completa320×640; alvo4 linhas1280×800; zero overflow; preço total mobile à direita e unitário subordinado; filtros4 e todas as ordens | Geometria E2E, cálculos, hashes; manual safe area/teclado/valores; reverter composição do PR sem tocar fila/dados |
| 07 Compra sheets | ItemEditor/AddItem/NewPurchase/BudgetEditor/ConfirmFinish/Complete → sheets novos em `components/shopping/*` | Selecionar0/alguns/todos/resultados; ativa anterior arquivada com aviso; footer de coleção33/100 sempre alcançável; avulso pode entrar no catálogo; pendências não impedem concluir; sucesso só após write confirmado | Tests compra/retry/idempotência; vídeo dos fluxos e falhas; reverter sheets, preservar registros criados e IDs |
| 08 Casa | ProductsHome/ProductRow/ProductEditor → `components/products/*` | Criar/editar/ativo/inativo e seleção seguinte intactos; busca local, limpar, categoria/A–Z e ordenação independente; não adicionar estoque “Já temos” ao catálogo | Produtos/ordem e busca; manual nomes longos e reativação/foco; rollback do consumidor, sem migration |
| 09 Histórico | HistoryView/Detail/HistoryPriceComparison → `components/history/*` | Zero/muitas compras, contagens de todos os status e comprado sem preço; BRL e comparação unitária anterior à data da compra; agrupamento mensal só apresentação, sem perder ordenação ou detalhes | Histórico e fórmulas com0/sem preço; manual long names/large values; reverter apresentação e manter snapshots |
| 10 Casas | `household-manager.tsx`, `household-onboarding.tsx`, `activateHousehold` → `components/households/*` | UI-002 encerrado320/390; nome80 e prefixos iguais; owner/admin/member; criar/aceitar/revogar, usado/expirado; transferência/remover/sair/último owner; falha não muda casa | Tests de manager/contexto; integração descartável de papéis; manual confirmação/reader/privacidade; rollback visual sem reverter papéis já alterados |
| 11 Auth/conta | `login-form.tsx`, `reset-password/page.tsx`, ProfileEditor/BrandMark → `components/auth/*` e primitivos | Conta individual, lembrar email, revelar senha, signup e confirmação, recovery, profile80, loading/erros; guard e redirect seguros; não expor email de terceiros | Tests Auth e guardas; mailbox e sessão reais como gate específico, teclado/zoom; rollback de UI preservando autenticação |

**Pré-requisitos:** fundações/componentes aceitos, UI-013 corrigido, fixture segura e baseline. A migração deve extrair callbacks/controladores por responsabilidade, não mover o monólito inteiro e chamar isso de rebuild. Não atualizar todas as telas na mesma revisão. Cada PR entrega antes/depois, vídeo dos estados e lista de consumidores legados restantes.

**Riscos comuns:** fila otimista ligada a closure da casa antiga; troca de casa com write pendente; revalidação sobrescrevendo edição; foco perdido após filtro; metadata histórica confundida com fonte de verdade. **Critérios transversais:** tests06 verdes, sem UI falsa/sem sucesso inventado, estados de offline/retry visíveis, sem alargamento de dados de perfil.

## Fase 4: motion, acessibilidade e retirada

**PR12:** revisar `requestSheetClose`, ToastMessage, dialog/menu, CSS de motion e feedback de fila. Dado imediato, saída candidata160, entrada220–260; sem count-up/stagger geral. Unificar ciclo de término/cancelamento e cleanup. Medir foco e comportamento de reader, repetição rápida e reduced motion; medir custo em build atual e aparelho.

**PR13:** retirar globals/ui/tokens/Tailwind visuais antigos, imports e classes sem consumidores, seguindo02. Criar a base nova definitiva em `app/layout.tsx`. Consumidores públicos ainda presentes precisam usar tokens/primitivos novos para permitir retirada segura dos globals. Essa preparação pública mínima vem depois de estabilizar o core; não adota outra paleta nem antecipa a composição editorial da fase5. Não usar aliases permanentes para manter o CSS velho funcionando.

**Aceite:** nenhuma classe nova depende da cascata antiga, nenhuma regra antiga global afeta o core; hashes de dados/segurança intactos; CSS novo cobre reset/focus/reduced; busca e inspeção comprovam retirada do core/global; todos os restos públicos têm destino no PR14. Registrar honestamente que a retirada **total** só fecha no PR15, quando a landing também foi substituída.

**Automação:** lint/typecheck/test/build, inventário de imports e valores, E2E cruzado, tamanho de bundle por rota e diff de CSS. **Manual:** seis viewports, reader, zoom, dispositivos, falha e foco durante motion. **Riscos:** apagar CSS compartilhado necessário para auth/landing, quebrar return-focus, subestimar fonte/bundle. **Rollback:** reverter PR13 e seus imports como unidade; nunca acrescentar `!important` para esconder regressão. PR12 reversível separado. Não declarar P3 de timing mais urgente que P1/contexto.

## Fase 5: landing e outward-facing UI

**PR14:** reconstruir `app/page.tsx`, `app/landing.css` e cada arquivo `components/landing` inventariado02. Usar componentes apresentacionais novos sem importar clientes de dados/RPC em demo. Preservar rótulos de exemplo, cálculo coerente, links de entrada, skip link, FAQ e IDs/hashes testados. Retirar aparência velha do zero; não concluir com retheme de classes `.landing-*` antigas.

**PR15:** encerrar referências normativas antigas, remover CSS/assets/fontes antigos sem consumidores, atualizar documentação e conferir lista de exclusões aprovada. Artefatos históricos/licenças permanecem quando têm responsabilidade documental/legal. Registrar versão de release candidata, QA e rollback proposto, sem publicar automaticamente antes dos gates aprovados.

**Aceite:** core estabilizado antes da composição pública; nenhuma segunda linguagem visual; landing útil sem JS, sem simulação enganosa de colaboração real; primeira dobra/CTAs em320/390/1440 e checks nas demais dimensões; ausência de todo legado visual ativo comprovada por busca/imports/render e revisão humana. Assets finais com licença/master e nenhuma alegação falsa de produto/performance.

**Automação:** testes landing existentes e novas interações críticas, links/âncoras/SSR, build e orçamento medido de mídia/fontes. **Manual:** revisão de mensagem/copy, contraste e navegação, touch/zoom/no-JS. **Riscos:** demos divergirem do domínio e promises de marca sem asset final. **Rollback:** reverter somente PR14/15 e manter sistema core; não restaurar globals velhos que voltem a contaminar o app novo. Para remoção de arquivo compartilhado, revert unitário do commit que o eliminou, com validação de imports.

## Gates de decisão e conclusão

1. **Aprovação do plano:** oito documentos e alvos de reconstrução revisados; nenhum PR criado antes disso.
2. **Baseline:** checks atuais estabilizados, dados/fixtures autorizados, fonte e evidência reproduzíveis.
3. **P1:** UI-013 verde antes do polish; UI-001 e UI-002 verdes nos PRs de tela e novamente no conjunto.
4. **Funcional:** todos os contratos06, sem simplificar preço/orçamento/histórico/permissões para caber no desenho.
5. **Visual/técnico:** seis larguras, estados completos, fontes/assets legais, bundle atual e nenhuma cascata antiga ativa ao final.
6. **Release:** pendências de mailbox, Safari/Android físico, reader, zoom/texto e concorrência/CWV têm resultados ou decisão explícita e documentada de risco por responsável; não marcar auditoria100%. Publicação é ação futura separada desta missão.

Este roteiro pode ser aprovado com dependências externas abertas, desde que sejam gates vinculantes. Aprovação de roadmap não transforma evidência não executada em aprovação de release.
