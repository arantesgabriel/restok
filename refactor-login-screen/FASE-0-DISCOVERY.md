# Restok — Nova experiência animada de login

## Progresso

| Fase | Descrição | Status |
|---|---|---|
| 0 | Discovery e planejamento | Concluída e aprovada — decisões registradas abaixo |
| 1 | Composição visual estática | Concluída — aguardando aprovação para a Fase 2 |
| 2 | Fundação do sistema de animação | Não iniciada |
| 3 | Cena 1: planejamento e colaboração | Não iniciada |
| 4 | Cena 2: dentro do mercado | Não iniciada |
| 5 | Cena 3: finalização e métricas | Não iniciada |
| 6 | Loop e storytelling completo | Não iniciada |
| 7 | Microinterações do login | Não iniciada |
| 8 | Mobile, tablet e reduced motion | Não iniciada |
| 9 | Acessibilidade e performance | Não iniciada |
| 10 | Testes e hardening | Não iniciada |
| 11 | Polish final | Não iniciada |

Commit de base (antes de qualquer fase): `d45ce29 feat(login): redesign login form and product preview panel`. Ele isola o redesenho anterior do login, que estava sem commit em `app/login/page.tsx` e `app/globals.css`, para que cada fase tenha commits próprios.

Na Fase 0 nenhum arquivo de produção foi modificado.

---

## Decisões da Fase 0

1. **Colaboração ("Maria adicionou Café")** — será implementada no showcase do login. O app ainda **não** possui atribuição de autor por item: `shopping_list_items` não tem `created_by`/`added_by` e a interface nunca mostra quem adicionou um item. A funcionalidade fica registrada como pendência do app (ver "Backlog do app").
2. **Métricas ("Economizados") e gráfico de compras anteriores** — serão implementados no showcase do login. O app ainda **não** calcula economia nem exibe gráfico de histórico. Ficam registrados como pendência do app (ver "Backlog do app").
3. **Commit de base** — autorizado e realizado (`d45ce29`).

Consequência: o showcase representa capacidades planejadas. Até elas existirem no app, a tela de login comunica mais do que o produto entrega; o backlog abaixo existe para fechar essa diferença.

## Decisões da Fase 1

1. **Copy** — o título não para no caixa: "Sua compra, da lista à próxima." O apoio cobre os três momentos: "Vocês planejam juntos, acompanham o gasto no mercado e levam o total para a próxima compra."
2. **Dataset** — uma compra de 11 itens em `showcase-data.ts`. Total R$ 468,05 (soma dos comprados), orçamento R$ 800,00, disponíveis R$ 331,95. "Já temos" (sabonete) fica de fora. Economizados R$ 38,00 é a soma do que ficou abaixo do preço anterior, não o mock antigo de R$ 46,28 / 28 itens / R$ 483,72.
3. **Quadro parado** — lista em "Dentro do mercado" com 11 de 11 resolvidos, cartão "Maria adicionou Café" e cartão "Compra concluída" com o mesmo total. O passo em destaque é **Compre**, porque a lista é o cartão dominante. Sem animação.
4. **Painel** — continua oculto em ≤800px. Abaixo de 820px de altura o bloco compacta para caber em 768px sem rolagem.

---

## Backlog do app (funcionalidades mostradas no login e ainda não implementadas)

| Item | O que falta no app | Onde impacta |
|---|---|---|
| Atribuição de autor por item | Coluna de autor em `shopping_list_items` (ex.: `created_by uuid references auth.users`), preenchimento no insert, leitura em `lib/supabase/data.ts`, exibição no item/aviso em tempo real ("Maria adicionou Café") | `supabase/migrations`, `lib/supabase/data.ts`, `lib/supabase/realtime.ts`, `lib/types.ts`, `components/restok-app.tsx` |
| Métrica de economia ("Economizados") | Definir a regra de negócio (ex.: diferença entre preço anterior e preço pago, ou orçamento menos total) e exibi-la no resumo da compra concluída | `lib/utils.ts`, `CompleteSheet` e histórico em `components/restok-app.tsx` |
| Gráfico de compras anteriores | Série de totais por compra concluída no histórico; atenção ao princípio do `PRODUCT.md`: "histórico guarda contexto para a próxima compra sem virar dashboard" | `HistoryView` em `components/restok-app.tsx` |

---

## LOGIN IMPLEMENTATION DISCOVERY

### Stack

- Next.js 15.5 (App Router), React 19, TypeScript.
- Tailwind 3 no app autenticado; landing e login usam CSS próprio com prefixo (`.landing-*`, `.login-*`, `.preview-*`) em `app/globals.css`.
- Tokens OKLCH em variáveis CSS (`--canvas`, `--surface`, `--ink`, `--muted`, `--line`, `--primary`, `--primary-strong`, `--sage`, `--terracotta`, `--focus`), documentados em `DESIGN.md`. Pesos de fonte limitados a 600.
- Tipografia: "Avenir Next" com fallback de sistema; serif (Georgia) nos títulos emocionais da landing.
- Ícones: `lucide-react`.
- Testes: Vitest em ambiente `node`, 2 testes de utilitários. Sem jsdom, Testing Library ou Playwright.
- Linha de base: `typecheck` ok, `lint` ok, testes 2/2 ok.

### Arquitetura atual do login

- `app/login/page.tsx`: client component único, duas colunas.
- Formulário: entrar e criar conta alternam na mesma tela; campos nome (só cadastro), email e senha com mostrar/ocultar; "Lembrar email" (`localStorage`, chave `restok-login-email`); "Esqueceu a senha?" (`resetPasswordForEmail`); link "Experimentar com dados de exemplo" (`/app`); estado de sucesso "Quase lá" após cadastro sem sessão.
- Estados: `loading` troca o botão para "Aguarde…"; erro com `role="alert"`; nota com `role="status"`; `resetting` desabilita o link de redefinição.
- Após autenticar: `router.push(nextPath)`, padrão `/app`. `app/app/page.tsx` valida a sessão no servidor e redireciona para `/login?next=…` sem usuário. `middleware.ts` renova a sessão em `/app/*` e `/auth/*`.
- `app/auth/callback/route.ts`: troca o code por sessão e redireciona para `next`.
- A autenticação não será alterada neste trabalho.

### Painel direito atual

- `<aside class="login-aside">` com fundo `oklch(0.94 0.03 145)`; conteúdo com `aria-hidden`.
- Réplica estática da tela "Dentro do mercado": "Compras de Setembro · 18 de 32 resolvidos", faixa "Gasto até agora R$ 483,72 / R$ 316,28 disponíveis" e 3 itens (comprado, pendente, já temos). Cartão verde-escuro na base com legenda e 3 benefícios.
- Grid: `minmax(420px, 1.05fr)` para o formulário e `minmax(360px, 0.95fr)` para o painel.
- Largura medida do painel: cerca de 488px em 1024, 684px em 1440, 912px em 1920.
- Problema: a réplica ocupa toda a largura do painel. Em 1920 a faixa de orçamento chega a 868px de largura com texto de 9–10px, e sobram cerca de 570px vazios entre o último item e a legenda.
- Acoplamento: o painel reaproveita `.landing-preview` e `.preview-*` da landing; alterá-las afeta o hero da página inicial.

### Componentes disponíveis (referência visual, sem reuso direto)

Em `components/restok-app.tsx` (arquivo único, 675 linhas):

- `ShoppingItemRow`: quadrado de 40px com glifo da categoria (◌ Alimentos), ✓ quando comprado, ⌂ quando "Já temos"; resolvido fica muted com line-through; texto "2 un. · R$ 6,49 un." e subtotal à direita. O item não muda de posição ao ser marcado.
- `BudgetSummary`: "Gasto até agora", valor, "R$ X disponíveis · de R$ Y", barra que fica terracota ao estourar.
- `StatusBadge`: Pendente / Comprado / Já temos.
- `CompleteSheet`: título real "Compra concluída"; "N produtos resolvidos", total "registrados nesta compra", contagens "Comprados" e "Já tínhamos".
- `HistoryView`: compras concluídas com mês, número de itens e total.
- `PreviousPrice`: variação ↑/↓ em % em relação à compra anterior.
- Planejamento: tela "Produtos da casa" (itens recorrentes) e "Nova compra".

Esses componentes dependem de callbacks e estado do app; o showcase terá versões apresentacionais próprias com a mesma linguagem visual.

### Dependências de animação atuais

Nenhuma. Apenas `transition` CSS de 180–300ms. Existe uma regra global de `prefers-reduced-motion` que zera durações (`0.01ms !important`) — insuficiente sozinha para o showcase.

### Comportamento responsivo

- Breakpoint de layout único em 800px: abaixo dele o painel some e fica só o formulário. Ajustes menores em 430px.
- Em 390px não há overflow (`scrollWidth` = 390).
- Entre 801 e 1023px o painel fica com cerca de 360–480px, apertado para cartões sobrepostos.
- Em 768px (tablet) já aparece só o formulário.

### Riscos

1. Showcase mostra capacidades ainda inexistentes (autor por item, economia, gráfico) — decisão tomada, backlog registrado acima.
2. Números inconsistentes no briefing (lista de 11 itens contra "28 itens comprados"; frango a R$ 32,90 contra R$ 158,90). Resolver com um único arquivo de dados de demonstração coerente.
3. A regra global de reduced motion faria as animações pularem para estados errados; a timeline em JS precisa checar `matchMedia` e ter quadro estático explícito.
4. A timeline não pode rodar com o painel oculto (≤800px) nem com a aba em segundo plano.
5. CLS/LCP: itens entrando na lista não podem deslocar o layout; reservar espaços e renderizar o primeiro quadro no servidor.
6. Testes de componente/E2E na Fase 10 exigirão dependências novas (jsdom, Testing Library, possivelmente Playwright), justificadas naquela fase.
7. Fora do escopo, apenas documentado:
   - link de demo não funciona com Supabase configurado (`/app` redireciona ao login);
   - redefinição de senha sem tela de nova senha;
   - validação de `next` aceita `/\` (ver `docs/audit/`);
   - a marca mostra "restok ." com espaço antes do ponto por causa do `gap` do `inline-flex`.

### Abordagem recomendada

- Sem biblioteca nova. CSS transitions para opacity, translate e barra de orçamento; tween com `requestAnimationFrame` para contadores (com `tabular-nums`); gráfico em SVG com `stroke-dashoffset`.
- Hero transition: o próprio cartão de orçamento troca "Gasto até agora" por "Compra concluída" mantendo o valor — mesmo elemento, sem shared layout.
- Se a Fase 2 mostrar que a entrada de itens fica travada só com CSS, avaliar `motion` com `LazyMotion` (cerca de 20KB gz), com justificativa na fase.
- Timeline: roteiro declarativo + reducer puro (evento → estado da cena), testável no Vitest atual sem jsdom. Hook `useShowcaseTimeline` com um único agendador encadeado, `play`, `pause`, `restart`, `goTo(stage)`; respeita reduced motion, visibilidade da aba e `matchMedia`; limpa tudo ao desmontar.
- CSS: nova seção `login-showcase-*` em `globals.css`, só com tokens existentes, bordas finas e sombra pequena (≤8px, conforme `DESIGN.md`); `.preview-*` não é alterado.
- Composição: cartão de lista com largura limitada (cerca de 380–440px), cartão de colaboração acima à esquerda, cartão de resumo abaixo à direita, indicador "Planeje · Compre · Acompanhe" embaixo. Título com o serif da marca.
- Copy: "do planejamento ao caixa" termina no caixa, mas a cena 3 acontece depois; ajustar na Fase 1.

### Arquitetura de componentes proposta

```text
LoginPage (app/login/page.tsx — formulário intacto, só troca o <aside>)
├── (formulário atual)
└── LoginShowcase                  components/login-showcase/login-showcase.tsx
    ├── ShowcaseHeader             headline + supporting text (conteúdo legível)
    ├── ShowcaseStage (aria-hidden)
    │   ├── CollaborationCard      avatar + evento de colaboração
    │   ├── ShoppingDemo           título, contador, orçamento, itens
    │   │   └── DemoItemRow
    │   └── SummaryCard            total, comprados, economizados, gráfico
    └── StoryProgress              Planeje · Compre · Acompanhe

components/login-showcase/
├── showcase-data.ts               dataset único e coerente
├── showcase-timeline.ts           tipos, roteiro, reducer puro     (Fase 2)
└── use-showcase-timeline.ts       agendador/hook                   (Fase 2)
```

### Arquivos previstos

- `app/login/page.tsx` — só o `<aside>` é substituído.
- `app/globals.css` — nova seção `login-showcase-*`; remoção de `.login-aside`/`.login-scene` que deixarem de ser usadas; regra de reduced motion específica na Fase 8.
- `components/login-showcase/*` — novos.
- Testes do reducer a partir da Fase 2.

---

## Evidências coletadas na Fase 0

- Screenshots do login atual em 1024×768, 800×1000 e 390×844 (capturados com navegador headless, fora do repositório).
- Medições de layout via DevTools em 390, 1440 e 1920.
- `npm run typecheck`, `npm run lint` e `npm test` executados sem erros.
