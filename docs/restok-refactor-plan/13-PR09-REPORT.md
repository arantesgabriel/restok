# PR09: Histórico e detalhe

29/10/2026 · America/Sao_Paulo · Unidade local de implementação/revisão. Somente PR09 autorizado, após conclusão do gate08 em `eb34201`. Sem push, PR remoto, merge ou deploy.

## Resultado

Histórico reconstruído em lista com agrupamento mensal e cronologia decrescente. Nome, data, contagens e total registrado continuam acessíveis em cada compra concluída. No mobile, total e ações não comprimem o nome. Detalhe distingue subtotal, preço unitário, ausência de preço e todos os estados; nomes e números grandes podem quebrar sem overflow. Resumo usa divisores e tipografia do sistema, sem cartões financeiros decorativos.

Comparação usa preço unitário da compra concluída estritamente anterior, excluindo a própria lista, datas iguais, futuras e ativas. Referência0 recebe diferença absoluta sem percentual inválido. `latestPriceFor`, persistência, filas, schema e snapshots não foram alterados. Navegação continua em `#history`/`#history/<id>`, com foco no título ao detalhar e na compra ao voltar. Um hash de lista ativa não a apresenta como registro histórico.

Arquivos de produto: `components/history/{history-model.ts,history-view.tsx,history-detail.tsx,history-price-comparison.tsx,history.module.css}` e consumidor `components/restok-app.tsx`. Testes: `components/history/history.test.tsx` e `components/restok-app.history.test.tsx`. Legado restante de casas/auth/globais/landing permanece nos PRs10–14; não foi antecipado.

Intenção visual: superfície operacional de consulta para compras domésticas, Raiz & Eucalipto V3/M2/D7, fonte Manrope local, tokens e primitivos existentes. Referências: `DESIGN.md` e `docs/design/RESTOK_DESIGN_SYSTEM_V1.md`. Agrupamento mensal é apresentação; modelo de dados não mudou.

## Verificação nova

- **175/175 testes em34 arquivos**,15 casos adicionais desde PR08. Histórico16/16 em2 arquivos: zero/100 compras, todos os status,0/sem preço, datas equivalentes com offsets diferentes, referência estritamente anterior, fallback de startedAt, mesmo/mais/menos por unidade, imutabilidade e snapshot após editar/desativar catálogo.
- Hash direto, retorno de foco, popstate/hashchange e exclusão de detalhe ativo cobertos em componente. Browser back/forward e retorno explícito exercitados na aplicação real.
- Lint, typecheck sem incremental e build Webpack final aprovados. Primeira execução do typecheck identificou `exact` em opções do Testing Library; removido porque o nome string já usa correspondência exata. Falhas intermediárias dos testes novos corrigidas em seletores duplicados, evento hashchange e NBSP do BRL; nenhum timeout ou contrato relaxado. Build final executado após o ajuste CSS de quebra balanceada do título.
- Alterações preexistentes de package/lock/tsconfig/seed preservadas. Package tem hashC302…FD2B, correspondente ao estado anterior mais o script Webpack de PR01. Next-env reescrito automaticamente foi restaurado somente com SHA256 exatamente igual ao pré-buildB8B3…1000. Nenhuma dependência instalada ou migration/seed/reset executado.

## Dados e evidências

Usuário autorizou explicitamente até quatro compras fictícias na casa isolada `QA PR08 visual 2026-10-29`, ID `619c5f67-0d98-467b-90c1-8a7dbd283d3f`. Criadas quatro, três concluídas e uma ativa vazia. A principal (`312d37fe-064c-4309-afc8-9fcf41c7a9fd`) tem3 comprados/1 já tínhamos/1 pendente, incluindo1 comprado sem preço, quantidade999999 e totalR$1.234.566.655.447,11. A compra anterior registra preço unitário0. Dados confirmados por reload/hash direto; manifesto em `evidence/pr09/integrated-house.json`. Nenhum registro de casa preexistente foi editado e nenhum dado de QA foi apagado.

Toda a mídia09 veio do navegador interno na porta3001. A autorização4173 ficou restrita à comparação anterior08; não foi usada para09.

| Evidência | Cobertura e limite |
| --- | --- |
| `before-geometry.json`, `*-before-list/detail.jpg` | Antes real892×790. Os nomes nominais de seis dimensões foram pedidos de override ignorados pela aba antiga; não comprovam seis viewports. Detalhe anterior apresentou55px de overflow nessa composição extrema. |
| `892-after-list.jpg`, `892-after-detail.jpg` | Depois na largura/altura real do antes; sem overflow. Contexto e dados das mesmas compras preservados. |
| `after-geometry.json`, `*-after-list.jpg`, `*-after-detail-top/end.jpg` | Depois em seis dimensões CSS exatas, DPR1, zero overflow horizontal. Capturas de fim com End são posições intermediárias; `320-final-item.jpg` comprova o último item. |
| `320-final-item.jpg`, `390-known-zero.jpg`, `390-empty-completed.jpg` | Último item integral acima da navegação, zero conhecido e compra concluída sem itens. |
| `navigation.json`, `post-reload.json`, `reloaded-detail.txt` | Navegação, foco e persistência observados no backend através da UI; não são vídeo ou teste de RLS. |
| `interaction.webm`, `recording.json`, `media-checks.json` |100 JPEGs reais contínuos/~4,5s, mediana30ms/máximo48ms;25fps retém último quadro adquirido, sem interpolação. Cinco seeks40ms, MAE≤1,441, aprovados. Não mede latência de motion. |

JPEGs originais preservados. PNGs são conversões para entrega, sem nova aquisição. `current-after-detail.jpg` é uma captura diagnóstica da aba original; não substitui as medições finais. Inspeção focal: detalhe320, fim320 e lista1440, além das leituras DOM/medidas nas seis dimensões. Não se declara revisão humana de cada quadro.

## Limites e rollback

Comparação anterior disponível em uma dimensão real; seis dimensões finais verificadas. Integração visual tem três compras concluídas, enquanto100 compras são cobertura COMPONENT. Novo estado de zero compras testado em componente; captura vazia é anterior à criação dos dados. Hardware, leitor, zoom nativo, engines adicionais, concorrência e performance de campo permanecem nos gates transversais; não há aceite global WCAG/release. Gates adiados04–05/07 continuam no PR12, sem reatribuir suas evidências ao PR09.

Rollback: reverter somente o commit09 como unidade, após revisar dependentes, incluindo consumidores e componentes de histórico. Preservar dados, IDs, snapshots, autorizações e evidências; sem rollback de banco. Não reverter `eb34201`, PR08 ou alterações preexistentes do usuário.

**Parar para conferência do PR09. PR10 (Casas e pessoas/onboarding) exige autorização específica.**
