# Fase 1: fundações visuais submetidas à aprovação

30/10/2026, America/Sao_Paulo. Autorização atual: “inicie a fase 1”.
Baseline: diagnóstico em `docs/restok-visual-refactor/00` e `01`, Git
`e1565f8b3399a8eb500a06657dafdc165653536b`. Antes da execução, somente o pacote
`docs/restok-demo-v6-handoff/` estava não rastreado. Seus originais foram preservados.

## Entrega e escopo

As fundações existentes foram reconciliadas com a referência v6, sem recriar
valores que já coincidiam. Mantidos17 papéis de cor, fonte Manrope local/OFL,
escala12/14/16/20/24/32, spacing4/8/12/16/24/32/48, raios8/12/18, alvos44,
camadas, sombra de overlays e movimento compatível com o diagnóstico.

Acrescentados papéis de texto sobre brand/action, foco, pesos, borda, ícones e
gutter responsivo. Corrigido o foco de teclado global e dos wrappers monetário/
quantidade. Lucide passa a usar traço1.75 via fundação. Não há `!important` novo.
[Mapeamento completo](TOKEN-MAPPING.md).

Os tokens de gutter estão preparados; a mudança do shell é reservada à Fase 2.
Não foram alterados handlers, domínio, persistência, Supabase, Auth, RLS, APIs,
schema ou dados. A landing recebeu apenas smoke de regressão pelo efeito global.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| styles/tokens.css | Papéis de texto/foco, pesos, hairline, ícones e gutter inicial |
| styles/responsive.css (novo) | Gutter12/16/24 por largura; sem alterar layout do produto |
| styles/base.css | Import responsivo, peso semântico, foco action2/3, traço Lucide |
| components/ui/numeric-fields.module.css | Wrapper de foco visível, sem halo info; borda de erro preservada |
| tailwind.raiz.config.ts | Utilities de tipo, gutter e alvo de toque |
| eslint.config.mjs | Excluir o pacote de referência imutável do lint da aplicação |
| tests/e2e/foundations.tsx e .css | Amostras de estado com componentes reais e estilos de preview limitados |
| tests/e2e/capture-phase1.mjs (novo) | Runner local reproduzível de screenshots e checks computados |
| DESIGN.md e docs/design/RESTOK_DESIGN_SYSTEM_V1.md | Decisão atual, precedência e links de evidência |
| docs/restok-phase1/ | Mapeamento, relatório, índice e evidências desta execução |

O lint inicialmente encontrou49 erros nos arquivos JavaScript do pacote estático
adicionado pelo usuário. A exclusão é limitada ao pacote de referência, sem
relaxar regras dos fontes reais nem modificar o original.

## Validação técnica e visual

| Verificação | Resultado |
|---|---|
| npm test -- --maxWorkers=2 --reporter=dot | 240/240 em40 arquivos; log em evidence/tests.log |
| npm run lint | Aprovado; evidence/lint.log |
| npm run typecheck | Aprovado; evidence/typecheck.log |
| git diff --check | Aprovado |
| Playwright/Edge156, DPR1 | 77 checks aprovados, zero pageerror; evidence/after/manifest.json |
| 17 cores contra JSON v6 | Igualdade computada nos quatro viewports |
| Fonte | Manrope real/customizada confirmada por glifos via CDP, não apenas por nome CSS |
| Contraste textual | Seis pares funcionais ≥4,5:1 nos quatro viewports |
| Foco | Campo simples, erro, monetário e quantidade;2px action/offset3, erro preservado |
| Responsividade | Preview, Compra/Casa/Histórico, login e landing sem overflow nos quatro viewports |
| Reduced motion | Quatro durações computadas0ms |
| Fonte indisponível | Fallback em320px sem overflow |

A primeira execução com paralelismo padrão teve5 falhas: timeouts e falhas
subsequentes de limpeza/foco nos testes de compra/histórico. Repetição com dois
workers passou integralmente, sem alterar testes nem aumentar timeouts.

Build de produção não executado: `.next/dev/lock` presente, evitando conflito com
o ambiente de desenvolvimento do usuário. PostCSS/Tailwind são compilados nos
testes e o CSS real é renderizado no harness; isso não equivale a um build Next.

## Evidências e classificação

[Galeria de antes/depois e referência](index.html). Capturas em320×640,390×844,
1440×900 e1920×1080, com manifestos separados de antes/depois. Nas amostras dos
fluxos, a fixture do produto é a mesma antes/depois; a demonstração contém seus
próprios dados. Comparação direta com a demo nesta fase limita-se a fundamentos,
não a contagens ou geometria de telas com fixtures diferentes.

As capturas de referência são do `#app` original em320/390/1440, removendo apenas
o transform de escala do laboratório. A fonte Manrope é fornecida localmente
ao navegador da referência porque as requisições externas ficam bloqueadas;
nenhum arquivo original foi editado. Não existe modo original1920.

| Item | Classificação | Observação |
|---|---|---|
| Paleta, fonte local, spacing, raios e tipos disponíveis | Conforme | Mapeamento e verificações computadas |
| Foco e erro dos campos amostrados | Conforme | Capturas antes/depois e checks |
| Traço Lucide e reduced motion | Conforme | Estilos computados |
| Timings140/220/220/160 versus JSON160/180/260/360 | Exceção aprovada | Compatibilidade já documentada no diagnóstico e faixas do markdown; preservada |
| Sidebar e ausência de header global redundante | Exceção aprovada | Decisão posterior do usuário; composição preservada nesta fase |
| Gutter do shell em320/390 | Conforme nas regras atuais | Shell já usa12/16; ainda mantém token local e transições375/768, a revisar na Fase 2 |
| Composição das telas versus demonstração | Divergente | Diferenças de anatomia/ritmo preservadas para as fases de shell e telas; não corrigidas por tokens globais |
| F-05, texto branco no orçamento | Conforme no harness / Não verificado no Next | Não reapareceu no harness atual; não se alterou o componente |
| Next autenticado, permissões e persistência reais | Não verificado | Não foi usado backend nesta execução |
| Leitor de tela, zoom nativo e dispositivos físicos | Não verificado | Não atribuir o smoke a esses testes |

O navegador integrado foi tentado, mas falhou na inicialização dos assets do
kernel (os error3). As capturas reais foram feitas via Playwright/Edge, com
requisições fora de localhost bloqueadas. Não houve acesso remoto ou deploy.

## Prontidão para a Fase 2

Fundações implementadas e revisáveis. A fase fica aguardando aprovação visual do
usuário; os limites de Next autenticado/build permanecem explícitos, sem certificar
conformidade integrada. A Fase 2 deverá aplicar o gutter no shell, conferir a
largura útil da sidebar, remover duplicações globais conforme a decisão atual e
validar a cascata no Next seguro. Não transportar automaticamente todo o Bloco0
do roadmap anterior para esta fase de fundações.

Rollback: reverter somente os diffs desta fase e os novos arquivos específicos;
não remover o handoff original nem reverter dados. Nenhum commit, push, migration
ou publicação foi realizado. A Fase 2 não foi iniciada.
