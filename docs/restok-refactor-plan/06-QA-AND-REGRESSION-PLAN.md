# Plano de QA e regressão

28/10/2026 · Ensaios propostos para implementação futura. Status atual: testes locais69/69 e lint verdes; typecheck falhou; sem build/integrado/browser do produto novo nesta rodada. Fonte de comportamento: PRODUCT, código atual e decisões de casas; fonte de evidência anterior: v2 no03.

## Escopo e proteção

Antes de rodar E2E, confirmar ambiente descartável e contas fictícias autorizadas. `tests/supabase/authorization.integration.ts` recusa target público/externo e deixa fixtures: não relaxar esses checks nem aplicar seed/reset/migrations no projeto compartilhado para gerar mídia. Não copiar senhas de `seed.sql`/`.env` para código, logs, screenshots ou documentos. Não reaproveitar autorizações históricas da v2 como autorização nova para escrita.

Tests com mocks/happy-dom certificam contrato local, não Supabase/RLS/Realtime. Rotular separadamente: UNIT, COMPONENT, E2E-FIXTURE, INTEGRADO-DESCARTÁVEL, MANUAL-HARDWARE e EVIDÊNCIA-HERDADA. Não criar demo query flag para dispensar guarda no app real.

## Matriz funcional completa

Cada linha deve ter antes/depois no mesmo cenário e consumidor final migrado; smoke test após cada PR; suíte de risco correspondente antes de aceitar. Paths de teste citados existem hoje; expansões são propostas.

| ID | Fluxo e variações obrigatórias | Fonte / teste atual | Ensaio futuro e resultado esperado |
|---|---|---|---|
| F01 | Entrada `/app`, sessão ausente/config ausente/query flag antiga | `app/app/page.test.tsx`, `middleware.test.ts` | Guard redireciona; nenhum catálogo fictício, nenhum bypass |
| F02 | Login válido/inválido/network, submit duplo, loading | `login-form.test.tsx` | Erro genérico, inputs mantidos, busy anunciado, sem submissão duplicada |
| F03 | Signup com/sem sessão, confirmação pendente/falha | `login-form.test.tsx`, callback | Conta individual, onboarding/next seguro, foco no sucesso; mailbox real pendente |
| F04 | Lembrar email sim/não/storage bloqueado, revelar senha | `login-form.test.tsx` | Persistir só email escolhido, login funciona sem storage, nomes/estado acessíveis |
| F05 | Recovery envio, email ausente, rede, link inválido/usado/realmente expirado, senha divergente/válida | Form/callback/reset page; parte dos ramos no login test | Mailbox controlada e fluxo completo; input novo/confirm e status acessíveis; não tratar seed como prova de entrega |
| F06 | `next` externo/backslash/encoded/control/queries desconhecidas, callback sem code/error | `lib/auth/redirect.test.ts`, route | Somente destinos seguros; nenhuma regressão por novo layout |
| F07 | Nome do perfil vazio/trim/>80/falha/sucesso | `data.profile.test.ts`, compra test | Só próprio perfil muda; nome de participante usa RPC restrita |
| F08 | Logout sucesso/erro, cache de outra conta, sessão trocada | `restok-app.sign-out.test.tsx`, cache tests | Limpa apenas cache daquela conta; falha não navega falsamente; UI anterior não vaza |
| F09 | Zero memberships, criar casa, falha na ativação e retry, aceitar código válido/inválido | `household-onboarding.tsx`, `data.empty-household.test.ts` | Casa vazia sem seed de produto; ativação não cria duplicata no retry |
| F10 | Casa ativa: duas memberships, reload, troca de conta, convite ausente/inválido/válido, membership removida, storage bloqueado | `data.ts`, RestokApp boot; teste específico novo | UI-013: preferência autorizada mantida; fallback explicado e cache segregado |
| F11 | Trocar casa: snapshot falha, long name, write pendente | `activateHousehold`, cache/realtime | Falha mantém casa atual; mudança não envia fila antiga para tenant novo; zero dados cruzados |
| F12 | Owner/admin/member; criar/revogar convite;0/10 ativos; usado/revogado/expirado | `household-manager`, integration suite | Visibilidade e negação real concordam, duração14dias/uso único preservados, sem token em mídia |
| F13 | Promover/rebaixar/transferir/remover/sair/último owner | `PHASE2_DECISIONS.md`, migration lifecycle, integration suite | Confirmação identifica pessoa; admin não promove owner; último owner protegido; negações no backend |
| F14 | Nome não informado, nome80, dois prefixos iguais, loader/error/retry | `household-manager.test.tsx` | UI-002: nome inteiro legível antes de ações, sem email/ID; ações sensíveis bloqueadas sem identificação |
| F15 | Catálogo vazio, ativos/inativos, criar/editar nome/categoria/quantidade, ativar/desativar | `restok-app.products.test.tsx`, ProductEditor | Defaults e estado preservados; reativado reaparece na próxima compra; foco não some |
| F16 | Casa por categoria/A–Z, categoria A–Z/Z–A e busca futura | `restok-app.category-sort.test.tsx`, utils | Ordem por categoria persiste por casa; busca não altera catálogo; limpar resultado vazio |
| F17 | Nova compra nome padrão/vazio, orçamento, seleção0/alguns/todos/resultados,33/100 produtos | `restok-app.purchase.test.tsx` | Contagem correta, busca não perde seleção oculta, footer visível/alcançável, lista pode nascer vazia |
| F18 | Nova compra com ativa anterior pendente/resolvida, retry repetido | compra test e RPC integration | Aviso antes de concluir anterior; transação/idempotência sem duplicar compra/itens/ativo |
| F19 | Compra inexistente, ativa0itens, lista longa, categorias recolhidas | RestokApp/CategorySection | Empty correto e próximo passo; primeira linha quando há itens; recolher não muda estado |
| F20 | Busca por nome, quatro filtros, combinar busca/status, categoria/A–Z/Z–A, voltar browser | compra tests / utils / hash controllers | Resultado e empty específicos, limpar, ordem estável; hashes/back/forward preservados |
| F21 | Marcar comprado/Já temos/desfazer; status e total; itens não pulam | utils e compra tests, v2 INT4 | Três estados sem só cor; Já temos não soma; foco e posição reconhecíveis |
| F22 | Editor nome/categoria/quantidade/situação/preço; cancel/Escape/backdrop | compra test, motion-keyboard test | Salvar valido atualiza; inválido mantém form; cancelar não grava; foco retorna |
| F23 | Preço vazio/null/undefined/0/positivo/negativo/malformado/grande, input pt-BR | ItemEditor/AddItem e utils; parser novo | UI-003/004: valor canônico correto, ausência≠0, erro local; comprado0 permanece preço conhecido |
| F24 | Avulso sem/com preço/0, quantidade/categoria, “adicionar aos produtos da casa” | AddItem e addItem handler | Opcional cria produto e vínculo; sem preço fica pendente; positivo comprado;0 segue contrato aprovado sem virar desconhecido |
| F25 | Quantidade1,3,6,999999, colar/digitar inválido, stepper | QuantityStepper, UI-008 | Não aceitar NaN/negativo/fração silenciosa; valor visível; limite novo só com decisão e erro |
| F26 | Meta criar/editar0, gasto0/igual/abaixo/acima, valores grandes, preço desconhecido | BudgetSummary/BudgetEditor/UI-010 | Excedente positivo e texto, progresso válido e saturado, sem Infinity; “sem preço” não inclui0 |
| F27 | Referência anterior, mesmo/mais/menos, quantidade diferente, referência0 | `utils.test.ts`, PreviousPrice | Comparar unitário, não subtotal; preço anterior da casa/produto concluído;0 sem divisão inválida |
| F28 | Finalizar com pendências/resolvidos/sem preço/0itens; cancelar; write falha/retry | `restok-app.purchase.test.tsx`, v2 CONT | Resumo distingue três status e parcial sem preço; não mostrar sucesso remoto antes da confirmação |
| F29 | Histórico vazio/múltiplo, data/fuso/nome longo, totais e contagens | `restok-app.history.test.tsx` | Ordenação e datas corretas, nenhuma lista ativa no histórico, BRL e snapshots intactos |
| F30 | Detalhe histórico de pendente/comprado/Já temos/sem preço/0, anterior cronológico | HistoryDetail/HistoryPriceComparison tests | Status verdadeiros e preço/subtotal corretos; não usar compra futura como referência; back/hash direto |
| F31 | Realtime entre duas sessões, reconectar, update de produto/lista/item | `realtime.ts`, v2 INT4/CONT | Mesmo tenant/lista, cleanup de canal, revalidação sem perder write local pendente |
| F32 | Offline/retry, falha POST/PATCH, snapshot falha, eventos online, reload com operação pendente | runRemoteWrite e revalidação; v2 CONT | Diferenciar local/remoto; fila em memória não anunciada como durável; sem sucesso falso/duplicata |
| F33 | Dois writes no mesmo item/duas sessões, conclusão simultânea, mudança rápida de casa | Não exercitado integralmente na v2 | Ensaio integrado dedicado com resultado final registrado; não declarar merge/conflito resolvido sem prova |
| F34 | RLS cruzado, perfil privado, referência foreign category/product, auto-promoção | `authorization.integration.ts` | Sessões comuns/anon key, negações e ausência de linhas; UI não substitui RLS |
| F35 | Landing CTAs/hashes/menu/FAQ/skip/no-JS | `app/page.test.tsx`, landing tests | Links mantidos; FAQ e histórico demonstrativo legíveis sem JS; nada depende de auth real |
| F36 | Demos planejamento/compra/convite/histórico/reset, totais e “Exemplo ilustrativo” | `components/landing/*.test.tsx` | Dados fictícios rotulados, zero RPC de produto em interação demo, nenhuma capability inexistente prometida |
| F37 | Layout idioma/viewport/themeColor/metadata e carregamento de fonte/marca | `app/layout.test.tsx`, layout/BrandMark | pt-BR, safe area/zoom, fonte local com licença, fallback legível, sem CLS evitável |

F24: zero explícito é dado conhecido, mas status automático do avulso0 precisa estar explicitado no PR04 conforme contrato aprovado. Recomendação: presença de preço válido, inclusive0, torna comprado; campo vazio mantém pendente. Não transportar a condição atual `>0` por acidente. A regra de Já temos permanece distinta e excluída do gasto.

## Responsividade e evidência visual

Executar320×640,390×844,768×1024,1024×768,1280×800 e1440×900. Alturas intermediárias são convenções deste plano e devem ser registradas; o handoff só fixa larguras768/1024. Não substituir320×640 pelo histórico320×568 nem zoom por mudança de viewport.

Para cada rota/tela principal: initial/primeira dobra, scroll até fim, vazia/longa, loading/error, busca/filtro e overlay aplicável. Cruzar core/pessoas com nomes80, títulos duas linhas, dinheiro grande e teclado. Nova imagem PNG e vídeo de interação com seek verificado; gravar início/fim e precisão. Não é necessário repetir o produto cartesiano de cada teste unitário: a matriz de cobertura deve dizer quais combinações não foram amostradas.

UI-001 exige primeira linha inteira e clicável antes de dock e toast, com foco/tap no mesmo item. UI-005: alvo4 linhas completas1280×800 sem reduzir fonte/toque a ponto de perder legibilidade; exceção funcional deve ser registrada e aprovada. UI-002: nome80 e prefixos iguais lidos por inteiro antes de ações. Capturar retângulos `row/dock/header/viewport` para comprovar geometria, além da imagem.

## Acessibilidade

- Teclado: tab/shift-tab lógico; botão/search/select/checkbox operáveis; menu com setas/Home/End/Escape/Tab; dialog com foco inicial/retorno/Escape/cancel; controles de item e categorias não perdem foco ao atualizar/filtrar.
- Semântica: labels reais, aria-invalid/describedby, status/alert sem anúncios duplicados; três status anunciados; progressbar com contexto quando meta0/excedente; nomes e papéis sem depender de cor/ícone.
- Contraste: texto normal≥4,5:1 e grande≥3:1; identificação de controles/foco≥3:1 onde exigido. `line` decorativa pode ser suave, mas não ser único contorno ilegível do campo. Avaliar todas as superfícies, disabled e erro.
- Toque: alvo preferido44×44 em ações frequentes, safe area, teclado virtual/orientação, scroll no sheet com footer, gestos acidentais e ergonomia real. Tamanho nominal não certifica uso com uma mão.
- Zoom nativo200/400%, texto ampliado de SO e espaçamento de texto; não marcar aprovado com root font-size ou viewport equivalente. Conferir dock/dialog em altura útil pequena.
- Leitor: NVDA em Windows e VoiceOver/Safari em iPhone/macOS; nome/estado de controles, mudança de casa, somas, erro/retry, confirmação e retorno. Axe é complemento, não substituto.
- Reduced: preferência real/emulada explicitamente rotulada; nenhuma espera artificial; foco e conteúdo funcionam sem transição. Não confundir toggle visual da demo com preferência de SO.

## Motion e performance

Medições de timing devem separar CSS configurado, frames de animação e latência de rede. Gravar abertura/fechamento/reversão rápida de sheet, navegar durante atualização, filtros, marcar/desfazer e toast; verificar cleanup ao desmontar. State financeiro visível imediatamente. Não usar count-up para ocultar atraso nem adicionar GSAP/Motion sem caso medido.

Executar build atual em ambiente de QA antes de comparar tamanho. Histórico193kB/Next15 serve só contexto. Registrar por rota JS/CSS/fontes transferidos/comprimidos e primeiro carregamento, fontes carregadas e requests. Gate inicial proposto: nenhum aumento de JS de runtime para motion sem justificativa; demais limites derivados da baseline nova e aprovados. Fontes/assets/CSS podem alterar custo mesmo sem dependência JS.

Medir LCP/INP/CLS p75 em campo quando houver amostra válida; laboratório/lista longa em hardware é diagnóstico separado, não métrica de campo. Não implantar telemetria nem rodar `EXPLAIN ANALYZE` em produção nesta rodada. Paginação/virtualização/índice só se volume e medição justificarem; `loadRemoteState` carrega histórico inteiro, risco a observar.

## Sequência de checks e aceite

1. Typecheck sem ocultar erro atual; lint e69 testes como baseline mínima.
2. Testes novos de risco nos PRs: contexto, parsing, overlay e fluxos reais, não apenas snapshots que espelham implementação.
3. Build e E2E de fixture, sem conexão não autorizada.
4. Integração descartável com três contas para autorização e duas sessões para colaboração/contexto; injetar falha de transporte apenas no cliente de teste.
5. QA visual de seis larguras, axe contextual, teclado/reduced/zoom/reader/hardware, evidência redigida e medição de bundle.
6. Revisão da retirada02, do escopo de dados e do rollback por PR; aprovação humana dos limites remanescentes.

## Lacunas conhecidas e donos propostos

| Lacuna | Fonte / estado atual | Responsável e requisito mínimo |
|---|---|---|
| Signup/recovery/email e expiração real | B-01/B-05 v2, NÃO VERIFICADO nesta rodada | Produto/QA: mailbox de teste e token válido/usado/naturalmente expirado; fluxo sem expor segredo |
| Safari/iPhone e Android físicos | B-02 v2 | QA/dispositivos: browsers e versões reais, teclado/notch/orientação |
| VoiceOver/NVDA | B-03 v2 | QA a11y: falas e ordem, erro/status/overlay/casa |
| Zoom/texto de SO | B-04 v2 | QA:200/400% reais e escala de sistema; vídeo do método |
| Concorrência | B-05 v2 | Engenharia dados/QA: duas sessões e writes simultâneos no mesmo registro, sem privilégio extra |
| FPS/interrupção/CWV de campo | B-07 v2 | Engenharia/QA: hardware e metodologia com amostra, sem promessa numérica inventada |
| Baseline v1 e históricos extensos | B-08 e links externos da v2 | Responsável pelo handoff: disponibilizar pacote anterior ou recapturar estados; sem certificar leitura/teste inexistente |

Auditoria só pode ser chamada integral após resolver ou delimitar cada lacuna com resultado e responsável. Aceite de uma fase não autoriza declarar release completo nem aprovação WCAG global.
