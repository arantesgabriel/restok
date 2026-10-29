# Progresso de implementação

28/10/2026 · America/Sao_Paulo

## Autorizações

- **29/10/2026, PR10:** após entrega09, usuário determinou “inicie o pr10” e depois “prossiga de onde parou”. Autoriza somente Casas e pessoas/onboarding, com commit local separado e parada antes11. Autorizou explicitamente alterar temporariamente e restaurar os nomes das contas fictícias. Após rejeição automática de um convite por falta de autorização explícita nesta conversa, confirmou o gate integrado: criar/aceitar/reutilizar/revogar convites, promover/rebaixar, transferir propriedade, remover e sair **somente** com contas fictícias na casa `QA PR10 Casas e pessoas 2026-10-29`, ID `8c4535dd-e835-4194-ae27-837342404983`. Rejeição resolvida por essa autorização, sem contorno. Migrations/seed/reset, push/PR remoto/merge/deploy e alterações de acesso em casas preexistentes continuam não autorizados.

- **29/10/2026, retomada PR09:** usuário pediu “de acordo com o arquivo abaixo, inicie apenas o PR 09”. Autoriza somente essa unidade local, subordinada ao tratamento do gate08. Em resposta à pergunta, escolheu **concluir o QA visual do PR08 antes do PR09**, sem adiamento. Determinou usar o app já ativo na porta **3001** e autorizou criar **uma casa fictícia isolada e produtos de teste somente nela**. Não amplia autorização para compras, convites, papéis, migrations/seed/reset ou casas preexistentes.
- **Autorização adicional posterior09:** usuário autorizou criar e concluir até quatro compras fictícias somente na casa isolada `QA PR08 visual 2026-10-29`, para nomes longos, preço0, ausência de preço, quantidades e totais grandes. Também autorizou4173 restritamente para comparação anterior sem backend do gate08. Não autoriza PR10 nem novas alterações fora dessas casas/cenários.

- **29/10/2026, limite histórico anterior à retomada:** usuário determinou execução PR por PR, finalizar somente até o PR08 e solicitar sua conferência e autorização antes de prosseguir. Autorizações anteriores por bloco ficam subordinadas a esse limite, depois ampliado exclusivamente ao PR09 pela mensagem registrada acima.

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
| Bloco 3 (06–11) | Estratégia substituída por execução PR a PR | Limite vigente PR10, autorizado especificamente; parar antes11 |
| PR06 | Concluído localmente | UI-001/UI-005, checks e mídia novos; sem alteração de fila ou banco |
| PR07 | Concluído localmente com adiamento explícito de evidências | Checks/integração aprovados; vídeo/capturas restantes vinculados ao PR12 |
| PR08 | Implementado; gate visual fechado na retomada | Commit ca8a1b7; evidências novas/QA em eb34201; release/hardware continuam próprios |
| PR09 | Implementado e validado localmente |175 testes; lint/typecheck/build; navegador interno3001, vídeo/seek e seis dimensões finais; revisão humana pendente |
| PR10 | Implementado e validado localmente; revisão humana pendente |192 testes/35 arquivos; lint/typecheck/build; seis larguras, vídeo/seek e integração isolada; limites no relatório14 |
| PR11 | Pendente de autorização específica | Não iniciar automaticamente; usuário exige conferência PR a PR |
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

## PR07: implementação e gates em andamento

- Extraídos seis sheets para components/shopping com CSS próprio por tokens e hook de seleção. Ações dos formulários de item/avulso/orçamento e resumo no footer. Nomes de produtos quebram linhas; seleção de resultados preserva itens fora da busca. Sem nova dependência, schema ou mudança de domínio de catálogo.
- Corrigido sucesso sem confirmação: runRemoteWrite só remove pendência e chama callback de sucesso se ok E synced. Resposta apenas local mantém retry/erro persistente. Retry reutiliza os mesmos registros/IDs. Contagem da confirmação permanece estável durante saída após atualização otimista.
- Checks novos:156/156 testes em31 arquivos, sete adicionais ao PR06. Cobrem0/resultados/33/100, resposta atrasada, falha, synced=false, retry dos mesmos IDs e ordem produto→item vinculado. Lint e typecheck aprovados. Build Webpack final e diff-check aprovados após o último ajuste da confirmação.
- Aba interna: comparação antes/depois de Nova compra e coleções33/100 nas seis dimensões, sem overflow. Footer abaixo do limite em desktop; no mobile arredondamento de0,41/0,44px, dentro da tolerância1px. Fim de100 atingido por teclado e confirmado por DOM (scroll5430,30); captura desse estado falhou e não foi registrada como evidência visual.
- Integração autorizada realizada somente na nova casa identificada em evidence/pr07/integrated-house.json: criada compra com orçamento0; avulso de quantidade3/preço0 incluído no catálogo; editado para5, total15 após reload; adicionado um pendente; conclusão confirmada com1 comprado/1 pendente/total15; segunda compra seleciona produto recorrente; terceira vazia arquiva a segunda após aviso. Histórico e catálogo relidos após reload e após logout/login (nova sessão sem cache anterior). Algumas respostas ultrapassaram o prazo inicial do seletor; foi observada confirmação posterior, sem declarar timeout como sucesso.
- Captura do navegador interno passou a falhar; depois navegação local atingiu timeout. Servidor inicial estava isolado, encerrado e substituído por servidor temporário acessível em127.0.0.1:3001 (sem mexer em processo do usuário). Nova aba exclusivamente interna recuperou interação/DOM, mas não imagens. Solicitação ao usuário para tornar a aba interna visível; sem pedido de nova autorização de banco.
- **PR07 não concluído:** vídeo obrigatório com seek e estados visuais restantes pendentes. Sem avanço ao PR08 e sem commit de aceite07. Nenhuma captura/vídeo integrado foi produzido neste PR até este registro; arquivos .txt são DOM. PR06 commit528cd76 separado; PR08–11 continuam pendentes.

### Retomada do gate visual07

- Usuário confirmou explicitamente que a aba interna estava visível. Recuperadas capturas reais de catálogo/histórico/detalhe da casa isolada, sem novas gravações remotas nesta retomada. Registro anterior de ausência de imagens integradas passa a ser histórico; não houve vídeo integrado.
- Capturados fim de100 em320 com último produto focado (bottom546,42 antes do footer563,43), editor em seis dimensões sem overflow, preço negativo sem gravação, avulso/stress cancelado e orçamento0/erro em320/390/1280. Inspecionadas visualmente detalhe integrado e editor inválido320. Cobertura/combinações não amostradas em evidence/pr07/coverage.json. Quatro PNGs são conversões sem perda dos JPEGs capturados; originais preservados.
- Tentativas de gravação falharam. A primeira interrompeu a conexão de automação; a segunda, com erro tratado, adquiriu apenas1 frame e não gerou vídeo. recording-failed.json documenta falha, não evidência aprovada. Fluxo simulado ainda mostrou erro persistente, retry pendente sem resumo precoce e resumo somente após resposta controlada; essa observação DOM não substitui filmagem.
- Após a falha, também falharam captura individual, API alternativa e nova navegação de fixture. Nenhum controle de desktop/navegador externo usado. Vídeo e imagens restantes de confirmação/conclusão continuam pendentes. Solicitada decisão explícita entre manter gate aberto ou adiar evidências07 ao PR12; **sem resposta/aprovação de adiamento07 até este registro**. Adiamento anterior04–05 não foi ampliado implicitamente. PR08 não iniciado.


## Decisão explícita: evidências07 e avanço

- Usuário respondeu: “Adiar formalmente essas evidências do PR07 para o PR12 e prosseguir no Bloco 3”. Vídeo com seek e capturas restantes de confirmação/conclusão07 ficam vinculados ao PR12. Não realizados nem aprovados como evidência; decisão de adiamento libera avanço ao PR08, sem dispensar os gates dos demais PRs. Blocos4–5 continuam não autorizados.
- PR07 concluído como unidade local com checks/integração e ressalva acima; commit seletivo somente dos arquivos do agente. PR08 iniciado sequencialmente.

## PR08: catálogo, 29/10/2026

- ProductsHome/ProductRow/ProductEditor extraídos e recompostos em components/products com estilos próprios por tokens. Hook de busca local/mode/grupos; callbacks de persistência e preferência independente por categoria preservados. Ativos/inativos pesquisáveis, limpar devolve foco; nenhuma semântica de estoque adicionada.
- 160/160 testes em33 arquivos, quatro casos adicionais. Lint, typecheck, build Webpack e diff-check aprovados. Falha inicial de typecheck por tipos gerados indisponíveis não foi ocultada; reexecução/build passaram sem mudar tsconfig. Alterações preexistentes verificadas por hash após build.
- Gate visual bloqueado: ferramenta CUA não inicializa por caminho local ausente. Reset e tentativa da URL3001 também falharam antes do acesso à aba. Usuário informou aba interna aberta; nenhuma captura/vídeo novo08 ou medição de layout foi realizada. Preview de fixture catalog preparado4173; abertura no Codex ficou queued, sem inspeção aprovada.
- Adiamento autorizado04–05/07 não abrange08. PR08 pronto para revisão de implementação, com aceite visual pendente. Unidade local separada e somente arquivos do agente; sem push/PR remoto/merge/deploy ou escrita remota.
- Estratégia mais recente exige parar aqui para conferência e autorização. PR09 não iniciado. Relatório completo de arquivos/checks/limites/rollback/próximo escopo:12-PR08-REPORT.md.

## Handoff solicitado, 29/10/2026

- Usuário solicitou um Markdown para iniciar o PR09 em outro chat. Criado HANDOFF-PR09.md com checkout, preservação, commits, checks herdados, bloqueio do navegador, escopo09 e ponto de parada antes10.
- Solicitação documental atendida sem implementar PR09. A pendência visual08 permanece aberta, sem aprovação ou adiamento inferido do pedido de handoff. O novo chat deve registrar a instrução efetivamente enviada pelo usuário e tratar esse gate explicitamente.

## Retomada: gate visual PR08 antes do PR09

- Navegador interno recuperado. Harness4173 inicialmente inacessível sob sandbox; servidor do agente reiniciado fora do sandbox, HTTP200 confirmado e fixture aberta. Usuário determinou em seguida usar somente3001. Nenhum browser externo/desktop controlado. Servidor3001 do usuário preservado.
- Sessão aberta3001 estava na Casa de Gabriel com catálogo vazio. Após autorização específica, criada **QA PR08 visual 2026-10-29**, ID `619c5f67-0d98-467b-90c1-8a7dbd283d3f`. Cinco produtos fictícios, incluindo nomes longos e quantidade999999; um desativado, editado para quantidade3 e reativado. Dados confirmados após reload. Nenhuma compra criada e nenhum dado de casa preexistente editado.
- Capturas novas reais em `evidence/pr08/retomada`: catálogo e editor nas seis dimensões, busca vazia, nome longo/foco, inativo e reload. `final-geometry.json` prevalece sobre capturas/medidas intermediárias; seis viewports CSS exatos, DPR1, scrollWidth=clientWidth. Capturas full-page intermediárias apresentaram enquadramento inconsistente; arquivos `*-final-*` são as referências finais. Escape retorna ao botão Editar, limpar busca ao campo e reativar ao controle Desativar do mesmo produto.
- Vídeo novo de aquisições sequenciais contínuas:85 JPEGs reais, ~4,5s, mediana31ms/máximo80ms. Container25fps sem interpolação; cinco seeks de40ms com MAE<1,32 aprovados. Não é medição de latência de motion nem prova de hardware/leitor. Originais e manifesto preservados.
- **Comparação anterior ainda pendente:**3001 executa somente a composição atual. Solicitada decisão entre autorização restrita de4173 para comparação anterior sem backend ou aceitação explícita da baseline herdada com cenários diferentes. PR09 ainda não implementado; a solicitação não equivale a resposta.

### Fechamento do gate08 nesta retomada

- Usuário autorizou explicitamente4173 **somente para a comparação anterior sem backend**. Cenário `catalog-pr08-compare` replica os cinco produtos fictícios criados3001 (nomes, categorias, quantidades e ausência de compra ativa), com IDs locais próprios. Capturadas versão anterior e nomes longos nas seis dimensões, sem gravação remota pelo harness. Contexto/fonte anterior:d9b51b2, `before-pr08.tsx` já preservado no PR08; a casa/perfil ilustrativos diferem da sessão real.
- Zoom de cada aba preservado:3001 DPR1,4173 DPR~0,90. Override ajustado para medir CSS320/390/768/1024/1280/1440, com arredondamento de1px em768 e altura1024. Métricas em `before-geometry.json`; imagens são JPEGs originais e conversões PNG explicitamente identificadas. Capturas full-page deformam o enquadramento neste backend e **não são prova de encaixe**; usar `*-final-top`, `320-stable-long`, `*-before-top`, `*-before-long` e editor.
- Reexecução nova: **6/6 testes em4 arquivos** de catálogo, busca, snapshots/seleção seguinte e ordenação aprovados. Não se reatribui a esta rodada a suíte anterior160/160. Gate visual08 fechado para avanço local após inspeção focal320/1440/editor/inativo, vídeo com seek e seis dimensões; hardware/leitor/zoom nativo/release permanecem conforme06. Nenhum defeito novo demonstrado que exija alterar código08.
- PR09 liberado pela autorização original específica, sem avanço ao PR10. Próximo registro passa a documentar exclusivamente Histórico e detalhe.

## PR09: Histórico e detalhe, 29/10/2026

- Intenção: leitura dos registros da casa, lista cronológica com agrupamento mensal somente apresentacional, direção Raiz & Eucalipto V3/M2/D7. Tokens/primitivos e fonte Manrope existentes; sem motion decorativo. Extraídos `history-view`, `history-detail`, `history-price-comparison`, `history-model` e CSS Module para `components/history`. Snapshot usa dados da compra, nunca metadados correntes do catálogo.
- Mantidos hashes e controladores de navegação; retorno foca a compra aberta, detalhe foca seu título. Hash de compra ativa não exibe detalhe histórico. Contagens dos três estados, preço desconhecido explícito e0 conhecido; comparação absoluta unitária com compra concluída estritamente anterior, sem divisão por0. `latestPriceFor` compartilhado não foi alterado. Persistência/fila/snapshots/SQL intactos.
- Novos checks: **175/175 testes em34 arquivos**,15 casos adicionais; lint, typecheck sem incremental, build Webpack final e diff-check aprovados. Recorte de histórico16/16 em2 arquivos. Testes de catálogo/desativação garantem snapshots concluídos;100 compras cobertas em componente. Falhas intermediárias dos testes novos foram seletor duplicado, espaço não separável BRL e evento inexistente; tipo `exact` inválido no Testing Library removido, sem relaxar assertions/timeout.
- Quatro compras fictícias autorizadas criadas exclusivamente na casa isolada: três concluídas (vazia, referência0 e casos extremos) e uma ativa vazia. Dados registrados em `evidence/pr09/integrated-house.json`. Total da compra principal R$1.234.566.655.447,11,3 comprados/1 já tínhamos/1 pendente/1 comprado sem preço. Reload e hash direto confirmaram os dados no backend. Nenhuma gravação adicional em casa preexistente.
- Evidências novas3001: antes/detalhe/lista em892×790 reais; nomes nominais320…1440 dos arquivos anteriores são pedidos de override que a aba antiga ignorou, **não seis testes válidos do antes**. Nova aba interna recuperou override; depois medido exatamente em320×640,390×844,768×1024,1024×768,1280×800 e1440×900, DPR1, zero overflow. Comparação adicional do depois892×790. Último item mobile bottom536,34 antes da navegação em580. Não houve nova execução do harness4173 para09.
- Vídeo novo:100 aquisições sequenciais reais/~4,5s, mediana30ms/máximo48ms, container25fps sem interpolação. Cinco seeks40ms com MAE≤1,441 aprovados. Browser back/forward e retorno explícito confirmados por DOM/foco; zero/preço ausente, compra vazia, três estados e último item capturados. Originais JPEG preservados; PNGs são conversões sem nova aquisição. Instabilidades de acesso/viewport superadas com nova aba interna; não houve uso de desktop/browser externo.
- Riscos/limites: antes limitado a uma dimensão real;100 compras apenas COMPONENT, integração visual usa três concluídas; novo empty de zero compras coberto em componente, screenshot vazio é anterior. Hardware, leitor real, zoom nativo, matriz de engines, concorrência e performance de campo continuam conforme06/PR12. Sem aceite global de acessibilidade/release. Alterações preexistentes novamente conferidas por SHA256; next-env restaurado somente após equivalência exata ao hash pré-buildB8B3…1000.
- Relatório próprio: `13-PR09-REPORT.md`. Rollback reverte somente composição/consumidores09 como unidade, preservando registros e IDs. Encerrada a implementação autorizada; **não iniciar PR10 sem conferência e autorização específica**.

## PR10: Casas e pessoas e onboarding, 29/10/2026

- Autorização específica registrada acima. Reconstruídos manager/onboarding em components/households com tokens e primitivos existentes, identidade80 íntegra antes das ações, confirmações em sheet e retorno de foco. Papéis owner/admin/member e último owner preservados; falha mantém casa/erro e retry da criação reutiliza ID. Reexports nas entradas antigas; harnesses históricos preservam fontes anteriores, sem consumidor do produto apontando para tests.
- Gate integrado revelou aceite duplo de convite no boot sob StrictMode: primeira execução consumia o token e era cancelada; segunda mostrava inválido e não priorizava a casa. Regressão reproduzida antes da correção e aprovada após compartilhar o resultado por token/montagem. Novo convite real aceito com mensagem correta e casa selecionada. Sem alteração de RPC/RLS/schema.
- Checks novos finais: **192/192 testes em35 arquivos**,17 adicionais desde09; lint, typecheck sem incremental, build Webpack e diff-check aprovados. Slop-lint sem erro; faixa lateral sinaliza erro real. Arquivos preexistentes package/lock/tsconfig/next-env/seed com SHA256 preservados; next-env restaurado após build com igualdade exata.
- Somente casa QA PR10 ID8c4535dd-e835-4194-ae27-837342404983: quatro convites (três usados/um revogado/zero ativos), promoção/rebaixamento, propriedade ida/volta, remoção e duas saídas voluntárias confirmadas. Duas contas fictícias; ambos os nomes temporários restaurados e confirmados em nova sessão. Conta inicial proprietária; participante sem vínculo QA ao final. Nenhuma membership de casa preexistente alterada. Rejeição automática inicial resolvida por autorização explícita do usuário, sem contorno.
- Navegador interno3001: seis larguras CSS exatas para manager com nomes80/prefixo79 igual e para composição de onboarding, sem overflow. Antes disponível em seis larguras com uma pessoa/nome original; tentativa de antes80 não concluiu e import final foi restaurado. Onboarding foi composição autenticada somente leitura na mesma porta, sem submissão; rota temporária removida. Não representa sessão integrada sem memberships.
- Vídeo novo120 aquisições sequenciais/~4,7s de cancelamento/confirmar revogação,25fps sem interpolação; cinco seeks40ms MAE≤1,517. Tokens ocultados antes de capturar. Escape/retorno ao seletor observado após fechamento. Inspeção visual focal320/1440 e confirmação390. Expirado/limite10/transporte/onboarding sem memberships cobertos em componente; leitor real, zoom nativo, hardware/engines/concorrência e release não declarados aprovados.
- Relatório14-PR10-REPORT.md e evidence/pr10 registram cobertura, dados e limites. Rollback somente da unidade visual/boot e consumidores, preservando banco/IDs e arquivos do usuário. **Parar para conferência; PR11 exige autorização específica.**
