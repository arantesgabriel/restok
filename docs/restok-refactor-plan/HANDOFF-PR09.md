# Handoff — Restok / PR09: Histórico e detalhe

29/10/2026 · America/Sao_Paulo · Repositório `C:\Fontes\restok`

## Leia primeiro: estado e autorização

Este handoff foi solicitado para iniciar o PR09 **em outro chat**. Nenhuma implementação do PR09 foi iniciada neste chat.

A estratégia vigente é **PR por PR**, com conferência e autorização do usuário antes do próximo. A autorização antiga de blocos não permite avançar automaticamente. O último limite de execução foi o PR08; a solicitação atual cria o documento de transferência. Registre a autorização de execução que o usuário der no novo chat, sem confundi-la com aceite das evidências anteriores.

**PR08 está implementado e commitado, mas seu gate visual continua pendente.** Não houve autorização explícita para adiar suas capturas/vídeo. O pedido de handoff não transforma esse gate em aprovado nem concede seu adiamento. Antes de avançar, fechar a pendência ou obter uma decisão explícita do usuário sobre seu tratamento. Não pedir novamente aprovações já registradas para PR04–05/07.

Depois de executar somente o PR09 autorizado, entregar relatório, commit local separado e parar para conferência/autorização do PR10. Não antecipar PR10–15.

## Checkout e preservação

- Branch verificada: `codex/restok-raiz-eucalipto-bloco-1`. O nome é histórico; não representa autorização atual por bloco.
- Último commit de implementação: `ca8a1b7 feat(products): rebuild catalog with local search`.
- HEAD antes da criação deste handoff: `ca8a1b7`. Um commit documental posterior deste handoff não representa implementação09.
- Não executar reset, clean, stash destrutivo, checkout de arquivos preexistentes ou exclusões para obter árvore limpa.
- Commits locais autorizados, em Conventional Commits em inglês, somente do trabalho do agente, com staging explícito. **Push, PR remoto, merge e deploy não autorizados.** “PR” é unidade local de implementação, validação e revisão.

Estado preexistente do usuário, ainda presente e fora dos commits do agente:

```text
 M next-env.d.ts
 M package-lock.json
 M package.json
 M tsconfig.json
?? docs/restok-refactor-plan/00-EXECUTIVE-SUMMARY.md
?? docs/restok-refactor-plan/01-REPO-ARCHITECTURE-MAP.md
?? docs/restok-refactor-plan/02-LEGACY-DESIGN-REMOVAL-MATRIX.md
?? docs/restok-refactor-plan/03-UI-EVIDENCE-MATRIX.md
?? docs/restok-refactor-plan/04-DESIGN-SYSTEM-IMPLEMENTATION-MAPPING.md
?? docs/restok-refactor-plan/05-INSIDE-OUT-ROADMAP.md
?? docs/restok-refactor-plan/06-QA-AND-REGRESSION-PLAN.md
?? docs/restok-refactor-plan/07-OPEN-DECISIONS.md
?? docs/restok-refactor-plan/evidence/pr01/preexisting.patch
?? supabase/seed.sql
```

Hashes iniciais: `evidence/pr01/preexisting-sha256.json`. O package preserva alterações do usuário mais o delta autorizado do PR01 no script `build`: `next build --webpack`. Para comparar ao hash inicial, descontar apenas esse delta. **Não substituir o package pelo HEAD.** Build reescreve next-env automaticamente; restaurar somente essa reescrita, com confirmação do hash anterior. Revalidar o estado atual, pois o usuário pode ter feito mudanças depois deste documento.

## Leitura obrigatória antes da implementação

1. Ler integralmente os oito documentos00–07 em `docs/restok-refactor-plan/`.
2. Ler `PRODUCT.md`, `DESIGN.md`, `docs/design/RESTOK_DESIGN_SYSTEM_V1.md` e instruções aplicáveis do repositório/ancestrais. Na execução anterior não havia AGENTS.md aplicável; verificar novamente.
3. Ler `08-IMPLEMENTATION-PROGRESS.md` como registro cronológico de decisões e aprovações. Entradas mais recentes prevalecem; trechos antigos conservam estados históricos.
4. Ler `09-BLOCK-1-REPORT.md`, `10-BLOCK-2-REPORT.md`, `11-BLOCK-3-REPORT.md`, `12-PR08-REPORT.md` e checkpoints necessários. Evidências herdadas não são testes novos.
5. Aplicar as skills exigidas pelo pacote e disponíveis no novo chat. Foram usadas Anti-Webslop, UI Craft, UI Craft Loop (incluindo quality-gates/motion-craft) e Biblioteca de Motion Documental. Relê-las conforme o escopo; não improvisar seus requisitos. Caminhos usuais: `C:/Users/Gabriel/.codex/skills/<skill>/SKILL.md`.

Direção aprovada: **Raiz & Eucalipto V3 / M2 / D7**. Reusar tokens semânticos, Manrope local licenciada e primitivos existentes. PNG da marca é transitório; master vetorial continua gate final. Não reabrir a escolha estética. Não retirar globais/legado antes do PR13 nem redesenhar landing antes do PR14.

## Histórico dos commits de implementação

| Unidade | Commit | Resultado |
|---|---|---|
| PR01 | `c053ca0` | Baseline, tooling e harness de fixtures |
| PR02 | `b243f42` | Restauração da casa ativa autorizada e storage resiliente |
| PR03 | `6dcd518` | Tokens, fonte legal e fundações isoladas |
| PR04 | `afc5a44` | Contrato monetário, zero distinto de ausência e quantidade |
| PR05 | `34846f0` | Controles, overlays, foco e feedback |
| PR06 | `528cd76` | Shell e Compra; UI-001/UI-005 com geometria e mídia novas |
| PR07 | `d9b51b2` | Sheets de compra e sucesso somente após write confirmado |
| PR08 | `ca8a1b7` | Catálogo extraído, busca local e ativos/inativos; QA visual pendente |

PR08 extraiu `components/products/{products-home,product-row,product-editor-sheet,use-product-view}.tsx/.ts` e `products.module.css`. Busca ativos/inativos sem escrever; limpar devolve foco; categoria/A–Z preserva direção por categoria. Edição de catálogo preserva snapshots das compras e defaults da seleção seguinte. Não existe estoque “Já temos” no catálogo. Controladores saveProduct/toggleProduct foram preservados contra d9b51b2.

## Gates e evidências pendentes

- **PR04–05:** vídeo com seek e leitor real adiados explicitamente pelo usuário para PR12. Continuam não realizados, não aprovados como evidência.
- **PR07:** vídeo e capturas restantes de confirmação/conclusão adiados explicitamente para PR12. Integração real e imagens estáticas parciais foram realizadas. `evidence/pr07/recording-failed.json` contém uma tentativa falha, não vídeo aprovado.
- **PR08:** nenhum adiamento autorizado. Não houve capturas novas, vídeo com seek ou medição de overflow desta composição. Faltam antes/depois, seis dimensões, nomes longos/quantidade extrema e foco/edição/reativação. Testes de componente não substituem esses gates.
- QA físico, leitor real e demais gates de release permanecem conforme06; não afirmar aceite global de acessibilidade/performance.

Últimos checks novos registrados para PR08: **160/160 testes em33 arquivos**, lint, typecheck sem incremental, build Webpack e diff-check aprovados. Quatro testes novos cobrem busca/limpar/foco, ordenação, vazio e edição de inativo/seleção seguinte. Primeira execução de typecheck encontrou tipos gerados indisponíveis; reexecução/build passaram sem alterar tsconfig. Nenhum timeout relaxado. Esses resultados são anteriores ao novo chat: relatar reexecuções novas separadamente.

## Escopo exato do PR09

Roadmap05, fase3D: reconstruir **Histórico e detalhe** em `components/history/*`, extraindo responsabilidades do monólito sem mudar persistência ou snapshots.

Origem atual, em `components/restok-app.tsx`:

- `HistoryView` (aproximadamente linha67 em ca8a1b7).
- `previousHistoryPrice` (aproximadamente linha86).
- `HistoryPriceComparison` (aproximadamente linha95).
- `HistoryDetail` (aproximadamente linha104).
- Estado/controlador `historyDetailId`, `setHistoryDetail`, integração com AppShell e hashes `#history` / `#history/<id>`.

Resolver referências por nome/rg; os números de linha podem mudar. Ler também `components/restok-app.history.test.tsx`, `lib/utils.ts`, `lib/types.ts`, `tests/fixtures/shopping.ts` e testes relevantes de utilitários/navegação. `latestPriceFor` é compartilhado: não introduzir regressão em Compra ao extrair a comparação histórica.

Critérios de aceite:

- Zero e muitas compras; apenas concluídas no histórico, cronologia decrescente preservada e detalhe correto.
- Contagens distintas de comprado, já tínhamos e pendente; comprado sem preço continua explícito.
- Total registrado usa subtotal de itens comprados com preço conhecido; zero é preço conhecido, ausência continua desconhecida.
- BRL e comparação de **preço unitário**, contra compra concluída estritamente anterior à data da compra exibida. Não usar compra futura, a própria lista ou subtotal como referência; lidar com anterior0 sem divisão inválida.
- Snapshot histórico não muda quando o catálogo é editado/desativado.
- Agrupamento mensal, se adotado, é somente apresentação: não perder ordenação nem acesso a detalhes.
- Nomes longos, valores grandes, seis viewports e controles/foco legíveis; voltar/detalhar e navegação do browser preservados.
- Tests de histórico/fórmulas0/sem preço e checks completos; antes/depois e vídeo com seek verificado conforme06, ou decisão explícita sobre bloqueio obrigatório.

Não incluir Casas/papéis/convites, auth/perfil, retirada global, instalações, migrations ou landing. Não antecipar correção de outro PR para “aproveitar” a revisão. Se ampliar escopo for obrigatório, explicar e aguardar decisão.

## Banco e contas de teste

**Não executar migrations, seed/reset nem alterações em banco sem autorização específica.** Ler o seed para identificar contas não autoriza executá-lo. Não copiar credenciais/tokens para handoffs, logs, screenshots ou chat.

Frontend localhost não significa Supabase local. `.env` apontava ao **restok-dev**, projeto `gweynnnjcqafkhpynmrx.supabase.co`. Verificar destino sem imprimir segredos.

Autorizações históricas de teste foram específicas aos gates02 e07/10. Para07/10 o usuário autorizou contas fictícias do seed, casas isoladas e, somente nelas, compras/produtos/convites/papéis/remoção/saída. Isso não é permissão genérica para novas gravações de outro escopo. O PR09 é apresentacional e pode usar fixtures; se precisar novo write remoto, obter a autorização necessária.

Casa criada no gate07, preservada para rastreabilidade:

- Nome: `QA Bloco3 PR07 2026-10-28T22-01-24`.
- ID: `2340d936-7d1b-485d-8ecb-ca02d72839a6`.
- Três compras: primeira concluída (1 comprado,1 pendente,total15), segunda arquivada (1 pendente), terceira ativa vazia; um produto recorrente de quantidade3. Manifesto: `evidence/pr07/integrated-house.json`.
- Não apagar esses registros nem alterar casas preexistentes como limpeza/rollback.

## Navegador: restrição e bloqueio conhecidos

**Usar exclusivamente o navegador interno do Codex.** Usuário proibiu controle do desktop/aplicativos e browsers externos. Shell/arquivos/checks locais continuam parte do trabalho de implementação autorizado. Não executar antigos runners que iniciam Chromium/Playwright externo.

Último contexto fornecido pelo usuário: aba interna em `http://127.0.0.1:4173/components.html`. Em mensagens anteriores, app real em3001; disponibilidade e abas não são garantidas no novo chat. Inventariar/selecionar a aba pertinente pela API documentada, sem assumir IDs antigos.

Bloqueio mais recente: CUA falhava **antes de executar o código da aba** com `failed to write kernel assets` / caminho local não encontrado. Reset, getTab por ID e URL3001 não resolveram. Não diagnosticar isso como site quebrado ou considerar “aba aberta” como prova de captura. Recuperar a ferramenta no novo chat antes de certificar QA visual.

Quando funcionava:

- `cua_repl` para todas as interações; obedecer inicialização/documentação da ferramenta. `playwright.evaluate` é somente leitura de DOM, sem injeção de estado, SDK ou storage.
- Capturas retornavam JPEG; preservar originais. Conversão de formato a PNG não cria nova captura.
- Usar viewport capability para testes e resetar ao final; preservar zoom do usuário. O DPR era aproximadamente0,99; medir CSS innerWidth/Height reais, sem supor que override equivale exatamente ao alvo.
- Não lançar gravações com promises sem await entre chamadas. Tentativas de screenshot em paralelo a comandos UI falharam; não transformar frames isolados em vídeo apresentado como gravação válida.
- Falha de navegação pode deixar uma página data:error bloqueada pela política da API. Verificar servidor antes de navegar; não insistir em URLs bloqueadas nem usar desktop para contornar.

## Harness e comandos

```powershell
Set-Location C:\Fontes\restok
git status --short
git log -10 --oneline
npm test -- --reporter=dot
npm run lint
npm run typecheck -- --incremental false
npm run build
git diff --check
```

Build usa Webpack por correção documentada01; não instalar/trocar dependências para resolver ambiente. Limite atual de workers4 e timeout5s dos testes não devem ser relaxados para esconder regressão. Não rodar build e typecheck simultaneamente: arquivos gerados podem mudar durante o check. `.next/dev/types` pode ser regenerado por servidor dev; diagnosticar ausência/race sem apagar tsconfig ou modificar arquivos do usuário.

Harness: `node tests/e2e/serve.mjs`, porta4173, Vite já instalado. Verificar se existe servidor antes de iniciar outro; não encerrar processo do usuário. No ambiente anterior, testes de porta/processos iniciados sob sandbox às vezes eram invisíveis fora dele; execução escalonada do servidor foi necessária. Utilizar o mecanismo de aprovação disponível, não contornos.

- Novo catálogo: `http://127.0.0.1:4173/app?scenario=catalog#home`.
- Anterior08: `http://127.0.0.1:4173/before-pr08?scenario=long#home`.
- Histórico fixture: `/app?scenario=long#history`; conferir os dados existentes antes de criar cenários necessários09.
- `tests/e2e/entry.tsx`, `fixtures.ts`, `data-fixture.ts` e `client-fixture.ts` isolam SDK/realtime. Rótulo “E2E-FIXTURE · sem backend” obrigatório; não é evidência de Supabase.
- Snapshots before-pr06/07/08 são fontes históricas exclusivas do harness; não são segundo build de produção nem código a migrar como consumidor real.
- `tests/e2e/encode-internal-recording.py` documenta amostragem, timestamps e comparação de seeks. Só usar com quadros reais válidos e manifestos corretos; não declarar latência de motion a partir do container25fps.

Sessões de shell, processos, aliases de runtime, browser handles e aprovações técnicas podem não sobreviver à transferência. Reinspecionar sem repetir testes/capturas antigos como se fossem novos. Não expor `.env` nem seed inteiro em outputs.

## Entrega esperada e ponto de parada

Registrar decisões, estado atual, aprovações explícitas e gates em `08-IMPLEMENTATION-PROGRESS.md`. Produzir relatório próprio09: resumo/arquivos, checks executados e resultados, evidências novas versus herdadas, limitações, rollback e próximo escopo. Commit separado somente da implementação09 autorizada.

Rollback09 deve reverter composição/consumidores como unidade, preservando registros, IDs e snapshots. Sem rollback de banco. Não declarar concluído critério não verificado; explicitar bloqueios e aguardar decisão quando obrigatório.

**Parar após PR09. Solicitar conferência e autorização específica antes de PR10.**

## Texto sugerido para abrir o novo chat

> Retome o Restok em C:\Fontes\restok a partir de docs/restok-refactor-plan/HANDOFF-PR09.md. Leia os documentos e instruções indicados e confira Git/alterações preexistentes. Meu objetivo é executar somente o PR09, Histórico e detalhe, em unidade local separada. Antes de implementar, trate explicitamente a pendência visual do PR08; não presuma que ela foi aprovada ou adiada. Use somente o navegador interno do Codex. Não execute migrations/seed/reset, push/PR remoto/merge/deploy. Preserve meu trabalho, registre progresso e faça commit somente do que implementar. Ao concluir o PR09, apresente o relatório e pare para minha conferência/autorização do PR10.

O texto sugerido não é aprovação automática: a mensagem efetivamente enviada pelo usuário no novo chat determina o escopo e as decisões sobre pendências.
