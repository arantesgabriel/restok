# Harness de evidências do Bloco 1

`E2E-FIXTURE`: renderiza os componentes reais com os CSS existentes em um servidor
Vite separado, somente em `127.0.0.1:4173`. Não é rota do Next, não altera `/app`,
não carrega `.env` e substitui dados/auth/realtime por módulos locais. O runner
recusa requisições externas. Auth/RLS/Realtime reais **não** são certificados aqui.
O adaptador de imagem/link/router também é local, sem otimização SSR do Next.

Nenhuma dependência foi instalada: Vite vem da instalação atual de Vitest; o
Playwright/Chromium usado nesta execução pertence ao runtime empacotado do Codex.
O harness não participa do bundle de produção. Se essas ferramentas não estiverem
disponíveis em outro computador, sua instalação exige decisão de tooling própria.

## Reprodução

1. `node tests/e2e/serve.mjs`
2. Configurar `RESTOK_PLAYWRIGHT_MODULE` com o caminho absoluto de `playwright/index.mjs`
   (ou deixar vazio se importável), `RESTOK_CHROMIUM_EXECUTABLE` com o Chromium local e,
   quando necessário, `PLAYWRIGHT_BROWSERS_PATH` com a pasta dos browsers/ffmpeg.
3. `node tests/e2e/capture.mjs docs/restok-refactor-plan/evidence/pr01/baseline`
4. Com Python contendo Pillow e NumPy:
   `python tests/e2e/verify-media.py docs/restok-refactor-plan/evidence/pr01/baseline --ffmpeg CAMINHO_FFMPEG`

Windows: utilizar o Node empacotado se o executável do sistema falhar no spawn.
Nesta execução, o sandbox negou sockets/processos/arquivos temporários. Capturas,
verificação de mídia e build foram repetidos com execução escalonada aprovada.

O manifesto registra engine, viewport CSS, DPR 1, zoom 1, preferência de movimento
emulada, cenário, rota, PNG, vídeo, retângulos e tempo do script. `mediaSeek` é
preenchido **somente** depois de decodificar todos os frames de cada vídeo e
comparar RGB em largura 80. Precisão de um frame (40 ms), não latência da ação.
MAE é uma verificação de correspondência, não avaliação de qualidade da UI.

## Cobertura da baseline

Seis viewports: 320×640, 390×844, 768×1024, 1024×768, 1280×800 e 1440×900.
Em cada um: Compra com 33 itens, editor, Casa, pessoas com dois nomes de 80 caracteres,
Histórico, detalhe, casa vazia, falha de snapshot sem cache, login, reset e landing.
Capturas são da primeira dobra; não representam QA completo, teclado físico,
leitor de tela, zoom nativo, mobile físico, mailbox, nem Supabase integrado.
As fixtures são ilustrativas e determinísticas; o servidor real não é usado.

## Unidades locais e segurança

PR 01 é tooling/harness/baseline. PR 02 será correção/testes de contexto e evidência
integrada específica, após os gates do PR 01. A suíte `test:supabase` continua
separada e mantém sua recusa a projetos hospedados; não flexibilizar essa proteção.
Credenciais, tokens de convite e sessões não devem entrar nos artefatos de revisão.
