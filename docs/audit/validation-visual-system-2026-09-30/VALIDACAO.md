# Validação de conformidade — Restok

Data: 30/09/2026. Referência: [AUDITORIA.md](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/ui-phase-1-2026-09-30/AUDITORIA.md). Código validado: `1f5a34b518592d4f9c674d9223ae3afa774990e7`.

## Resultado

**Conformidade parcial. Não é correto afirmar que tudo da auditoria foi implementado em `/visual-system`.** Essa rota continua sendo a prova da Fase 2, com Compra, Casa e editores locais. As fases posteriores estão no app principal, com demonstração isolada em `/app?demo=1`. São implementações diferentes, com componentes, estilos e comportamento próprios.

Na matriz de 22 achados, considerando exclusivamente `/visual-system`: **8 atendidos no recorte observado, 6 parciais e 8 pendentes ou sem cobertura**. Isso mede cobertura dos achados, não porcentagem de conformidade WCAG nem conclusão das oito fases. A ausência de um fluxo na prova não é uma correção daquele fluxo.

As provas cumprem o limite original da Fase 2 (tokens e três cenas). Entretanto, não servem como validação final do produto integrado. A integração de Geist, paleta oficial e logo aprovado ainda está pendente no app principal.

## Qualidade técnica da prévia

Antipadrões: não há evidência de glassmorphism, gradientes decorativos ou grids de cards repetidos na prova. A lista usa divisores; marca e hierarquia têm intenção clara.

| Dimensão | Nota / 4 | Evidência e limite |
|---|---:|---|
| Acessibilidade | 3, provisória | Busca nomeada, filtros/status semânticos, foco contextual e restauração; menu de revisão não fecha por Escape. Sem leitor de tela/axe/QA completa. |
| Performance | 3, provisória | Build da prévia: 13,9 kB de rota e 116 kB de First Load JS; motion em transform/opacity. Sem perfil FPS/Core Web Vitals. |
| Responsividade | 2 | Layouts usuais funcionam, mas há overflow com scrollbar convencional em 320 px. Teclado físico/virtual, zoom e Safari não cobertos. |
| Tokens | 3 | Paleta e escalas locais consistentes; hover primário ainda usa hex literal. Não há migração global. Dark mode não é requisito. |
| Clareza/antipadrões | 4 | Lista e divisores, ações agrupadas, sem decoração concorrente na compra. |
| **Total indicativo** | **15 / 20** | Boa base com pendências; não certifica acessibilidade nem prontidão para produção. |

## Matriz dos 22 achados

“Atendido” abaixo se limita à reprodução feita nesta rota. A coluna do app integrado distingue navegador (N), código (C) e testes automatizados (T); não transforma leitura de código em teste remoto.

| ID | `/visual-system` | Evidência / limite | App integrado atual |
|---|---|---|---|
| V01 · identidade | **Parcial** | Cinco hexes oficiais e Geist no DOM; logo aprovado na prova. Migração de todas as telas ausente. | **Pendente (N/C):** body segue Avenir/Segoe, primary OKLCH legado e wordmark textual; nenhum img de marca na cena observada. |
| V02 · FAB/resumo | **Atendido** | Uma barra contém total e CTA; não há FAB separado. Geometria das 10 dimensões sem colisão entre CTA/nav. | Alterações de composição em C; não foi repetida a matriz completa do app. |
| V03 · primeira dobra | **Atendido no mínimo observado** | Em 320×568, primeira linha começa em y≈384 e dock em y=429: nome e controle aparecem, mas apenas ≈45 dos 76 px da linha ficam livres. A linha inteira ainda exige scroll. | Compactação em C; não aprovado para todas as condições de teclado. |
| V04 · valores grandes | **Parcial** | R$ 246.913,56 cabe no orçamento e dock; documento ainda excede largura útil em 15 px quando scrollbar ocupa espaço. | Ajustes em C; extremo não reexecutado no app. |
| V05 · contraste resolvidos | **Atendido** | Linha resolvida com opacity=1; metadado rgb(82,100,91), ≈6,03:1 sobre canvas. | Estilos alterados em C; contraste completo do app não recalculado. |
| V06 · nome/estado | **Atendido** | Busca “Buscar na lista”; filtros, situação e Já temos expõem aria-pressed. | Busca e filtros presentes em N/C. |
| V07 · foco | **Atendido** | Editor abre no preço; Escape e salvar retornam a Editar item Cebola; quantidade com outline solid 2 px por teclado. | AccessibleDialog atualizado em C; não exercitado todo editor integrado nesta rodada. |
| V08 · alvos | **Parcial** | Botões e summary das provas medidos com ≥44 px; wrapper da busca tem 44 px (input interno 42 px, não defeito de target). Editar meta, desativar e reveal de auth não existem na prova. | Alvos ampliados em C; medidas de auth não repetidas. |
| V09 · hierarquia | **Atendido** | Barra conjunta, orçamento compacto, leitura em 400/500 e títulos 600; Casa com lista e divisores. | App mantém composição e identidade diferentes; sem aprovação visual global. |
| V10 · menus | **Pendente** | Menu de compra ausente. O disclosure de revisão, análogo, permanece aberto após Escape. Estado expanded é nativo de details; não é necessário duplicar ARIA. | **Corrigido na reprodução N:** Menu da compra fecha com Escape, expanded=false e foco no gatilho; ActionMenu em C. |
| V11 · Back | **Pendente/sem cobertura** | Compra/Casa são state React; não há Histórico nem detalhe para validar Back. | Seções/detalhes ainda em state React (C); não há roteamento/pushState dessas transições. Back não deve ser declarado corrigido. |
| V12 · motion | **Parcial** | Tokens 100/160/220/280 ms, sheet/backdrop/check/progresso e reduced motion verificados. Sem padrão completo de inclusão/saída/toast/loading/troca de conteúdo. | Motion e preferência reduzida em C/T; testes não substituem aparelho/FPS. |
| V13 · empty | **Parcial** | Busca+filtro têm mensagem contextual e reset. Lista realmente vazia/ausência de compra não são reproduzíveis pelo fluxo da prova; código usa mesma mensagem de seleção. | Ramificações específicas para lista vazia e filtro/busca em C. |
| V14 · preparar lista | **Pendente/sem cobertura** | Nova compra e seleção não existem. | **N/C/T:** busca na seleção, aviso da ativa e scroll único no código. |
| V15 · colaboração | **Pendente/sem cobertura** | Perfil/casas/membros não existem. | C/T: sem fragmentos de UUID, recuperação de erro e distinção de membros sem nome; pessoas sem nome real continuam exigindo contexto confiável. Sem backend real. |
| V16 · exports | **Parcial** | Variante oficial raster usada na prova; assinatura preservada. Handoff vetorial e QA de outras superfícies/exportações continuam pendentes. | Wordmark segue textual na cena integrada (N/C). |
| V17 · warning Next | **Atendido** | Layout global contém data-scroll-behavior="smooth"; logs capturados das duas rotas sem warn/error. | Correção global em C/T. Warning de build sobre ESLint é outro assunto. |
| F01 · reativação | **Pendente/sem cobertura** | Casa só cria/edita produtos; não mostra desativar/inativos/ativar. | C/T: Produtos inativos, Ativar e teste de retorno à próxima seleção presentes. |
| F02 · finalização/histórico | **Pendente/sem cobertura** | Não há Finalizar, resumo final ou Histórico. Contador da lista ativa não valida essas telas. | C/T: contagens reais e estados diferentes; N: histórico existente informa 44 comprados, 0 já tínhamos, 0 pendentes e 11 sem preço. Finalização mista validada pelo teste, não por mutação manual nesta rodada. |
| F03 · troca da ativa | **Pendente/sem cobertura** | Não há criação de nova compra. | **N/C/T:** aviso de encerramento e pendências, CTA “Encerrar atual e começar”. Mantida regra de uma ativa. |
| F04 · demonstração | **Pendente/sem cobertura do achado** | Prova tem dados locais efêmeros, mas não controla link da tela de login. Sua existência não corrige por si esse link. | C/T: link `/app?demo=1`, modo sem cargas/escritas Supabase; N: Demonstração/Casa de demonstração visíveis. |
| F05 · total incompleto | **Atendido na lista** | Café comprado sem preço mantém R$ 0,00 e mostra “1 comprado sem preço” junto a Total registrado. | C/T: indicação também no resumo/histórico. |

## Pendências verificadas e ações

### P1 — proposta visual ainda separada do produto

Localização: [VisualSystemProof](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-proof.tsx:14), [globals](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/globals.css:53), [BrandMark](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/restok-app.tsx:229).

A pessoa que revisa a prova aprova Geist/logo/cores, mas o app operacional entrega outra identidade e outra composição. Esse é um bloqueio para declarar a auditoria inteira concluída, embora não seja descumprimento do escopo original da Fase 2. Integrar os padrões aprovados aos componentes reais e avaliar os fluxos completos. Comando sugerido: `$impeccable harden`, seguido de implementação no produto conforme escopo aprovado.

### P2 — overflow com scrollbar convencional em 320 px

Localização: [min-width global](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/app/globals.css:53). DOM: innerWidth=320, clientWidth=305, scrollWidth=320, diferença=15 px. Reprodução em Compra e Casa, alturas 568 e 844. No modal, body overflow hidden elimina a scrollbar e esse overflow não aparece.

O teste antigo `scrollWidth <= innerWidth` deixa passar esse caso. Comparar com clientWidth, além de inspecionar a captura. O layout monetário em si não excedeu suas caixas (orçamento 288/288 e dock 305/305). A página ainda permite rolagem horizontal e reduz espaço livre para a lista. Remover/reformular o mínimo global ou tratar o contêiner da rota, sem mascarar conteúdo com overflow-x hidden. Comando sugerido: `$impeccable adapt`.

### P2 — Escape não fecha Opções da prévia

Localização: [details de revisão](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/components/visual-system-proof.tsx:40). Abrir, pressionar Escape: details.open permanece true e foco fica no summary. O popup continua ocupando a tela. Reusar o comportamento de fechamento previsível que já existe no ActionMenu do app, preservando semântica do disclosure. Comando sugerido: `$impeccable harden`.

### Pendências de conclusão, sem novo defeito alegado

V11 continua sem relação entre Back e seções; exige decisão de navegação e implementação. Auth/onboarding/colaboração real, safe areas com notch, teclado virtual, Safari/Android, texto/zoom 200%, leitor de tela, performance e preferência reduzida do sistema continuam sem validação completa. A prova não implementa a detecção de teclado usada pelo app principal. Não há evidência suficiente para declarar esse comportamento correto em aparelho.

O hover de `.proof-button` usa `#123e31` literal: refinamento de tokens a incorporar na integração. Não é um novo achado de alto impacto.

## Execução e resultados

| Check | Resultado |
|---|---|
| Lint | Passou, exit 0. |
| Typecheck | Passou, exit 0. |
| Testes atuais | **119 passaram, em 20 arquivos.** Incluem compra/finalização, histórico, reativação, modo demo e motion/teclado simulado do app integrado. Não há testes dedicados à família visual-system. |
| Build | Passou, exit 0, em cópia de HEAD sem tocar no servidor em execução. Prévia 116 kB de First Load JS; app 197 kB. |
| Layout da prova | 30 cenas: Compra/sheet/Casa × 9 larguras, com altura 320×568 adicional. 4 cenas com overflow do documento em 320 px. |
| Domínio | 6 × 4,50 = 27,00; Já temos retorna gasto zero; Café sem preço sinalizado; padrão Café alterado para 3 não muda quantidade 1 na compra. |
| Erros | Preço -5 mantém modal, alert e aria-invalid=true; foco no preço. |
| Foco | Preço ao editar/nome ao criar; Escape/salvar devolvem foco; stepper 44×44 com outline solid 2 px. |
| Reduced motion | Toggle da prova: fast=0 ms, sheet e backdrop=0,00001 s. Preferência nativa do sistema não alterada. |
| Console | Nenhum warn/error nos registros das duas abas. Mensagem Statsig da ferramenta não é registro do console da aplicação. |
| Supabase/auth real | Não executados; prévia não importa persistência/API/storage. App integrado observado em demo, sem salvar/encerrar/desativar dados nele. |

**Correção da conclusão anterior:** “sem overflow” na entrega da Fase 2 precisa ser limitado ao critério usado naquela sessão. A rodada atual verifica também largura útil com scrollbar convencional e encontrou o caso descrito. O relatório histórico da Fase 1 permanece intacto.

## Evidências

- [Geometria das 30 cenas](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/measurements.json)
- [Interações da prévia](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/cases.json)
- [Comparação integrada](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/integrated.json)
- [Console](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/console.json)
- [Compra 320×568](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/shop-320x568.jpg), [sheet](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/sheet-390.jpg), [valor grande](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/large-values-320x568.jpg)
- [Menu após Escape](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/review-menu-after-escape-390.jpg), [empty](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/search-filter-empty-390.jpg)
- [App integrado](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/integrated-shop-390.jpg), [aviso Nova compra](/Users/aidcrusadergabrielarantes/Documents/Fontes/restok/docs/audit/validation-visual-system-2026-09-30/integrated-new-purchase-390.jpg)

Logs de lint/typecheck/testes/build estão nesta pasta. A captura da primeira dobra deve ser lida com scrollbar convencional; não simula teclado virtual.

Depois da integração e das correções, executar `$impeccable polish` e repetir a validação das rotas operacionais. As ações podem ser feitas uma a uma ou juntas; a prioridade é integrar a proposta, resolver overflow/menu e fechar cobertura dos fluxos reais.
