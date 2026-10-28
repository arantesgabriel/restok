# Bloco 3 — relatório incremental

28/10/2026. Bloco06–11 autorizado. PR06 concluído; PR07 em andamento, PR08–11 pendentes. Este relatório não declara o bloco concluído. Commits locais autorizados, sem push, PR remoto, merge ou deploy.

## PR06 — shell e Compra

Shell com navegação lateral no desktop, casa identificável, avisos persistentes expansíveis e dock de ações; Compra composta por toolbar, categorias e linhas novas. Total à direita e unitário subordinado. Hooks de apresentação extraídos; fila e persistência preservadas.

Arquivos de produto: `components/app/app-shell.{tsx,module.css}`; `components/shopping/{use-shopping-view.ts,shopping-view.tsx,shopping-toolbar.tsx,category-section.tsx,item-row.tsx,shopping-dock.tsx,shopping.module.css,budget-summary.tsx,shopping-controls.module.css}`; `components/ui/{toast.tsx,feedback.module.css,controls.module.css}`; `components/restok-app.tsx`.

Validação: `shopping-view.test.tsx`, `ui/primitives.test.tsx` e testes existentes de contexto, logout e motion/teclado ajustados aos elementos acessíveis. **149 testes/29 arquivos aprovados**, lint, typecheck, build Webpack e diff-check aprovados. Novos casos cobrem zero/filtros, busca/limpar/foco, skip link/hash e Escape do feedback. Não houve relaxamento de timeout.

Harness: `tests/e2e/{before-pr06.tsx,entry.tsx,fixtures.ts,data-fixture.ts,client-fixture.ts,encode-internal-recording.py}`. Snapshot anterior34846f0 conferido contra Git; cenário de espera só é liberado por ação da fixture. Nenhum bypass de autenticação em produção.

Evidências novas em `evidence/pr06`: comparação anterior/posterior nas seis dimensões; UI-001320×640 com duas linhas inteiras, inclusive primeira linha com aviso+feedback; UI-0051280×800 com quatro linhas inteiras. Zero overflow medido nas seis dimensões exatas, inclusive stress. `final-geometry.json` é a referência final. Filtros/ordens/navegação em `controls.json`.

Vídeo `interaction.webm`:61 aquisições reais contínuas durante editar/salvar/filtrar/buscar/limpar; mediana66ms, máximo141ms. Container25fps mantém quadros adquiridos, sem interpolação. Cinco seeks40ms aprovados por comparação MAE<=3 (`media-checks.json`). Inspeção visual focal: primeiras dobras320/1280 e estado de busca vazia; não se afirma revisão humana de cada imagem/frame. JPEGs originais preservados.

Limites: fixture não prova integração Supabase; nenhuma gravação remota no PR06. Stress extremo valida encaixe, não precisão financeira fora do intervalo seguro de Number. Safe area e teclado de aparelho físico não foram testados. Fonte/master e gates de release continuam conforme plano; vídeo/leitor04–05 adiados explicitamente ao PR12. Legado de sheets, catálogo, histórico, casas, auth e CSS global permanece com responsáveis posteriores.

Rollback: reverter o commit06 como unidade antes de seus dependentes, preservando registros, IDs, fila e alterações preexistentes. Sem operação de banco. Snapshot de comparação é fixture exclusiva.

## PR07 — em andamento

Preparar/adicionar/editar/concluir compra: sheets novos, seleção0/alguns/todos/resultados, coleção33/100 com footer alcançável, aviso de arquivamento, avulso opcional no catálogo e conclusão com pendências. Sucesso exige write confirmado, com falha/retry/idempotência cobertos.

Autorização explícita recebida para usar contas fictícias do seed e criar casas isoladas no restok-dev nos gates07/10, com writes somente nelas. Nenhuma migration, seed/reset ou alteração de casa preexistente autorizada.

## Próximas unidades e pausa

PR08 catálogo; PR09 histórico; PR10 casas/pessoas; PR11 auth/conta. Avanço somente após gates da unidade anterior. Ao concluir Bloco3, parar e aguardar autorização específica do Bloco4 (PR12–13). Blocos4–5 seguem não autorizados.
