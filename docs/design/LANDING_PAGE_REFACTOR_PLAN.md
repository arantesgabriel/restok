# Restok — plano de refatoração da landing page

**Data:** 01/10/2026. **Rota:** `/`. **Entrega deste documento:** orientação de implementação; nenhuma alteração de interface foi executada nesta etapa.

## 1. Objetivo e direção

Transformar a landing atual em uma apresentação clara, acolhedora e visual do ciclo **Planejar → Compartilhar → Comprar → Acompanhar**. A página deve explicar o produto em poucos segundos, demonstrar sua utilidade e conduzir à entrada/criação de conta.

A direção combina a composição dos cinco anexos com a fluidez da [Visor](https://visorfinance.app/), preservando a identidade própria do Restok: verde profundo, Geist, fundos claros, objetos domésticos discretos e interface de compras como protagonista. A cena de referência é a preparação tranquila de uma compra em casa, sob luz natural, antes de sair para o mercado.

**Assinatura da página:** a mesma lista ilustrada percorre as quatro etapas. Os itens e seus estados permanecem coerentes entre hero, planejamento, compartilhamento, compra e histórico. Isso dá continuidade à narrativa e diferencia a página de uma sequência genérica de cards.

### Escopo

- Refatoração completa da composição de `/`, incluindo header, hero, showcase, quatro etapas, navegação por etapas, dúvidas, CTA final e footer.
- Estilos e interações próprios da landing, mantendo a fonte, os tokens e os assets de marca já existentes.
- Demonstrações locais com dados fictícios explicitamente identificados; nenhum acesso à conta ou à casa do visitante.
- Adaptação mobile, acessibilidade, motion, metadados e validação de performance.
- Não inclui redesenho do aplicativo autenticado, mudança de regras de compras, implementação de cobrança ou publicação em produção.

**Prioridade:** conteúdo e composição responsiva → demonstrações coerentes → navegação → animações → acabamento. A página precisa funcionar antes de receber motion.

## 2. Base consultada e estado atual

O plano considera os arquivos do workspace, inclusive alterações locais já presentes em 01/10/2026. Antes de implementar, registrar novamente o estado do Git: há modificações anteriores em `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/ui.css`, documentos de produto/design e componentes do aplicativo. Não sobrescrever trabalho existente nem usar o último commit como substituto do estado analisado.

### Mapa do código

| Arquivo existente | Situação observada | Orientação para implementação |
| --- | --- | --- |
| `app/page.tsx` | Server Component de 14 linhas; header, hero em duas colunas, card de ciclo com três passos, seção compartilhada e footer. Todos os CTAs de entrada apontam para `/login`. | Manter a composição principal no servidor e substituir as seções por componentes próprios da landing. |
| `app/ui.css` | CSS compartilhado com login e app. Regras `.public-*` nas linhas 2–18; ajuste mobile em `max-width:639px` na linha 74; hover compartilhado na linha 95. | Migrar somente os estilos públicos para um CSS da landing; separar seletores compartilhados antes de remover `.public-*`. |
| `app/globals.css` | Geist local, paleta, pesos 400/500/600, foco visível e tratamento de movimento reduzido. Scroll suave global. | Reutilizar a base; criar extensões sob `.landing-page`, sem alterar tempos e dimensões do aplicativo. |
| `app/layout.tsx` | Importa `globals.css` e `ui.css`; metadata global simples, `lang="pt-BR"`, `data-scroll-behavior="smooth"`, viewport com safe areas. | Preservar o layout. Metadata específica da landing pode ser exportada em `app/page.tsx`. |
| `components/brand-mark.tsx` | `next/image` com `/brand/restok-logo.png`, dimensões 124×41, variante compacta e `priority`. | Reutilizar o logo; não recriar o wordmark como texto. Rever `priority` apenas se necessário, considerando todos os consumidores. |
| `tailwind.config.ts` | Tokens via CSS, pesos bold/extrabold/black mapeados para 600, camadas dropdown 20 / sticky 30 / modal 40 / toast 50. | Evitar presets globais novos. Raio e tipografia de marketing podem ser locais. |
| `app/login/page.tsx`, `app/login/login-form.tsx` | Uma rota para login/cadastro; abre em login e alterna cadastro por botão. Lê `next`/erros de autenticação, sem parâmetro atual para iniciar em cadastro. | `/login` é o destino válido de “Entrar” e “Começar agora”. Não inventar `/signup` ou um query param que ainda não funciona. |
| `app/app/page.tsx` | Rota autenticada; sem Supabase redireciona para `/login?auth=unavailable`, sem sessão redireciona para login. | “Ver como funciona” deve demonstrar na própria landing; `/app` não é uma demo pública. |
| `middleware.ts` | Matcher restrito a `/app/:path*` e `/auth/:path*`. | Manter `/` pública, sem middleware ou consulta de sessão adicional. |
| `lib/auth/redirect.ts` | Restringe destinos e queries permitidas de autenticação e convites. | Não alterar os redirects para acomodar âncoras de marketing. |
| `components/restok-app.tsx` | Navegação atual: Compra, Histórico, Casa. Histórico lista compras concluídas, seus itens e valores. | Usar como referência funcional; não importar o componente inteiro para os mockups. |
| `components/household-manager.tsx`, `lib/supabase/realtime.ts` | Convite por link; colaboração por casa; assinatura de mudanças em listas, produtos e itens. | Explicar colaboração existente; a demonstração pública apenas ilustra, sem conexão real. |
| `lib/types.ts`, `lib/utils.ts` | Categorias e status definidos; total soma quantidade × preço dos itens comprados; “Já temos” não soma. | Reutilizar tipos e funções puras quando úteis para manter os exemplos corretos. |
| `package.json`, `package-lock.json`, `vitest.config.ts` | Next App Router, React, TypeScript, Tailwind, Lucide e Vitest; sem biblioteca de motion e sem Playwright como dependência do projeto. | Usar CSS e IntersectionObserver inicialmente. Não pressupor infraestrutura E2E instalada. |
| `PRODUCT.md`, `DESIGN.md` | Descrição do MVP e direção visual atual. | Fundamentar textos e demos nesses arquivos. |

Versões resolvidas no lockfile: **Next 15.5.25, React/React DOM 19.2.8, Tailwind 3.4.19, Lucide 0.468.0 e Vitest 3.2.7**. As versões declaradas no `package.json` são intervalos; não confundir os dois registros. Não é necessário atualizar dependências para esta refatoração.

### Assets e documentação existentes

- Logo usado pela interface: `public/brand/restok-logo.png`; variantes em `brand/01_logo_principal_transparente/`, `brand/02_icone_com_fundo/` e `brand/03_icone_sem_fundo/`.
- Fonte: `public/fonts/geist-latin.woff2`, com licença e proveniência em `public/fonts/`. O README da fonte ainda descreve uso limitado à antiga prévia; o código atual já usa Geist globalmente.
- Guidelines visuais: `brand/visual-id/Restok_Visual_Identity_Guidelines_Page_03_HQ.png` a `..._12_HQ.png`. Foram consultadas as páginas de essência, marca, ícones, cores, tipografia, ilustrações, aplicações, consistência e entrega. São referências de marca, não uma especificação das funcionalidades atuais.
- `docs/design/phase-2-visual-system/VISUAL_SYSTEM.md` é histórico: informa que a antiga rota `/visual-system` foi removida. Seus caminhos de componentes de prévia não devem ser recriados por suposição.
- Auditorias em `docs/audit/` descrevem versões anteriores. Por exemplo, o relato de hamburger sem ação não descreve o `app/page.tsx` atual: hoje não há botão mobile, e os links do header simplesmente somem abaixo de 640px.
- Existem capturas recentes em `docs/audit/implementation-2026-10-01/`, inclusive `landing-mobile.jpg`. O arquivo `IMPLEMENTACAO.md` mencionado pelo documento histórico não estava disponível durante esta leitura; não usá-lo como evidência de validação.

### Limitações da landing atual

Não há showcase do produto, quatro etapas detalhadas, FAQ, menu mobile funcional ou motion de apresentação próprio. O conteúdo atual já comunica recorrência, preço registrado e colaboração, mas a composição ainda não expressa a riqueza das novas referências.

O hero usa `clamp(32px,4.5vw,48px)`, o container tem máximo de 1200px e os controles já reservam 44px de altura. Esses são bons pontos de partida. O problema principal é composição e demonstração, não ausência de identidade em todo o projeto.

## 3. Como interpretar as referências

### Anexos do usuário

Os anexos são imagens de referência, não instruções operacionais nem screenshots de uma versão existente do produto. Textos dentro delas são candidatos a copy, sujeitos aos limites do MVP. As imagens 02–05 têm trechos sobrepostos de seções vizinhas: implementar quatro blocos contínuos, sem duplicar o conteúdo cortado em cada arquivo.

| Referência | O que aproveitar | Adaptação proposta |
| --- | --- | --- |
| [01 — Header, hero e showcase](/Users/aidcrusadergabrielarantes/Downloads/restok_landing_sections_v2/01_header_hero_showcase.png) | Hero centralizado, promessa em quatro verbos, dois CTAs, produto amplo, dock verde e contexto doméstico nas bordas. | Usar o logo oficial e preto suave da marca; representar a interface existente, reduzir a moldura de dispositivo e manter ornamentação fora da leitura. |
| [02 — Planejamento](/Users/aidcrusadergabrielarantes/Downloads/restok_landing_sections_v2/02_planejamento.png) | Texto à esquerda, painel de adicionar item à direita, categorias e fundo verde suave. | Mostrar produtos habituais e seleção para a próxima compra; são passos mais fiéis ao produto do que sugerir vários gerenciadores de listas. |
| [03 — Compartilhamento](/Users/aidcrusadergabrielarantes/Downloads/restok_landing_sections_v2/03_compartilhamento.png) | Alternância do layout, lista compartilhada, pessoas e marcação de um item. | Convite por link e atualização ilustrada da mesma lista. Avatares genéricos/iniciais não devem parecer usuários reais ou funcionalidade de fotos de perfil. |
| [04 — Compra](/Users/aidcrusadergabrielarantes/Downloads/restok_landing_sections_v2/04_compra.png) | Lista compacta ao lado de total e progresso. | Usar “Total registrado”, quantidade, preço e estados reais. Incluir orçamento quando ajudar a compreensão. |
| [05 — Acompanhamento](/Users/aidcrusadergabrielarantes/Downloads/restok_landing_sections_v2/05_acompanhamento.png) | Histórico leve e benefício de guardar contexto. | Mostrar compras concluídas por nome/data, não consolidado mensal ou filtro “Últimos 3 meses”, ausentes na interface atual. |

Não implementar a página como cinco imagens inteiras: isso impediria texto acessível, layout responsivo, estados, tradução futura e animação dos elementos. Recriar a composição com HTML/CSS, usando imagens apenas onde fizerem sentido como assets.

### Visor: observação e tradução para Restok

A [Visor](https://visorfinance.app/) foi consultada em 01/10/2026 por leitura da página e inspeção visual desktop no navegador. Foram observados hero centralizado, CTAs adjacentes, navegação persistente em cápsulas, ilustrações de produto, módulos de recursos com conteúdo rotativo, entradas progressivas durante a rolagem, FAQ e CTA final. Esses elementos orientam ritmo e interação.

Para Restok, traduzir essa linguagem em hero com sequência curta, dock das quatro etapas, alternância entre texto e demonstração, entradas discretas e transições de estados da lista. Preservar verde e cotidiano doméstico. Não copiar assets, textos comerciais, claims, métricas ou linguagem financeira da Visor.

**Limite da observação:** não foram medidos os tempos/easings exatos da Visor nem validado seu comportamento mobile. Os valores de motion e breakpoints abaixo são especificações propostas para Restok, não medições do site de referência. Não há necessidade de reproduzir sua stack.

## 4. Conteúdo, estrutura e destinos

### Estrutura proposta

```text
Header: marca | Funcionalidades · Como funciona · Dúvidas | Entrar · Começar agora
Hero: contexto + promessa + explicação + dois CTAs
Showcase: a lista da casa, com itens, estados e total registrado
Dock: Planejar | Compartilhar | Comprar | Acompanhar
Introdução curta: Como funciona / Funcionalidades
01 Planejar:      texto                  demonstração
02 Compartilhar: demonstração           texto
03 Comprar:      texto                  demonstração
04 Acompanhar:   demonstração           texto
Dúvidas: perguntas essenciais
CTA final: organizar a próxima compra
Footer: marca, assinatura e navegação útil
```

Os números 01–04 fazem sentido porque representam uma jornada real. Evitar outro grid genérico de benefícios repetindo os mesmos quatro argumentos.

### Copy inicial para implementação

| Bloco | Texto proposto |
| --- | --- |
| Eyebrow do hero | Compras de casa sem complicação |
| H1 | Planeje. Compartilhe. Compre. Acompanhe. |
| Apoio do hero | Organize a próxima compra, compartilhe a lista com quem mora com você e acompanhe os valores registrados no mercado. |
| Etapa 01 | **Planeje suas compras em poucos cliques.** Parta dos produtos habituais da casa, escolha o que precisa repor e prepare a próxima compra. |
| Etapa 02 | **Compartilhe com quem mora com você.** Convide as pessoas da casa por link e acompanhe as atualizações da mesma lista enquanto vocês compram. |
| Etapa 03 | **Compre com mais facilidade.** Marque o que comprou, informe quantidades e preços e acompanhe o total registrado em relação ao seu orçamento. |
| Etapa 04 | **Guarde o contexto para a próxima compra.** Consulte compras concluídas, itens e preços anteriores para planejar a próxima reposição. |
| CTA final | **A próxima compra começa com a lista da casa.** Organize os produtos habituais e leve a lista com você para o mercado. |
| Assinatura do footer | A lista que vai ao mercado com você. |

Usar frases curtas e português brasileiro. “Compre” significa acompanhar a compra no mercado, não encomendar produtos pelo Restok. “Tempo real” descreve colaboração com conexão, não garantia de atualização instantânea ou funcionamento offline.

### Contrato de navegação

| Controle | Destino / comportamento |
| --- | --- |
| Marca | `/`, preservando o padrão atual. |
| Entrar | `/login`. |
| Começar agora, inclusive no CTA final | `/login`; o cadastro é acessível por “Criar conta” no formulário existente. |
| Ver como funciona | `#como-funciona`, com ícone de seta. Trocar o play do mockup por seta porque não há vídeo a abrir. |
| Funcionalidades | `#funcionalidades`, no começo do conjunto das quatro etapas. |
| Como funciona | `#como-funciona`, introdução da jornada. |
| Dúvidas | `#duvidas`. |
| Dock | `#planejar`, `#compartilhar`, `#comprar`, `#acompanhar`. Links de âncora, não tabs. |
| Ações nas etapas | “Ver o planejamento” → `#demo-planejar`; “Ver o convite” → `#demo-compartilhar`; “Ver uma compra” → `#demo-comprar`; “Ver o histórico” → `#demo-acompanhar`. Cada painel recebe seu ID e o mesmo offset de navegação. |

Preservar os hashes antigos `#como-funciona` e `#para-casa`; este último será um alias na seção de compartilhamento. Aplicar offset de scroll também aos aliases. Não criar links vazios nem destinos protegidos para uma demonstração pública.

**Preços:** o header do anexo mostra esse link, mas não foi encontrada implementação de planos/cobrança na aplicação consultada. Omitir “Preços” nesta primeira versão. Uma seção comercial futura depende de valores e condições fornecidos pelo responsável pelo produto; não inventar gratuidade permanente, assinatura, trial ou checkout.

### Dúvidas propostas

Implementar com `details/summary`, permitindo leitura e abertura sem JavaScript:

1. **Posso usar com outras pessoas da casa?** Sim. Convide por link para participar da casa e acompanhar a lista compartilhada.
2. **Como o total é calculado?** Pelos itens marcados como comprados com preço informado, multiplicado pela quantidade. Itens “Já temos” não aumentam o total.
3. **O que fica no histórico?** Compras concluídas, itens, quantidades e preços registrados.
4. **Preciso instalar um aplicativo?** O Restok atual funciona no navegador, no celular e no computador.
5. **O Restok controla minha despensa?** Ele organiza os produtos habituais e a lista de compras; não mede o estoque físico da casa.

Não adicionar FAQ comercial sem informações confirmadas. Footer não deve apontar para termos, privacidade ou suporte em rotas inexistentes; inserir esses destinos quando houver conteúdo real disponível.

## 5. Sistema visual da landing

### Tokens e identidade

| Papel | Base existente | Uso na landing |
| --- | --- | --- |
| Canvas | `#FAFAF7` / `--canvas` | Fundo dominante e respiro. |
| Texto | `#171A18` / `--ink` | Headings e leitura; substituir o azul quase preto dos mockups. |
| Verde profundo | `#174C3C` / `--primary` | CTAs, dock, seleção e marca. |
| Verde suave | `#B8D8C7` / `--soft` | Apoio, trilhos e detalhes. |
| Verde névoa | `#EAF3EE` / `--sage` | Fundos das demonstrações e áreas de contexto. |
| Texto secundário | `#52645B` / `--muted` | Parágrafos, metadados e notas legíveis. |
| Divisores | `#D6DFD9` / `--line` | Separação de linhas, sem substituir contorno acessível de controles. |
| Contorno de controle | `#70877B` / `--line-strong` | Limites de inputs/checkboxes realmente interativos. |

Manter valores RGB dos tokens existentes e derivar transparências localmente. Não é necessário migrar o sistema inteiro para outro formato de cor. Evitar verdes neon, texto em gradiente e sombras excessivas. Gradiente tonal discreto no dock pode ser experimentado, mantendo contraste em todo o percurso.

Tipografia: **Restok Geist**, já carregada localmente, com 400/500/600. Não adicionar fonte manuscrita: a identidade pede consistência com Geist. As notas afetivas dos anexos podem virar pequenas legendas em Geist, acompanhadas de uma seta simples, ou ser removidas quando competirem com o conteúdo.

### Escala proposta

- H1: `clamp(2.125rem, 4.8vw, 4rem)`, semibold, line-height 1.06–1.12, tracking −0.03em. O teto de 64px é uma extensão para marketing; não aplicar ao app. Ajustar o tamanho no limite de 320px para que nenhuma palavra transborde.
- H2 de etapa: `clamp(1.5rem, 2.8vw, 2.25rem)`, semibold, line-height 1.15–1.25.
- Corpo: 16px no mobile, 18–20px no apoio do hero em telas amplas, line-height 1.5–1.65; parágrafos de etapas até cerca de 45ch.
- Labels/legendas: 13–14px; conteúdo central das demos deve continuar legível sem depender de uma miniatura reduzida.
- Números e moeda: `font-variant-numeric: tabular-nums`. Usar `formatBRL` quando o valor vier de dados.
- Escala de espaço: aproveitar 4/8/12/16/24/32/40 e estender localmente para 64/80/96/128px nos intervalos entre seções.
- Container: máximo de 1200px, gutter de 16–20px no mobile e 24–40px nas telas maiores. Fundo/decorativos podem ultrapassar o container, texto e controles não.
- Formas: raios 20–28px nas molduras demonstrativas e pill nos CTAs/dock, como extensão da linguagem promocional. Dentro das listas, usar divisores; não transformar cada linha em um card.

### Assets

Reutilizar o arquivo oficial do logo sem filtros, redesenho, deformação ou sombra. PNG é suficiente para a primeira versão; um master vetorial futuro deve preservar o artwork aprovado e não bloquear esta entrega.

Para molduras, setas e formas suaves, usar CSS ou SVG simples. Para folhas, preferir uma ilustração dedicada coerente com os guidelines, em WebP/AVIF otimizado com transparência quando necessária. Não recortar texto ou UI dos anexos para usá-los como componentes. Não importar páginas de guidelines de 8000×4500 como imagens da landing.

Decoração fica nas bordas, com `aria-hidden="true"` e `pointer-events:none`; desaparece em telas pequenas quando roubar espaço. Limitar inicialmente a dois conjuntos de folhas no hero e uma ou duas notas pontuais na jornada. Avatares ilustrativos podem usar iniciais em vez de fotografias sem proveniência.

## 6. Demonstrações do produto

### Decisão técnica

Construir as demonstrações com DOM/CSS, renderizando o estado estático no servidor. Uma pequena ilha client pode atualizar os exemplos. Os dados são isolados em `components/landing/demo-data.ts`, identificados na página por “Exemplo ilustrativo”.

Não importar `RestokApp`, `HouseholdManager` ou clientes Supabase na landing. Os componentes reais misturam lógica de conta, cache e escrita; o reuso aqui deve ficar nos tipos, funções puras, iconografia e linguagem visual.

O showcase terá navegação ilustrativa fiel ao app: **Compra, Histórico e Casa**. Categorias e gestão da casa aparecem como contexto do fluxo, não como páginas independentes prometidas. Não reproduzir a sidebar do anexo com Listas, Categorias e Configurações como se esses destinos existissem hoje.

### Dados coerentes

Usar quatro produtos ilustrativos, com quantidade numérica e preço unitário. O modelo atual não tem unidade kg/litro nem imagem de produto: não sugerir suporte a essas propriedades como funcionalidade já implementada.

| Item | Quantidade | Preço unitário | Estado inicial do showcase |
| --- | ---: | ---: | --- |
| Tomate | 1 | R$ 8,90 | Pendente |
| Leite | 2 | R$ 5,90 | Pendente |
| Pão | 1 | R$ 6,50 | Comprado |
| Banana | 1 | R$ 5,90 | Comprado |

Resultado inicial: **R$ 12,40 registrados**, 2 de 4 comprados. Ao marcar Tomate: **R$ 21,30**, 3 de 4 comprados. Se Leite também for comprado: **R$ 33,10**, 4 de 4 comprados. Esses valores substituem os números inconsistentes do hero de referência, onde o total não corresponde aos itens marcados.

Separar “comprados” de “resolvidos”: “Já temos” resolve uma pendência, mas não aumenta os comprados nem o total. O progresso precisa indicar qual métrica representa. Comprado sem preço continua sendo comprado, acompanhado de aviso de que o total é parcial.

### Papel de cada painel

- **Showcase:** visão geral da compra; 3–4 linhas, filtros ilustrativos e total. Em desktop, moldura de navegador; no mobile, apresentação compacta focada na lista e no total.
- **Planejar:** produtos habituais e categorias Alimentos, Bebidas, Higiene, Limpeza, Outros; exemplo curto de escolher/adicionar um item. Sem backend, cadastro completo ou armazenamento.
- **Compartilhar:** duas pessoas genéricas na mesma lista, convite visual e uma atualização de estado. Não copiar link de convite real nem prometer sincronização sem conexão.
- **Comprar:** interação demonstrativa de marcar um item e ver total/progresso mudar. Usar `itemSubtotal`/`listTotal` ou funções equivalentes já existentes; não duplicar regras de preço.
- **Acompanhar:** três compras concluídas ilustrativas com nome, data e total; comparação contextual de preço anterior pode aparecer como nota. Não incluir gráfico mensal, previsão financeira ou filtro de meses inexistente.

Interações locais ficam claramente diferenciadas de CTAs de navegação. Controles que parecem botões devem funcionar; elementos puramente ilustrativos devem ser apresentados como ilustração, sem elementos focáveis falsos. A demo deve permitir “Reiniciar exemplo”, não persistir em localStorage e não depender de dados aleatórios que causem diferenças de hidratação.

## 7. Comportamento responsivo e navegação persistente

| Faixa proposta | Composição | Header e dock |
| --- | --- | --- |
| 320–639px | Hero, CTAs e etapas em uma coluna; texto antes da demo em todas as etapas. Showcase simplificado, sem encolher uma tela desktop inteira. | Marca + Entrar + botão Menu; “Começar agora” dentro do menu e do hero. Dock em 2×2, no fluxo, sem fixação inferior. |
| 640–1023px | Hero centralizado; demos amplas; duas colunas somente onde o conteúdo couber confortavelmente. | Manter menu compacto até haver espaço real para links e dois CTAs. Dock pode ficar no fluxo. |
| ≥1024px | Etapas alternadas em duas colunas, proporção aproximada 45/55, intervalos de 80–128px. | Header completo sticky; dock sticky durante o conjunto das etapas, abaixo do header. |

Os breakpoints são próprios da landing. Não alterar o `sm` usado pela navegação autenticada para adequar esta página.

### Header

Altura de referência 64px mobile / 72px desktop, com fundo suficiente para manter a leitura quando sobrepõe conteúdo. Efeito de translucidez/backdrop é opcional e localizado. Evitar transform em ancestrais sticky. Preferir menu mobile como disclosure inline com `details/summary`, utilizável antes da hidratação. O enhancement client acrescenta fechamento ao selecionar, Escape e retorno de foco ao gatilho. Se usar botão customizado, aplicar `aria-expanded`/`aria-controls` e oferecer alternativa navegável sem JavaScript.

Incluir “Pular para o conteúdo”. Header e menu não devem deixar CTAs ou seções ocultos atrás de suas áreas fixas.

### Dock das etapas

A cápsula verde começa junto ao fim do showcase, com sobreposição visual moderada da moldura. Em desktop, acompanha apenas o wrapper da jornada e libera o fluxo antes de FAQ/CTA/footer. Implementar um único dock, evitando duplicar links para versões visualmente equivalentes.

Usar anchors reais e ícone + texto. O indicador ativo recebe `aria-current="location"`, além de fundo/contraste; não usar `role="tab"`. Um IntersectionObserver compartilhado atualiza a etapa ativa com regra determinística: a seção que cruza a faixa abaixo do header/dock, mantendo a última ativa entre seções. Cliques atualizam o hash e a seleção; Back/Forward e deep links continuam funcionando.

Definir `scroll-margin-top` com tokens locais para header, dock e folga. Aplicar offset menor no mobile, onde o dock fica no fluxo. Não fazer scroll automático ao trocar o indicador durante a rolagem.

No mobile, o dock em 2×2 preserva os quatro rótulos e alvos de 44px sem slider obrigatório. Não usar barra inferior fixa nesta versão: a altura útil já é reduzida pelo navegador e pelos CTAs.

## 8. Motion: especificação de implementação

Os tempos abaixo são ponto de partida para ajuste visual. Reutilizar a curva `cubic-bezier(.22,1,.36,1)` e reservar tokens locais `--landing-motion-*`; não estender globalmente os 160/220/280ms do app para tempos de marketing.

| Elemento | Gatilho | Movimento proposto | Tempo / sequência |
| --- | --- | --- | --- |
| Hero | Primeira apresentação | Eyebrow, H1 e apoio com fade e deslocamento vertical de 8–12px; CTAs entram juntos. | 450–650ms; intervalo de 70–100ms; texto e CTA disponíveis imediatamente. |
| Showcase | Entrada na área visível | Fade + translateY de até 20px; scale 0,985 → 1 apenas em desktop se não prejudicar nitidez. | 650–800ms; uma vez. |
| Planejamento | Painel visível | Destaque da seleção de categoria/item após entrada leve do painel. | Entrada 450–550ms; detalhe 160–220ms. |
| Compartilhamento | Painel visível | Identificação de duas pessoas seguida da mudança de um estado da lista. | Dois passos de 180–250ms, sem repetir continuamente. |
| Compra | Clique ou ação demonstrativa pontual | Check e total atualizam; progresso usa `scaleX`, mantendo o número final legível. | 160–280ms. Evitar contagem artificial de centavos. |
| Histórico | Painel visível | Linhas aparecem com deslocamento até 8px e intervalos curtos. | 350–450ms, stagger de 40–60ms no máximo. |
| Dock | Nova etapa ativa | Crossfade de estado selecionado e pequeno deslocamento do ícone/indicador quando útil. | 160–220ms; sem mover a página. |
| CTA | Hover / foco / press | Variação tonal; seta desloca até 3px em hover, feedback equivalente no foco. | 120–180ms; hover apenas em pointer fine. |
| FAQ | Abrir / fechar | Estado do ícone e cor. Altura pode mudar instantaneamente com `details`. | Até 160ms no ícone; sem animar layout por padrão. |

Usar CSS para hover, foco, press e keyframes; IntersectionObserver para disparar entradas e definir seção ativa. Não adicionar Lenis, GSAP ou outra biblioteca sem demonstrar uma necessidade que CSS/Observer não atenda. Manter scroll nativo.

### Regras de robustez

- O HTML e o CSS padrão mostram o conteúdo. Não definir `opacity:0` persistente esperando hidratação, Observer ou animação terminar.
- Animações de entrada devem ser enhancement transitório: quando não executarem, o estado final continua visível. Se usar Web Animations API, tratar falha/cancelamento e respeitar preferências antes de iniciar.
- Não esconder H1, CTA ou informação essencial para esperar o showcase. Evitar fade no elemento que determinar LCP; se a medição acusar regressão, deixar esse elemento estático.
- Sem bounce, scroll hijacking ou parallax forte. Folhas podem permanecer estáticas; movimento ambiente não é requisito.
- Se uma sequência automática da demo durar vários segundos ou repetir, oferecer pausa. Preferir uma execução curta por entrada e interações acionadas pelo visitante.
- Pausar sequências fora do viewport/aba ativa; limpar observers, media-query listeners e timers no unmount. Não criar um listener de scroll por seção.
- Não manter `will-change` em todos os elementos nem animar width/height/top para efeitos de entrada. Preferir transform e opacity; limitar blur/backdrop a áreas pequenas.
- Tratar `prefers-reduced-motion` em CSS e JS: sem stagger, deslocamento, escala ou autoplay; seleção e valores mudam diretamente. O conteúdo e os estados continuam equivalentes.
- Visita direta a um hash deve exibir a seção sem obrigar nova animação do topo.

## 9. Arquitetura sugerida

Estrutura proposta, a ser criada durante a implementação:

```text
app/
  page.tsx                         composição no servidor + metadata da rota
  landing.css                      estilos exclusivos da landing
components/landing/
  landing-header.tsx                ilha client para menu mobile
  landing-hero.tsx                  conteúdo e composição do hero
  product-showcase.tsx              moldura e estado ilustrativo
  journey-navigation.tsx            dock, anchors e estado ativo
  journey-section.tsx               estrutura compartilhada das quatro etapas
  product-demos.tsx                 painéis visuais e interações locais
  demo-data.ts                      conteúdo, IDs estáveis e dados ilustrativos
  landing-motion.tsx                coordenação mínima de reveals
  landing-faq.tsx                   FAQ sem dependência de JS
  landing-footer.tsx                CTA final e fechamento
public/landing/
  ...                              apenas assets finais usados na página
```

Não é obrigatório criar um arquivo para cada painel se isso fragmentar uma implementação pequena. O limite importante é separar composição/conteúdo de menu, Observer e estado da demo. O Server Component pode passar conteúdo como `children` a wrappers client, evitando transformar a rota inteira em `use client`.

Importar `landing.css` a partir da rota pública e prefixar seletores com `.landing-page`/`.landing-*`. Como CSS importado pelo App Router não cria isolamento por si só, o prefixo é necessário. Keyframes e custom properties também devem usar nomes próprios.

Manter `app/ui.css` para login/app. Ao retirar regras antigas, preservar hover de `.login-submit` e `.purchase-add`, foco global, tokens e componentes operacionais. Não refatorar `components/restok-app.tsx` para atender ao marketing.

## 10. Fases de implementação

Cada fase entrega um incremento revisável. Atualizar os checkboxes e registrar decisões/validação neste mesmo documento; não espalhar a orientação em vários planos.

### Fase 0 — Baseline e alinhamento de conteúdo

**Dependência:** nenhuma. **Arquivos:** este plano e leitura dos arquivos existentes.

- [ ] Registrar Git status e identificar alterações prévias que devam ser preservadas.
- [ ] Executar os checks existentes para separar falhas anteriores de regressões futuras.
- [ ] Capturar a landing atual em 320, 390, 768 e 1280px, com data e viewport; não tratar capturas antigas como retrato atual.
- [ ] Registrar o bundle de `/` no build e uma medição local de performance em condições documentadas.
- [ ] Consolidar copy, contratos de CTA e dados de demonstração conforme seções 4 e 6.
- [ ] Inventariar assets; planejar produção/otimização somente dos elementos decorativos realmente usados.

**Aceite:** baseline reproduzível, escopo fechado para a versão inicial, nenhuma dependência de preços, vídeo, gráficos ou funcionalidades não existentes.

### Fase 1 — Fundação isolada e composição estática

**Dependência:** fase 0. **Arquivos:** `app/page.tsx`, novo `app/landing.css`, componentes base em `components/landing/`; remoção seletiva de `.public-*` em `app/ui.css`.

- [x] Criar o shell semântico: header, main, seções com headings/IDs e footer.
- [x] Aplicar paleta, Geist, escala de espaços e container definidos.
- [x] Construir versão mobile em uma coluna e desktop com alternância de etapas.
- [x] Reutilizar `BrandMark`; configurar estilos promocionais apenas no escopo da landing.
- [x] Preservar âncoras antigas e implementar CTAs com destinos válidos.
- [x] Separar seletores de hover compartilhados antes de retirar CSS legado.

**Aceite:** página completa e legível sem JavaScript, navegação por hashes funcional, sem vazamento de CSS para login/app. Ainda não é necessário animar.

### Fase 2 — Hero e showcase

**Dependência:** fase 1. **Arquivos:** hero, showcase, `demo-data.ts`, `landing.css`, assets em `public/landing/` quando necessários.

- [x] Implementar hero centralizado com H1 fluido, apoio e duas ações.
- [x] Criar showcase fiel à linguagem do app, com lista, total e navegação ilustrativa Compra/Histórico/Casa.
- [x] Preparar uma composição compacta para mobile em vez de reduzir proporcionalmente a desktop.
- [x] Inserir “Exemplo ilustrativo” e aplicar os cálculos coerentes definidos.
- [x] Adicionar folhas/legendas com moderação, assets dimensionados e sem interferir na leitura.
- [x] Reservar proporções de imagens e molduras para evitar mudanças de layout.

**Aceite:** identidade reconhecível, hero legível em 320px, CTA acessível na primeira tela em uma altura mobile típica, começo do produto visível logo depois. Não exigir a moldura desktop inteira acima da dobra.

### Fase 3 — Jornada em quatro etapas

**Dependência:** fase 2. **Arquivos:** `journey-section.tsx`, `product-demos.tsx`, `demo-data.ts`, `landing.css`.

- [ ] Construir os quatro blocos alternados, sem duplicar trechos dos anexos.
- [ ] Conectar visualmente os painéis com produtos e pessoas ilustrativas consistentes.
- [ ] Implementar apenas interações locais que esclareçam planejamento, convite, estados e histórico.
- [ ] Garantir total/progresso corretos e separar comprado de “Já temos”.
- [ ] Mostrar histórico por compra; retirar gráfico mensal e filtro inexistente.
- [ ] Adicionar reset de exemplo e caminhos claros para CTAs de seção.

**Aceite:** o visitante entende cada etapa pelo texto e pelo painel, sem backend ou sessão. Todas as affordances interativas têm efeito real e todos os valores batem com os dados.

### Fase 4 — Header, dock e navegação acessível

**Dependência:** fases 1–3. **Arquivos:** `landing-header.tsx`, `journey-navigation.tsx`, `landing.css`.

- [ ] Implementar menu mobile com teclado, Escape, foco e fechamento após navegação.
- [ ] Aplicar header sticky com altura previsível.
- [ ] Implementar dock no fluxo mobile e sticky limitado à jornada desktop.
- [ ] Criar atualização da etapa ativa por Observer, `aria-current` e offsets para deep links.
- [ ] Exercitar navegação por clique, teclado, rolagem, hash inicial e histórico do navegador.

**Aceite:** não há colisão entre header/dock/conteúdo; nenhum heading alvo fica escondido; nenhum link desaparece sem alternativa mobile.

### Fase 5 — Motion e microinterações

**Dependência:** fase 4. **Arquivos:** `landing-motion.tsx`, componentes interativos e estilos locais.

- [ ] Implementar a sequência de hero e entrada do showcase conforme tabela de motion.
- [ ] Dar a cada demo um movimento ligado ao seu significado, evitando o mesmo fade em todos os blocos.
- [ ] Sincronizar check, total e progresso, sem loops desnecessários.
- [ ] Adicionar feedback de hover, foco e press.
- [ ] Implementar alternativa reduced motion em CSS e JS e cleanup de recursos.
- [ ] Testar JS desativado, Observer ausente, aba oculta e deep links.

**Aceite:** a experiência permanece completa sem animação; CTA e conteúdo não esperam motion; interação e rolagem continuam fluidas no mobile.

### Fase 6 — Fechamento, metadados e otimização

**Dependência:** fases 3–5. **Arquivos:** FAQ, footer, `app/page.tsx`, `public/landing/` e CSS local.

- [ ] Implementar FAQ, CTA final e footer com links existentes.
- [ ] Definir título/descrição específicos da rota, coerentes com o produto. Se houver domínio de produção confirmado, configurar canonical e metadataBase/Open Graph com esse domínio; não adivinhar URL pela imagem.
- [ ] Preparar imagem social otimizada se fizer parte da entrega; não usar o mockup inteiro ilegível como thumbnail.
- [ ] Aplicar `next/image`, `sizes`, dimensões ou aspect-ratio e lazy loading nos assets abaixo da dobra.
- [ ] Priorizar somente asset realmente crítico para LCP, quando houver. Evitar preload de folhas decorativas e logo repetido do footer.
- [ ] Revisar imports e bundle para impedir entrada de Supabase/app na rota pública.

**Aceite:** conteúdo de fechamento verdadeiro, metadados sem placeholders e assets proporcionais ao uso. Domínio não confirmado não bloqueia a página local; canonical/URLs sociais ficam explicitamente pendentes.

### Fase 7 — Validação e handoff

**Dependência:** todas as anteriores. **Arquivos:** implementação, testes pertinentes e registro de resultados neste documento.

- [ ] Rodar lint, typecheck, testes e build.
- [ ] Executar matriz visual e funcional da seção 11; corrigir falhas antes de finalizar.
- [ ] Comparar login, reset-password e app com o baseline para detectar vazamento de estilo.
- [ ] Medir bundle/performance e reduzir imagens/motion se houver regressão.
- [ ] Registrar capturas, resultados, limitações, arquivos alterados e dependências adicionadas, se houver.
- [ ] Limpar CSS público obsoleto sem remover regras operacionais compartilhadas.

**Aceite:** página revisável e pronta para integração, com verificações registradas. Deploy/merge ficam para uma solicitação específica; este plano não os executa.

## 11. Verificação e critérios finais

### Checks do projeto

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Executar primeiro no baseline e depois no incremento concluído. Não atribuir à landing falhas anteriores. Não é necessário executar testes Supabase para demos locais que não modificam contratos de backend.

Adicionar testes somente para comportamento novo que possa regredir: menu mobile, estado ativo do dock/Observer com mock, reset/total da demo e preservação dos destinos. Usar Vitest/Testing Library existentes com ambiente DOM quando necessário. Não escrever testes que apenas reproduzam a marcação, cores ou uma função pura já coberta.

### Matriz de revisão

| Eixo | Casos e critérios |
| --- | --- |
| Larguras | 320, 360, 375, 390, 412, 430, 768, 1024, 1280 e 1440px. Sem overflow horizontal do documento. |
| Altura | 320×568 e um mobile com altura de cerca de 844px; CTAs/dock não cobrem conteúdo. |
| Responsividade | Ordem do DOM coerente com leitura mobile; texto antes da demo; molduras e valores não cortados. |
| Teclado | Skip link, menu, CTAs, dock, demo e FAQ; foco visível, ordem lógica e Escape no menu. |
| Leitor de tela | Um H1, H2 por etapa, nomes de controles, seção ativa anunciada; decorativos ignorados. Demos com resumo textual suficiente. |
| Contraste | Texto normal ≥4,5:1, texto grande ≥3:1, controles/indicadores ≥3:1 quando necessário. Medir sobre gradiente/translucidez real. |
| Toque e zoom | Alvos preferencialmente ≥44×44px, zoom 200%, sem conteúdo ou ação inacessível; verificar reflow equivalente a 320px. |
| Movimento reduzido | Sem autoplay, stagger ou deslocamentos; seleção e números continuam corretos. |
| JS ausente/falhando | Conteúdo, imagens, âncoras e FAQ visíveis; fallback da demo mostra um exemplo útil. Menu mobile precisa de fallback navegável, por exemplo disclosure nativo ou links públicos visíveis sem enhancement. |
| Navegação | Todas as âncoras, aliases antigos, hash inicial, Back/Forward e CTAs para `/login`; não cair em `/app` ao pedir demo. |
| Estados da demo | Reset, comprado, pendente, Já temos e comprado sem preço; total nunca inclui item pendente/Já temos. |
| Regressão | `/login`, `/reset-password` e telas Compra/Histórico/Casa; fonte, hover, dialogs e ações fixas existentes preservados. |
| Navegadores | Chromium desktop; Safari/iOS e Chrome/Android quando houver acesso. Registrar os que não forem exercitados. |

### Metas de performance propostas

- LCP ≤2,5s, CLS ≤0,1 e INP ≤200ms são metas de experiência. Resultado local é diagnóstico; não afirmar percentil 75 de campo sem amostra real.
- Medir build de `/` antes/depois. Meta inicial para JS adicional da landing: **até 30kB comprimidos**, além do baseline compartilhado; justificar qualquer aumento com medição. Não usar o orçamento antigo de `/app` como baseline de `/`.
- Como orçamento inicial de assets, buscar até cerca de 300kB transferidos para imagens efetivamente usadas no primeiro viewport mobile; privilegiar DOM, logo existente e ilustração otimizada.
- Registrar condições de rede, cache, navegador e viewport, identificando se o LCP é texto, fonte ou imagem. Corrigir a causa medida, não adicionar preload indiscriminadamente.
- Nenhuma chamada Supabase, consulta a usuário, escrita, cache de conta ou sessão deve ser necessária para renderizar a landing.

## 12. Decisões iniciais e pendências

| Tema | Decisão para a primeira implementação | Pendência real |
| --- | --- | --- |
| Direção | Anexos + ritmo/interações da Visor + identidade Restok. | Ajuste visual fino durante implementação. |
| Tipografia | Geist local, pesos existentes. | Nenhuma fonte nova. |
| Motion | CSS, scroll nativo e Observer; demos curtas e acionáveis. | Avaliar biblioteca somente se surgir necessidade demonstrada. |
| Navegação | Header sticky; dock sticky desktop dentro da jornada, 2×2 em fluxo mobile. | Validar alturas e offsets nas capturas. |
| Cadastro | CTA `/login`, conforme fluxo atual. | Entrada direta em cadastro exigiria extensão explícita do formulário; não faz parte desta versão. |
| Preços | Omitir seção e link. | Valores e condições comerciais futuros. |
| Histórico | Compras concluídas e preço anterior. | Gráficos mensais exigiriam outro escopo de produto. |
| Ornamentação | Poucos elementos domésticos nas bordas. | Produzir asset dedicado se os arquivos disponíveis não atenderem. |
| Domínio/SEO absoluto | Não presumir domínio pelo mockup. | Confirmar domínio publicado antes de canonical/URLs sociais finais. |
| Publicação | Entregar implementação validada para integração. | Autorização de deploy em trabalho posterior. |

### Checklist de conclusão

- [ ] Identidade Restok preservada e composição renovada.
- [ ] Hero e quatro etapas claros, com exemplos consistentes.
- [ ] Header/dock úteis no desktop e mobile.
- [ ] Todos os CTAs e links têm destino válido.
- [ ] Demos ilustrativas isoladas do produto autenticado.
- [ ] Motion inspirado na referência com fallback completo.
- [ ] Página legível, acessível e sem overflow em 320px.
- [ ] Nenhuma promessa comercial ou funcionalidade inventada.
- [ ] Checks, capturas e medições registrados com limitações reais.
- [ ] Nenhuma regressão nas telas que compartilham a base visual.

## 13. Registro de execução

Preencher ao implementar; não representa trabalho já realizado.

| Fase | Status | Arquivos/decisões relevantes | Verificação e evidência |
| --- | --- | --- | --- |
| 0 — Baseline | Pendente | — | — |
| 1 — Fundação | Concluída em 01/10/2026 | `app/page.tsx`, `app/landing.css`, `components/landing/*`. CSS `.public-*` removido de `app/ui.css`; hover de `.login-submit` e `.purchase-add` mantido. Menu mobile é `<details>` nativo, sem ilha client. Demos estáticas usam `listTotal`/`itemSubtotal`. `#para-casa` fica fora do grid para não ocupar coluna. | `npm test`: 64 testes. Browser em 320, 390×844 e 1280: sem overflow, H1 íntegro, CTAs na primeira tela de 844px, dock 2×2, etapas alternadas, hash `#como-funciona`, FAQ abre sem JS. `/login` sem classes da landing; botão continua verde com raio de 8px. Motion, dock sticky e interação das demos ficam para as fases seguintes. |
| 2 — Hero/showcase | Concluída em 01/10/2026, após autorização do usuário | `landing-hero.tsx`, `product-demos.tsx`, `landing.css`, `public/landing/pantry-leaves.svg`. Hero em dois grupos de verbos, moldura de navegador/side navigation desktop e lista/resumo/navegação inferior mobile. Exemplos continuam no servidor e usam os dados/cálculos existentes. | Lint, typecheck, 64 testes e build aprovados; 10 larguras sem overflow; CTAs cabem em 320×568; fallback sem scripts validado. Baseline da fase 1 preservada antes das alterações; capturas refeitas em cópia isolada. Detalhes no registro da fase 2 abaixo. |
| 3 — Jornada | Pendente | — | — |
| 4 — Navegação | Pendente | — | — |
| 5 — Motion | Pendente | — | — |
| 6 — Fechamento/SEO | Pendente | — | — |
| 7 — Validação | Pendente | — | — |

## 14. Validação independente da fase 1 — 01/10/2026

**Resultado:** os seis itens de implementação da fase 1 estão atendidos, sem defeitos técnicos bloqueantes encontrados no escopo da fundação estática. A aprovação para iniciar a fase 2 ainda depende do responsável pelo produto. Nenhuma implementação da fase 2 foi realizada nesta revisão; foram acrescentados apenas este registro e evidências.

### Padrões

Nenhum achado acionável. A composição permanece no servidor, reutiliza `BrandMark`, Geist e os tokens existentes. Os seletores novos são `.landing-page`/`.landing-*`; a remoção de `.public-*` preserva os hovers de `.login-submit` e `.purchase-add`. Não houve alteração das regras operacionais ou de autenticação.

### Aderência ao plano

Shell semântico, um H1, headings/IDs das etapas, mobile com texto antes do painel, alternância desktop, destinos `/login` e hashes antigos estão presentes. O menu e o FAQ usam disclosure nativo e funcionam sem execução de scripts. Há bases estáticas de showcase, demos e fechamento, a serem refinadas nas fases correspondentes; elas não representam conclusão antecipada dessas fases.

**Ressalva de processo:** a fase 0 permanece pendente no checklist e no registro de execução, embora seja dependência explícita da fase 1. As verificações atuais não substituem uma baseline anterior à implementação. Falta documentar ou recuperar a evidência histórica disponível e registrar expressamente o que não puder ser recuperado; não é possível concluir comparação de bundle/performance ou regressão visual histórica a partir desta revisão.

### Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Estado revisado | Alterações locais sobre `HEAD` `2370f33fc9e42b6c956173045645010bb455d34f`: `app/page.tsx`, `app/ui.css`, `app/landing.css`, `app/page.test.tsx` e `components/landing/`. Documentos/capturas anteriores preservados. |
| Lint e typecheck | `npm run lint` e `npm run typecheck` aprovados. |
| Testes | `npm test`: 18 arquivos e 64 testes aprovados. |
| Build | `npm run build` aprovado. `/` estática: 187 B de tamanho de rota e 111 kB de First Load JS; 103 kB compartilhados. São números do build atual, sem delta histórico ou medição de Core Web Vitals. Aviso do build sobre plugin Next no ESLint e avisos de cache webpack registrados na execução, sem falha dos checks. |
| Layout | Codex In-app Browser, build de produção local em `127.0.0.1:3115`; larguras 320, 360, 375, 390, 412, 430, 768, 1024, 1280 e 1440 com altura 844. Nenhum overflow horizontal do documento; H1 sem transbordar; textos antes das demos no mobile e etapas alternadas a partir de 1024. Inspeção adicional em 320×568 e captura desktop em 1280×900. |
| Sem scripts | Proxy local temporário em `127.0.0.1:3116`, mesmo build, com cabeçalho `Content-Security-Policy: script-src 'none'`. Conteúdo e estilos visíveis; menu abre/fecha com Enter; FAQ abre; links de hash funcionam. Esse teste bloqueia scripts da página, sem alterar preferências globais do navegador. |
| Destinos e âncoras | Todos os hashes do HTML têm alvo existente e não há IDs duplicados. Exercitados `#funcionalidades`, `#como-funciona` e acesso direto a `#para-casa`; o alias chega à seção Compartilhar com offset de aproximadamente 16px. CTAs de entrada apontam para `/login`, sem `/app` ou `/signup`. |
| Isolamento | Navegação da landing para `/login`: nenhuma classe `landing-*`, fonte Geist, botão verde `rgb(23, 76, 60)` e raio 8px preservados. `/reset-password` também sem classes da landing, com Geist. CSS operacional preservado pela comparação do diff; telas autenticadas não foram exercitadas no navegador nesta revisão. |
| Console normal | Nenhum erro ou warning retornado pelo capturador do In-app Browser na visita normal ao build. |

**Evidências atuais:** [mobile 390×844](../audit/landing-foundation-validation-2026-10-01/landing-390.png), [desktop 1280×900, página inteira](../audit/landing-foundation-validation-2026-10-01/landing-1280.png), [âncora sem scripts](../audit/landing-foundation-validation-2026-10-01/nojs-anchor-390.png) e [medições de layout](../audit/landing-foundation-validation-2026-10-01/layout-measurements.json).

**Limites:** não houve ensaio em aparelhos Safari/iOS ou Chrome/Android, leitor de tela, zoom 200%, sessão autenticada ou medição de LCP/CLS/INP. Dock sticky/ativo, enhancement do menu, interações/reset das demos e motion continuam nas fases previstas. Total: zero achados técnicos de padrões; uma ressalva de processo na aderência ao plano (fase 0 sem baseline registrada).

## 15. Execução e validação da fase 2 — 01/10/2026

**Autorização:** o usuário solicitou prosseguir para a fase 2 após a validação da fase 1 e ciência da ressalva de baseline. A fase 3 permanece pendente.

### Implementação

- Hero centralizado com dois grupos de verbos no H1, escala fluida, apoio e CTAs existentes. O eyebrow agora mantém 14px, sem herdar a escala/margem do parágrafo de apoio. O título pode ocupar quatro linhas em 320px para preservar palavras e legibilidade.
- Showcase em DOM/CSS com moldura de navegador no desktop, marca oficial, navegação ilustrativa **Compra / Histórico / Casa**, filtros ilustrativos, quatro itens e resumo. No mobile, a moldura de navegador e o logo lateral ficam ocultos; a lista permanece em tamanho legível, com resumo compacto e navegação ilustrativa inferior.
- Os controles ilustrativos são listas de texto/ícones, sem links falsos, botões inertes ou tab stops. A identificação “Exemplo ilustrativo” acompanha a figura. As interações locais das demos pertencem à fase 3.
- Dados de `demo-data.ts` e cálculos existentes preservados: Pão R$ 6,50 + Banana R$ 5,90 = **R$ 12,40**, 2 de 4 comprados, orçamento **R$ 80,00**, disponível **R$ 67,60**. Tomate e Leite continuam pendentes e não somam.
- Dois ramos discretos nas bordas do hero, ocultos abaixo de 1024px, com `aria-hidden`, alt vazio e sem captura de ponteiro. Asset vetorial original criado para a landing: `public/landing/pantry-leaves.svg`, 180×320, **897 bytes**, aplicado com `next/image`, dimensões e `sizes` explícitos. Sem dependências novas. O DOM do showcase é renderizado no servidor; não há conteúdo aguardando carregamento de screenshot ou hidratação.
- Nenhuma alteração em autenticação, regras de compras, aplicativo autenticado ou estilos globais. Nenhum motion, dock sticky/ativo ou interação da fase 3 foi antecipado.

### Verificação

| Caso | Resultado |
| --- | --- |
| Baseline desta fase | Antes de editar, foram preservados os arquivos alterados da fase 1 e feitas medições em 320×844, 390×844, 768×844 e 1280×900. As capturas iniciais apresentaram recortes do compositor e foram substituídas por capturas completas da mesma interface, reconstruída com as fontes preservadas em cópia isolada, sem `.env`, servida em `127.0.0.1:3117`. As evidências permitem comparar a fase 2 com a fase 1; não reconstituem a baseline histórica ausente da fase 0. Screenshots JPEG registram a área de conteúdo capturada pelo In-app Browser; dimensões de viewport estão nas medições. |
| Checks | `npm run lint`, `npm run typecheck`, `npm test` (18 arquivos, 64 testes), `npm run build` e `git diff --check` aprovados. Não foram acrescentados testes que apenas espelhem markup/CSS; os contratos de destino existentes continuam cobertos. |
| Responsividade | Codex In-app Browser, produção local em `127.0.0.1:3115`, larguras 320, 360, 375, 390, 412, 430, 768, 1024, 1280 e 1440. Sem overflow horizontal; H1 e valores íntegros; nenhuma imagem quebrada ou hash sem destino. Chrome da moldura e decoração aparecem apenas no desktop. |
| Primeira tela | Em 320×568, ambas as ações do hero cabem: final do grupo de CTAs em y≈523px. Em 390×844, CTAs terminam em y≈424px e o produto começa em y≈456px, comparados a 457/489px na fase 1. |
| Desktop | Em 1280px, CTAs terminam em y≈435px e o showcase começa em y≈475px, comparados a 502/558px na fase 1. Navegação lateral e resumo lado a lado com a lista, sem reduzir a interface proporcionalmente. |
| Sem scripts | Mesmo build através do proxy temporário `127.0.0.1:3116`, com `Content-Security-Policy: script-src 'none'`. Os quatro itens, preços, total, saldo e navegação ilustrativa continuam visíveis e legíveis. |
| Contraste dos tokens usados | Texto muted sobre canvas **6,03:1**, muted sobre sage **5,57:1**, primary sobre canvas **9,40:1** e primary sobre sage **8,69:1**; canvas sobre primary **9,40:1**. Cálculo sRGB dos tokens opacos, sem alegar auditoria completa de todos os estados. |
| Bundle/assets | `/` continua estática, 187 B de tamanho de rota e **111 kB de First Load JS**, sem aumento nos números reportados frente à fase 1. O novo asset tem 897 bytes. Não confundir tamanho do arquivo com medição de transferência, nem números do build com Core Web Vitals. |
| Console | Nenhum erro/warning retornado pelo capturador na visita normal. O aviso já observado do build sobre plugin Next no ESLint permanece sem impedir os checks. |

**Evidências:** [antes em 390px](../audit/landing-phase-2-2026-10-01/before-390.jpg), [depois em 390px](../audit/landing-phase-2-2026-10-01/after-390.jpg), [desktop 1280×900](../audit/landing-phase-2-2026-10-01/after-1280.jpg), [showcase desktop completo](../audit/landing-phase-2-2026-10-01/showcase-1280.jpg), [mobile 320×568](../audit/landing-phase-2-2026-10-01/after-320x568.jpg), [resumo mobile sem scripts](../audit/landing-phase-2-2026-10-01/nojs-showcase-390.jpg), [medições anteriores](../audit/landing-phase-2-2026-10-01/before-measurements.json) e [medições finais](../audit/landing-phase-2-2026-10-01/after-measurements.json). A pasta também contém pares antes/depois em 320 e 768px.

**Limites:** não foram medidos LCP/CLS/INP ou desempenho em aparelhos reais; dimensões reservadas e conteúdo SSR são medidas preventivas, não prova de CLS zero. Validação completa de acessibilidade, zoom, motion, regressão autenticada e performance permanece nas fases previstas. Trabalho anterior mantido no checkout; sem commit, merge ou deploy nesta etapa.
