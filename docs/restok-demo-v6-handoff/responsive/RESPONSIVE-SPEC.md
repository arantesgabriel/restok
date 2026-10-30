# Responsividade — proveniência e regras

O preview usa `state.device` e classes em `#app`, **não apenas CSS media queries**:

| Viewport | Classe do app | Layout | Origem |
|---|---|---|---|
| 320×640 | `app a compact` | Mobile compacto | Código original |
| 390×844 | `app a` | Mobile | Código original |
| 1440×900 | `app a desktop` | Desktop | Código original |
| 1920×1080 | Desktop no produto real | Desktop amplo | **Derivado para QA** |

As funções `dimensions()`, `resize()` e `draw()` em `original/dist/r2.js` definem os 3 modos originais. O frame pode estar **escalado** dentro do laboratório. O CSS também contém media queries que afetam a moldura externa; não os usar como breakpoints do produto.

Medidas do estilo final presentes em `r26.css` (complementado por `r27.css` e `r28.css`):

| Medida | 320 | 390 | 1440 e cenário 1920 |
|---|---:|---:|---:|
| Padding conteúdo superior | 10px | 16px | 32px |
| Padding lateral | 12px | 16px | 38px |
| Padding inferior | 110px | 115px | 80px |
| Sidebar | Oculta | Oculta | 228px |
| Contexto lateral | Oculto | Oculto | 254px |
| Gap principal | — | — | 32px |
| Largura máxima conteúdo | Fluida | Fluida | 1240px |
| Valor gasto | 23px | 27px | Ver CSS original |
| Mínimo da linha de compra | 53px | 62px | Ver CSS original |

Em 1920×1080 não há token novo canônico. O objetivo é verificar a composição desktop com o conteúdo limitado e distribuído, sem ampliar artificialmente tipografia e componentes. Eventuais ajustes específicos de 1920 serão **decisões novas documentadas**.

**Precedência:** regras do produto real → decisões posteriores de navegação enxuta e sidebar → Design System v1 → visual demonstrado → CSS legado do laboratório.
