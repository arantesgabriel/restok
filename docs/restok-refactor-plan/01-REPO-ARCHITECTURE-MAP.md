# Mapa da arquitetura real

28/10/2026 · OBSERVADO-C salvo indicação contrária. Paths relativos à raiz `C:/Fontes/restok`. Destinos novos citados em outros documentos são propostas e não existem nesta rodada.

## Stack e ferramentas

| Área | Evidência real | Implicação |
|---|---|---|
| Framework | `package.json`, lock e instalação: Next 16.4.3, React 19.2.8; App Router; `next.config.ts` com StrictMode | Não é a stack HTML/JS da prévia. Não propor migração de framework |
| TypeScript | Instalação 5.9.3; `tsconfig.json`, alias `@/`; typecheck com erro de config do Vitest | Estabilizar separadamente antes da reconstrução |
| Estilos | Tailwind 3.4.19 instalado; `tailwind.config.ts`, `postcss.config.mjs`, Autoprefixer | Não usar sintaxe/configuração Tailwind 4 por suposição |
| UI | Componentes customizados; `lucide-react`; `clsx` declarado, `cn` próprio em `lib/utils.ts` | Não há necessidade demonstrada de Radix, shadcn ou kit novo |
| Fontes | `@font-face` Restok Geist em `app/globals.css`, WOFF2 local e OFL em `public/fonts` | Nenhuma fonte Nexa/Manrope instalada no produto |
| Dados | `@supabase/ssr` 0.6.1 e `@supabase/supabase-js` 2.112.4 instalados | Preservar SSR de sessão e fronteiras de tenant |
| Testes | Vitest 5.0.5; Testing Library; `happy-dom` via diretivas de arquivos de componente; config principal `node` | 22 arquivos / 69 testes atuais; não equivalem a E2E em navegador |
| Build | scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:supabase` | Build atual não reexecutado. Histórico de 193kB em Next 15 não é baseline atual |
| CI e catálogo | Nenhum `.github/workflows`, Storybook, Playwright config ou flag visual rastreado encontrado | Gate automatizado e harness E2E ainda precisam ser projetados, não presumidos |

## Árvore de entradas e telas

| Entrada | Renderização e componentes | Estados/contratos |
|---|---|---|
| `/` | `app/page.tsx`, Server Component; importa `app/landing.css`; `components/landing/*` | Hero, showcase, quatro etapas com demos locais, FAQ, fechamento e footer; links de login e hashes existentes |
| `/login` | `app/login/page.tsx` + client `login-form.tsx` | Login, signup, mostrar senha, lembrar email, enviar recovery, confirmação pendente, indisponível/erro/retry |
| `/reset-password` | client `app/reset-password/page.tsx` | Confirmação de senha, erro de divergência, erro de link/sessão, gravação, retorno ao app |
| `/auth/callback` | Route Handler `app/auth/callback/route.ts` | Troca code por sessão; `flow=signup/recovery`; erros; redirect sanitizado |
| `/app` | Server Component `app/app/page.tsx`; exige `auth.getUser()`; client `RestokApp` | Não existe modo de dados fictícios acessível por query flag |
| `/app#shop` | `RestokApp`: `BudgetSummary`, `CategorySection`, `ShoppingItemRow` | Compra ativa, nenhuma compra, lista vazia, filtros/busca, menus, editor, avulso, meta, conclusão |
| `/app#home` | `ProductsHome`, `ProductRow`, `ProductEditorSheet` | Ativos/inativos, categoria/A–Z, ordenação por categoria, criar/editar/ativar/desativar |
| `/app#history` | `HistoryView` | Compras concluídas ordenadas, total registrado e contagens verdadeiras, vazio |
| `/app#history/<id>` | `HistoryDetail`, `HistoryPriceComparison` | Snapshot de todos os status, preço ausente, unitário, subtotal, referência anterior àquela compra |
| Contexto sem membership | `HouseholdOnboarding` | Criar casa ou aceitar código; erro e retry de ativação; sem produtos fictícios |
| Overlay de casas | `HouseholdManager` | Select da casa ativa, criar, participantes, papéis, convites, transferir, remover, sair e impedimento de último owner |
| Overlay de perfil | `ProfileEditorSheet` dentro de `restok-app.tsx` | Editar o próprio nome, obrigatório após trim, máximo 80; erro e busy |

`AppScreen = shop | history | home` não representa quatro rotas de filesystem. Casas e pessoas é diálogo, não página independente. `setScreen`, `setHistoryDetail` e listeners `popstate/hashchange` preservam navegação do browser. Não introduzir `/compras`, `/casas` ou novo roteador sem decisão separada.

## Acoplamento de apresentação e lógica

`restok-app.tsx` define localmente Button, IconButton, Sheet, QuantityStepper, AppNavigation, BudgetSummary, StatusBadge, PreviousPrice, ShoppingItemRow, CategorySection, ItemEditorSheet, AddItemSheet, NewPurchaseSheet, BudgetEditorSheet, CompleteSheet, ConfirmFinishSheet, HistoryView, HistoryDetail, EmptyState, ToastMessage, ProductRow, ProductsHome, ProductEditorSheet e ProfileEditorSheet.

Hooks e controladores atuais: `useCategoryNameSort` (localStorage por casa), boot da sessão/casa, listeners Auth, hash/history, `visualViewport` para teclado, `requestSheetClose`, `runRemoteWrite`, `requestRemoteRevalidation`, `activateHousehold` e `refreshMemberships`. A extração proposta separa esses contratos de componentes apresentados; não implica reescrever segurança/dados.

`AccessibleDialog` usa `<dialog>.showModal()`, bloqueio de scroll, título acessível, foco inicial, Escape/backdrop e restauração de foco. `ActionMenu` usa menu/menuitem, foco inicial, setas, Home/End, Escape, Tab e clique externo. A aparência deve nascer de novo; esses contratos acessíveis são responsabilidades a preservar e testar.

## Sessão, persistência e colaboração

1. `middleware.ts` valida/renova cookies em `/app/:path*` e `/auth/:path*`; `lib/supabase/server.ts` adapta cookies no servidor; `client.ts` mantém singleton do browser.
2. `lib/auth/redirect.ts`: whitelist de paths; rejeita backslash, authority externa, escapes de separadores e controles; reconstrói queries permitidas.
3. `readCurrentProfile` em `data.ts`: consulta `profiles`; pode fazer upsert ou completar nome com metadata. **Carga não é universalmente read-only.**
4. `resolveRemoteContext`: consulta memberships autorizadas, preferência por usuário e casa. Defeito UI-013 está na distinção `undefined/null` entre boot e resolver.
5. `loadRemoteState` chama `getCategoryIds`, que pode completar categorias via upsert; depois lê produtos, listas e todos os itens das listas da casa. Não é paginação de histórico.
6. Cache `restok-state-v3:<user>:<household>` em `lib/supabase/cache.ts`; cache legado v2 é removido. Preferência `restok-active-household:<user>` é separada. Ordenação `restok-category-name-sort:<household>` não contém user; avaliar comportamento de preferência compartilhada no mesmo browser, sem confundir com vazamento de dados comprovado.
7. Estado é otimista; `runRemoteWrite` serializa por chave, controla versões, mantém operações pendentes/falhas e retry em memória. `persistList` usa RPC de lista completa; não afirmar merge fino por item ou fila durável após reload. Realtime dispara revalidação debounced, adiada enquanto há writes, e backoff até 30s para snapshot.
8. `subscribeToShoppingList` escuta listas/produtos por household e itens por lista, publica estados de conexão e remove canal no cleanup. Sem promessa de resolução automática de conflito simultâneo.
9. `activateHousehold` valida contexto e snapshot antes de trocar; limpa busca/filtro/detalhe; grava seleção. Logout bem sucedido limpa caches daquele usuário; erro mantém sessão e mensagem.

## Banco: fontes que precisam permanecer

Oito tabelas de domínio: profiles, households, household_members, household_invites, categories, products, shopping_lists e shopping_list_items; identidade em auth.users. SQL inicial permite orçamento e preço zero; preço pode ser null. `ShoppingItem.unitPrice?: number` converte null remoto para undefined, e o mapper de escrita usa `?? null`.

| Migration real | Responsabilidade observada |
|---|---|
| `20260901000000_initial_schema.sql` | Tabelas, constraints iniciais, RLS e realtime de itens |
| `20260930000000_phase0_security_hardening.sql` | Endurecimento de políticas/execução/perfil e helpers; invalida conclusões tiradas apenas do SQL inicial |
| `20260930000100_phase1_tenant_integrity.sql` | Guards de tenant e referências produto/categoria/item |
| `20260930000200_phase2_invite_schema.sql` | Estados e integridade de convite |
| `20260930000300_phase2_household_lifecycle.sql` | Criar casa, membros/convites, papéis, saída, transferência e proteções de owner |
| `20260930000400_phase5_6_reliable_shopping.sql` | RPC transacional/idempotente `create_shopping_list_with_items`, uma ativa e realtime de domínio |
| `20260930000500_shopping_item_sort_order.sql` | Ordem estável de itens e contrato atualizado da RPC |
| `20261001000000_household_member_names.sql` | `get_household_member_names` compartilha somente display names com membros autorizados, sem abrir profiles |

`data.ts` expõe RPCs de criar/aceitar/revogar convite, carregar membros/convites, mudar papel, remover, sair, transferir, criar lista e atualizar perfil. `persistItem` existe, mas os fluxos principais de edição usam `persistList`. Não remover função pública por ser pouco usada sem busca de dependências e teste.

A inspeção de migrations comprova intenção local, não o estado de schema/policies hoje no backend. A v2 registra ensaios integrados em restok-dev; não se atribui à rodada atual nem se reaplica seed.

## Ciclo e invariantes

Catálogo ativo → seleção de produtos/nome/orçamento em `NewPurchaseSheet` → `createPurchase` conclui ativa anterior → compra com `pending/purchased/already_have`, quantidade, busca/ordenação → `finishPurchase` e confirmação de gravação → histórico completo → `latestPriceFor` e `previousHistoryPrice`.

`listTotal` soma apenas comprados com preço; Já temos não soma; contagens distinguem pendentes de resolvidos. Quantidade atual é inteira e ≥1. Preços e datas usam `Intl`. Hoje `latestPriceFor` ignora zero por truthiness e o editor converte zero em undefined: correção monetária precisa atravessar edição, referência histórica e feedback, não só o campo.

## Testes e dívida verificável

`lib/utils.test.ts`: cálculos, referência de preço e ordem. `lib/supabase/cache.test.ts`: escopo/limpeza. `data.*.test.ts`: perfil, nomes e casa vazia. `lib/auth/redirect.test.ts`, `middleware.test.ts`, `app/app/page.test.tsx`: redirects/guardas. `components/restok-app.*.test.tsx`: compra, histórico, produtos, ordenação, logout, motion/teclado. `household-manager.test.tsx`: identidade e recuperação. `app/login/login-form.test.tsx`: fluxos de formulário. `components/landing/*.test.tsx`: demos locais e render sem JS. `app/page.test.tsx` e `layout.test.tsx`: destinos e viewport.

`tests/supabase/authorization.integration.ts`: oito cenários de autorização, referências de tenant, convites, ciclo de papéis, criação idempotente e ordem. Exige três contas e target descartável em localhost, recusa URL igual à pública. **Não executada**: cria registros. Seu README ainda afirma inexistência de CLI config, mas há `supabase/config.toml` no checkout; revisar texto factual futuramente.

Não há teste específico atual que demonstre boot preservando casa com duas memberships ou os P1 geométricos em browser. Asserts happy-dom não medem clipping, safe area, layout ou comportamento de leitor de tela. Plano de cobertura no documento 06.
