# Auditoria UX/UI Restok

## 1. Resumo executivo

Fase 1 realizada em 30/09/2026, sem alterações no código do produto. O Restok tem uma base funcional aproveitável: listas agrupadas, ações rápidas por item, formulários nativos, navegação simples e feedback de total. O maior problema é a distribuição de atenção e espaço durante a compra, agravada pela distância da identidade oficial.

Foram registrados **22 achados: 0 P0, 10 P1, 10 P2 e 2 P3**. P0 bloqueia a tarefa; P1 tem impacto alto; P2 tem impacto moderado; P3 é refinamento. Cinco achados, identificados por F, envolvem comportamento ou interpretação dos dados e devem ser tratados separadamente da refatoração visual.

Prioridades: impedir a colisão FAB/resumo; devolver área útil à lista em telas pequenas; aplicar Geist e as cores oficiais; corrigir contraste, nomes acessíveis e foco; tornar o histórico fiel aos estados dos itens.

| Dimensão técnica | Nota / 4 | Fundamentação |
|---|---:|---|
| Acessibilidade | 2 | Bons formulários de login e dialog nativo; busca sem nome, filtros sem estado e contraste reduzido nos itens resolvidos. |
| Performance | 3, provisória | Dependências enxutas e ausência de biblioteca pesada de motion. Sem medição de FPS, bundle de produção ou Core Web Vitals. |
| Responsividade | 2 | Breakpoints funcionam, mas há colisão de controles e overflow monetário em 320 px. |
| Tokens/tematização | 2 | Tokens existem; cores legadas e estilos locais não seguem integralmente a marca. Dark mode não é requisito identificado. |
| Clareza/antipadrões | 3 | Listas usam divisores, sem excesso generalizado de cards; controles e resumos ainda disputam atenção. |
| **Total indicativo** | **12 / 20** | **Base aceitável, com trabalho significativo. Não é certificação de acessibilidade ou desempenho.** |

O diagnóstico não é “toda a UI parece gerada por IA”. Há decisões específicas e saudáveis. Os sinais confirmados são repetição de caixas em formulários, controles com pesos próximos, excesso de informação antes dos itens e pouca assinatura da marca.

## 2. O que a identidade visual exige

Inspecionados integralmente [brand/README.txt](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/brand/README.txt), as 12 páginas de [brand/visual-id/](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/brand/visual-id) e as 12 variações PNG nas três pastas de logo/ícone. O repositório contém essas imagens; os PDFs citados no README não estavam presentes.

| Aspecto | Exigência da identidade | Produto observado / consequência |
|---|---|---|
| Personalidade | Doméstica, prática, humana, simples, confiável, organizada e próxima. | O texto e as tarefas combinam com a proposta; a composição do fluxo principal precisa favorecer uso rápido no mercado. |
| Paleta | Verde profundo **#174C3C**, suave **#B8D8C7**, névoa **#EAF3EE**, off-white **#FAFAF7**, preto suave **#171A18**. Valores documentados na página 06. | Tokens atuais equivalem aproximadamente a canvas #FBFBF2, primary #145F30, sage #DAEFDA e ink #122112. Essas aproximações descrevem o legado; não substituem os valores oficiais. |
| Superfícies | Predomínio do off-white; profundo em marca/foco/ações, verdes claros em apoio. | Landing amarelada; branco puro em superfícies; terracota também decorativa. Separar cor semântica de alerta de cor de marca e evitar inventar uma paleta paralela. |
| Tipografia | **Geist**; corpo regular e títulos semibold. Referências: display 32–48, títulos 24–32, subtítulos 18–22, corpo 14–16, legendas 12–13, botões 14–16 px. | Body usa Avenir Next/Segoe/system; landing usa Georgia. Parte dos metadados fica em 10,7–11 px. O mapeamento de bold/extrabold/black para 600 evita peso 900, mas concentra hierarquia no semibold. |
| Logo | Wordmark minúsculo, proporções e ponto preservados; sem redesenho, deformação ou efeitos. | `BrandMark` e versões públicas são texto digitado. Login usa cesta genérica no lugar da assinatura r+ponto. Integrar os arquivos aprovados, sem reconstruir a marca. |
| Ícones | Traço linear consistente, simples, sem misturar estilos 3D/filled. | Lucide é uma boa base; categorias usam caracteres Unicode (`◌`, `⌁`, `✦`, etc.), com aparência dependente da fonte. |
| Ilustrações | Formas simples, suaves, domésticas/mercado, verdes e neutros, com respiro. | A narrativa pública pode continuar doméstica; ajustar paleta e tipografia sem transportar decoração para a compra. |
| Bordas, raios, sombras | Exemplos discretos, leves e funcionais. | O guideline não fixa uma escala numérica. Definir escala na Fase 2 é tradução da identidade, não cumprimento de números inexistentes. |
| Handoff | Página 12 descreve uma base raster e evolução para masters vetoriais. | Sem SVGs prontos identificados. Conferir exportações e transparência antes da integração. |

Preservar a simplicidade, o r+ponto, a paleta exata, Geist e o tom cotidiano. Não extrapolar para estética financeira, cromatismo terracota decorativo, serifas de identidade paralela ou ilustrações excessivas. Os nomes das pastas de ícones nem sempre correspondem ao fundo visível das variantes; validar visualmente cada exportação. Algumas variantes claras apresentam bordas/alpha irregulares na inspeção: conferir em superfícies finais, sem redesenhar o logo.

## 3. Inventário de telas auditadas

Stack: Next.js App Router 15 (instalado 15.5.25), React 19, TypeScript, Tailwind 3, CSS global, Supabase e Lucide. Sem biblioteca de UI ou motion dedicada. Vitest + Testing Library + happy-dom; sem suíte Playwright/Cypress no projeto. `/app` mantém Compra/Casa/Histórico e detalhes em estado React, sem rotas próprias. Os componentes operacionais estão majoritariamente em [components/restok-app.tsx](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx).

Cobertura **9V** significa navegador em 320, 360, 375, 390, 412, 430, 768, 1024 e 1280 px; alturas 844 px em mobile e 900 px nas demais. Também testados 320 × 568 e scroll até o último item. **M** significa interação manual nos estados indicados; **L** significa leitura de código sem execução completa.

| Tela / rota e cobertura | Objetivo | Ação principal | Problemas de UX | Problemas visuais | Problemas mobile | Consistência | Severidade | Componentes |
|---|---|---|---|---|---|---|---|---|
| Landing [/](/) · 9V/M | Apresentar produto | Começar agora | Menu e âncora funcionam | Georgia, amarelo/terracota e logo textual fora da identidade | Hero alto; ação principal continua visível | Vocabulário e preview diferem do app | P1 | Landing, wordmark, preview |
| Login `/login` · 9V/M | Entrar | Entrar | Demo aponta para app configurado, sem modo demo explícito | Logo/cesta, cores e fontes legadas | Reveal 32 px; links baixos | Botão pill difere dos botões do app | P1 | LoginForm, LoginShowcase |
| Cadastro `/login` · 9V/M parcial | Criar conta | Criar conta | Sem submissão real | Mesmos gaps de marca | Links secundários pequenos | Validação nativa versus mensagens próprias | P2 | LoginForm |
| Recuperação `/reset-password` · 9V/L | Atualizar senha | Atualizar senha | Sessão válida e envio não testados | Mesmos gaps tipográficos | Layout sem overflow padrão | Formulário separado | P2 | ResetPasswordForm |
| `/auth/callback` · L | Trocar token/redirect | Redirecionar | Fluxos remotos não executados | Sem tela própria relevante | Sem avaliação em aparelho | Erros chegam ao login | — | Callback, middleware |
| Onboarding de casa · L | Criar/entrar numa casa | Criar/aceitar convite | Precisa usuário de teste sem casa | Estilos próprios | Sem validação visual real | Não usa todas as primitives do app | A validar | HouseholdOnboarding |
| Compra `/app` · 9V/M | Comprar com agilidade | Marcar/editar item | “Continuar” gera aviso; duplicação de caminhos | Resumo, busca e filtros competem | FAB/resumo sobrepostos; nenhuma linha inicial em 320×568 | Hierarquia diferente entre header e conteúdo | P1 | AppNavigation, BudgetSummary, ShoppingItemRow, FAB |
| Busca/filtros · M | Encontrar item | Buscar/filtrar | Busca sem nome acessível; seleção não anunciada; empty impreciso | Chips com pesos próximos | “Já temos” exige scroll da faixa em 320 | Categoria/A–Z têm aria-pressed, filtros não | P1 | SearchInput implícito, chips, EmptyState |
| Adicionar item · 9V/M | Incluir produto | Adicionar à compra | Formulário funciona; foco a rever | Caixas e header ocupam espaço | Sheet exige scroll em tela baixa | Sem entrada/transição coerente | P1 | AddItemSheet, Sheet, Stepper |
| Editar item · 9V/M | Quantidade/preço/status | Salvar item | Foco abre em Fechar e não retorna ao gatilho após Escape | Opacidade posterior reduz legibilidade | Preço e quantidade precisam feedback de foco uniforme | Status escolhidos sem semântica de seleção | P1 | ItemEditorSheet, AccessibleDialog |
| Meta/orçamento · M | Ajustar limite | Salvar meta | Zero desabilita salvar; comportamento registrado, sem alteração | Valores grandes quebram o resumo | Overflow 334 px em viewport 320 | Ação Editar tem 28 px | P1 | BudgetEditorSheet, BudgetSummary |
| Nova compra · 9V/M | Preparar lista | Começar compra | Sem aviso de arquivamento da ativa; sem busca na seleção | Caixa interna e externa | Scroll aninhado com lista longa | Pode criar compra sem itens | P1 | NewPurchaseSheet |
| Casa · 9V/M | Manter recorrentes | Adicionar/editar produto | Desativado desaparece sem caminho de recuperação | Banner, ordenação e ações competem | Desativar 18 px; ordenação 36 px | Categoria/A–Z anuncia seleção corretamente | P1 | ProductsHome, ProductRow |
| Criar/editar produto · M | Manter padrão doméstico | Salvar produto | Criar, editar e desativar exercitados | Mesmo padrão de sheet | Mesmos gaps de foco | API de produto preservável | P1 | ProductEditorSheet, Stepper |
| Finalização/resumo · M | Encerrar compra | Finalizar e salvar | 45 “resolvidos” para apenas 1 comprado e 0 já tínhamos | Ênfase em sucesso mascara pendências | Formulário cabe com scroll | Menu permite pendências; footer orienta resolver todas | P1 | ConfirmFinishSheet, CompleteSheet |
| Histórico · 9V/M | Consultar compras | Abrir compra | Back nativo sai da seção; estados históricos pouco claros | Todas as linhas do detalhe têm check | Truncamento exige detalhe legível | Pendentes parecem comprados | P1 | HistoryView, HistoryDetail |
| Perfil/Casas e pessoas · M leitura conectada | Gerir colaboração | Abrir gestão | Membro identificado por ordinal/fragmento de UUID | Formulário de gestão possui estilo próprio | Gestão carregada observada em desktop; loading em mobile | Uso de window.confirm nas ações sensíveis | P2 | HouseholdManager, menu de perfil |
| Loading/empty/erro · M/L | Orientar e recuperar | Tentar novamente/adicionar | Empty de compra vazia diz limpar filtros | Caixa tracejada genérica; loading apenas textual | Espaço inicial consumido | Erros de auth melhores que empty operacional | P2 | EmptyState, toast, banners |

Componentes sistêmicos cobertos: headers, navegação, FAB, Button/IconButton, inputs/search/select, chips/segmentados, linhas/produtos/categorias, progresso/métricas, empty, sheet/dialog, toast/badge/avatar, counter/preço, loading e divisores. Não existe um sistema compartilhado completo para todos eles; search e parte dos chips são JSX inline. Não foi encontrado skeleton operacional equivalente ao loading textual.

## 4. Problemas sistêmicos encontrados

| ID / prioridade | Evidência e impacto | Localização | Recomendação / etapa |
|---|---|---|---|
| V01 · P1 | Fonte, paleta e marca não correspondem aos arquivos aprovados; produto perde reconhecimento. | [app/globals.css:6](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/globals.css:6), [:23](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok:23), [:61](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok:61); [restok-app.tsx:220](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:220) | Traduzir identidade em tokens e integrar assets aprovados. Fases 2–3. |
| V02 · P1 | FAB invade resumo em todas as larguras medidas; desktop cobre parte da CTA. | [restok-app.tsx:1091](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:1091), [:1101](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok:1101) | Definir composição conjunta das ações fixas e reserva de espaço. Fases 2/4. |
| V03 · P1 | Em 320×568, header/título/resumo ocupam o espaço até o footer; não há item visível na entrada. | [restok-app.tsx:1082](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:1082) | Compactar estrutura acima da lista sem reduzir alvos de toque. Fases 2/4. |
| V04 · P1 | Total R$ 246.913,56 faz documento alcançar 334 px em 320; saldo/Editar ficam cortados. | `BudgetSummary`, [restok-app.tsx:224](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:224) | Layout com min-width:0, quebra e hierarquia monetária adaptativa. Fase 4. |
| V05 · P1 | Texto muted de linhas resolvidas cai de 5,91:1 para 3,23:1 após opacity .72. | [app/globals.css:38](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/globals.css:38) | Reduzir ênfase por tokens de texto/superfície, mantendo contraste; não diminuir opacidade do bloco inteiro. Fase 3. |
| V06 · P1 | Busca tem label vazio; filtros e escolha de status não expõem seleção. | [restok-app.tsx:1084](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:1084), `ItemEditorSheet:329` | Nome persistente para busca e estado semântico para controles. Fases 3/4. |
| V07 · P1 | Editor abre com foco em Fechar; Escape após edição deixa activeElement BODY. Quantidade remove outline sem alternativa própria. | [accessible-dialog.tsx:25](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/accessible-dialog.tsx:25); [restok-app.tsx:180](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:180) | Capturar gatilho antes de montar, foco inicial contextual, restauração e indicador de foco no Stepper. Fase 3. |
| V08 · P2 | Editar meta 28 px, Desativar 18 px, A–Z/Categoria 36 px e reveal 32 px ficam abaixo da meta de conforto de 44 px. | BudgetSummary, ProductRow, ProductsHome, LoginForm | Aumentar área interativa sem inflar visualmente todo controle. Fase 3. |
| V09 · P2 | Banner de orçamento, status, chips, CTA e FAB disputam atenção; labels e nomes recorrentes ficam em semibold. | Compra, Casa, formulários | Regular para leitura; semibold só onde ajuda; agrupamento por proximidade e divisores. Fase 2. |
| V10 · P2 | Menu da compra permanece aberto ao Escape e não anuncia expanded; comportamento difere do perfil. | [restok-app.tsx:1082](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:1082) | Primitive única de disclosure/menu, com Escape, foco e fechamento previsíveis. Fase 3. |
| V11 · P2 | Back do navegador no detalhe levou ao login, pois seções/detalhes são estado local. | [restok-app.tsx:549](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:549), [:552](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok:552), [:1081](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok:1081) | Projetar relação entre navegação do app e histórico do navegador sem impor reestruturação completa. Decisão explícita antes da implementação. |
| V12 · P2 | Sheets, toasts, inclusão de item e mudanças de categoria entram/saem abruptamente; durações dispersas. | Sheet, Toast, CategorySection, AppNavigation | Motion tokens e transições funcionais, com transform/opacity e reduced motion. Fases 2–3/8. |
| V13 · P2 | Compra sem itens diz “Esse filtro ainda não tem itens” e oferece Limpar filtros; resultado filtrado com busca culpa só o termo. | EmptyState e condição do filtro | Empty por contexto: lista vazia, busca, filtro e ausência de compra. Fase 4. |
| V14 · P2 | Seleção de 45 produtos exige scroll aninhado e não oferece busca; custo alto para preparar lista. | `NewPurchaseSheet:414` | Busca/seleção com resumo acessível e um modelo de scroll deliberado. Fases 4–5. |
| V15 · P2 | “Membro 2 · [fragmento de UUID]” não ajuda a identificar com segurança a pessoa. | [household-manager.tsx:22](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/household-manager.tsx:22) | Nome identificável, respeitando modelo e privacidade; verificar disponibilidade de dados antes de mudar API. Fase 7. |
| V16 · P3 | Assets só raster; diferenças entre nomes das pastas/fundos e irregularidades de alpha em variantes claras. | [brand/](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/brand) | QA das exportações em fundos finais e handoff vetorial aprovado, sem redesenho. Fase 2. |
| V17 · P3 | Console de desenvolvimento emite warning do Next sobre scroll-behavior smooth sem data-scroll-behavior. | [app/globals.css:22](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/globals.css:22); [app/layout.tsx:16](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/layout.tsx:16) | Ajuste compatível com Next quando autorizado; warning não é falha funcional observada. |

Hipóteses confirmadas: densidade vertical, competição FAB/footer, excesso de peso semelhante em controles e assinatura de marca insuficiente. Parcialmente confirmadas: caixas em sheets e alguns resumos, bordas em controles e microcopy genérica. **Rejeitadas como diagnóstico global:** tudo dentro de cards, radius universal, glassmorphism excessivo, gradientes aleatórios, mistura generalizada de ícones 3D e hero typography nas telas operacionais. Raios e paddings variam; as listas usam divisores. Preservar essa base.

## 5. Problemas por tela

Além dos achados visuais V01–V17, estes problemas de comportamento foram reproduzidos ou confirmados no fluxo configurado e no código:

| ID / prioridade | Tela e reprodução | Consequência | Recomendação separada |
|---|---|---|---|
| F01 · P1 | Casa: criar produto temporário, editar e Desativar. A linha some; não há Inativos, Ativar ou Desfazer. `toggleProduct` define active:false. | Produto permanece nos dados, mas não pode ser recuperado pela UI. | Projetar recuperação/reativação; aprovar como mudança funcional antes de incluir na fase visual. |
| F02 · P1 | Finalizar pelo menu uma lista com 45 itens: 1 comprado, 44 pendentes. Resumo mostra “45 produtos resolvidos”; detalhe histórico põe check em todos. | Informação incorreta de conclusão e leitura enganosa do histórico. | Contar status reais e representar pendentes/já temos/comprados. Preservar possibilidade atual de finalizar com pendências, salvo decisão explícita. |
| F03 · P1 | Criar nova compra enquanto a ativa tem pendência. Sheet não avisa; anterior vai para completed no histórico. | Pessoa pode perder o contexto da compra ativa sem perceber que a está encerrando. | Tornar consequência explícita antes da criação; não alterar automaticamente a regra de uma compra ativa. |
| F04 · P2 | Link “Experimentar com dados de exemplo” aponta `/app`; com Supabase configurado usa a sessão/casa real ou exige login. | Promessa de demonstração não corresponde à execução nesse ambiente. | Separar destino de demonstração e conta real por decisão de produto. Teste isolado só funciona porque as variáveis públicas de Supabase foram desativadas na cópia. |
| F05 · P2 | Lista nova curta: Café comprado sem preço, Cebola Já temos. App mostra R$ 0,00 e “Tudo resolvido”, permitindo finalizar. | Total parcial pode parecer gasto real igual a zero. Preço é opcional hoje. | Identificar preços não registrados e rotular total registrado; não tornar preço obrigatório sem autorização. |

Compra: “Continuar compra” não avança nem leva ao próximo pendente; mostra um toast exigindo resolver itens, embora o menu permita finalizar com pendências. Rever microcopy e utilidade da ação, preservando o comportamento até decisão.

Casa: alternância Categoria/A–Z funciona e anuncia aria-pressed. Nome longo pode ficar excessivamente abreviado entre ícone, editar e desativar; preservar acesso ao nome completo no editor.

Histórico: lista e detalhes funcionam, mas itens pendentes e sem preço precisam leitura fiel. Não adicionar gráficos financeiros decorativos. Auth: validação, labels, estado de erro e reveal já são melhores que a semântica dos filtros operacionais; reaproveitar esses padrões.

## 6. Problemas específicos de mobile

| Faixa / condição | Observação |
|---|---|
| 320×568 | Nenhuma linha de produto visível na entrada. Scroll funciona e o último item pode ser alcançado, mas a tarefa inicial fica escondida. |
| 320×844 | Título quebra, filtros aparecem mais abaixo; aproximadamente uma linha completa antes da região fixa no cenário inicial. |
| 320–430×844 | Footer tem cerca de 119 px e navegação 64 px. FAB invade aproximadamente 30 px da região do resumo; compete com total. |
| 320 px, valor grande | Documento chega a 334 px; é overflow real, diferente de scroll intencional dos filtros. |
| 320/360 px, filtros | Último filtro “Já temos” fica parcialmente fora da faixa visível. O container permite scroll horizontal, mas a possibilidade não é clara. |
| 375/390/412/430 px | Mais área de lista e menos quebra de título, sem resolver a colisão das ações fixas. |
| 768/1024/1280×900 | Sidebar melhora navegação, mas resumo 300×120 px e FAB 56×56 px ocupam o mesmo canto; colisão com CTA continua. |
| Sheets nas 9 larguras | Largura do documento e do dialog sem overflow nos cenários padrão medidos. Sheet curta em 320×568 tem scroll, não cabe inteira. |

Nomes longos: truncamento no item, quebra no título do editor e wrap na seleção de nova compra. O editor oferece contexto, mas truncamento muito agressivo na lista dificulta reconhecimento rápido.

Safe-area-inset-bottom, viewportFit cover e visualViewport já existem. A detecção de teclado exige campo focado e redução superior a 140 px. **Redimensionar viewport não equivale a testar teclado virtual.** Teclado, rotação, barras do Safari, notch e 200% de texto precisam aparelho/emulação dedicada antes de aprovar as novas foundations para produção.

## 7. Motion e microinterações ausentes

Já existem press/hover em alguns botões, transição de cor, barra de orçamento em 300 ms e showcase animado no login. Não se trata de ausência total de motion.

| Interação | Gap observado | Direção para o futuro |
|---|---|---|
| Navegação | Troca de cor sem indicador compartilhado; conteúdo troca abruptamente. | Indicador curto, resposta imediata e orientação de foco. |
| Marcar item | Texto/status/check mudam sem encadeamento coerente. | Transição breve que confirme ação sem bloquear o próximo toque. |
| Sheets/backdrop | Montagem e remoção imediatas. | Entrada/saída curta; fade do backdrop; foco sincronizado. |
| Adicionar/editar | Novo item e confirmação não têm padrão comum. | Entrada discreta e feedback de salvamento, preservando posição/scroll. |
| Categorias/filtros | Colapso e lista trocam sem transição contextual. | Indicador de seleção; evitar movimentar toda lista longa. |
| Toast/empty/loading | Feedback aparece sem linguagem compartilhada. | Transição breve, estado acessível e mensagens específicas. |
| Valores/progresso | Largura animada e atualização textual direta. | Evitar efeito cassino; alinhar duração e legibilidade. |
| Hover | Regras de hover não são sistematicamente limitadas a dispositivos com hover. | Usar media query hover/pointer adequada. |

Na Fase 2, avaliar intervalos instant 80–120, fast 140–180, base 180–240 e slow 260–320 ms. São referências de proposta, **não tokens implementados nesta fase**. CSS deve ser a primeira opção; nenhuma necessidade comprovada de biblioteca nova.

Reduced motion está implementado em CSS global e no showcase, com testes do showcase. Não foi emulado como preferência do sistema no navegador desta sessão; suporte estático/testes não substituem validação visual dessa preferência.

## 8. Acessibilidade

| Verificação | Resultado / consequência |
|---|---|
| Contraste base | Ink/canvas 16,05:1; muted/canvas 5,91:1; branco/primary 7,72:1. Boa base. |
| Contraste resolvidos | Texto muted com opacity .72 sobre canvas ≈3,23:1. Insuficiente para texto normal de metadados. |
| Nome e estado | Busca não tem nome acessível persistente; filtros/status não anunciam seleção. Nav usa aria-current e ordenação usa aria-pressed corretamente. |
| Formulários | Login tem labels, aria-invalid, aria-describedby e alert; formulários do app usam labels. Não confundir input visual de 24 px dentro de wrapper clicável de 50 px com target de apenas 24 px. |
| Foco | Escape fecha dialog; restauração ao gatilho falhou no editor. Input de quantidade tem outline-none sem indicador próprio. |
| Modal | Dialog nativo, aria-modal e título nomeado são boas escolhas. Não foi constatada interação com conteúdo externo enquanto aberto; não diagnosticar “focus trap quebrado” por um Tab que passa pelo chrome do navegador. |
| Touch | Ações principais 44+ px, nav 48 px, FAB 56 px. Ações secundárias variam de 18 a 36 px; ampliar área real. |
| Mensagens | Toast tem role=status; auth possui role=alert. Mudanças de filtro e estado precisam contexto além de cor. |

Critério: contraste mínimo de texto normal **4,5:1**, texto grande **3:1**. WCAG 2.2 AA tem mínimo de target **24×24 CSS px, com exceções**; 44×44 é a meta de conforto usada na auditoria e o critério aprimorado, não uma obrigação AA universal. Links inline e espaçamento podem se enquadrar em exceções e precisam avaliação individual. Fontes: [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum), [W3C — WCAG 2.2 e tamanho de alvo](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

Cálculos derivados dos tokens OKLCH convertidos em sRGB e composição da opacidade do bloco sobre canvas estão em [contrast-calculations.json](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/contrast-calculations.json). Não foi realizada certificação WCAG, execução de axe, teste de leitor de tela ou avaliação completa de zoom/reflow.

## 9. Quick wins

- Nome acessível da busca e aria-pressed/semântica dos filtros/status.
- Corrigir foco do Stepper e retorno ao gatilho do dialog.
- Remover redução global de opacidade dos itens resolvidos, usando texto contrastante.
- Separar FAB de CTA/resumo em todos os breakpoints.
- Permitir quebra segura dos valores e saldo em 320 px.
- Área de toque maior nas ações secundárias, com desenho visual discreto.
- Empty e microcopy específicos para compra vazia, filtro e busca.
- Resumo/histórico fiéis aos status, após aprovação do escopo funcional F02.

São correções localizadas candidatas às fases autorizadas, não mudanças realizadas agora. Paleta/Geist/logo têm alcance sistêmico e devem passar pelo Visual System antes de migração global.

## 10. Mudanças estruturais recomendadas

Criar uma base compartilhada pequena: tokens de cor/typography/espaçamento/radius/elevation/motion; Button/IconButton/Input/Search; chips/segmentados; Sheet/Dialog; Toast/EmptyState/Loading; header/nav e composição de ações fixas. Extrair do arquivo operacional somente as partes que ganham consistência ou teste, sem reescrever o app.

Estabelecer duas hierarquias: conteúdo de compra primeiro, orçamento como apoio; nas telas de preparação, organização e seleção primeiro. Uma única ação primária clara por região. Não transformar cada item da lista em card.

Definir regras explícitas para scroll de sheets, foco, teclado/safe areas e nomes/valores longos. Reusar listas e divisores existentes. Compor nav, footer e FAB como sistema, evitando cálculos de bottom desconectados.

Tratar navegação do navegador, reativação de produtos, demonstração e encerramento implícito como decisões funcionais separadas. Não acrescentar API, gráfico, dependência ou camada arquitetural sem necessidade.

## 11. Proposta de fases de implementação

| Fase | Entrega e limite |
|---|---|
| 1 · Auditoria | Este relatório e evidências; nenhum ajuste visual no produto. |
| 2 · Visual System | Tokens propostos e 2–3 provas: compra, sheet e Casa ou Histórico; before/after; aprovação antes de expandir. |
| 3 · Foundations | Primitives e estados acessíveis/motion; ainda sem migração geral. |
| 4 · Compra | Busca, filtros, lista, preço/status, FAB/footer e finalização. |
| 5 · Casa | Recorrentes e preparação da próxima compra; reativação somente se aprovada. |
| 6 · Histórico | Estados e totais fiéis; comparação útil, sem dashboard decorativo. |
| 7 · Demais fluxos | Auth, onboarding, colaboração, perfil e erros. |
| 8 · Polish/QA | Motion, safe areas, teclado real, reduced motion, regressão e comparação visual. |

Cada fase exige autorização explícita, lint/typecheck/testes relevantes, navegação mobile/desktop, console e screenshots. Não carregar os bugs funcionais silenciosamente para a refatoração estética.

## 12. Riscos e pontos que não devem ser alterados

Preservar os estados pending/purchased/already_have, preço opcional, cálculo de quantidade × preço apenas em comprado, exclusão de Já temos do gasto, catálogo recorrente, regra de uma compra ativa, autenticação, papéis de casa, isolamento de dados, contratos Supabase e sincronização. Preservar dialog nativo, labels saudáveis e prevenção de efeitos de movimento quando solicitado.

Não executar remoção de membros, transferência de propriedade, revogação de convites, saída da casa, criação de contas ou atualização de senha em dados reais durante auditoria. Nada disso foi realizado. Ações de compra e produtos foram executadas em **cópia local sem Supabase**, origem 127.0.0.1:3101, com dados de exemplo; ambiente conectado 3000 foi observado apenas em leitura. Sessão do servidor de auditoria encerrada; servidor original preservado.

| Validação | Resultado |
|---|---|
| `npm run lint` | Passou, exit 0. |
| `npm run typecheck` | Passou, exit 0. |
| `npm test` | Passou: 10 arquivos, 95 testes. |
| E2E automatizado | Projeto não possui suíte Playwright/Cypress; não adicionada nesta fase sem código. Fluxos locais exercitados manualmente no navegador. |
| Integração Supabase | Não executada: exige projeto descartável distinto e usuários/credenciais de teste. |
| Console | Sem erros capturados; warning de scroll-behavior registrado. |
| Layout | Medições em 9 larguras; overflow monetário e colisão registrados; cenários padrão de sheets sem overflow horizontal. |
| Reduced motion | Código e testes do showcase revisados; emulação visual da preferência pendente. |
| Regressões | Nenhuma alteração de código realizada; problemas descritos são preexistentes. Não declarar que o app está livre de defeitos. |

Limites: onboarding sem casa, sucesso/erro remoto de auth e escrita compartilhada não foram testados ponta a ponta; histórico e produtos totalmente vazios avaliados no código, enquanto compra sem itens, busca sem resultado e filtro vazio foram vistos no navegador. Teclado virtual real, Safari/Android, leitor de tela, zoom 200% e perfil de performance permanecem pendentes. A auditoria documental está entregue; esses itens precisam integrar a validação das fases posteriores, sem alegar cobertura inexistente.

A cópia usada no navegador foi comparada com 30 arquivos de source atuais (app/componentes/lib/Tailwind): sem diferenças. Não foram produzidos commits, PRs ou alterações de regras de negócio.

## 13. Screenshots/evidências

Capturas locais são de desenvolvimento; o círculo “N” é o indicador do Next, não controle do produto. Arquivos com `shop-validation-*` substituem capturas iniciais de resize com artefatos do compositor. `seed-purchased-390.jpg` mostra item de seed com preço histórico; o teste verdadeiro sem preço está em `purchased-no-price-390.jpg`. Não confundir esses cenários.

| Evidência | Arquivo | O que comprova |
|---|---|---|
| Lista fora da dobra | [320×568](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/shop-validation-320x568.jpg) | Nenhum item na entrada e colisão FAB/resumo. |
| Colisão desktop | [1280](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/large-value-1280.jpg) | FAB cobre parte da CTA do footer. |
| Valor grande | [320](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/large-value-320.jpg) | Saldo/Editar ultrapassam largura; total R$ 246.913,56. |
| Finalização incorreta | [Resumo](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/finish-summary-320.jpg), [Confirmação](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/finish-confirm-320.jpg) | 44 pendentes antes, 45 ditos resolvidos depois. |
| Histórico com pendentes | [Detalhe](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/history-detail-390.jpg) | Checks não representam o status real dos itens. |
| Comprado sem preço | [Lista curta](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/purchased-no-price-390.jpg) | Tudo resolvido e total registrado zero sem sinalização de incompletude do gasto. |
| Troca de compra ativa | [Antes](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/new-purchase-active-without-warning-390.jpg), [Depois](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/automatic-archive-390.jpg) | Ausência de aviso e anterior arquivada. |
| Busca/filtro | [Busca vazia](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/search-empty-390.jpg), [Filtro vazio](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/filter-empty-390.jpg) | Microcopy e semântica contextual a rever. |
| Compra sem itens | [Empty](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/empty-purchase-390.jpg) | Limpar filtros oferecido para lista vazia. |
| Nome longo | [Linha](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/long-name-row-320.jpg), [Editor](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/long-name-sheet-320.jpg) | Truncamento na lista e nome acessível em contexto. |
| Sheet pequena | [Adicionar 320×568](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/add-sheet-320x568.jpg) | Scroll necessário; não simula teclado real. |
| Menu | [Escape](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/menu-escape-390.jpg) | Popup permanece aberto. |
| Identidade pública | [Landing 320](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/landing-320.jpg), [Landing completa](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/landing-full-390.jpg), [Login](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/login-390.jpg) | Serifas, paleta e wordmark legados. |
| Erro auth | [Login](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/login-invalid-link-390.jpg) | Erro de link exibido sem submissão de dados. |
| Casa | [390](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/home-390.jpg), [A–Z](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/home-alphabetical-390.jpg) | Layout de recorrentes e ordenação. |
| Colaboração, leitura | [Gestão carregada](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/connected-household-loaded.jpg) | Papéis, identificação de membros e convites; sem mutações. |
| Quantificação | [Medições](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/measurements.json), [Contraste](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/contrast-calculations.json), [Console](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/console.json) | Geometria, contraste e warnings. |

As séries `landing`, `login`, `signup`, `reset-password`, `shop-validation`, `home`, `history`, `new-purchase`, `add-sheet` e `item-editor` documentam as larguras. Na primeira série signup, medições de DOM são a referência de largura; capturas iniciais podem refletir o compositor após resize. As três capturas destacadas abaixo foram inspecionadas visualmente e são referências centrais para os achados.

![Compra em 320×568](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/shop-validation-320x568.jpg)

![FAB sobreposto à CTA no desktop](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/large-value-1280.jpg)

![Resumo com contagem incorreta](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/finish-summary-320.jpg)

## 14. Próxima fase proposta

Fase 2 — Visual System: estabelecer proposta fiel ao brand, com Geist, paleta oficial e hierarquia leve; projetar ações fixas como conjunto; definir estados acessíveis e motion; produzir 2–3 provas de conceito e screenshots before/after. Submeter essa entrega antes de expandir componentes/telas. Nenhuma implementação dessa fase foi iniciada.

Está autorizado iniciar a **Fase 2 — Visual System**?
