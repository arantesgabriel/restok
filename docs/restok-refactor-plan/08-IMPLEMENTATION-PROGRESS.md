# Progresso de implementação

28/10/2026 · America/Sao_Paulo

## Autorizações

- Mensagem explícita do usuário nesta execução: direção Raiz & Eucalipto e roadmap aprovados como orientação. **Somente Bloco 1, PRs 01–02, autorizado.**
- PR significa unidade local de implementação, validação e revisão. Push, PR remoto, merge e deploy não autorizados.
- Migrations e seed/reset não autorizados. Autorizações históricas não são reaplicáveis.
- Respostas explícitas do usuário nesta execução: usar contas do `seed.sql` e frontend `http://localhost:3000`; confirmou `restok-dev` em `gweynnnjcqafkhpynmrx.supabase.co` ao pedido de autorização para gravações de perfil/categorias durante carga e criação/aceitação de convites do gate. Não autoriza reset, migrations, execução do seed ou criação arbitrária de dados.
- Em mensagem subsequente, usuário autorizou explicitamente iniciar o próximo bloco, **Bloco2, PRs03–05**, e efetuar commits seguindo o padrão anterior, somente das alterações do agente. Commits locais autorizados; push/PR remoto/merge/deploy continuam não autorizados.
- Blocos3–5 permanecem pendentes de aprovação explícita.
- Mensagem explícita posterior do usuário: “inicie o proximo bloco”, com aplicação local disponível. **Bloco3, PRs06–11, autorizado.** Essa autorização não foi registrada como dispensa automática dos gates de evidência abertos do Bloco2. Decisão sobre adiamento de vídeo/leitor solicitada; PR06 aguarda essa decisão ou fechamento dos gates. Blocos4–5 permanecem não autorizados.
- Resposta explícita seguinte: “Sim, adiar essas evidências e iniciar o Bloco 3”. **Vídeo com seek e leitor real dos PRs04–05 adiados formalmente para o PR12**, sem registrá-los como realizados/aprovados. Bloco3 liberado, PR06 em andamento. Demais gates e limites permanecem; Blocos4–5 não autorizados.
- Autorização explícita para gates integrados dos PRs07/10: usar contas fictícias do seed no restok-dev para criar casas de teste isoladas e, somente nelas, criar/editar/concluir compras, cadastrar produtos, criar/aceitar/revogar convites e testar papéis/remoção/saída de membros fictícios. Não autoriza migrations, seed/reset ou alterações em casas preexistentes.

## Estado

| Unidade | Estado | Gate |
|---|---|---|
| Bloco 1 | Concluído; Bloco2 autorizado posteriormente | PR01 e PR02 separados, gates aplicáveis satisfeitos |
| PR 01 | Concluído localmente | Checks e baseline de fixtures aprovados; checkpoint separado |
| PR 02 | Concluído localmente e no gate integrado autorizado | UI-013 vermelho antes e verde depois em duas sessões |
| Bloco 2 (03–05) | Implementado; evidências específicas adiadas por autorização explícita | Vídeo/reader dos PR04–05 vinculados ao PR12; avanço ao Bloco3 autorizado |
| PR03 | Concluído localmente | Checkpoint próprio, fundações isoladas |
| PR04 | Implementado e commitado; gate de evidência reaberto | Gates funcionais verdes; falta vídeo novo e leitor real da fase2 |
| PR05 | Implementado; revisão local pronta, aceite pendente | Checks/teclado/geometria verdes; falta vídeo novo e leitor real |
| Bloco 3 (06–11) | Autorizado, em andamento | PR06 primeiro; PR07–11 pendentes dos gates sequenciais |
| PR06 | Concluído localmente | UI-001/UI-005, checks e mídia novos; sem alteração de fila ou banco |
| PR07 | Em andamento | Sheets e gates integrados isolados autorizados; implementação/validação pendentes |
| PR08–11 | Pendentes | Dependem dos gates sequenciais anteriores |
| Bloco 4 (12–13) | Não autorizado | Motion, acessibilidade e legado global |
| Bloco 5 (14–15) | Não autorizado | Landing e limpeza final |

## Inspeção inicial e preservação

- HEAD `7c3ed3bc821adbf01966aee354eb1702ffc1cbed`, branch inicial `feat/restok-mvp`.
- Preexistentes: `next-env.d.ts`, `package.json`, `package-lock.json`, `tsconfig.json` modificados; `supabase/seed.sql` e os oito documentos 00–07 não rastreados. Não são alterações desta execução.
- Diff anterior e hashes dos cinco arquivos preservados em `evidence/pr01/preexisting.patch` e `preexisting-sha256.json`. Seed não lido nem copiado.
- Lidos integralmente documentos 00–07, PRODUCT.md, DESIGN.md, decisões de casas e skills Anti-Webslop, UI Craft Loop (incluindo quality-gates) e Biblioteca de Motion Documental. Nenhum AGENTS.md aplicável encontrado no repo ou ancestrais.
- Skills visuais lidas como exigência do pacote; sem rebuild visual/motion no Bloco 1. Aplicação estética fica nos blocos correspondentes.

## PR 01: baseline nova

- Stack instalada: Node 24.21.0, npm 12.2.1, Next 16.4.3, React/React DOM 19.2.8, TypeScript 5.9.3, Tailwind 3.4.19, Vitest 5.0.5, Vite 8.3.5.
- **Testes novos nesta execução, antes da correção:** `npm test -- --reporter=dot`: 22 arquivos, 69 testes aprovados (27,98s reportados). `npm run lint`: aprovado. `npm run typecheck -- --incremental false`: reprovado, TS2769 em vitest.config.ts.
- Correção: retirar opção esbuild obsoleta e ignorada pelo Vite 8; JSX já configurado como react-jsx no tsconfig preexistente. Sem alteração de dependências ou exclusão do config do typecheck.
- Build Turbopack falhou na criação do subprocesso PostCSS, inclusive escalonado e com Node empacotado. Webpack passou; script build fixado em `next build --webpack`. Nenhuma mudança de versão/dependência ou lockfile.
- Reexecução simultânea encontrou 2 timeouts de 5s em DOM tests. Limitados workers a 4, sem aumentar timeout ou retirar asserts. Suíte final: 22 arquivos / 69 testes aprovados, 10,64s; lint e typecheck aprovados. `npm run build` aprovado com Webpack em execução escalonada (sandbox gerou EPERM durante prerender em tentativa anterior).
- Harness isolado `tests/e2e/`: Vite instalado e Playwright/Chromium empacotados, sem instalação nova. 66 PNGs, 6 WebMs, seis viewports; zero erros de página ou tentativas de HTTP externo no manifesto final. Seeks de 40ms verificados por decodificação/MAE, não pelo relógio do script. Artefatos: `evidence/pr01/baseline/manifest.json`.
- Inspeção visual nova: Compra 320 e1280, pessoas390, landing1440. UI-001 e UI-002 reproduzidos nas fixtures, mantidos para PRs06/10. As demais capturas foram geradas/verificadas por correspondência de mídia; não equivalem a inspeção visual manual integral de66 estados.
- Unidade local de revisão: `evidence/pr01/PR01.patch`, `checkpoint.json`; sem commit de alterações preexistentes. Branch local `codex/restok-raiz-eucalipto-bloco-1`.
- `next-env.d.ts` reescrito automaticamente pelo build foi restaurado aos bytes capturados antes da execução, com hash idêntico. `tsconfig.json`, lockfile e seed conservam hashes iniciais. Package preserva mudanças preexistentes e acrescenta somente opção webpack no script build.
- Evidências herdadas da auditoria continuam identificadas no documento 03. Não são testes/capturas desta execução.

## PR 02: contexto da casa ativa

- Iniciado somente após checkpoint/gates locais do PR01. Patch próprio `evidence/pr02/PR02.patch`, hashes e resultados em `evidence/pr02/checkpoint.json`.
- `resolveRemoteContext(acceptedHouseholdId ?? undefined)`: ausência/falha de convite consulta a preferência por usuário; convite aceito continua explícito. Serviço mantém validação de membership, sem modificação em RLS/RPC/SQL.
- Persistência opcional via `browserStorage`: getter/métodos/quota indisponíveis não impedem boot, troca, ordenação ou logout. Seleção inválida recebe aviso; cache removido somente do usuário/casa afetados. Troca de conta esvazia estado visível antes de recarregar.
- UNIT/COMPONENT: 25 casos adicionados (13 boot/ativação,11 resolver real com cliente mockado,1 cache), além dos69 anteriores. Resultado final: **94/94 em24 arquivos**,13,28s. Subconjunto de risco:28/28 em3 arquivos. Lint/typecheck/build aprovados. `git diff --check` e checks reversos dos dois patches aprovados.
- Reprodução COMPONENT inicial:7 falhas/4 passes em11 casos antes da correção; depois foram fortalecidos os casos de storage e adicionados os casos restantes. Não confundir esse recorte vermelho com a suíte final de25 casos novos.
- INTEGRADO-RESTOK-DEV: contas do seed autenticadas;3 memberships cada. Duas sessões isoladas, seleção da segunda casa confirmada no DOM/storage antes do reload. **Antes:0/2 preservadas. Depois:2/2 preservadas.**
- Em cada conta após correção: convite malformado/inválido preserva preferência, convite válido prevalece e usado falha; snapshot com cache não troca casa; preferência não autorizada faz fallback explicado; getter de storage bloqueado permite carregar contexto remoto. Seis cenários adicionais aprovados por conta, zero erros de página registrados nos contextos principais filmados. O contexto auxiliar de storage foi validado por DOM, sem instrumentação própria de pageerror.
- Gravações explícitas:2 convites novos criados e consumidos sobre memberships já existentes. Conferência final de leitura:contagens/papéis iguais ao início. Carga autenticada pode fazer upserts automáticos de perfil/categorias, autorizados; esses possíveis deltas não foram auditados linha a linha. Nenhum seed/reset/migration, casa, produto ou mudança de papel executado pelo runner.
- Evidência nova integrada:10 PNGs e4 vídeos antes/depois, com seeks verificados em40ms. Antes:build PR01; depois:build PR02, ambos `next start` local em127.0.0.1:3001. Capturas do antes pegaram entrada do diálogo; identidade no fundo/seleção e resultado DOM comprovam o contexto. Não são comparação de acabamento visual.
- Inspecionados visualmente:antes selecionado/reload e depois reload da conta1; mídia das duas contas verificada por decodificação. Não declarar revisão humana integral de cada frame/captura.
- Servidores temporários4173/3001 encerrados. Servidor dev do usuário3000 preservado. `next-env.d.ts` novamente restaurado ao hash inicial após build. Sem push, commit, PR remoto, merge ou deploy.

## Limites e pendências fora do aceite deste bloco

- Target `restok-dev` e contas do seed autorizados explicitamente nesta conversa. Ainda verificar disponibilidade e memberships antes do gate; não aplicar fixtures SQL.
- Gate integrado do PR02 realizado conforme seção anterior. O harness de fixtures continua sem backend e não é apresentado como prova de Supabase.
- Revogação real, zero memberships real e troca de conta durante uso têm cobertura local/simulação; não foram produzidos por mudanças destrutivas de membership no banco. A suíte `test:supabase`, que recusa hosted, não foi executada nem flexibilizada.
- Hardware, reader/zoom nativos, mailbox, concorrência e QA completo dos seis viewports por estado continuam nos gates posteriores. UI-001 e UI-002 permanecem para PRs06/10. Fonte/master da marca continuam dependências do Bloco2/aceite final.
- Relatório de arquivos, evidências, riscos e rollback: `09-BLOCK-1-REPORT.md`.
- Registro histórico: ao concluir Bloco1, a execução parou antes do Bloco2. A autorização subsequente acima inicia uma nova etapa.

## Bloco2: início

- Checkout e histórico conferidos. Commits existentes seguem Conventional Commits em inglês (`feat(landing): ...`, `docs(ui): ...`). Serão preservados commits por unidade, com staging seletivo.
- PR03 em andamento: fundações isoladas, norma e Manrope local obtida do Google Fonts com OFL. Master vetorial continua pendente do aceite final de marca; asset raster existente será identificado como transitório.
- Nenhuma autorização nova de banco inferida para o Bloco2. Validações monetárias serão locais/fixtures; não escrever preços de teste nas casas reais.

## PR03: fundações isoladas

- Gates satisfeitos: lint/typecheck/build e95/95 testes (25 arquivos; um novo teste de compilação de alpha/pesos reais). Sem novas dependências.
- `styles/{tokens,base,motion}.css`, fronteira `RestokTheme`, Tailwind novo isolado, norma local e DESIGN.md atualizados. Config/cascata antigos continuam com dono PR13; não foram ativados globalmente.
- Manrope oficial WOFF2 latin/latin-ext,400–800, com OFL e origem registrada. Fonte custom confirmada pelo Chromium; sem fetch de fonte no build. Master vetorial continua gate final da marca.
- Contrastes computados: ink/canvas15,13; branco/action8,07; highlight/brand7,15; info/canvas4,90; danger/surface-danger4,96; warning/surface-warning4,81. Seis dimensões sem overflow. Fallback sem fonte capturado.
- Zoom nativo200/400% observado no menu da aba interna antes da interrupção por Escape, sem overflow. Métricas e limites em `evidence/pr03/native-zoom-observation.json`. Imagens nativas foram exibidas na conversa; a exportação pelo menu não produziu arquivo.
- Retomada autorizada com uso exclusivo do navegador interno. Sem novo controle de desktop/aplicativos. Foco por teclado e largura CSS320 confirmados e capturados na aba interna. O zoom atual do usuário foi preservado; override de viewport será restaurado ao fim.
- Evidências19 PNGs e6 vídeos do harness, mais capturas internas JPG. Seis quadros iniciais com seeks verificados40ms. Os6 PNGs de foco são evidência estática: frames finais não foram gravados de forma confiável e não receberam seek. A falha de correspondência não foi ocultada nem o limiar reduzido.
- PR03 concluído para fundações; PR04 pode iniciar. PR05 aguarda gates do PR04. Blocos3–5 não autorizados.

## PR04: contrato monetário e quantidade

- Concluído após os gates do PR03. Parser compartilhado distingue vazio/undefined de zero, aceita pt-BR e decimal sem agrupamento, rejeita negativos, formato inválido e valores fora de numeric(12,2). Não altera dados históricos ou schema.
- MoneyField e QuantityField usados nos sheets existentes; quantidade inteira positiva, sem teto arbitrário de layout (até a precisão inteira segura do JavaScript). Entrada inválida persiste visível e impede gravação/fechamento. Preço anterior zero usa diferença absoluta, sem divisão por zero; Já temos continua excluído do total.
- Gates novos: **133/133 testes em27 arquivos**, lint, typecheck e build Webpack aprovados.38 casos adicionais ao checkpoint PR03, incluindo criar/editar orçamento0, avulso0, inválido sem write, quantidade fracionária e fórmulas3×5/3×6.
- Navegador exclusivamente interno: fixture money, erro BRL, quantidade999999 em6 dimensões (as métricas reais estão no manifesto; arredondamento do zoom produz diferença de1px em alguns alvos), subtotal3×1234,50=3703,50, preço conhecido0 e quantidade fracionária rejeitada.9 JPGs em evidence/pr04/browser. Sem vídeo novo deste PR; capturas estáticas e asserts DOM não são apresentados como filmagem.
- Primeiras execuções tiveram falha no seletor do teste novo e um timeout isolado sob carga; corrigido o seletor para a ação acessível existente. Suíte completa final passou sem relaxar timeout/asserts. next-env e demais alterações preexistentes conferidos por hash após build.
- PR05 pode iniciar. Blocos3–5 continuam não autorizados. Sem nova gravação remota, instalação, migration, seed ou reset.

## PR05: componentes e revisão final da fase2

- Componentes novos em components/ui, shopping e app: botões, campos/select/busca/checkbox, filtros/tabs/listas, status/Já temos, orçamento, sheet, menu, feedback, skeleton, navegação e acionador de casas. Consumidores locais do monólito migrados por primitivo; composição das telas, permissões e legado global continuam nos PRs06–13.
- Sheet usa header/body/footer, body rolável e ação de Nova compra no footer. Menu em portal fora de clipping, dentro do dialog quando aninhado; Escape fecha apenas o menu. AccessibleDialog contém Tab/Shift+Tab e devolve foco. Fechamento lê token de saída e limpa timeout na desmontagem; gravações continuam acionadas imediatamente pelo controlador.
- Toast persistente por padrão, dispensável; somente confirmação explicitamente transitória expira. Erros de sincronização mantêm retry; skeleton depende do carregamento real. Preview identifica toda simulação e não adiciona bypass à rota autenticada.
- Gates novos: **145/145 testes em28 arquivos** (12 casos novos de primitivos), lint, typecheck, build Webpack e diff-check aprovados. Nenhum timeout/assert relaxado; uma execução intermediária teve timeout do teste antigo de categoria sob carga, e as duas suítes finais posteriores passaram (144 e145 casos).
- Aba interna existente: seis larguras sem overflow e nenhum botão medido abaixo de44px; seis amostras com100 itens e uma com33; footer estável/visível, Tab/Shift+Tab contidos, Escape e retorno corretos. Métricas reais e tolerância de1px de arredondamento em evidence/pr05/browser. Inspeção visual da captura final320 confirma título e footer completos. Menu e sequência erro→retry→espera→resposta simulada→sucesso também exercitados.
- Corrigidos durante a inspeção: Tab escapava ao chrome do navegador; seletor do preview atingia footer/section do sheet; box-sizing do root afetava medidas de overlays. Capturas intermediárias de recuperação em aba temporária tinham enquadramento inconsistente e foram substituídas pelas capturas finais da aba existente; não são usadas como prova de aceite.
- Após interrupções, o servidor de fixtures precisou ser retomado. A última tentativa adicional de abrir o consumidor /app falhou por conexão e a página de erro interna bloqueou nova navegação pelo mecanismo disponível. Não contar essa tentativa como smoke aprovado. Os testes de componente exercitam os consumidores; browser QA final registrado é do preview isolado.
- **Correção de status do gate:** o PR05 foi iniciado após os checks e critérios funcionais do PR04; a revisão final identificou que o gate de evidência da fase2 não estava integralmente fechado. A seção06 pede vídeo com seek e a fase2 pede leitor manual. Não houve vídeo novo nos PRs04/05, nem execução com leitor real. AX/DOM, imagens estáticas e mock de reduced motion não substituem essas provas. O aceite integral de PR04/05 fica aberto, sem autorização implícita para dispensá-lo ou avançar.
- Restrição explícita mantida: somente navegador interno; nenhum controle de desktop/aplicativos desde essa instrução. Preferência de reduced motion coberta em teste e CSS; não alterada no SO. Zoom nativo200/400 observado no PR03 não equivale a nova prova dessa fase.
- Trabalho revisável preservado em commit próprio do PR05, somente arquivos do agente. Blocos3–5 seguem não autorizados. Sem push/PR remoto/merge/deploy, instalação ou gravação nova em banco. Alterações preexistentes novamente conferidas por hashes.
- Relatório completo de arquivos, evidências, limites, rollback e próximo bloco: 10-BLOCK-2-REPORT.md. Para fechar o bloco falta realizar ou decidir explicitamente sobre as evidências manuais pendentes; nenhum gate não verificado foi aprovado.

## PR06: shell e Compra

- Intenção: lista no centro do uso, casa identificável e total à direita; Raiz & Eucalipto aprovada. Extraídos shell, hook de busca/filtro, toolbar, categoria, linha e dock. Persistência/fila/guards permanecem no controlador, sem nova dependência ou gravação remota.
- UI-001: primeira linha320×640 termina431,03 antes do dock500,25, duas linhas completas. Com aviso e feedback simultâneos termina492,20, ainda antes do dock. UI-005:1280×800 passa de2 para4 linhas completas. Seis dimensões exatas sem overflow, scrollY0, em final-geometry.json, que prevalece sobre medições intermediárias.
- Novos checks:149/149 testes em29 arquivos (quatro casos adicionais ao PR05); lint/typecheck/build Webpack e diff-check aprovados. Asserts antigos migrados para regiões/announcements acessíveis; nenhum timeout relaxado.
- Aba interna existente: filtros/busca/limpar, A–Z, categoria/ordem, recolher/abrir, navegação/hash e skip link; skeleton com espera real da fixture, erro/retry, fim da lista acessível pelo editor/Escape. Stress extremo mede layout, não precisão monetária além da aritmética segura de Number. Sem teste físico de safe area/teclado móvel.
- Vídeo novo:61 aquisições reais contínuas (~4,4s), mediana66ms, máximo141ms. Container25fps mantém o último quadro adquirido, sem interpolar estados. Cinco seeks40ms verificados (MAE<=3). Não constitui medição de latência160ms. JPEGs originais preservados, referências e seeks PNG.
- Antes: snapshot de fonte34846f0 conferido contra Git normalizando CRLF, somente no harness; não é segundo build de produção. Fixtures sem backend. Hashes preexistentes conferidos, descontando somente build-script autorizado do PR01.
- Evidências novas em evidence/pr06. Vídeo/reader04–05 continuam vinculados ao PR12 por aprovação explícita. Legado restante: sheets/Produtos/Histórico/Casas/Auth e globais, nos respectivos PRs; nenhuma retirada global antecipada.
- Rollback: reverter somente commit06 antes dos dependentes, sem banco. PR07 iniciado após este checkpoint. Relatório incremental11-BLOCK-3-REPORT.md.
