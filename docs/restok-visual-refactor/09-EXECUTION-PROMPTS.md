# Prompts independentes

Entregar um por vez. Estes textos não autorizam implementação agora. Cada executor deve confirmar autorização do bloco, concluir e parar para revisão antes do seguinte.

## Prompt 0: fundações

~~~text
Trabalhe em C:/Fontes/restok (Next16/React19/TypeScript, CSS Modules, Tailwind3 semântico, Lucide/Supabase). Execute apenas Bloco0 de docs/restok-visual-refactor/07-IMPLEMENTATION-ROADMAP.md, após autorização explícita. Leia instruções locais, git status, DESIGN.md, docs/design/RESTOK_DESIGN_SYSTEM_V1.md e auditoria00/01/06/08. Preserve modificações preexistentes.

Composição aprovada: https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ . Consulte /handoff/RESTOK_DESIGN_SYSTEM_V1.md e /handoff/tokens.v1.json; cópias recuperadas em docs/restok-visual-refactor/evidence. Identidade única Raiz & Eucalipto, Manrope licenciada, sem copiar CSS/aliases ou contratos simulados da demo.

Resolva F-01 a F-05: região lateral opcional/largura útil, gutter12 em320 e16 em390, controles44/radius8/borda lineStrong, variantes de vazio e escopo de tema independente de imports. F-05 exige comparar Next e Vite: o harness mostrou texto escuro no orçamento, mas capturas fornecidas mostram branco. Confirme causa antes de corrigir.

Alvos: components/app e primitives components/ui; styles/base/tokens apenas se necessário. Preserve paleta, handlers, foco, AccessibleDialog/exit-lifecycle, notices e seleção por casa. Não reconstrua as telas, nem retire dock antes de realocar suas ações no Bloco1. Não altere domínio/API/Auth/RLS/RPC/schema/filas/banco, não instale kit/motion, não publique.

Renderize quatro telas em320×640,390×844,768×1024,1280×800,1440×900,1920×1080. Verifique estados dos controles, overflow, primeira linha, Escape/retorno/reduced e smoke auth/landing pelo efeito global. Rode testes pertinentes, lint/typecheck e build sem conflito com dev. Entregue diff, PNGs/manifesto, checks, riscos/rollback. Pare para aprovação antes do Bloco1.
~~~

## Prompt 1: Compra

~~~text
Em C:/Fontes/restok, execute só Bloco1 do roadmap docs/restok-visual-refactor/07-IMPLEMENTATION-ROADMAP.md, com autorização e Bloco0 aceito. Stack Next16/React19/TypeScript/CSS Modules/Tailwind3 semântico/Lucide/Supabase. Leia instruções, git status, auditoria02, QA08, decisões00 e DS local; preserve alterações preexistentes.

Referência de composição: https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ . Especificação em /handoff/RESTOK_DESIGN_SYSTEM_V1.md e tokens.v1.json; cópias em evidence. Raiz & Eucalipto/Manrope licenciada. Não copie aliases/CSS/unidades/categorias ou comportamento de banco da demo.

Corrija C-01 a C-05 em components/shopping e integração visual: orçamento padding16/24, valor28–32px, barra6 antes de meta+Editar; row com controle44 à esquerda, identidade central e preço ao fim, superfície branca/divisor leve,64px ordinária e crescimento livre; organização global sem redundância; desktop Adicionar no heading e Finalizar/pendentes/contexto visíveis, dock apenas mobile; valores grandes sem cortar grupos de dígitos.

Preserve status, filtros/busca, direção por categoria/recolhimento,0/ausente/anterior, quantidade, avulso, seleção de Nova, pendentes ao concluir, cache por casa e confirmação ok&&synced. Não altere funções financeiras, fila/API/Auth/permissões/schema/banco. Sem dependências, deploy ou antecipação das outras telas.

Valide320×640,390×844,768×1024,1280×800,1440×900,1920×1080:≥1 row inteira320 e≥4 em1280. Capture0/33/100, meta0/igual/excedente/preço ausente/alto,80 caracteres, busca0, erros/loading/offline/retry, editor e finalizar com pendências. Rode testes shopping/purchase-sheets/money/write-confirmation/contexto, lint/typecheck. Compare Next/fixture, teclado/foco/Escape/reduced. Entregue antes/referência/depois, manifesto, vídeo real com seeks, checks/limites/rollback. Pare para aceite da Compra antes do Bloco2.
~~~

## Prompt 2: Casa

~~~text
No C:/Fontes/restok execute só Bloco2 após autorização e aceites0–1. Stack Next16/React19/TypeScript/CSS Modules/Tailwind3 semântico/Lucide/Supabase. Leia instruções/git status, auditoria03, roadmap07, QA08, decisões00 e DS local; preserve mudanças preexistentes.

Fonte visual: https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ e /handoff/RESTOK_DESIGN_SYSTEM_V1.md/tokens.v1.json, com cópias em docs/restok-visual-refactor/evidence. Manter Raiz & Eucalipto/Manrope. Resolva D-02: catálogo real edita/ativa/desativa e prepara Nova compra; demo adiciona direto/Já temos, mas Product não tem estoque. Recomendação: preservar operações reais sem novos writes.

Corrija H-01 a H-03 em components/products: compactar título/contexto e subordinar compra em andamento; primeira row alvo y≤360px320/390; rows comuns64–80px com ações44, menu nomeado e quebra livre para nomes80; coleção branca/divisor leve; busca44/uma primária; vazio real/todos inativos/busca0 distintos e limpar explícito. Desktop pode ter contexto lateral útil, sem orçamento/dock da Compra.

Preserve use-product-view, categorias/defaultQuantity/active, edição de ativos/inativos, ordenação independente, foco após ativar/desativar e snapshots. Não converter active em Já temos, nem alterar banco/API/Auth/RLS/RPC/filas/cache. Sem kit/dependência/deploy.

Renderize320×640,390×844,768×1024,1280×800,1440×900,1920×1080 com0/33/100 produtos,79 caracteres comuns+A/B, quantidade999999, inativos, busca0, editor/erro/busy e menu por teclado. Row integral320, duas comuns390, sem overflow ou ação exclusiva de hover. Rode testes products-home/product-edit/products/category-sort/seleção/snapshots, lint/typecheck e regressões pertinentes. Entregue comparação real/manifesto, checks/limites/rollback. Pare para aprovação da Casa antes do Bloco3.
~~~

## Prompt 3: Histórico

~~~text
Em C:/Fontes/restok execute só Bloco3 após autorização e aceites0–2. Stack Next16/React19/TypeScript/CSS Modules/Tailwind3 semântico/Lucide/Supabase. Confira instruções/git status, auditoria04, roadmap07, QA08, decisões00 e DS local. Preserve alterações preexistentes.

Raiz & Eucalipto/Manrope é a identidade aprovada. Consulte https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ e /handoff/RESTOK_DESIGN_SYSTEM_V1.md/tokens.v1.json ou cópias em evidence. Não copie CSS/aliases nem apague estados reais que a demo simplifica.

Corrija R-01 a R-03 em components/history: registros com nome/data à esquerda e BRL ao fim, branco/divisores leves,72–88px ordinária e crescimento com80 caracteres; detalhe com resumo/stats subordinados e comparação junto do preço. Resolva D-03 sobre filtro local derivado de período e contexto explicitamente nomeado; sem API nova/meses fixos. Não preencher vazio com gráficos decorativos.

Preserve historyMonths/historyDate/historySummary/previousHistoryPrice, só concluídas, datas/offsets, snapshots imutáveis, status/preços0/ausentes e referência estritamente anterior; #history/<id>, back/forward/foco/scroll. Comparação atual absoluta por unidade; nada de percentual inválido sobre0. Não altere banco/schema/API/Auth/permissões/filas/Landing.

Valide320×640,390×844,768×1024,1280×800,1440×900,1920×1080 com0/1/24/100 compras, meses, nome80, BRL alto, anterior0/ausente/igual/mais/menos, hash e edição posterior do catálogo.≥3 registros ordinários390 com dados suficientes, sem overflow/perda/ambiguidade de total. Execute testes history/restok-app.history/money/snapshots, lint/typecheck e build seguro. Entregue antes/referência/depois, PNGs/manifesto/vídeo de retorno, checks/limites/rollback. Pare antes do Bloco4 para aprovação.
~~~

## Prompt 4: Casas e pessoas

~~~text
Em C:/Fontes/restok execute apenas Bloco4 após autorização e aceites0–3. Stack Next16/React19/TypeScript/CSS Modules/Tailwind3 semântico/Lucide/Supabase. Leia instruções/git status, auditoria05, roadmap07, QA08, decisões00 e DS local. Preserve alterações preexistentes e contratos de acesso.

Referência: https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ e /handoff/RESTOK_DESIGN_SYSTEM_V1.md/tokens.v1.json, cópias em evidence. Identidade Raiz & Eucalipto/Manrope. A demo apresenta Pessoas como tela. Resolva D-01: recomendação adaptar agrupamento/identidade para dialog desktop e bottom sheet mobile, sem nova rota. Não copiar emails ou writes simulados.

Corrija P-01 a P-03 em households/household-manager/member-row/CSS: casa sem tripla repetição, identidade antes de ações, Papel compacto desktop/linha própria mobile, seções/convites/Sair por finalidade. Dialog≤704px/90dvh, sheet94dvh, header/Fechar fixos e único body scroll. Não diminuir padding de todos os sheets para esconder uma gestão longa. Nome16/600, metadata14, grupos24 e alvos44.

Preserve useHouseholdManager/memberPermissions, owner/admin/member/self, último owner, confirmações de papel/transferir/remover/sair/revogar, limite/expiração, erro/retry, troca autorizada e reload. Sem schema/API/Auth/RLS/RPC/banco novos, kit externo ou deploy. Integração só com target/contas/ações atualmente autorizados; relatórios antigos não concedem autorização nova.

Valide320×640,390×844,768×1024,1280×800,1440×900,1920×1080 com uma/várias casas, nomes80 A/B, papéis/convites/erro/busy/confirm/cancel e top/bottom scroll. Foco/Escape/retorno/reduced e último alvo acessíveis. Rode households/household-manager/household-context/primitives/exit-lifecycle, lint/typecheck. Entregue evidência redigida sem tokens, fixture distinta de backend, checks/limites/rollback. Pare antes do Bloco5 para aprovação.
~~~

## Prompt 5: validação transversal

~~~text
No C:/Fontes/restok execute somente Bloco5 após autorização e aceites0–4. Stack Next16/React19/TypeScript/CSS Modules/Tailwind3 semântico/Lucide/Supabase. Leia instruções/git status, docs/restok-visual-refactor/00 a09, decisões resolvidas e relatórios de implementação. Preserve mudanças preexistentes.

Compare quatro telas com https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/ e DS/tokens do handoff (cópias em evidence). Demo tem canvas320/390/1440 escalado: registre viewport e canvas separadamente. F-05 exige confirmar cascata/font/cor no Next e harness. Paleta e Manrope já aprovadas, sem terceira identidade.

Execute matriz08 em320×640,390×844,768×1024,1280×800,1440×900,1920×1080 e1024×768. Confira primeira row320/quatro1280/última, nomes80 A/B,0/ausente/alto/meta0/excedente, histórico cronológico/imutável, filtro/hash/back/foco, permissões/casa após reload. Diferencie vazio/loading/erro/offline/retry. Faça jornada catálogo→compra→concluir→histórico e gestão/cancelamento com dados autorizados.

Teclado/reduced/foco/labels/anúncios/contraste, zoom200/400 e texto. Reader/Safari/iPhone/Android/hardware exigem ensaio real ou gate pendente. Não atribua mocks ao Supabase nem flexibilize guardas. Sem seed/reset/migrations/mutações remotas sem autorização atual.

Rode suíte/lint/typecheck/build sem conflito com dev; smoke auth/onboarding/landing por primitives, sem redesenhar essas telas. Corrija só defeitos confirmados, revalidando consumidores. Entregue diff, PNGs comparáveis, manifestos commit/diff/engine/viewport, vídeos reais com seeks, IDs encerrados/abertos, checks e riscos. Não publique. Pare para decisão final do usuário, sem certificar ensaios não executados.
~~~
