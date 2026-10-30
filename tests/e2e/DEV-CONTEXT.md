# Gate de contexto no restok-dev (PR 02)

Este runner é separado do harness de fixtures e da suíte `test:supabase`.
Ele acessa o backend real **somente após autorização humana atual**. A execução
de 28/10/2026 foi autorizada nas respostas registradas em
`docs/restok-refactor-plan/08-IMPLEMENTATION-PROGRESS.md`.

`dev-context.mjs` exige `RESTOK_DEV_CONTEXT_TEST=authorized`, aceita apenas o
hostname restok-dev explicitamente autorizado e frontend localhost3000 ou
127.0.0.1:3001. Extrai as duas credenciais do seed para memória, sem executar SQL,
imprimir credenciais ou salvar sessões. A gravação de vídeo começa depois do login.
As contas do seed são fictícias. Não substituir essas contas por pessoas reais.

- `node tests/e2e/dev-context.mjs inspect`: autenticação e leitura da quantidade/papéis.
- `node tests/e2e/dev-context.mjs before`: troca/reload nas duas contas; sem criar convites.
- `node tests/e2e/dev-context.mjs after`: valida troca/reload, convites malformado/inválido,
  cria/consome **dois** convites para memberships existentes, verifica reutilização,
  injeta falha de snapshot só no browser, testa preferência não autorizada e getter
  localStorage bloqueado. Cada nova execução after cria mais dois convites.

Usar as variáveis de Playwright/Chromium/ffmpeg descritas no README do harness.
`RESTOK_FRONTEND_URL` e `RESTOK_BUILD_LABEL` identificam o frontend e o build.
Nesta execução, antes/depois finais usaram `next start` em 127.0.0.1:3001: primeiro
o build do PR01, depois o build do PR02. O servidor dev do usuário em3000 não foi
reiniciado. Os processos temporários de QA foram encerrados ao concluir.

Os resultados omitem IDs, emails, senhas, cookies e tokens de convite; screenshots
mostram somente os nomes e email fictícios das contas de teste. Não salvar trace
de requisições autenticadas sem redigir segredos. Manifestações de mídia ficam
junto aos resultados: `manifest.json` e `result.json` em evidence/pr02/before e after.

Limites: a preferência não autorizada é simulada no browser, sem revogar membership
no banco. Troca de sessão durante uso é coberta por COMPONENT; o integrado usa duas
sessões isoladas. Falha sem cache, zero memberships e snapshots de outro tenant
têm cobertura local, não integração destrutiva. Esta execução não certifica a
suíte completa de RLS, realtime concorrente, hardware, mailbox ou release.
