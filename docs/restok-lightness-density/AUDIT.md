# Audit: components/shopping/shopping-view.tsx, components/app/app-shell.tsx

## Surfaces

One row per screen. **Fill this in before fixing anything.** Classifying
after changing things is justifying what was already done.

- **A acquisition**: whoever is not a customer yet. Persuade, prove, convert.
- **B work**: whoever uses it every day. Speed, density, keyboard.
- **C trust**: money, permission, destructive action. It cannot lie.

Applying A instincts to a B screen is the most expensive Visant frontend mistake.

| File | Surface (A/B/C) | Business variable it moves | Notes |
|---|---|---|---|
| components/shopping/shopping-view.tsx | B | Tempo para localizar e resolver itens | T2, lista e filtros |
| components/app/app-shell.tsx | B | Orientação e acesso à casa ativa | T2, navegação compartilhada |

## Screen seen

One row per screen OPENED, with what was seen. Without this the gate does not
open: a frozen AnimatePresence passes tsc, ESLint, motion-lint, impeccable,
audit:design and copy-lint without lighting anything up.

Each row carries: route, width, data state, and what happened.
Before measuring anything, check that the page hydrated (see
`visant-killer/references/environment.md`): half the findings of one session
were the dev server lying, not the screen.

- /app?scenario=empty-list, 1920px: card esticado, contexto redundante e CTA duplicado, screenshot before/1920x1080-empty-list.png.
- /app?scenario=long, 390px: selector com contorno e navegação pesada, screenshot before/390x844-long.png.

## Findings



## Resultado da rodada

T2 / superfície B. Corrigidos: expansão ilimitada do workspace, nav mobile em992px, seletor com aparência de input, repetição de CTA no vazio, finalização dominante sem itens e contorno do editor financeiro. Encontrado e corrigido na segunda inspeção: valor extremo do dock invadia o CTA; agora quebra dentro da coluna disponível.

## Verificação

237 testes; typecheck; ESLint;20/20 interações;77 capturas isoladas sem pageerror/overflow. Screen seen: /app na porta3000, sete viewports, Compra vazia e preenchida; Casa e Histórico; editor de meta, House Switcher e browser back. Evidências nos manifestos de before/after.

Gate parcial: token fallback/noise aprovados; Impeccable sem acesso ao registry, copy não descoberto pelo runner; motion-lint zero e Anti-Webslop sem erros. Não se atribui score agregado com gates indisponíveis.

## Interrogação adversarial

- O que tornou dezenas de ajustes de pixel desnecessários? Retirar a regra sem limite acima1600px, em app-shell.module.css.
- A lista vazia precisa de resumo? Não: repete zero. Contexto só monta com items.length>0, em restok-app.tsx.
- Finalizar desapareceu? Não: shopping-view.tsx preserva o menu e chama o mesmo handler de confirmação.
- Existe componente novo? Não: parametrizados Button, Navigation, HouseSwitcher, EmptyState, AppShell existentes.
- O foco acompanha a mudança? Escape retorna ao editor, ver interactions.json e validação real3000.
- O que falta para certificar lançamento? Hardware mobile/Safari, integração Supabase e gate Impeccable; não são substituídos por screenshots.
