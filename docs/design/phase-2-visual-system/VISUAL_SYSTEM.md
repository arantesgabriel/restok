> **HISTÓRICO — orientação substituída em 29/10/2026.** Norma vigente: DESIGN.md e docs/design/RESTOK_DESIGN_SYSTEM_V1.md na raiz. Preservado como evidência, sem autoridade normativa.

# Restok — Visual System · Fase 2

Proposta de 30/09/2026, entregue para revisão. Não autoriza a migração geral das telas.

**Registro histórico:** a rota `/visual-system` e seus componentes foram removidos em 01/10/2026 após a integração na interface principal, autorizada pelo usuário. A [validação e implementação final](../../audit/implementation-2026-10-01/IMPLEMENTACAO.md) registra o estado atual. Os caminhos, links de prévia e resultados abaixo descrevem a entrega original e já não representam arquivos ativos.

## Escopo e acesso

Prévia interativa em [localhost:3000/visual-system](http://localhost:3000/visual-system). As três provas são **compra em andamento, sheet de item e Produtos da casa**. Usam os 44 produtos iniciais do seed e as funções existentes de total, status e agrupamento.

A rota usa estado React local, sem Supabase, chamadas de API ou persistência. Recarregar descarta as alterações. A opção **Prévia → Reduzir movimentos** permite revisar a alternativa sem mudar preferências do computador.

O app conectado, auth, regras, contratos e telas existentes não foram migrados. A navegação desta prévia contém apenas Compra/Casa, as duas telas demonstradas; o sistema proposto mantém os três destinos existentes — Compra, Histórico e Casa — na futura migração. Não é a remoção de Histórico do produto.

Implementação da proposta: [tokens](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/visual-system/tokens.css), [estilos das provas](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/visual-system/proof.css), [composição](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-proof.tsx), [sheet](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-dialog.tsx), [editor](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-editor.tsx) e [Casa](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-home.tsx).

## Direção visual

A pessoa está em pé no corredor do mercado, sob luz clara, com uma mão no carrinho e pouco tempo para reconhecer o próximo produto. A interface usa superfície clara, texto legível, ações ao alcance do polegar e densidade que deixa os itens aparecerem cedo.

Geist, off-white, verde profundo e a assinatura oficial formam o reconhecimento. A hierarquia vem da ordem, proximidade, peso e contraste; as linhas da lista usam divisores discretos. A compra ganha prioridade sobre os resumos. Cor de apoio identifica seleção e contexto doméstico sem transformar cada item em card.

## Paleta e estados semânticos

As cinco cores oficiais são as âncoras. Os neutros derivados atendem legibilidade e controles; erro e atenção são exclusivamente funcionais, sem introduzir cores decorativas na marca.

| Papel / token | Valor | Uso |
|---|---|---|
| `--restok-green` | **#174C3C** | Marca, ação principal, seleção, foco e ícones de ação. |
| `--restok-soft` | **#B8D8C7** | Apoio, trilho de progresso e hover de superfícies de apoio. |
| `--restok-mist` | **#EAF3EE** | Seleção discreta, contextualização da compra ativa, estados de apoio. |
| `--restok-canvas` | **#FAFAF7** | Canvas, inputs, sheets, barra de ações e navegação. |
| `--restok-ink` | **#171A18** | Conteúdo principal. |
| `--restok-text-secondary` | #52645B | Metadados, placeholders e conteúdo resolvido legível. |
| `--restok-line` | #D6DFD9 | Divisores e limites de superfícies, sem função de identificação de input. |
| `--restok-line-strong` | #70877B | Limite dos inputs e controle de marcar item. |
| Hover primário | #123E31 | Variação tonal do verde profundo, restrita ao hover. |
| `--restok-danger` / surface | #963F36 / #FAEFED | Erro e ação destrutiva; texto e ícone devem explicar a situação. |
| `--restok-warning` / surface | #755119 / #F8F1E5 | Atenção: orçamento ultrapassado; sem semântica de erro fatal. |

Default: canvas e ink. Hover: mist em ações discretas, shade profundo em ação principal, apenas em dispositivos com hover e pointer fine. Active: press de 100 ms, sem deslocar o layout. Focus: contorno verde de 2 px com afastamento de 3 px; em inputs compostos, o contorno envolve o controle inteiro. Selected: mist, texto/ícone profundo, estado acessível e indicador discreto. Disabled: mist + texto secundário e bloqueio nativo; loading: manter tamanho e rótulo da ação, desabilitar repetição e anunciar progresso. Success: check + mensagem breve. Error: mensagem relacionada ao campo, aria-invalid e retorno de foco. Warning: texto explicativo e indicador, sem depender apenas da cor.

Loading remoto, ações destrutivas e suas superfícies estão definidos como regras, mas não foram simulados com requisições na prévia local.

## Tipografia, espaçamento e forma

**Geist Sans variável local**, pesos 400/500/600. O arquivo é o Geist latino já distribuído com Next.js 15.5.25; cópia sem alteração e com licença SIL OFL. Não há dependência nova nem download de fonte durante build. [Proveniência e licença](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/public/fonts/README.md).

| Papel | Tamanho | Peso |
|---|---:|---:|
| Labels compactos | 12 px | 400–500 |
| Legendas/metadados | 13 px | 400 |
| Ações/texto pequeno | 14 px | 500 / 400 |
| Produto e corpo da lista | 15 px | 500 para nome; 400 para leitura |
| Inputs | 16 px | 400 |
| Título de seção | 18 px | 600 |
| Valor / título de sheet | 22 px | 500 / 600 |
| Título mobile | 24 px | 600 |
| Título amplo | 28 px | 600 |

Títulos usam tracking de −.02 a −.03em; texto corrido não recebe tracking decorativo. Valores têm números tabulares. Nome longo quebra com segurança; conteúdo resolvido mantém contraste e reduz peso, sem opacity no bloco inteiro. Não usar os tamanhos de hero nas tarefas operacionais.

Escala de espaço: **4, 8, 12, 16, 20, 24, 32 e 40 px**. Mobile: margem lateral 16 px; sheet: 20 px; desktop: 24 px. Proximidade organiza campos relacionados; separação maior marca mudança de assunto. Controles têm mínimo de 44 px independentemente do tamanho visual do ícone.

Raios: 8 px para controles; 12 px para superfície contextual e menu; 16 px para sheet; pill apenas onde a forma tem função. Linhas da lista não têm caixa individual. Bordas são de 1 px; ícones lineares Lucide, stroke 1.75, em 16–20 px, sem caracteres Unicode decorativos para categoria.

Elevação: menu `0 2px 8px` e sheet `0 -2px 8px`, verde profundo com 12% de alpha. Não combinar borda e sombra difusa ampla. Backdrop usa preto suave com 36% de alpha. Cards, quando necessários, recebem fundo de apoio ou limite discreto; não aninhar cards de métrica dentro de cards.

O logo é o PNG oficial, copiado sem redesenho de `brand/01_logo_principal_transparente`, variante 02. O asset raster ainda merece o handoff vetorial previsto no guideline; não foi produzido um novo logo.

## Composição mobile, tablet e desktop

**Compra:** título e progresso de resolução; orçamento compacto; busca; filtros; categorias e itens. Resumo usa linhas, sem card dominante. Quatro filtros permanecem visíveis em 320 px, com alvo de 44 px e seleção sublinhada. Busca tem nome acessível persistente.

**Ações fixas:** substituir a colisão FAB/footer por uma barra única. À esquerda, pendências e total registrado; à direita, Adicionar item com rótulo e ícone. A navegação tem 60 px + safe area, e a barra tem 64 px. Reservar área no scroll para ambos. O botão não encolhe nem quebra o rótulo quando o total cresce.

**Desktop a partir de 768 px:** navegação vira lateral; conteúdo ocupa uma coluna clara e a barra de ações permanece alinhada à área principal. Não adicionar outro FAB flutuando sobre a CTA. Container máximo de 1200 px; título 28 px.

**Valores grandes:** em 320–430 px, quantias com seis ou mais dígitos levam o orçamento para linhas completas. Total e saldo ficam legíveis sem comprimir o texto. Acima do orçamento, texto e barra usam atenção sem deixar a compra inteira vermelha.

**Casa:** compra ativa em uma superfície mist, seguida dos recorrentes. Categoria/A–Z usam o mesmo padrão de estado selecionado. Nome e quantidade padrão ficam juntos, e edição tem área de 44 px. A lista ganha espaço ao retirar ícones e ações repetidos de baixo valor visual.

Finalização, Histórico, perfil e gestão de casa continuam no app existente. Sua migração exige as fases correspondentes; a proposta não elimina seus fluxos.

## Sheets e formulários

Dialog nativo em top layer. No mobile, sheet ancorado embaixo, largura disponível, raio superior de 16 px e altura máxima `100dvh − 24px`; no desktop, centralizado, máximo 480 px e margem de 24 px. Scroll acontece no painel e o fundo permanece bloqueado. Safe area entra no padding inferior.

Abrir edição da compra com foco no preço; criar item/produto com foco no nome. Escape, botão Fechar e toque no fundo fecham. Restaurar foco ao gatilho; quando o item deixa a seleção atual, buscar um alvo útil, como a busca.

Inputs de 16 px ou mais, preço com prefixo R$, inputMode decimal, quantidade com inputMode numeric e redução desabilitada em 1. Preço aceita vírgula/ponto e continua opcional. Erro mantém os valores, anuncia a mensagem e foca o campo. Nome e categoria do item existente ficam em disclosure de 44 px; os dados principais não precisam disputar espaço com opções ocasionais.

Pendente, Comprado e Já temos têm texto, ícone quando útil e aria-pressed. A implementação usa `statusAfterPrice` e `listTotal` existentes: registrar preço positivo continua marcando comprado; Já temos continua sem adicionar gasto. Quantidade padrão da Casa não altera a lista ativa.

## Motion e camadas

| Token | Duração | Regra |
|---|---:|---|
| instant | 100 ms | Press e confirmação do check. |
| fast | 160 ms | Hover, seleção, backdrop, saída do sheet e toast. |
| base | 220 ms | Entrada do sheet e progresso do orçamento. |
| slow | 280 ms | Reservado a mudanças de contexto que precisem de orientação; sem uso decorativo. |

Curva principal `cubic-bezier(.22, 1, .36, 1)`, sem bounce. Sheet entra 16 px e sai 12 px; check aparece com escala discreta; indicador de filtro e navegação confirma seleção. Progresso usa transform scaleX, sem animar largura. Não há stagger geral, animação de números ou parallax operacional. Nenhuma biblioteca de motion adicionada.

`prefers-reduced-motion: reduce` reduz tokens a zero e elimina duração significativa de animações/transições. O mesmo conjunto de regras pode ser acionado pela opção de revisão. Conteúdo não depende de animação para aparecer.

Camadas: menu 20, sticky 30, backdrop 35, dialog 40, toast 50, tooltip 60. O dialog nativo usa top layer; números de z-index não substituem esse comportamento. Mensagens relativas ao formulário devem ficar dentro dele; feedback geral aparece após o fechamento.

## Acessibilidade e contraste

| Combinação | Razão calculada |
|---|---:|
| Ink / canvas | 16,77:1 |
| Texto secundário / canvas | 6,03:1 |
| Verde profundo / canvas | 9,40:1 |
| Verde profundo / mist | 8,69:1 |
| Texto secundário / mist | 5,57:1 |
| Limite de controle / canvas | 3,69:1 |
| Erro / canvas | 6,56:1 |
| Atenção / canvas | 6,81:1 |

[Cálculos exatos dos tokens sRGB](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/contrast.json). Referências: [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) e [W3C — tamanho de alvo em WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). A meta de conforto é 44 px; AA tem 24 px com exceções.

Busca, filtros, status, categoria e ordenação têm nomes/estados. A edição do item descreve quantidade/status além do nome. Já temos anuncia pressed. Toast usa role=status; erros usam alert/aria-invalid/aria-describedby. O input de quantidade mostrou contorno visível de 2 px; Escape e salvar devolveram foco ao gatilho. Na sequência de Tab, houve passagem pelo chrome do navegador (BODY) e retorno ao dialog; não foi observada interação com controles do app fora do modal.

Não é certificação WCAG. Leitor de tela, zoom 200%, teclado virtual, safe areas e Safari/Android em aparelho real permanecem necessários antes da migração para produção.

## Validação e limites

| Verificação | Resultado |
|---|---|
| Lint | Passou, exit 0. |
| Typecheck | Passou, exit 0. |
| Testes do repositório | **101 testes em 11 arquivos passaram.** |
| Build de produção | Passou em cópia isolada, sem variáveis Supabase; a prévia foi prerenderizada. |
| Tamanho da rota | 13,9 kB; First Load JS 116 kB, dos quais 102 kB são compartilhados pelo framework. Não é medição de performance em aparelho. |
| Matriz visual | Compra, sheet e Casa × 9 larguras = **27 combinações**, sem overflow de documento/dialog e sem buttons/summary abaixo de 44 px nas medições. |
| Altura pequena | Compra e sheet também vistos em 320×568; primeiro produto já aparece na compra. |
| Stress monetário | R$ 246.913,56 em 320 px; documento permaneceu em 320 px, CTA com 44 px e uma linha. |
| Nome longo | Nome completo no editor e quebra segura na lista; sem overflow horizontal. |
| Fluxos locais | Buscar/filtrar, recolher categoria, marcar comprado/Já temos, editar quantidade/preço, adicionar item e incluir na Casa, ordenar, criar/editar produto. |
| Domínio | 6 × R$ 4,50 = R$ 27,00; Já temos retorna total a zero; mudar padrão Café para 3 não mudou a quantidade 1 na lista ativa. |
| Erro | Preço negativo mantém sheet aberto, mostra mensagem e devolve foco ao preço com aria-invalid=true. |
| Preço ausente | Comprado sem preço mantém preço opcional e informa “1 comprado sem preço” no total registrado. |
| Foco | Abrir edição foca preço; criar foca nome; fechar/salvar retorna ao gatilho e restaura scroll do fundo. |
| Movimento reduzido | Na opção de revisão, token fast = 0 ms e sheet/backdrop = 0,00001 s, sem movimento perceptível. CSS da preferência do sistema também existe; a preferência do computador não foi alterada. |
| Console da prévia | Sem warnings/errors capturados no registro final. |

Sem suíte E2E Playwright/Cypress no projeto; fluxos exercitados pelo navegador interno, sem adicionar framework nesta fase. Integração Supabase não executada porque não há alterações de backend e não foi disponibilizado projeto descartável. Há warning preexistente do build sobre detecção do plugin Next no ESLint, apesar de lint e build passarem; ficou fora do escopo.

Evidências adicionais: [medidas](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/measurements.json), [teclado](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/keyboard.json), [console](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/console.json) e logs nesta pasta.

## Before / after

Baselines capturados em cópia local do app existente, com os mesmos 44 produtos iniciais: compra sem itens resolvidos, Cebola com 5 unidades/preço 3,96 e Casa com catálogo inicial. Não são comparações pixel a pixel, porque a estrutura e os componentes mudam. O indicador “N” é do Next em desenvolvimento.

| Prova | Antes | Depois |
|---|---|---|
| Compra · 390 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-shop-390.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-shop-390.jpg) |
| Compra · 320×568 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-shop-320x568.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-shop-320x568.jpg) |
| Sheet · 390 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-item-sheet-390.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-item-sheet-390.jpg) |
| Casa · 390 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-home-390.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-home-390.jpg) |
| Compra · 1280 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-shop-1280.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-shop-1280.jpg) |
| Sheet · 1280 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-item-sheet-1280.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-item-sheet-1280.jpg) |
| Casa · 1280 | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-home-1280.jpg) | [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-home-1280.jpg) |

| Compra antes · 320×568 | Proposta · 320×568 |
|---|---|
| ![Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/before-shop-320x568.jpg) | ![Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-shop-320x568.jpg) |

Casos adicionais: [valor grande](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-large-value-320.jpg), [nome longo](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-long-name-sheet-320.jpg), [erro](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-price-error-320.jpg), [sem preço](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-unpriced-item-320.jpg) e [movimento reduzido](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/design/phase-2-visual-system/after-reduced-motion-320.jpg).

## Próxima fase e decisões separadas

Fase 3: aprovar estes tokens e padrões; extrair foundations reutilizáveis, integrar font/logo no app conforme escopo aprovado e validar componentes. As classes e componentes `proof` são o ambiente de revisão; não representam uma migração completa ou a API final do design system.

Finalização/histórico incorretos, reativação de produtos, encerramento implícito da compra ativa, destino da demonstração e navegação Back continuam como decisões separadas da auditoria. O rótulo “Total registrado” nesta prova esclarece preço opcional sem mudar cálculo ou obrigatoriedade.

Nenhuma Fase 3 foi iniciada. A aprovação deve avaliar a hierarquia da compra, barra única de ações, linguagem do sheet, densidade da Casa e os tokens propostos.
