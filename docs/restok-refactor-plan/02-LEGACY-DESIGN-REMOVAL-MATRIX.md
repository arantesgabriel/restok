# Matriz de substituição integral do design legado

28/10/2026 · **Nenhuma ação desta matriz foi executada.** Origem: inventário do checkout, imports e seletores lidos nesta rodada. Paths relativos a `C:/Fontes/restok`. Novo destino é proposta. Revisar os alvos exatos antes da implementação aprovada.

## Regra de separação

Reescrever do zero significa novos contratos visuais, tokens, documentação, composição e motion, sem reaproveitar valores/cascata por inércia. Não significa destruir domínio, isolamento de tenant, SQL, contratos acessíveis ou testes úteis. Arquivo histórico preservado não pode continuar autoridade ativa de design. Adicionar aviso de supersessão futuramente, manter evidência original e não reescrever resultado de teste passado.

Risco A = alcance global/negócio, M = múltiplos consumidores, B = localizado. Validação: **G** checks de código, **V** comparação renderizada, **F** regressão funcional, **A11Y** foco/semântica, **P** privacidade/permissões. Toda linha é OBSERVADO-C quanto à origem e INFERIDO quanto à ação/destino.

## Fontes normativas, configuração e CSS

| Arquivo antigo | Responsabilidade / dependências | Novo destino | Ação futura | Risco / validação |
|---|---|---|---|---|
| `DESIGN.md` | Green pantry light, tokens antigos, fonte Geist e PNG; orientação geral | `DESIGN.md` novo + `docs/design/RESTOK_DESIGN_SYSTEM_V1.md` | Reescrever integralmente a norma visual; retirar autoridade do texto antigo | A; busca de termos/valores + aprovação |
| `PRODUCT.md` | Domínio completo + seção visual/logo com referências anteriores | Mesmo arquivo, parte factual preservada | Reescrever somente identidade/orientação para logo e referências visuais conflitantes; preservar o ciclo e limites | A; diff por seção, F/P |
| `README.md` | Setup, stack, rotas, verificação | Mesmo arquivo | Manter operacional; atualizar apenas referências de design/stack que estiverem desatualizadas | M; G e links |
| `app/globals.css` | Font-face, Tailwind, tokens RGB, reset, forms/status, foco, motion e dois blocos root; todas as rotas | `styles/tokens.css`, `base.css`, `motion.css`, CSS de componentes | Retirar implementação antiga integral após consumidores migrados; reconstruir responsabilidades acessíveis | A; V seis larguras, A11Y, busca de tokens |
| `app/ui.css` | Login, seletores `data-*` do core, rodapé fixo, resumo e breakpoints por altura | CSS dos componentes novos e shell | Substituir integralmente; retirar os overrides por seletor de estrutura e regras conflitantes | A; UI-001, 005, 011, teclado/safe area |
| `app/landing.css` | Todos os componentes públicos e demos; usa tokens globais antigos | CSS da landing reconstruída e primitivos novos | Retirar integralmente por substituição na fase 5; preparar integração semântica antes de apagar globals antigos | M; no-JS, hashes, V, F |
| `tailwind.config.ts` | Tokens antigos, pesos 700–900 fixados em 600, shadow-sheet, duração e z-index | Mesmo config, mapa semântico novo | Reescrever extensões visuais do zero; manter paths content e configuração funcional compatível | A; alpha/cores/pesos e build |
| `app/layout.tsx` | Importa globals/ui para toda aplicação; metadados, idioma e viewport | Mesmo arquivo com novos imports | Substituir imports e themeColor; preservar lang, viewportFit e comportamento testado | A; todas as rotas, `layout.test.tsx` |
| `postcss.config.mjs` | Tailwind e Autoprefixer | Mesmo arquivo | Manter por motivo técnico; não trocar versão major em redesign | B; build |
| `package.json`, `package-lock.json` | Dependências e scripts com alterações prévias do usuário | Mesmos arquivos | Preservar; ajuste de tooling isolado só em PR aprovado; sem biblioteca visual por inércia | A; diff, checks |
| `vitest.config.ts`, `vitest.supabase.config.ts` | Test runner e integração separada | Mesmos arquivos | Preservar separação; tratar erro TS2769 no PR de baseline | M; 69 testes + typecheck |
| `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `eslint.config.mjs` | Config técnica, parte já alterada antes desta rodada | Mesmos arquivos | Manter; mudanças necessárias devem ser independentes da identidade | M; checks |

Não foram encontrados `AGENTS.md` no repo/ancestrais consultados, `.agents`, `.codex` locais, `context.md`, `design.md` alternativo, tema de biblioteca ou CSS Modules ativos adicionais. Não criar nem apagar instruções presumidas. Se aparecerem em outra branch, inventariar seções visuais separadamente de segurança/ferramentas/domínio e obter revisão dos alvos; não excluir arquivo inteiro.

## Core, auth e componentes compartilhados

| Arquivo antigo | Responsabilidade atual / dependências | Novo destino | Ação futura | Risco / validação |
|---|---|---|---|---|
| `components/restok-app.tsx` | UI + estado + filas + contextos + sheets + hashes | `components/app/*`, `shopping/*`, `products/*`, `history/*`, `ui/*` | Reconstruir JSX/classes do zero por tela; extrair somente contratos de dados/controladores com testes; aposentar as funções visuais locais ao migrar último consumidor | A; suíte completa, UI-001/013, dados/F/P |
| `components/household-manager.tsx` | Membros, papéis, convites, casa ativa, confirmação; Tailwind inline | `components/households/*` | Reconstruir apresentação; manter RPCs, checks de identidade, limites e confirmações | A; UI-002, roles, nomes, retry/P |
| `components/household-onboarding.tsx` | Criar/aceitar/ativar casa, retry | Mesmo papel em `components/households/*` | Reescrever visual, preservar estados e ausência de seed fictício | A; F/P e vazio |
| `components/accessible-dialog.tsx` | Dialog nativo, foco inicial/retorno, Escape, scroll lock | Wrapper acessível existente ou novo primitivo | Manter contrato e reconstruir interface visual; eventual mudança estrutural com testes de teclado | A; A11Y, múltiplas aberturas e cleanup |
| `components/action-menu.tsx` | Teclado, foco e apresentação hardcoded | `components/ui/action-menu.tsx` | Reescrever aparência e API de variantes; preservar comportamento acessível | M; setas/Home/End/Tab/Escape |
| `components/brand-mark.tsx` | Next Image para PNG; todas as páginas | Componente de marca com asset aprovado | Substituir fonte raster pelo master validado; preservar alt/dimensões e assinatura | M; V pequeno/monocromático/CLS |
| `app/login/page.tsx` | Composição de auth | Mesmo arquivo | Reconstruir composição mínima sem mudar navegação da conta | M; SSR/G/V |
| `app/login/login-form.tsx` | Formulário, lembrar email, signup/login/recovery + classes | Mesmo controlador + `components/auth/*` e UI novos | Reescrever camada visual/copy de conta individual; preservar handlers, autocomplete e erros | A; testes login, loading, focus |
| `app/reset-password/page.tsx` | Form e updateUser de senha | Mesmo fluxo com primitivos novos | Reconstruir visual; preservar validação e retorno | A; mailbox/manual autorizada, erro, guardas |
| `app/app/page.tsx` | Guarda de sessão no servidor | Mesmo arquivo | Manter por motivo de segurança; apenas alterar import do shell quando necessário | A; guard tests/P |
| `app/auth/callback/route.ts`, `middleware.ts` | Sessão/redirect/cookies | Mesmos arquivos | Manter por motivo não visual | A; Auth e redirects/P |
| `lib/types.ts` | Categorias, estados e contratos de casa/lista/item | Mesmo arquivo | Preservar taxonomia e formas de dados; não importar tipos da demo | A; F |
| `lib/utils.ts` | Cálculos, preços anteriores, ordem, Intl, helper de classes e glifos | Cálculo preservado, parser novo em `lib/money.ts`, ícones nos componentes | Preservar regras; corrigir zero em PR dedicado; retirar `categoryIcon` apenas se sem consumidores e testes aprovados | A; totais/histórico/ordem |
| `lib/supabase/data.ts` | Dados/RPCs, nullable price, contexto | Mesmo serviço | Manter; UI-013 é correção funcional explícita; não reescrever serviço por estética | A; memberships/cache/P |
| `lib/supabase/cache.ts`, `realtime.ts`, `client.ts`, `server.ts`, `config.ts` | Isolamento, assinaturas, sessão e config | Mesmos arquivos | Manter; não confundir nome de cache LEGACY com regra visual a apagar | A; logout/cache/reconexão |
| `lib/auth/redirect.ts` | Allowlist de redirect | Mesmo arquivo | Manter integralmente por segurança | A; testes de caminhos maliciosos |

## Landing: todos os arquivos de produção

Todos dependem de `app/landing.css`, tokens compartilhados e, em alguns casos, `lib/types.ts`/`lib/utils.ts`. Reconstrução composta apenas após o core estabilizado. Não transportar selectors e wrappers decorativos antigos para o sistema novo.

| Arquivo | Responsabilidade → ação/destino | Risco / validação |
|---|---|---|
| `app/page.tsx` | Orquestra seções → reescrever composição preservando IDs/destinos | M; âncoras/no-JS |
| `components/landing/landing-header.tsx` | Navegação e menu → reconstruir com navegação nova | M; foco/mobile |
| `components/landing/landing-hero.tsx` | Mensagem e CTAs → reconstruir hierarquia com conteúdo factual | M; primeira dobra/link |
| `components/landing/landing-footer.tsx` | Closing e footer → reconstruir com tokens novos | B; links/contraste |
| `components/landing/landing-faq.tsx` | FAQ → reconstruir apresentação preservando fatos | B; details/no-JS |
| `components/landing/journey-section.tsx` | Estrutura repetida de etapa → reconstruir segundo função | M; IDs/ordem |
| `components/landing/journey-navigation.tsx` | Navegação de etapas → reconstruir sem duplicar nav do core | M; hashes/foco |
| `components/landing/product-demos.tsx` | Showcase e histórico → reconstruir com componentes reais apresentacionais | M; dados rotulados/no-JS |
| `components/landing/planning-demo.tsx` | Seleção fictícia → manter interação e reconstruir visual | M; seleção/reset |
| `components/landing/purchase-demo.tsx` | Compra fictícia local → manter semântica de cálculo e reconstruir | M; preço/status/reset |
| `components/landing/sharing-demo.tsx` | Colaboração simulada → reconstruir e manter rótulo de exemplo | M; zero RPC real |
| `components/landing/demo-controls.tsx` | Controles das demos → substituir por primitivos novos | M; teclado/nome |
| `components/landing/demo-row.tsx` | Linha ilustrativa → substituir por apresentação compartilhada sem importar estado de produção | M; status/preço |
| `components/landing/demo-data.ts` | Fixtures públicas e cálculo → preservar dados factuais coerentes; não usar como catálogo real | B; testes SSR/cálculos |

## Documentação antiga, prompts e evidências

| Arquivo | Responsabilidade / conflito | Ação proposta / destino | Risco / validação |
|---|---|---|---|
| `docs/design/LANDING_PAGE_REFACTOR_PLAN.md` | Plano antigo de marketing | Preservar histórico, retirar autoridade visual via aviso/link para fase 5 nova | M; revisão de seções |
| `docs/design/phase-2-visual-system/VISUAL_SYSTEM.md` | Norma visual anterior | Arquivar como histórico não normativo; nova norma nasce do zero | M; busca de referências ativas |
| `refactor-login-screen/FASE-0-DISCOVERY.md` | Descoberta longa, instruções e planos antigos; menciona serif/Avenir/showcase e stack já divergente | Preservar fatos históricos, remover de orientação ativa; não reintroduzir backlog mostrado como produto entregue | M; links/aviso de supersessão |
| `docs/audit/RESTOK_AUDIT.md` | Diagnóstico histórico geral | Preservar imutabilidade dos achados/resultados; apontar fonte atual separadamente | B; cronologia |
| `docs/audit/AUTH_AND_MULTI_TENANCY.md` | Riscos históricos, alguns remediados no SQL posterior | Preservar histórico de segurança; não apagar como legado visual nem afirmar P0 atual sem teste | A; comparação com migrations |
| `docs/audit/MOBILE_FIRST_AUDIT.md` | Auditoria histórica mobile | Preservar evidências; superseder apenas recomendações visuais | B; IDs |
| `docs/audit/REMEDIATION_PLAN.md` | Plano misto de negócio/segurança/visual | Preservar decisões não visuais; novo roadmap substitui apenas reconstrução visual | A; rastreabilidade |
| `docs/audit/PHASE2_DECISIONS.md` | Casas/papéis/convites e privacidade | Manter como decisão de produto, sem alterar por redesign | A; F/P |
| `docs/audit/PHASE_7_PERFORMANCE_BASELINE.md` | Build histórico Next 15 e 193kB | Manter datado; medir baseline atual antes de novos limites | M; sem confundir datas |
| `docs/audit/ui-phase-1-2026-09-30/AUDITORIA.md` | Relatório e direção antigos | Preservar prova, superseder norma visual | B; IDs/medias |
| `docs/audit/validation-visual-system-2026-09-30/VALIDACAO.md` | Validação histórica | Preservar resultados e limitações, não editar para alegar aprovação nova | B; integridade |
| `docs/audit/implementation-2026-10-01/IMPLEMENTACAO.md` | Entrega histórica | Preservar registro, não reaplicar receitas anteriores | B; contexto |
| Demais JSON/TXT/JPG/PNG de `docs/audit/*`, `docs/design/phase-2-visual-system/*` | Evidências/saídas de ferramenta, não CSS ativo | Manter; referências antigas permitidas em arquivos históricos identificados | B; hashes/links |

## Assets e fontes

`public/brand/restok-logo.png` é o único logo consumido por `BrandMark`; `brand/**` contém 12 variações raster, 12 páginas de guia raster e README. Inventário nominal no apêndice. Não há master SVG de marca. `public/landing/pantry-leaves.svg` é ilustração; sua presença não comprova adequação à identidade nova.

Retirar do bundle/consumidores a fonte Geist e assets visuais conflitantes após substituição legal e verificada. Manter arquivos de licença enquanto qualquer cópia do asset permanecer distribuída. Assets históricos em `brand` podem ser arquivados fora do caminho de produção, identificados como superseded; remoção física exige alvo aprovado e checagem de dependências, não exclusão cega.

## Arquivos explicitamente preservados

Oito migrations listadas no documento 01, `supabase/config.toml`, `.env.example`, `.gitignore`, `supabase/.gitignore`, `tests/fixtures/shopping.ts`, `tests/support/account.ts`, todos os testes `.test.ts/.tsx`, `tests/supabase/authorization.integration.ts` e seu README. Motivo: operação, segurança, fixtures ou contratos funcionais. Não remover ou enfraquecer asserções para acomodar aparência. Atualizar somente seletores/nomes que mudarem legitimamente, adicionando os casos faltantes antes de substituir componentes.

`supabase/seed.sql` e `.env` são entradas locais prévias; não ler credenciais para colocar em documentos, não publicar e não alterar. `.git`, `.next` e `node_modules` não são alvos do rebuild de design.

## Checklist de encerramento futuro

- [ ] Cada consumidor antigo tem linha desta matriz, PR de substituição e prova de regressão.
- [ ] Novos tokens não definem aliases `--primary`, `--sage`, `--terracotta`, `--color-lime`, `--color-blue` nem paletas rejeitadas.
- [ ] `globals.css`/`ui.css` antigos não são importados; `landing.css` antigo foi substituído integralmente após fase 5.
- [ ] Classes e valores antigos não aparecem em código ativo; ocorrências em histórico/licenças estão explicitamente separadas.
- [ ] Não há `!important` para encobrir colisão de tema. Exceção acessível tecnicamente necessária exige registro e inspeção, não serve como ponte visual.
- [ ] Nenhum peso 700/800 foi remapeado silenciosamente para 600; nenhuma fonte sem licença.
- [ ] Não há CSS de demo, `Trigo`, `Pêssego`, editorial serif, lime/blue aliases ou segundo tema residual em runtime.
- [ ] Ausência de import/uso confirmada antes de excluir cada asset/classe/helper.
- [ ] Busca de estilos inline diferencia dado dinâmico legítimo (progresso calculado) de constante visual sem token.
- [ ] Domínio/Auth/cache/RLS/RPC/testes e fatos de PRODUCT continuam íntegros.

Buscas propostas para o gate, não executam exclusões:

```powershell
rg -n --glob '*.{css,ts,tsx}' 'primary-strong|terracotta|--sage|--primary|Restok Geist|--color-lime|--color-blue|#FAFAF7|#174C3C|#B8D8C7' app components styles tailwind.config.ts
rg -n --glob '*.{css,ts,tsx}' '!important|transition-all|backdrop-blur|font-family|rounded-\[' app components styles
rg -n 'Green pantry light|Despensa clara|Avenir|Georgia|serif|Trigo|Pêssego' DESIGN.md PRODUCT.md app components styles
rg -n 'globals.css|ui.css|landing.css|geist-latin|restok-logo.png' app components styles
```

Esperado: zero referências conflitantes em código ativo, ou exceção não visual/dado dinâmico individualmente justificada. Resultado de `rg` sozinho não comprova ausência visual nem substitui screenshots.

## Apêndice: assets existentes por arquivo

Inventário nominal gerado nesta rodada. Ação comum: validar uso/licença/identidade e substituir asset ativo; preservar referência histórica identificada. Não foi feita perícia visual das 12 páginas raster de guideline.

| Arquivo existente | Papel / ação proposta |
|---|---|
| brand/01_logo_principal_transparente/restok_logo_variacao_01_verde_profundo_ponto_verde.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/01_logo_principal_transparente/restok_logo_variacao_02_verde_profundo_ponto_verde_nevoa.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/01_logo_principal_transparente/restok_logo_variacao_03_offwhite_ponto_verde_nevoa.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/01_logo_principal_transparente/restok_logo_variacao_04_verde_nevoa_ponto_verde_profundo.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/02_icone_com_fundo/restok_icone_fundo_variacao_01_verde_profundo.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/02_icone_com_fundo/restok_icone_fundo_variacao_02_offwhite.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/02_icone_com_fundo/restok_icone_fundo_variacao_03_preto_suave.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/02_icone_com_fundo/restok_icone_fundo_variacao_04_verde_nevoa.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/03_icone_sem_fundo/restok_icone_sem_fundo_variacao_01_verde_profundo_ponto_verde_nevoa.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/03_icone_sem_fundo/restok_icone_sem_fundo_variacao_02_offwhite_ponto_verde_nevoa.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/03_icone_sem_fundo/restok_icone_sem_fundo_variacao_03_verde_nevoa_ponto_verde_profundo.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/03_icone_sem_fundo/restok_icone_sem_fundo_variacao_04_preto_suave_ponto_verde.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/README.txt | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_01_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_02_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_03_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_04_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_05_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_06_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_07_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_08_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_09_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_10_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_11_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| brand/visual-id/Restok_Visual_Identity_Guidelines_Page_12_HQ.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| public/brand/restok-logo.png | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
| public/fonts/geist-latin.woff2 | Fonte/licença antiga: substituir distribuição após fonte nova legal; preservar obrigação de licença. |
| public/fonts/Geist-OFL.txt | Fonte/licença antiga: substituir distribuição após fonte nova legal; preservar obrigação de licença. |
| public/fonts/README.md | Fonte/licença antiga: substituir distribuição após fonte nova legal; preservar obrigação de licença. |
| public/landing/pantry-leaves.svg | Asset/guia: validar uso; substituir consumidor ativo e arquivar histórico superseded, sem exclusão nesta rodada. |
