# Bloco2 — implementação local e aceite pendente

28/10/2026 · America/Sao_Paulo

O usuário autorizou explicitamente PRs03–05 e commits locais somente do trabalho do agente. Blocos3–5, push, PR remoto, merge e deploy não autorizados. Sem migrations/seed/reset, novas dependências ou gravações remotas neste bloco.

## Resultado por PR

| Unidade | Implementação | Verificação nova | Situação |
|---|---|---|---|
| PR03 · `6dcd518` | Tokens isolados, Manrope legal local, norma e preview de fundações | 95 testes/25 arquivos, lint/typecheck/build; fonte/alpha/pesos, contraste, seis dimensões, foco e observação de zoom | Concluído localmente; master final de marca continua pendência da marca |
| PR04 · `afc5a44` | Vazio distinto de0, parser BRL, campos de dinheiro/quantidade, histórico0 e orçamento0 | 133 testes/27 arquivos, lint/typecheck/build; fixture monetária na aba interna | Implementação concluída; gate transversal de evidência reaberto |
| PR05 · commit próprio desta unidade | Primitivos novos e consumidores; sheet com footer; menus/foco; feedback/nav | 145 testes/28 arquivos, lint/typecheck/build e diff-check; teclado/overlays em seis dimensões na aba interna | Código pronto para revisão; aceite integral pendente |

Os commits do Bloco1 já autorizados e feitos separadamente são `c053ca0` (PR01) e `b243f42` (PR02). Nenhum arquivo preexistente foi incorporado por engano. O script build de package.json é a única mudança anterior do agente nesse arquivo; as atualizações de dependências do usuário continuam fora dos commits.

## Evidências realizadas nesta execução

- PR03: 19 PNGs/6 WebMs do harness e capturas internas JPG. Seeks iniciais verificados40ms; PNGs finais de foco sem vídeo correspondente foram identificados como estáticos. Fonte real confirmada; contrastes registrados no progresso. Zoom nativo200/400 observado, com limites registrados em native-zoom-observation.json; não houve exportação de vídeo do método.
- PR04: 9 JPGs da aba interna. Entrada inválida continua no formulário; quantidade999999 cabe; fracionária rejeitada; subtotal3×1234,50=3703,50 e preço conhecido0 observados. Valores e contas são fixtures locais rotuladas, sem backend.
- PR05: capturas finais do preview isolado da aba interna em320/390/768/1024/1280/1440; manifesto registra dimensões CSS reais, inclusive arredondamento de1px. Nenhum botão medido abaixo de44px, sem overflow. Sheet com100 itens nas seis dimensões e33 em320; footer estável/visível e retorno de foco. Esc/Tab/Shift+Tab e menu com End/ArrowDown/Tab exercitados. Erro, retry, skeleton pendente e resposta simulada demonstrados. Dados de geometria e sequência em sheet-checks.json/interaction-checks.json.
- Inspeção visual final: preview320 e sheet100 ao fim da rolagem. Capturas das demais combinações e medidas não significam revisão humana integral de cada pixel ou leitor de tela.
- As evidências do documento03 são herdadas da auditoria. Não entram nas contagens de testes novos acima.

## Gates ainda abertos e limites

**O Bloco2 não está certificado como integralmente aceito.** O roteiro da fase2 inclui inspeção manual com leitor; a seção06 pede imagem e vídeo de interação com seek. Não foram realizados leitor real nem vídeos novos nos PRs04/05. Reduced motion foi exercitado em teste e previsto em CSS, sem mudar preferências do SO. Não confundir AX/DOM com NVDA/VoiceOver, nem JPG com filmagem.

O PR05 começou após os gates funcionais do04, mas antes de fechar essa evidência transversal. A revisão final reabre explicitamente o aceite; não apresenta o avanço anterior como cumprimento de todos os gates. O código já feito fica em unidade revisável, sem avançar ao Bloco3. Não gerar vídeo sintético de imagens estáticas para simular inspeção de motion.

A recuperação após interrupções produziu capturas intermediárias de uma aba temporária com enquadramento inconsistente; arquivos finais foram sobrescritos por capturas da aba existente. A última tentativa adicional de smoke no /app de fixtures encontrou conexão recusada e a página de erro interna impediu nova navegação pela ferramenta. Não foi contada como smoke aprovado. Preview final e testes de componente são evidências distintas.

Não houve validação física de teclado móvel/safe area, leitor nativo, concorrência real ou mailbox neste bloco. QA transversal completo continua no PR12, mas isso não dispensa o gate manual aberto desta fase sem decisão explícita. Master vetorial da marca permanece pendente; fonte raster existente é transitória. UI-001/UI-002 e reconstrução das telas pertencem aos PRs06/10. Aviso de middleware/proxy da stack instalada permanece fora deste escopo.

## Riscos e legado restante

Primitivos novos coexistem temporariamente com a composição antiga. `app/globals.css`, `app/ui.css`, Tailwind antigo, linhas/categorias, catálogo, histórico, pessoas e auth ainda têm consumidores legados; a retirada global continua no PR13. Não existe promessa de aceite visual final dessas telas. Campos/checkboxes brutos remanescentes nos consumidores de coleção e auth serão migrados nos PRs correspondentes, sem remover funcionalidades agora.

Toast novo é persistente por padrão para não apagar falhas; a confirmação transitória exige opção explícita. Menus preservam nomes e teclado, com portal fora de clipping e suporte a dialog pai. Sheet novo usa duração do token para saída; o fallback220ms dos dialogs antigos é mantido até PR12. Persistência/fila e confirmação remota não foram redesenhadas.

## Rollback sem tocar dados

1. PR05: reverter exclusivamente seu commit para voltar ao checkpoint PR04. Não incluir package/lock/tsconfig/next-env/seed do usuário. Manter a correção monetária do04.
2. PR04: rollback visual deve manter parser, distinção0/undefined, fórmulas e compatibilidade com histórico0. Reverter o commit inteiro reintroduz a ambiguidade antiga; não converter0 em null no banco. Preparar a reversão de apresentação como patch revisado e repetir os testes monetários.
3. PR03: retirar apenas após remover consumidores visuais dependentes; preservar correções de domínio do04. Não apagar dados/cache de terceiros nem reverter migrations de segurança.

Nenhum rollback foi executado. Alterações preexistentes foram verificadas contra hashes iniciais após cada build; package comparado descontando apenas o script webpack já autorizado.

## Próximo bloco, ainda não autorizado

Bloco3: PR06 shell/Compra;07 preparar/adicionar/editar/concluir;08 catálogo;09 histórico;10 casas/pessoas/onboarding;11 conta/auth/perfil. Requer fechamento ou decisão explícita sobre o gate atual e depois autorização explícita do usuário. Aprovação do roadmap não autoriza implementação desses PRs.

## Arquivos por unidade

As listas incluem código, testes e artefatos de evidência, sem os oito documentos00–07 preexistentes.

### PR03

- `DESIGN.md`
- `components/ui/theme.tsx`
- `docs/design/RESTOK_DESIGN_SYSTEM_V1.md`
- `docs/restok-refactor-plan/08-IMPLEMENTATION-PROGRESS.md`
- `docs/restok-refactor-plan/09-BLOCK-1-REPORT.md`
- `docs/restok-refactor-plan/evidence/pr03/browser/1024-768-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1024-768-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1024-768.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1024-768.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/1280-800-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1280-800-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1280-800.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1280-800.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/1440-900-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1440-900-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1440-900.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/1440-900.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/320-640-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/320-640-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/320-640.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/320-640.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/390-844-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/390-844-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/390-844.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/390-844.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/390-fallback.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/768-1024-focus.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/768-1024-full.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/768-1024.png`
- `docs/restok-refactor-plan/evidence/pr03/browser/768-1024.webm`
- `docs/restok-refactor-plan/evidence/pr03/browser/internal-320-focus.jpg`
- `docs/restok-refactor-plan/evidence/pr03/browser/internal-current.jpg`
- `docs/restok-refactor-plan/evidence/pr03/browser/manifest.json`
- `docs/restok-refactor-plan/evidence/pr03/checkpoint.json`
- `docs/restok-refactor-plan/evidence/pr03/google-fonts.css`
- `docs/restok-refactor-plan/evidence/pr03/native-zoom-observation.json`
- `public/fonts/manrope/OFL.txt`
- `public/fonts/manrope/README.md`
- `public/fonts/manrope/manrope-latin-ext-variable.woff2`
- `public/fonts/manrope/manrope-latin-variable.woff2`
- `styles/base.css`
- `styles/motion.css`
- `styles/tokens.css`
- `tailwind.raiz.config.ts`
- `tests/e2e/capture-foundations.mjs`
- `tests/e2e/foundations.css`
- `tests/e2e/foundations.html`
- `tests/e2e/foundations.tsx`
- `tests/e2e/runtime.mjs`
- `tests/e2e/verify-media.py`
- `tests/styles/tokens.test.ts`

### PR04

- `components/restok-app.money.test.tsx`
- `components/restok-app.tsx`
- `components/ui/money-field.tsx`
- `components/ui/numeric-fields.module.css`
- `components/ui/quantity-field.tsx`
- `docs/restok-refactor-plan/08-IMPLEMENTATION-PROGRESS.md`
- `docs/restok-refactor-plan/evidence/pr04/browser/1024-768-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/1280-800-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/1440-900-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/320-640-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/390-844-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/768-1024-error.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/invalid-quantity.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/known-zero.jpg`
- `docs/restok-refactor-plan/evidence/pr04/browser/manifest.json`
- `docs/restok-refactor-plan/evidence/pr04/browser/subtotal.jpg`
- `lib/money.test.ts`
- `lib/money.ts`
- `lib/quantity.ts`
- `lib/utils.ts`
- `tests/e2e/fixtures.ts`

### PR05

- `components/accessible-dialog.tsx`
- `components/app/house-switcher.tsx`
- `components/app/navigation.module.css`
- `components/app/navigation.tsx`
- `components/restok-app.tsx`
- `components/shopping/already-have.tsx`
- `components/shopping/budget-summary.tsx`
- `components/shopping/shopping-controls.module.css`
- `components/shopping/status-toggle.tsx`
- `components/ui/action-menu.tsx`
- `components/ui/button.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/controls.module.css`
- `components/ui/empty-state.tsx`
- `components/ui/feedback.module.css`
- `components/ui/field.tsx`
- `components/ui/icon-button.tsx`
- `components/ui/list.tsx`
- `components/ui/option-group.tsx`
- `components/ui/overlay.module.css`
- `components/ui/primitives.test.tsx`
- `components/ui/search-field.tsx`
- `components/ui/select.tsx`
- `components/ui/sheet.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/sync-status.tsx`
- `components/ui/toast.tsx`
- `components/ui/use-dialog-close.ts`
- `docs/restok-refactor-plan/08-IMPLEMENTATION-PROGRESS.md`
- `docs/restok-refactor-plan/10-BLOCK-2-REPORT.md`
- `docs/restok-refactor-plan/evidence/pr05/browser/1024-768-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1024-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1024-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1280-800-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1280-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1280-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1440-900-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1440-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/1440-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-640-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-menu-focus.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-pending.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-sheet-33-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/320-sheet-33-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/390-844-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/390-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/390-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/768-1024-components.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/768-sheet-100-end.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/768-sheet-100-top.jpg`
- `docs/restok-refactor-plan/evidence/pr05/browser/interaction-checks.json`
- `docs/restok-refactor-plan/evidence/pr05/browser/manifest.json`
- `docs/restok-refactor-plan/evidence/pr05/browser/sheet-checks.json`
- `styles/base.css`
- `tests/e2e/components.css`
- `tests/e2e/components.html`
- `tests/e2e/components.tsx`
- `docs/restok-refactor-plan/evidence/pr05/checkpoint.json`
