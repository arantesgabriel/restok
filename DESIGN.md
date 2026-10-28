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

Não importar globals/ui antigos no preview novo. O config Tailwind antigo e seus
consumidores permanecem temporariamente sob responsabilidade do PR13. A integração
gradual migra consumidores por PR; não cria aliases entre paletas. A retirada
global continua fora do Bloco2. Não reconstruir telas/landing antes dos seus PRs.

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
