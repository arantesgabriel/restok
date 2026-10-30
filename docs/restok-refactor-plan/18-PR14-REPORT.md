# PR14: landing e demos públicas

29/10/2026 · America/Sao_Paulo · Base a343059. Usuário autorizou “inicie pr14” e indicou usar a porta3000. Unidade local separada; sem push, PR remoto, merge, deploy, dependência nova ou banco. PR15 não iniciado.

## Resultado

Landing reconstruída, incluindo seus componentes, em CSS Modules novos. O hero reúne a proposta da lista da casa e uma compra ilustrativa com valores reais da fixture, sem folhas decorativas, moldura de navegador, filtros ou navegação falsos. Seções explicam catálogo, convite, compra e histórico, com ações úteis e exemplos identificados. Mantidos links de entrada para/login, skip link, IDs/hashes públicos anteriores e uma única h1.

Direção: público doméstico, registro prático e acolhedor, Raiz & Eucalipto V3/M2/D7. Fonte Manrope, tokens e primitivos existentes; nenhuma segunda paleta, asset externo ou motion decorativo. Assinatura PNG transitória preservada; master de marca continua gate próprio. Composição governada por tipografia, divisores e espaço, com o gasto verde associado ao dado da compra. Não há depoimentos, métricas, gratuidade ou funcionalidades não comprovadas.

Menu mobile conserva details/summary nativos e recebe Escape com retorno de foco e fechamento ao escolher âncora. FAQ e histórico são disclosures nativos. Dados, histórico, preço anterior e navegação permanecem no HTML do servidor. Controles interativos começam desabilitados no SSR e habilitam após hidratação; noscript explica esse limite, sem inventar uma sessão ou gravar dados.

Demos usam Button, Checkbox, Select e MoneyField. Planejamento seleciona/reinicia localmente; convite apresenta duas vistas ilustrativas da mesma atualização, explicitando simulação. Compra mantém os três estados, comprado sem preço, preço0 conhecido e total por quantidade×preço. Parser monetário existente aceita BRL, conserva o último valor válido durante erro e reseta campos/erros junto dos itens. Excedente recebe valor positivo e texto “acima do orçamento”, em vez de saldo negativo chamado disponível. Preço e quantidade do exemplo não alteram catálogo ou compras reais.

Na inspeção320, valores extremos inicialmente quebravam no meio do número. Ajustados para linha própria e20px no total extremo, conservando32px no total comum e16px nos inputs. TotalR$10.000.000.012,39 passou a uma linha em todas as seis dimensões; nenhum valor/cálculo foi alterado. Linhas grandes também ganham total em linha própria. Conteúdo de summary foi ajustado para phrasing válido, preservando a operação nativa por teclado.

## Arquivos e consumidores

- `app/page.tsx` recompõe a página e importa os componentes públicos. `app/landing.css` retirado; cópia histórica em `tests/e2e/legacy/before-pr14-landing.css`, sem consumidor de produção.
- `components/landing/site.module.css`, `demos.module.css`, `site-link.tsx`, `mobile-navigation.tsx`; reconstruídos hero/header/footer/FAQ, navegação/seção de etapas, showcase/histórico, seleção/compra/compartilhamento, linha e reset. `demo-data.ts` e funções de domínio não foram alterados.
- Assertions novas em `app/page.test.tsx`, `purchase-demo.test.tsx`, `public-interactions.test.tsx`; teste de resolução de variáveis públicas em `tests/styles/global-migration.test.ts` aponta para os novos módulos.
- Nenhum novo consumidor das classes landing-* antigas. Auditoria do CSS emitido confirma ausência delas e da paleta antiga. DESIGN.md registra a composição vigente. Fontes/assets antigos ainda existentes, mas sem consumidor novo, ficam para limpeza coordenada15; não se apagaram licenças ou evidências históricas.

## Checks novos

**228/228 testes em39 arquivos** passaram; cinco casos adicionais sobre a base223. Recorte final após o ajuste semântico dos summaries:13/13 em7 arquivos. Lint, typecheck sem incremental, build Webpack final e diff-check aprovados. Avisos preexistentes do middleware Next e configuração CommonJS do Vitest permanecem.

Cobertura adicional:0 conhecido/sem preço, BRL agrupado, erro que não corrompe o total, reset, excedente positivo; menu por Escape/âncora; duas vistas do convite e seleção sem fetch/storage; destinos e IDs únicos/resolvíveis; FAQ/histórico/noscript presentes no SSR e conteúdo válido em summary. Nenhuma guarda, teste, timeout ou contrato de dados foi relaxado.

HTML estático de produção também inspecionado (`.next/server/app/index.html`): uma h1, hashes resolvidos, preço12,40 e histórico/FAQ presentes,13 details nativos, cinco fieldsets desabilitados e três noscript. Esse ensaio e SSR unitário **não são uma sessão de navegador com JavaScript desabilitado**; não se declara esse ensaio manual realizado.

Package, lock, tsconfig, seed e next-env conservam os hashes anteriores. Next-env restaurado após build aos bytes capturados. Nenhuma mudança em lib, supabase, middleware ou callback/auth. Não se usaram credenciais, sessões de teste, migrations ou dados remotos no PR14.

## QA novo no navegador interno

Ferramenta recuperada. Primeira navegação3001 abriu outro projeto, sem interação posterior ou screenshot daquele conteúdo; usuário indicou3000, onde o Restok já estava ativo. Processos/serviços preservados; nenhum servidor ou browser externo iniciado. QA usou somente o navegador interno e a página pública.

| Evidência em evidence/pr14 | Cobertura |
| --- | --- |
| `*-before-top.jpg`, `before-geometry.json` | Antes novo em320×640,390×844,768×1024,1024×768,1280×800,1440×900, scroll0. Mesmos dados ilustrativos default do depois. |
| `*-after-top.jpg`, `after-top-geometry.json` | Seis dimensões CSS exatas, sem overflow e CTA inteiro na primeira dobra: bottom396,80 em320×640;635,02 em1440×900. |
| `*-large-budget.jpg`, `stress-geometry.json` | Total extremo final em seis dimensões sem overflow; fonte20px, altura30px igual à line-height30px. Usar estes arquivos finais; first-pass/check são diagnósticos. |
| `390-planning-selected.jpg`, `390-invite-example.jpg`, `1440-shared-update.jpg` | Quatro produtos selecionados; convite local; Pão comprado nas duas vistas. Isso não é Realtime ou membership real. |
| `390-purchased-unpriced.jpg`, `390-known-zero.jpg`, `390-price-error.jpg` | Ausência explícita mantém comprado/total parcial;0 é conhecido; erro não muda o último total válido. |
| `390-history-expanded.jpg`, `390-history-keyboard.jpg`, `390-faq-expanded.jpg`, `keyboard.json` | Histórico e FAQ abertos, Enter no summary final, Escape devolve ao summary do menu, âncora fecha menu, skip foca main#conteudo. |
| `320-footer.jpg`, `footer-geometry.json` | Fim alcançado por Ctrl+End, footer bottom640,23 em altura640 (arredondamento inferior a1px). Sem dock fixo da landing. |
| `320/1280-login-smoke.jpg`, `auth-smoke.json` | CTA real abriu/login; dois viewports sem overflow, nenhum formulário submetido. Não revalida auth/reader/core dos PRs anteriores. |
| `390-final-top.jpg/png` | Composição final; PNG é conversão do JPEG, sem nova aquisição ou alteração de pixels. |
| `interaction.webm`, `recording.json`, `frames/*`, `media-checks.json` |120 aquisições sequenciais reais/~5,2s do ciclo convite/entrada/Pão comprado/reset. Mediana39ms, máximo42ms, container25fps sem interpolação. Cinco seeks40ms, MAE≤1,001. Não mede latência de motion nem simula colaboração remota real. |

Inspeção visual focal: primeira dobra320/390/1440, total extremo320 antes/depois da correção, compartilhamento1440, preço inválido390. Todas as medições de overflow foram DOM; não se declara inspeção humana de cada quadro. Viewports medidos em CSS, DPR1. O backend de captura pode omitir scrollbar/bordas: o vídeo devolveu375×812 pixels para CSS390×844. `image-dimensions.json` registra dimensões dos originais; nenhuma imagem foi esticada para fazer corresponder nomes de arquivo às medidas CSS. Geometria é certificada pelos JSONs, sem confundir pixel de aquisição com viewport ou zoom nativo.

## Custo e limites

`before-assets.json` usa o build PR13 já produzido nesta sessão; `after-assets.json` o build final14. Pelo helper de manifestos, grafo JS/CSS da rota pública:77809→98514 bytes raw;23043→28213 gzip. Todos os JS/CSS emitidos:1380083→1383212 raw;414737→416251 gzip. Crescimento total de1514 bytes gzip, sem biblioteca/asset novo; o grafo público passa a referenciar primitivos compartilhados. Não são requisições observadas de primeiro acesso, FPS ou CWV de campo; não somar assets compartilhados por rota.

Leitor real, zoom nativo, dispositivos, outras engines, auditoria global de acessibilidade e sessão manual com JS desabilitado não realizados. Gates/evidências adiados04–05/07 e transversais12–13 continuam abertos; mídia14 não foi reatribuída a eles. Recuperação do navegador não significa fechamento automático desses ensaios. Release/limpeza final seguem PR15, não autorizado por este pedido.

## Rollback e parada

Reverter a unidade14 inteira: composição, módulos públicos, consumidores, CSS e testes, voltando ao estado íntegro13. Não restaurar paleta/global anterior ao PR13 sobre o core novo. Preservar registros, IDs, licenças, evidências e alterações preexistentes. Nenhum rollback de banco necessário.

**PR14 implementado e validado localmente para revisão. Não iniciar PR15 sem autorização específica.**
