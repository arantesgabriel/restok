# Bloco 3 — relatório incremental

28/10/2026. Bloco06–11 autorizado. PR06 e PR07 concluídos localmente; PR07 com evidências adiadas explicitamente ao PR12. PR08 em andamento, PR09–11 pendentes. Este relatório não declara o bloco concluído. Commits locais autorizados, sem push, PR remoto, merge ou deploy.

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

Implementado localmente: `components/shopping/{item-editor-sheet,add-item-sheet,new-purchase-sheet,budget-editor-sheet,confirm-finish-sheet,complete-sheet}.tsx`, `purchase-sheets.module.css`, `use-purchase-selection.ts` e consumidor `components/restok-app.tsx`. Footer associado ao formulário mantém ações alcançáveis. Sucesso exige `ok && synced`; falhas/resposta local conservam retry. Não houve alteração em SQL/fila por casa.

Testes novos em `components/shopping/purchase-sheets.test.tsx` e `components/restok-app.write-confirmation.test.tsx`: sete casos adicionais, **156/156 em31 arquivos**, typecheck e lint aprovados. Build Webpack final e diff-check aprovados após o ajuste da descrição durante fechamento. Harness acrescenta snapshot anterior528cd76, coleção100 e resposta de falha/confirmação controlada, identificadas como fixtures sem backend.

Evidências novas estáticas de Nova compra: seis dimensões antes/depois e com100 produtos, métricas em `evidence/pr07/geometry{33,100}.json`. Tolerância1px para arredondamento mobile; primeira medida transitória durante entrada foi substituída por geometria estável. Inspecionada visualmente a captura320. Fim de100 confirmado por foco/scroll no DOM, captura final falhou.

Integração real na casa `QA Bloco3 PR07 2026-10-28T22-01-24`, ID no manifesto local. Criados três registros de compra (primeira concluída, segunda arquivada, terceira ativa vazia), um produto de catálogo e dois itens na primeira/um na segunda. Orçamento0, preço0, edição3×5=15, pendente preservado, conclusão após confirmação, seleção seguinte e arquivamento conferidos por UI/reload e nova sessão após logout/login. DOMs salvos em .txt, sem imagem/vídeo integrado. Sem migrations/seed/reset ou gravação deliberada em casas preexistentes; carga autenticada conserva upserts automáticos autorizados.

**Gate07 aberto:** faltam vídeo com seek e capturas/estados visuais restantes. Navegador interno interage, mas exportação de imagens falha; recuperação solicitada ao usuário. Nenhum gate aberto foi aprovado e PR08 não começou. Implementação07 ainda sem commit de aceite.

Retomada após confirmação de aba visível: recuperadas imagens do catálogo, histórico e detalhe integrado, fim da coleção100, editor em seis dimensões e avulso/orçamento em320/390/1280. Quatro PNGs são conversões sem perda dos JPEGs originais. Cobertura em `evidence/pr07/coverage.json`; nenhuma gravação remota adicional nesta retomada. Inspecionados detalhe integrado e erro monetário320.

A gravação voltou a falhar e capturas individuais também deixaram de funcionar. O manifesto `recording-failed.json` contém apenas1 frame e erro explícito; não há vídeo aprovado07. Confirmação/conclusão ainda precisam de evidência visual. Solicitada decisão sobre manter gate ou adiá-lo formalmente ao PR12, sem presumir autorização. PR08 permanece pendente.

Rollback07: antes do commit, retirar somente os arquivos/deltas listados após revisão, preservando preexistentes; depois, reverter commit07 antes dos dependentes. Os registros de teste permanecem identificados na casa isolada; rollback de UI não apaga dados nem executa operações de banco.

## Próximas unidades e pausa

PR08 catálogo; PR09 histórico; PR10 casas/pessoas; PR11 auth/conta. Avanço somente após gates da unidade anterior. Ao concluir Bloco3, parar e aguardar autorização específica do Bloco4 (PR12–13). Blocos4–5 seguem não autorizados.


## Decisão posterior sobre o PR07

Usuário autorizou explicitamente adiar o vídeo e as capturas restantes do PR07 para o PR12 e prosseguir no Bloco3. PR07 fechado localmente com156 testes/lint/typecheck/build/integração aprovados e essa ressalva documental. Evidências não realizadas continuam pendentes; autorização não abrange adiamento dos próximos PRs nem início do Bloco4. PR08 inicia catálogo e busca local, com commit separado.
