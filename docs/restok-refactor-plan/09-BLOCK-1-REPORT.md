# Entrega local do Bloco 1

28/10/2026 · America/Sao_Paulo · PR01 e PR02 concluídos como unidades locais.
Branch `codex/restok-raiz-eucalipto-bloco-1`, HEAD de origem
`7c3ed3bc821adbf01966aee354eb1702ffc1cbed`. Sem commit, push, PR remoto, merge ou deploy.
Autorização limitada ao Bloco1 e respostas para testes no restok-dev registradas no08.

## PR 01: baseline e tooling

O typecheck falhava no campo esbuild ignorado pelo Vite8. A opção foi retirada,
mantendo config no typecheck e JSX do tsconfig preexistente. O Turbopack falhou
ao iniciar PostCSS; o build passa com Webpack, agora explícito no script.
Workers do Vitest limitados a4 após timeouts sob concorrência, sem ampliar os5s
ou remover asserts. Sem instalação, upgrade ou alteração do lockfile.

Arquivos de implementação/revisão:

- `package.json`: somente `build` → `next build --webpack`, sobre as alterações anteriores do usuário.
- `vitest.config.ts`: retirada esbuild e limite de workers.
- `tests/supabase/README.md`: corrigida informação sobre CLI config; autorizações e guardas preservadas.
- `tests/e2e/README.md`, `serve.mjs`, `index.html`, `entry.tsx`, `fixtures.ts`,
  `data-fixture.ts`, `client-fixture.ts`, `next-fixture.tsx`, `link-fixture.tsx`,
  `capture.mjs`, `verify-media.py`: harness separado das rotas Next, com fixtures
  rotuladas, sem .env/backend e HTTP externo bloqueado pelo runner.

Gate local:lint/typecheck/build verdes;69/69 testes em22 arquivos (10,64s na execução
final deste PR). A tentativa inicial de reexecução concorrente teve2 timeouts,
resolvidos pelo limite de workers. Tentativas de build/captura no sandbox tiveram
falhas de processos/sockets/EPERM; a execução escalonada validou os comandos finais.
Avisos não bloqueantes:convenção middleware deprecated, loader ESM futuro do Vite,
cache webpack com strings grandes. Não migramos stack/middleware para silenciá-los.

Unidade de revisão:[PR01.patch](evidence/pr01/PR01.patch) e
[checkpoint](evidence/pr01/checkpoint.json). O patch contém somente o delta desta
unidade, incluindo o único hunk nosso de package.json; não incorpora os upgrades
preexistentes do usuário.

## PR 02: UI-013 e proteção do contexto

Ausência de convite agora é passada como undefined ao resolver, permitindo ler a
casa salva da conta. Convite aceito conserva prioridade explícita. A membership
continua sendo validada pelo serviço real; nenhum contrato de dados/RLS/RPC mudou.
Storage bloqueado não quebra contexto/ativação/logout. Fallback é explicado,
limpeza respeita usuário/casa e mudança de conta oculta o estado anterior antes
do reload. Nenhuma alteração visual estrutural ou contrato monetário foi antecipado.

Arquivos:

- `components/restok-app.tsx`: boot, aviso, persistência opcional e troca de sessão.
- `lib/supabase/cache.ts`: acesso tolerante a storage indisponível.
- `lib/supabase/cache.test.ts`: caso adicional de métodos/getter/quota.
- `components/restok-app.household-context.test.tsx`:13 casos de boot/ativação.
- `lib/supabase/data.household-context.test.ts`:11 casos do resolver real com cliente mockado.
- `tests/e2e/dev-context.mjs` e `DEV-CONTEXT.md`: ensaio real autorizado e seus limites.

Gate local:lint/typecheck/build verdes;**94/94 testes em24 arquivos**,13,28s.
São69 testes anteriores reexecutados e25 novos. Subconjunto de risco:28/28 em3
arquivos. Red local inicial:7 falhas em11 casos do primeiro recorte; o arquivo
foi posteriormente fortalecido/expandido. Guards, cache, logout, compra, catálogo,
histórico, auth e landing anteriores continuam passando.

Gate real:duas contas do seed, duas sessões isoladas, duas casas exercitadas por
conta entre as3 memberships existentes. A segunda casa foi selecionada e confirmada
antes de recarregar. **Antes:seleção perdida em2/2. Depois:preservada em2/2.**
Por conta, passaram os seis cenários adicionais detalhados no08, inclusive convite
válido/usado, falha de snapshot com cache e storage negado. Zero erros de página
registrados nos contextos principais filmados; o contexto auxiliar de storage foi
validado por DOM, sem instrumentação própria de pageerror.

Foram criados/consumidos2 convites sobre memberships existentes, autorizados pelo
usuário. Contagem/papéis das contas foram conferidos novamente por leitura e
permaneceram iguais. Carga de perfil/categorias pode fazer upserts automáticos;
esses possíveis deltas não foram auditados linha a linha. Não executamos SQL,
migrations, seed/reset, criação de casas/produtos ou alteração de papéis.

Unidade de revisão:[PR02.patch](evidence/pr02/PR02.patch),
[checkpoint](evidence/pr02/checkpoint.json),
[resultado antes](evidence/pr02/before/result.json) e
[resultado depois](evidence/pr02/after/result.json).

## Evidências novas e herdadas

| Evidência nova | Cobertura / limite |
|---|---|
| [Baseline de fixtures](evidence/pr01/baseline/manifest.json) |66 PNGs e6 vídeos;11 estados por cada um dos6 viewports do06. Só primeira dobra, não QA integral |
| [Integrado antes](evidence/pr02/before/manifest.json) |4 PNGs e2 vídeos,1280×800, build PR01; diálogo entrando nas capturas, sem alegação de acabamento |
| [Integrado depois](evidence/pr02/after/manifest.json) |6 PNGs e2 vídeos,1280×800, build PR02; reload e convite válido |

Todos os seeks foram localizados nos vídeos decodificados por comparação RGB,
precisão40ms, separados do relógio do script. Manifestos contêm MAE e método.
Chromium156.0.8078.4, DPR/zoom1; movimento padrão emulado na fixture/depois e
default do browser no antes. Credenciais/sessões/tokens de convite não foram salvos.
As contas são fictícias; mídia integrada mostra seu próprio email de teste.

Inspeção visual direta nesta execução:Compra320/1280, pessoas390, landing1440,
antes selecionado/reload e depois reload da conta1. As demais imagens foram
capturadas e relacionadas aos vídeos automaticamente; não se declara inspeção
manual integral das76 imagens ou de todos os frames. O relatório03 e os artefatos
v2/v1 referenciados continuam **EVIDÊNCIA-HERDADA**, sem reatribuição a esta execução.

Exemplos:[UI-001 em fixture](evidence/pr01/baseline/320-640-shop.png),
[UI-002 em fixture](evidence/pr01/baseline/390-844-people.png),
[UI-013 antes/reload](evidence/pr02/before/account-1-reload.png),
[UI-013 depois/reload](evidence/pr02/after/account-1-reload.png).

## Preservação, riscos e limites

Os hashes de next-env.d.ts, tsconfig.json, lockfile e seed são idênticos aos
iniciais. O next-env gerado pelo build foi restaurado aos bytes originais.
Package conserva todos os upgrades anteriores, com somente o hunk build novo.
Os oito documentos originais não foram reescritos;08 é o registro corrente e09
esta entrega. Patches reversos foram verificados sem aplicá-los; diff sem erros
de whitespace. Servidores temporários4173/3001 encerrados, dev3000 preservado.

Nenhum critério obrigatório do Bloco1 ficou aberto. Os limites seguintes não são
declarados aprovados:revogação real/zero memberships reais e troca de conta em uso
têm testes locais/simulação; não alteramos memberships do banco para produzi-los.
Não rodamos nem flexibilizamos a suíte hosted-refusing `test:supabase`. Hardware,
leitores/zoom nativos, mailbox, concorrência/realtime completo e QA final pertencem
a gates posteriores. UI-001/002 continuam abertos nos PRs06/10. A baseline v1
externa não foi obtida; a baseline nova fica explicitamente separada.

Com storage negado, a seleção/cache não persiste nesse browser e a casa autorizada
de fallback é usada. Não prometemos limpar fisicamente storage inacessível; o
isolamento por usuário/membership continua obrigatório e testado. O build usa
Webpack até revisão futura da falha ambiental de Turbopack.

## Rollback por unidade

Reverter **PR02 antes de PR01**, conferindo hashes e `git apply --reverse --check`
do respectivo patch antes de aplicar qualquer reversão. Os patches são locais,
sem alterações preexistentes e sem SQL. Se houver edição posterior nos mesmos
trechos, revisar o diff em vez de forçar. Manter evidências e registro de aprovação.

PR02:reverter os7 arquivos do patch restaura o comportamento anterior de contexto,
inclusive o defeito UI-013 e a fragilidade com storage. PR01:reverter seus14 arquivos
restaura a configuração anterior, inclusive o TS2769 conhecido e o build Turbopack.
Não usar reset/clean, não reverter upgrades do usuário nem migrations de segurança.
Os2 convites consumidos permanecem como registros de teste no restok-dev; rollback
de código não precisa apagar dados, perfis, categorias ou sessões no backend.

## Próximo bloco, ainda não autorizado

Bloco2, PRs03–05:fundamentos/tokens/norma local e fonte legal em preview isolado;
campos monetários/quantidade e contratos vazio/zero/positivo; componentes,
overlays, feedback e navegação. Depende de assets/licença e gates do roadmap.
Nenhum código, instalação ou exclusão desse bloco foi iniciado.

**Execução encerrada. Aguardar aprovação explícita do Bloco2.**
