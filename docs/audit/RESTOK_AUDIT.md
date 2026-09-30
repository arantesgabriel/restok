# Auditoria do Restok

**Data:** 30/09/2026  
**Escopo:** diagnóstico e planejamento. Nenhuma correção de produção foi aplicada.

## Executive Summary

Restok é um MVP web em Next.js/TypeScript que oferece lista recorrente, modo mercado, histórico, orçamento, autenticação Supabase e compartilhamento por household. O caminho feliz da lista existe e o build atual é válido. O modelo de domínio ainda não chega à interface: não há onboarding de casa/membros nem seletor de household, e a tela exibe nomes de casa e perfil hardcoded.

Há uma falha **P0** confirmada por inspeção da policy: qualquer usuário autenticado pode inserir a si mesmo como membro de um `household_id` arbitrário. Como o restante da RLS usa membership como fronteira, conhecer/obter um ID permite atravessá-la e consultar ou alterar dados daquela casa. A migration também concede permissões de tabela amplas a `authenticated`; portanto a policy é a proteção decisiva e está permissiva demais. Não foi feita exploração no Supabase remoto, pois o `.env` local contém configuração Supabase e não foi identificado ambiente isolado nem contas de teste.

O principal problema mobile foi observado ao percorrer a lista demo: a barra fixa de resumo/ação e a navegação inferior cobrem o item final em viewport estreito. O usuário não consegue chegar ao fim da lista com rolagem normal. A interação de compra exige abrir editor por item, e a cópia promete que informar preço compra o item, mas salvar o item pendente com preço mantém seu status pendente.

**Contagem de findings:** P0: 1 · P1: 12 · P2: 9 · P3: 2.

## Current Architecture

| Área | Encontrado |
|---|---|
| Frontend | Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS |
| Rotas | `/` landing, `/login` login/cadastro, `/app` app client-side, `/auth/callback` OAuth/email code callback |
| Backend | Não há API de domínio própria. O browser usa Supabase JS diretamente; Server Components e middleware validam sessão. |
| Banco/Auth | Supabase Auth + PostgreSQL + RLS; uma migration inicial em `supabase/migrations/20260901000000_initial_schema.sql` |
| Sessão | `@supabase/ssr`, cookie adapter no servidor/middleware e browser client. `getUser()` valida a sessão. |
| Dados | `lib/supabase/data.ts` concentra consultas e gravações do browser. `components/restok-app.tsx` concentra navegação, estado e telas. |
| State/cache | React `useState`, Realtime para mudanças de item e snapshot global em `localStorage` (`restok-state-v2`) |
| Demo | Sem as duas variáveis Supabase, seed local em `localStorage`; com configuração, `/app` exige usuário autenticado. |
| Deploy | README documenta Vercel e configuração manual de URLs no Supabase. Infra real não foi inspecionada. |
| Testes | Vitest; somente 2 testes unitários em `lib/utils.test.ts`. Não há Playwright/E2E configurado. |

### Persistência de dados encontrada

`profiles` referencia `auth.users`; `households` guarda `created_by`; `household_members` liga usuário e casa; `household_invites` armazena token bearer; `categories`, `products` e `shopping_lists` possuem `household_id`; `shopping_list_items` referencia a lista e, opcionalmente, produto/categoria. Há RLS habilitada em todas as oito tabelas. Não existe Storage configurado na migration.

As queries partem do browser usando a chave anon pública e dependem de RLS. A migration concede `SELECT/INSERT/UPDATE/DELETE` em todas as tabelas para `authenticated`. Não encontrei `service_role` no código nem no `.env` (verificação apenas de presença, sem ler/imprimir valores); o README proíbe a chave no browser.

## Product Flow Map

1. `/` apresenta marketing e CTAs para `/login`.
2. `/login` alterna entre email/senha e cadastro de nome/email/senha; oferece redefinição, lembrar email e entrada demo.
3. Cadastro chama `supabase.auth.signUp`; se confirmação estiver habilitada, mostra instrução para confirmar email.
4. `/auth/callback` troca `code` por sessão e redireciona para `next`.
5. `/app` valida sessão no servidor; sem usuário redireciona ao login. Após isso, o componente cliente lê cache local, aceita `invite` (se presente) e carrega/cria dados remotos.
6. Compra: filtrar/pesquisar → abrir editor de item → mudar situação/quantidade/preço → salvar. “Já temos” tem ação direta na linha. O resumo fica fixo no rodapé.
7. Casa: produtos recorrentes, iniciar nova compra, editar/desativar produto e copiar link de convite.
8. Histórico: compras completadas e detalhes. Não existe gestão de household, membros, convite pendente, troca de casa, saída, remoção ou logout.

## Findings

| ID | Área | Problema | Severidade | Evidência | Impacto | Causa provável |
|---|---|---|---|---|---|---|
| AUTH-001 | RLS / multi-tenancy | Usuário autenticado pode se adicionar a qualquer casa e definir seu próprio `role` | **P0** | Migration, policy `members can add membership`, linha 152: `user_id = auth.uid() OR ...`; `is_household_member()` considera qualquer membership | Leitura, alteração e exclusão dos recursos do household alvo pelas policies de member. Quebra o limite de segurança principal. | A policy mistura fluxo de aceite com criação por owner e não exige convite ou autorização para a linha inteira. `role` não é validado. |
| AUTH-002 | Sessão / cache | Cache local usa uma única chave e não é particionado por usuário/casa | P1 | `components/restok-app.tsx:539-549, 555-557`; key `restok-state-v2` | Se conta/sessão trocar ou a carga remota falhar, itens de A podem aparecer no browser de B; stale state é exibido antes da resposta remota. | Snapshot local adotado sem namespace por `user.id`/household nem política de limpar/invalidar em logout. |
| AUTH-003 | Household / onboarding | Cadastro fala em “conta da casa”, mas cria apenas credencial; nome informado vai para metadata e não é copiado a `profiles`; primeira abertura cria “Minha casa” e seed sem confirmação de nome/ownership/membros | P1 | `app/login/page.tsx:52-58`; `lib/supabase/data.ts:17-23,40`; migration sem trigger de perfil; labels hardcoded em `components/restok-app.tsx:479,497,650,652` | Usuário não entende se cadastrou uma conta ou uma casa; perfil fica sem nome e household exibido não corresponde ao banco; falhas entre household e membership deixam registro incompleto. | Signup, profile/household setup e seed estão misturados ou ausentes no bootstrap client-side. Não há onboarding transacional. |
| AUTH-004 | Sessão | Não há logout nem troca de conta na interface; botão Perfil não tem ação | P1 | `components/restok-app.tsx:652`; busca por `signOut` não encontrou chamada. | Usuário não consegue encerrar sessão/trocar conta de forma clara em aparelho compartilhado; torna o cache cruzado mais provável. | A tela de perfil é apenas visual e auth foi implementada apenas para entrar. |
| AUTH-005 | Recuperação | Link de redefinição devolve usuário a `/login`, mas não há formulário `updateUser({password})` | P1 | `app/login/page.tsx:85-87`; `/auth/callback` apenas troca code e redireciona; login não tem modo reset | Fluxo promete recuperação, mas não oferece conclusão/troca de senha. | Callback reutilizado sem distinguir recovery de login nem estado de recuperação. |
| AUTH-006 | Redirecionamento | Validação de `next` aceita caminho iniciado com `/\`, que `URL` interpreta como host externo | P2 | `app/login/page.tsx:26-27`, `app/auth/callback/route.ts:8,11`; reprodução Node: `new URL("/\\evil.example", "https://restok.example").href` → `https://evil.example/` | Redirecionamento para página externa após autenticação; phishing e quebra da expectativa de domínio. | Sanitização por prefixo em vez de allowlist de rotas/normalização de URL. |
| AUTH-007 | Privacidade / RPC | Dados básicos de todos os perfis autenticados são legíveis por qualquer usuário logado | P2 | Migration linha 143: `USING (true)` em `profiles SELECT` | Exposição de nome/avatar de contas não relacionadas; impacto depende do preenchimento de perfil. | Policy global sem necessidade demonstrada de produto. |
| AUTH-008 | Privacidade / RPC | `household_for_list(uuid)` é `SECURITY DEFINER`, não checa `auth.uid()` e não revoga `EXECUTE` de `PUBLIC` | P2 | Migration linhas 95-98; `EXECUTE` público é o default PostgreSQL e não há revogação explícita | Quem conhece um UUID de lista pode consultar o household correspondente via RPC; facilita enumeração e encadeia com AUTH-001. | Helper de policy foi criado como função pública exposta no schema `public`, sem separar função interna de endpoint RPC. |
| FAMILY-001 | Convites | Convite não tem revogação/consumo, e todo membro pode ler tokens ativos da casa | P1 | Migration linhas 30-37, 107-130, policy linha 155; sem `accepted_at`, `revoked_at`, destinatário ou DELETE policy | Link copiado pode continuar adicionando membros até expirar (14 dias); qualquer membro vê todos os tokens da casa. Aceite é reutilizável. | Convite bearer é persistido como segredo legível por membros; lifecycle não foi modelado. |
| FAMILY-002 | Membership / autorização | `role` existe, mas autorização usa `households.created_by`; membro não consegue sair, e não há regra para último owner | P1 | Migration linhas 21-27, 149-153; apenas creator remove membership; nenhum fluxo de saída/transferência | Owner pode remover a própria membership e deixar casa sem acesso operacional; member não pode sair; `owner` pode divergir de `created_by`. | Duas fontes de ownership sem invariantes; nenhum workflow de administração. |
| DB-001 | Integridade | FK de `products.category_id` e `shopping_list_items.product_id/category_id` não garante mesmo household | P1 | Migration linhas 49-53, 75-80; RLS permite gravar item conforme household da lista, sem validar tenant da categoria/produto | Escrita autorizada em lista própria pode referenciar IDs de entidade de outra casa; causa vínculo inválido/ID leakage e resultados inconsistentes. | FKs simples validam existência, mas não a igualdade de tenant. |
| DATA-001 | Integridade / bootstrap | Toda carga remota reconcilia seed e sobrescreve nome, categoria, quantidade e `active` de produtos correspondentes; pode reativar item desativado | P1 | `lib/supabase/data.ts:48-60` | Personalizações são desfeitas em cada abertura e diferenças podem ser perdidas sem aviso. | Seed de demonstração está acoplada ao bootstrap de produção como fonte autoritativa. |
| SYNC-001 | Colaboração / Realtime | Evento `INSERT` de item não é anexado ao state; apenas atualiza item já existente ou remove DELETE | P1 | `components/restok-app.tsx:575-597`, map não inclui ramo de append; `subscribeToShoppingList` em `lib/supabase/realtime.ts` escuta `*` | Outro membro adiciona item e a tela atual não o mostra; mudanças em lista/produtos também não sincronizam. | Handler parcial que assume que todos os eventos são UPDATE/DELETE. |
| SYNC-002 | Persistência / offline | Escritas são fire-and-forget, erros são descartados; UI confirma sucesso sem confirmação do servidor | P1 | `components/restok-app.tsx:604-645`; `lib/supabase/data.ts:103-122` ignora `error`; não há fila/retry | Conexão móvel instável pode perder marcações sem indicar; cache otimista pode divergir do banco e ser substituído no reload. | Persistência não retorna resultado para UI, sem estado pending/failed ou outbox. |
| SYNC-003 | Performance / consistência | Criar compra grava cada item em paralelo e cada persistência repete auth, membership e categorias | P2 | `components/restok-app.tsx:614-622`; `persistItem` chama `getRemoteContext()` e `getCategoryIds()` em cada item, `data.ts:103-109` | Uma lista de 44 produtos gera dezenas de chamadas redundantes e gravações não atômicas; falha parcial cria compra incompleta. | Operações item-a-item sem batch/transação/contexto compartilhado. |
| MOBILE-001 | Compra mobile | Conteúdo final fica atrás do rodapé fixo no viewport estreito | P1 | Observado no modo demo local: rolagem até o limite mostra “Sabão Líquido” como último item visível enquanto há 4 itens na categoria Limpeza; rodapé fixo cobre o restante. Código: `components/restok-app.tsx:651,663-664` (`pb-24` frente a barra+nav fixas). | Produto final não pode ser marcado pelo fluxo de rolagem normal no celular; quebra a tarefa de compra. | Espaço inferior do `main` menor que a soma da barra-resumo, navegação e safe area. |
| UX-001 | Compra / preço | Editor afirma que preço informado torna item comprado, mas salvar item cujo status segue `pending` preserva `pending` | P1 | `components/restok-app.tsx:345` texto; `ItemEditorSheet` submit linhas 319-323 conserva `status`, só rebaixa `purchased` sem preço; botão muda para “Adicionar ao carrinho” em linha 360 | Total/preço e resolvidos ficam contraditórios; usuário pensa que registrou compra. | Estado de status controlado separadamente do preço, com regra e copy divergentes. |
| MOBILE-002 | Compra mobile | Marcar “comprado” não é ação direta na linha; abre sheet e requer escolha de status/preço; filtros têm alvos de 40px | P2 | `ShoppingItemRow` linha 264 abre editor; controle direto só para `already_have` linhas 276-280; filtros linha 657 `min-h-10` | Mais toques e atenção durante caminhada; áreas pequenas para toque impreciso/uma mão. | Modelo de linha usa edição como ação padrão e não prioriza ação principal do modo mercado. |
| UX-002 | Feedback / rede | Falha de leitura pode parecer lista vazia; erro de convite é ignorado; loading de bootstrap não é representado | P2 | `loadRemoteState` descarta erro de queries; boot não tem `loading`; `acceptHouseholdInvite` retorno ignorado em `components/restok-app.tsx:542-549` | Usuário pode interpretar perda temporária de conexão como ausência de dados ou aceite de convite bem-sucedido. | APIs retornam `null`/boolean, mas consumidor não mostra erro/estado. |
| UX-003 | Navegação / produto | Menu hamburger da landing é botão sem handler; link de demo não funciona como demo quando Supabase está configurado | P2 | `app/page.tsx` button `Abrir menu` sem `onClick`; login Link `/app` cai na guarda autenticada em `app/app/page.tsx:5-12` | Em mobile, navegação da landing desaparece sem substituição; CTA de demonstração redireciona para login em produção. | A versão mobile esconde os links desktop; modo demo só existe quando env Supabase está ausente. |
| A11Y-001 | Acessibilidade | Bottom sheet declara modal mas não prende foco, não move/restaura foco consistentemente nem fecha com Escape | P2 | `Sheet` em `components/restok-app.tsx:112-151`: `role=dialog`, sem focus trap/keydown/inert | Teclado e screen reader podem continuar no conteúdo sob o modal; contexto de foco se perde. | Sem primitive de diálogo acessível. |
| DB-002 | Performance / schema | Índices de consulta por household/list estão incompletos | P2 | Migration: `household_members` unique `(household_id,user_id)` não atende busca por `user_id`; não há índice de `shopping_list_items.shopping_list_id`; listas consultadas por `(household_id, started_at)` | Crescimento de dados aumenta scan em bootstrap, policy e Realtime. | Índices foram adicionados apenas para unicidade e histórico de preço. |
| CODE-001 | Arquitetura | Tela e orquestração do domínio concentradas em componente cliente grande; há implementação legacy morta | P2 | `components/restok-app.tsx` ~680 linhas, estado/telas/mutations/sync no mesmo módulo; `ProductsHomeLegacy` e `void ProductsHomeLegacy` | Mudanças em compra, dados e navegação ficam acopladas; aumenta risco de regressão e torna E2E/mocks difíceis. | MVP não separa casos de uso e apresentação; código anterior permaneceu após substituição. |
| PERF-001 | Performance | Carga inicial não tem virtualização, embora atualmente sejam 44 itens por lista; JS app já é maior que landing | P3 | Build: `/app` First Load JS 185 kB; `/` 106 kB; `seedProducts` tem 44; render usa `map` por categoria | Não é gargalo demonstrado nesta escala; crescimento futuro pode elevar custo em aparelhos lentos. | Sem medição de Web Vitals ou orçamento de performance. |
| AUTH-009 | Privacidade | Perfil local e cache sobrevivem à sessão Supabase sem estratégia de expurgo | P3 | `restok-login-email` e `restok-state-v2` no localStorage; sessão em cookies Supabase | Email e dados continuam no dispositivo após logout/uso compartilhado; não há logout para limpar. | Persistência local não distingue dado sensível de preferência/cache. |

## Positive Findings

- RLS está habilitada em todas as tabelas da migration; acesso a lista e produtos é de fato pretendido por membership, e as queries incluem `household_id` localmente.
- Não há service-role key nem backend com credencial administrativa no código inspecionado; Supabase browser usa anon key.
- `shopping_lists` possui unicidade parcial para uma lista ativa por household; quantidades/preços têm `CHECK` no banco e FKs principais existem.
- `auth.getUser()` é usado na guarda do servidor e no middleware, e a sessão usa `@supabase/ssr` cookies.
- Token de convite tem 18 bytes aleatórios criptográficos (144 bits) e expira em 14 dias.
- `viewportFit: cover`, safe area no nav/sheet, `min-width: 320px`, foco visível e `prefers-reduced-motion` estão previstos.
- Controles principais têm rótulos, e campos de autenticação incluem `autocomplete` adequado. Linhas de produto têm alvos grandes e rótulo acessível.
- Lista possui filtros, busca, categorias recolhíveis, histórico, resumo de orçamento e confirmação de finalizar compra.

## Technical Debt

- Modelo de conta/casa/membership existe só parcialmente na UI e no domínio TypeScript; `RestokState` não carrega household, sessão nem membros.
- Camada de dados combina seleção de tenant, provisionamento, carga, reconciliação de seed e persistência.
- Mutações são otimistas, sem retorno normalizado de resultado, log de erro ou estados de sincronização.
- `RestokApp` é monolítico; falta separação de componentes e casos de uso de household/list/item.
- Um migration inicial contém schema, helpers, RLS, grants e Realtime. Não foi encontrada suíte de políticas nem histórico adicional de migration.
- Dados de apresentação (Casa Gabriel & Brunna, iniciais GB) não derivam do usuário/casa real.
- Testes atuais só cobrem duas funções utilitárias; auth, RLS, dados e UI não possuem cobertura.

## Risks

1. **Vazamento/alteração entre households** via membership autoatribuível (P0).
2. **Perda silenciosa** de dados quando requests falham ou escrita parcial não é reconciliada.
3. **Personalização destruída** pelo seed que reaplica valores e estado em todo boot.
4. **Colaboração inconsistente**: adições feitas por outra pessoa não aparecem em Realtime.
5. **Abandono e fricção**: primeiro uso não cria uma casa explicitamente, não tem onboarding e convite não orienta escolha de household.
6. **Uso no mercado bloqueado** por overlay do rodapé; registro de preço/status tem regra contraditória.
7. **Recuperação de conta incompleta** e ausência de logout em dispositivo compartilhado.

## Validação e limites

- `npm run lint`: passou.
- `npm test`: passou, 1 arquivo/2 testes unitários.
- `npm run build`: passou; Next 15 gerou `/app` 185 kB First Load JS e `/` 106 kB. Aviso do Next ESLint plugin ausente.
- `npm run typecheck` isolado inicialmente falhou porque `.next/types/app/*` ainda não existia enquanto o build gerava; o build, que inclui lint/type validation, concluiu com sucesso.
- `npm audit --offline --omit=dev`: 0 vulnerabilidades de dependências de produção segundo o advisory cache local; sem rede, não foi possível confirmar atualidade do cache nem auditar dependências dev.
- Busca por TODO/FIXME, `console.*`, `dangerouslySetInnerHTML`, `eval`, `any` e cast duplo não encontrou ocorrências no código de aplicação. Não encontrei SQL dinâmico nem endpoint próprio não autenticado; consultas usam Supabase query builder. Isso não substitui pentest nem auditoria de headers/infra.
- A navegação foi feita numa cópia em `/private/tmp/restok-audit`, sem `.env`, modo demo, sem escrita em Supabase. Landing, login/signup switch, `/app`, editor de produto, casa e scroll da compra foram observados.
- No log da cópia demo apareceram `GET /brand/logo/rekko-logo-white.svg 404` e `GET /sw.js 404`; não há referências a esses caminhos no repositório. A origem do request não foi atribuída ao código do Restok, então não foi classificado como bug do app.
- Screenshot disponível no browser estava em viewport estreito de aproximadamente 525 px. O projeto não tem Playwright/config de viewport; os tamanhos solicitados de 320, 360, 375, 390, 412, 430, 768, 1024 e 1440 não foram todos emulados. A matriz do documento mobile distingue inspeção estática da execução visual.
- Não foram enviados requests de auth, RLS ou mutação ao Supabase configurado no `.env`. Não há contas/projeto isolado de teste fornecidos. O finding AUTH-001 decorre diretamente da expressão da policy e do uso dessa membership como condição de acesso; reproduzir requer um ambiente Supabase local/teste seguro.
- Sem teste de teclado/screen reader, rede realmente offline, dispositivos iOS/Android, storage, DevTools Network do ambiente remoto ou dados de produção.

## Histórico Git consultado

`git status` indicava antes da auditoria alterações do usuário em `app/globals.css`, `app/login/page.tsx` e `.login-check.jpg`; foram preservadas. `git log` e `git blame` situaram a policy e o `getRemoteContext` no commit `b6ace9c` (MVP inicial); commits posteriores cuidaram de signup, confirmação de email e convite, sem migration estrutural posterior observada.
