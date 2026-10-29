# Restok · Raiz & Eucalipto

Norma visual: [Design System v1](docs/design/RESTOK_DESIGN_SYSTEM_V1.md).
Domínio e limites continuam em [PRODUCT.md](PRODUCT.md).

Interface operacional para compras da casa. Lista protagonista, card de gasto
verde profundo, fonte Manrope e estados legíveis por texto/ícone. V3 / M2 / D7.
A assinatura `restok.` e seu ponto são parte da marca aprovada. O PNG atual é
transitório; master vetorial permanece um gate de marca final.

## Implementação e migração

- `styles/tokens.css`: primitivos e17 papéis semânticos, escopo `.restok-theme`.
- `styles/base.css`: Manrope local400–800 com OFL, foco e tipografia escopados.
- `styles/motion.css`: timing reduzido a zero pela preferência do usuário.
- `tailwind.raiz.config.ts`: vocabulário novo com alpha e pesos reais, sem preflight global.
- `components/ui/theme.tsx`: fronteira explícita dos novos consumidores.
- Preview `/foundations.html` no harness local4173, fora das rotas/auth de produção.

PR13: app/layout.tsx ativa a fronteira restok-theme; globals.css importa apenas
base/motion/reset novos e utilitários Tailwind semânticos. CSS e configuração
anteriores existem somente em tests/e2e/legacy, carregados nas rotas históricas
/before-*. Não há aliases entre paletas. PR14 reconstrói a landing e as demos em
CSS Modules site/demos, com os mesmos papéis e primitivos do app. Lista ilustrativa
no hero, navegação por etapas e exemplos locais; sem moldura de navegador, folhas
decorativas, depoimentos ou números inventados. O CSS público anterior é histórico,
sem import no produto. Retirada total de assets/normas e gates transversais no PR15.

```design-tokens
brand #213F1D; action #2D5A27; highlight #B4D3A7; info #4F7566;
canvas #F7FAF5; surface #FFFFFF; ink #18251A; muted #526452;
line #E1E9DE; lineStrong #C9D9C5; danger #B94132; warning #946127;
spacing 4/8/12/16/24/32/48; radius control8/panel12/budget18;
font Manrope400/500/600/700/800; type12/14/16/20/24/32;
```

## Decisões

28/10/2026: Bloco2 autorizado. Fundações isoladas e fonte legal local antecedem
campos monetários e componentes. Corpo16px em inputs; contorno de controles usa
info com contraste suficiente, `line` apenas para divisão. Sem sombra em linhas.
Fonte Nexa somente com licença/arquivos fornecidos. Nenhuma fonte é buscada no build.
