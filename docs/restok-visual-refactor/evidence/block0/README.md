# Bloco 0 — evidências e checks

Execução autorizada em 2026-10-30. Escopo limitado às fundações compartilhadas; nenhuma alteração em domínio, API, Auth, RLS/RPC, filas ou banco. Paleta, Manrope local, Lucide, handlers, AccessibleDialog, ciclo de saída, notices e seleção de casa foram preservados. Nenhuma dependência foi instalada.

## F-01 a F-05

- **F-01 — região contextual e largura útil:** `AppShell` aceita `context` opcional. A sidebar de 232 px e a navegação desktop entram em 1024 px; a coluna contextual de 256 px só entra em 1200 px quando fornecida. Em 1024 px a área de trabalho fica em uma coluna; em 1280 px com contexto mediu 712 px de trabalho e 256 px de contexto, sem overflow. A navegação inferior permanece visível nos larguras abaixo de 1024 px; o breakpoint do layout vertical dos seus itens foi alinhado ao da sidebar.
- **F-02 — gutters:** medidos no primeiro item: 12 px em 320 px, 16 px em 390 px e 24 px a partir de 768 px. Overflow horizontal zero em 320, 390, 768, 1024, 1280, 1440 e 1920 px.
- **F-03 — controles:** botão secundário mediu 44 px, campo de busca 46 px, raio 8 px e borda `lineStrong` (`rgb(201, 217, 197)`). Foco visível mediu 2 px com offset 3 px. Hover, pressionado, desabilitado e ocupado foram capturados e verificados.
- **F-04 — vazios:** `EmptyState` oferece `first-use` (padrão, com ícone e ação quando fornecida) e `compact` (resultado de busca/filtro). Consumidores existentes foram classificados; os handlers das ações são os originais.
- **F-05 — escopo do tema:** a comparação reproduzível está em `f05-before.json`/`f05-after.json` e nos quatro PNGs `f05-before/after-{vite,next}.png`. Antes, o mesmo orçamento em fundo `rgb(33, 63, 29)` recebia texto escuro no Vite (`rgb(24, 37, 26)`) e branco no Next. O CSSOM confirmou empate de especificidade: o default de `.restok-theme` competia com a regra do módulo e vencia conforme a ordem de imports. O default agora usa `:where(.restok-theme)`, que tem especificidade zero; após a correção, Vite e Next computam texto branco nas três medições do orçamento. A paleta e a regra de seleção de texto não foram alteradas.

## Evidências visuais

- `manifest.json` registra **100 capturas do harness de componentes**, engine Edge 156.0.4314.50, DPR/zoom 1, geometrias, primeira linha e **214 checks aprovados**, sem erros de página. Inclui Compra, Casa, Pessoas e Histórico em 320×640, 390×844, 768×1024, 1280×800, 1440×900 e 1920×1080; 1024×768 foi acrescentado para verificar a troca da navegação. Estados de vazio, busca sem resultado, nomes longos, valores, loading, erro, editor, sheet e foco também estão registrados.
- `shell-context-manifest.json` e `shell-context-1024x768.png`/`shell-context-1280x800.png` verificam a coluna contextual no Next isolado: sem overflow, empilhada em 1024 px e lateral em 1280 px.
- `screens/controls-390x844-{default,focus,hover,pressed}.png` documenta os estados dos controles.
- `next-public-smoke-manifest.json` registra 6 rotas públicas do build Next isolado (`/`, `/login`, `/reset-password` em 390×844 e 1440×900): todas responderam 200, sem overflow nem erros de página e com Manrope e tema presentes. Os PNGs correspondentes estão em `screens/next-*.png`.
- O `manifest.json` também registra smoke das mesmas rotas no harness Vite.

As telas de produto usam a fixture E2E identificada visualmente como “sem backend”. Elas demonstram o render e os contratos de componentes, não uma sessão autenticada nem dados vivos do Supabase.

## Checks e ambiente

- `npm test`: 39 arquivos, 230 testes aprovados.
- `npm run lint`: aprovado (`--max-warnings=0`).
- `npx tsc --noEmit --incremental false`: aprovado.
- `npm run build`: aprovado no Next 16.4.3/Webpack em cópia isolada, com um worker durante a construção. O dev existente na porta 3000 não foi parado nem teve seu `.next` usado; o smoke de produção usou a porta 3012 e foi encerrado depois. O `next.config.ts` temporário da cópia foi restaurado após o build.
- `git diff --check`: aprovado.

## Riscos e rollback

- O maior risco deste bloco é a mudança de cascata global: o smoke em Next e Vite cobre as rotas públicas e o orçamento, mas não substitui revisão de cada tela autenticada com dados reais.
- O dock continua fixo em desktop/mobile conforme solicitado; a realocação de ações permanece para o Bloco 1. As capturas permitem rever o espaço que ele ocupa antes dessa etapa.
- `block0.patch` contém apenas as alterações de código do Bloco 0. Para reverter esta unidade, aplique `git apply -R` nesse patch; mantenha o restante do `git status` preexistente intacto. Os PNGs e manifestos podem permanecer como registro.

**Gate:** Bloco 0 concluído e entregue para revisão. Bloco 1 não foi iniciado; aguarda aprovação explícita do Bloco 0.
