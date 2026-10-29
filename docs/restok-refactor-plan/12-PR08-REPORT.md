# PR08 — catálogo e busca local

> **Retomada29/10/2026:** gate visual fechado para avanço local ao PR09, conforme seção final. O texto original abaixo conserva o estado da entrega ca8a1b7; o bloqueio do navegador foi resolvido nesta retomada.

29/10/2026 · Unidade local de implementação e revisão. Estratégia vigente: executar PR por PR e parar no PR08 para conferência e autorização explícita. PR09 não iniciado.

## Resultado implementado

Catálogo recomposto com busca local por nome, limpar busca com retorno de foco, categoria/A–Z, ordem independente por categoria e produtos inativos pesquisáveis. Linhas mostram nome completo com quebra, quantidade padrão, editar e ativar/desativar. Editor com ação no footer e validação de quantidade existente. Não foi adicionado estoque ou estado “Já temos” ao catálogo.

Intenção visual: produto operacional para compras da casa; lista e busca protagonistas, densidade D7, direção Raiz & Eucalipto V3/M2, Manrope e componentes/tokens existentes. Fonte normativa: DESIGN.md e docs/design/RESTOK_DESIGN_SYSTEM_V1.md. O card de compra em andamento fica subordinado ao catálogo. Composição responsiva precisa de revisão no navegador antes de aceite visual.

## Arquivos

- Produto: `components/products/products-home.tsx`, `product-row.tsx`, `product-editor-sheet.tsx`, `use-product-view.ts`, `products.module.css`; consumidor `components/restok-app.tsx`.
- Testes novos: `components/products/products-home.test.tsx`, `components/restok-app.product-edit.test.tsx`.
- Harness: `tests/e2e/before-pr08.tsx` (snapshot do consumidor anterior no commit d9b51b2), `entry.tsx` e `fixtures.ts` (cenário catalog com nomes longos, quantidade999999 e produto inativo). Não adiciona bypass na aplicação autenticada.
- Documentação: progresso08, relatório incremental11, este relatório12 e `evidence/pr08/checkpoint.json`.

## Validação nova

- **160/160 testes em33 arquivos**, quatro casos novos desde o checkpoint07. Busca em ativos/inativos sem chamar callbacks de gravação; limpar devolve foco; ordem de categoria preservada ao alternar A–Z; resultado vazio diferente de catálogo vazio; edição de inativo mantém sua situação e snapshots da compra atual, reativação inclui os novos padrões na próxima compra sem herdar preço/status.
- Testes anteriores de reativação/foco e ordenação independente continuam aprovados. Lint, typecheck sem incremental, build Webpack e diff-check aprovados.
- Primeira versão de teste novo exigia uma propriedade unitPrice explicitamente presente com undefined; corrigido para verificar o valor ausente, sem relaxar a invariante de preço. Corrigida também opção de seletor incompatível com os tipos do Testing Library. Não houve aumento de timeout ou remoção de caso funcional.
- Primeira execução de typecheck encontrou dois arquivos gerados de `.next/dev/types` indisponíveis. A reexecução e o build passaram após esses arquivos voltarem a existir, sem alterar tsconfig ou excluir fontes do check. Warning de middleware legado herdado do Next permanece fora deste PR.
- Alterações preexistentes conferidas contra hashes iniciais; somente a reescrita automática de next-env pelo build foi restaurada aos bytes anteriores. Dependências/lockfile/seed preservados. Nenhuma instalação, migration, seed/reset ou gravação remota realizada no PR08.

## Gate visual e riscos

**Implementação pronta; aceite visual pendente, não concluído.** A ferramenta do navegador interno falha na inicialização com caminho local indisponível, antes de acessar qualquer aba. Reset e seleção da aba existente/URL3001 não recuperaram a ferramenta. O usuário informou que a aba3001 está aberta; isso não comprova a renderização da implementação08 nem restaura o acesso da automação.

Não foram produzidas capturas, vídeo com seek ou medições de overflow do PR08. Imagens dos PRs anteriores são evidências herdadas, não validação desta composição. Faltam comparação antes/depois, seis dimensões, nomes longos/quantidade extrema, edição/reativação/foco e vídeo de busca/ordenação. Não há nova aprovação de adiamento08; adiamentos04–05/07 continuam restritos a essas unidades.

Preview de fixture preparado em http://127.0.0.1:4173/app?scenario=catalog#home, com rótulo “E2E-FIXTURE · sem backend”. A solicitação de abrir o preview no Codex retornou queued; não foi contada como navegação ou inspeção aprovada. Antes em /before-pr08?scenario=long#home. O servidor4173 foi iniciado para essa revisão; o processo do usuário3001 não foi encerrado.

Riscos ainda não verificados: encaixe e ordem visual em320/390/768/1024/1280/1440; retorno de foco real após edição que tira produto da busca; nomes longos e ações em telas estreitas. DOM/component tests não substituem navegador, hardware ou leitor real.

## Rollback e próxima unidade

Reverter somente o commit local do PR08 como unidade, depois de revisar alterações posteriores. Isso restaura composição e consumidores anteriores sem apagar produtos, itens, snapshots ou preferências de ordenação. Não há rollback de banco. Não reverter commits anteriores nem alterações preexistentes do usuário.

Próximo escopo proposto: PR09, Histórico e detalhe, preservando cronologia, contagens, BRL, preço desconhecido e comparação unitária anterior à compra. **Não autorizado a iniciar na estratégia vigente.** Antes do avanço: conferir PR08, fechar o gate visual ou decidir explicitamente seu tratamento, e receber autorização específica do usuário para PR09.

## Retomada autorizada do gate visual

Usuário autorizou somente PR09, exigiu concluir primeiro o QA08, confirmou porta3001 e autorizou casa fictícia isolada com produtos. Casa criada: `QA PR08 visual 2026-10-29`, ID `619c5f67-0d98-467b-90c1-8a7dbd283d3f`. Cinco produtos fictícios; nomes longos, quantidade999999; Sabão desativado, editado para quantidade3 e reativado. Catálogo confirmado após reload. Sem novas compras, convites/papéis, migrations ou alteração de casa preexistente.

Autorização adicional restrita:4173 somente para comparação anterior sem backend. Fixture `catalog-pr08-compare` reproduz esses cinco produtos no snapshot anterior d9b51b2. Casa/perfil ilustrativos diferentes, IDs próprios, nenhum acesso remoto. Testes posteriores ficaram na aplicação real3001.

Evidências novas em `evidence/pr08/retomada`:

- Seis dimensões de catálogo/editor, primeira dobra, nomes longos, estado inativo, busca vazia e reload. `final-geometry.json`, `before-geometry.json` e `editor-geometry.json`: sem overflow horizontal, quantidade legível, footer do editor alcançável nas seis dimensões. DPR1 no app e~0,90 na fixture; zoom preservado. Arredondamento de1px no antes768/1024. Dimensões raster da API diferem das métricas CSS, registradas separadamente; sem alegação pixel-perfect. Capturas `*-full*` e intermediárias são diagnósticas, não prova de encaixe, pois a API full-page altera enquadramento. Preferir viewport `*-final-top`, `320-stable-long`, `*-before-top`, `*-before-long`, `320-native-before` e editor.
- Escape devolveu foco a Editar; limpar busca ao campo; desativar à seção de inativos; salvar inativo ao botão Editar com nome novo; reativar ao botão Desativar do mesmo produto. Busca/ordenação/editor/Escape filmados no navegador interno.
- `interaction.webm`:85 aquisições contínuas reais/~4,5s, mediana31ms/máximo80ms, container25fps com retenção do último quadro, sem interpolação. Cinco seeks40ms, MAE<1,32, aprovados em `media-checks.json`. Sem alegação de timing de motion ou hardware. JPEGs originais preservados; PNGs são conversões sem nova aquisição.
- Reexecução nova de risco:6/6 testes em4 arquivos de produtos/busca/ordem/snapshots/seleção seguinte aprovados. Suite160/160/lint/typecheck/build acima continua evidência herdada da implementação08, não reexecução desta retomada.

Inspeção focal de antes/depois320/1440, editor320 e inativo390: nome longo hoje usa a largura da linha e ações embaixo no mobile; antes era comprimido ao lado dos controles. Nenhum defeito novo demonstrado que exija mudança de código08. Gate08 encerrado para avanço local autorizado ao PR09; não equivale a aceite global de release, reader, hardware ou performance de campo. PR10 continua não autorizado. Dados da casa de QA preservados para rastreabilidade; rollback de UI não os apaga.
