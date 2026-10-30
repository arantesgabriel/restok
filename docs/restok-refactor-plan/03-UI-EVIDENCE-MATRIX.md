# Matriz de evidências e lacunas

28/10/2026 · Não é certificação de execução integrada nova. Mantém IDs, severidades e seeks da auditoria v2. Todo path `V2/...` abaixo é um **membro exato** do [ZIP fornecido](C:/Users/Gabriel/.codex/visualizations/2026/10/28/01a180c4-1044-7e81-8c36-0d66de05d570/restok-ui-audit-v2.zip), sob prefixo `restok-ui-audit-v2/`. O ZIP não foi extraído sobre o repo nem seus scripts executados.

## Integridade e método

Lidos integralmente README, FINAL-DECISION-REPORT, UPDATED-FINDINGS, UPDATED-COVERAGE-MATRIX, BLOCKERS, 11-INTEGRATION-AUDIT, 12-MOBILE-ACCESSIBILITY-VALIDATION, 13-MOTION-VALIDATION e 14-EVIDENCE-VALIDATION. BASELINE-REFERENCE e brief/referências foram consultados como contexto histórico. Baseline v1 referenciada externamente ao ZIP não foi fornecida.

Inspecionados visualmente nesta rodada os PNGs `UI-001-QA2-edge-media-12.019.png`, `UI-002-CONT-A-media-47.192.png`, `UI-013-before-CONT-B-media-11.228.png`, `UI-013-after-CONT-B-media-15.669.png`, diretamente dos bytes do ZIP. Os WebM novos estão no pacote; **não foram decodificados/revistos integralmente nesta rodada**. Seek/MAE/precisão são transcritos da validação v2, não medição nova. Os dois arquivos UI-013 mostram contextos diferentes, mas a prova de persistência remota depende também dos resultados anteriores e do código.

Verificação local final do contêiner ZIP: CRC de todos os membros aprovado (`ZipFile.testzip()`). Não confundir CRC com nova validação visual/semântica dos vídeos, nem com comparação criptográfica independente contra o manifesto histórico.

Na v2, quadros foram alinhados por seek no WebM com amostragem de 40ms; não medem início de requisição, duração de interação ou latência. Onde só existe marco de script, não converter em timestamp de vídeo. A coluna intervalo usa início=fim para um quadro pontual; duração do cenário não medida.

Critérios abreviados: **AWS-H** Anti-Webslop craft/hierarquia/proximidade em vez de caixas; **AWS-T** tipografia/medida/contraste/foco; **AWS-M** propriedades explícitas e reduced motion. **LOOP-S** UI Craft Loop, estados fiéis e comportamento antes de aparência; **LOOP-R** qualidade responsiva renderizada; **LOOP-A** acessibilidade; **LOOP-E** prova visual e limites de cobertura. **MOTION-F** AI Motion Library: easing e efeitos com função; **MOTION-X** saída mais curta como hipótese; **MOTION-N** números tabulares. Presets documentais não prevalecem sobre a especificação operacional.

## Achados preservados UI-001 a UI-013

| ID / prioridade | Problema, tela e certeza | Imagem / vídeo / intervalo de mídia | Código relacionado | Critério aplicado → aceite esperado |
|---|---|---|---|---|
| UI-001 P1 | Primeira linha não cabe acima das barras; `/app#shop`, 320×640, 33 itens. OBSERVADO-V2 + quadro revisto; causa de layout INFERIDA do C | `V2/evidence/screenshots/UI-001-QA2-edge-media-12.019.png`; `V2/evidence/videos/QA2-edge.webm`; **12.019–12.019s** | `restok-app.tsx`: header/title/BudgetSummary/filtros/ViewModeToggle/CategorySection/footer; `ui.css` regras por max-height 620 não atingem 640 | AWS-H + LOOP-R: reduzir empilhamento/controles redundantes, sem reduzir toque; ≥1 linha inteira acionável em 320×640 com dock/safe area |
| UI-002 P1 | Nome de participante vira “Audi...” junto às ações; `/app` HouseholdManager, 390×844. OBSERVADO-V2/C + quadro revisto | `V2/evidence/screenshots/UI-002-CONT-A-media-47.192.png`; `V2/evidence/videos/CONT-A.webm`; **47.192–47.192s** | `components/household-manager.tsx`: `members.map`, flex-wrap + min-w-0 flex-1 + truncate | AWS-T + LOOP-A/S: nome/papel em bloco anterior às ações, 80 caracteres e prefixos iguais distinguíveis; nomes acessíveis únicos |
| UI-003 P2 | Entrada `1.234,50` rejeitada; editor `/app`, 390×844. OBSERVADO-V2/C | `V2/evidence/screenshots/UI-003-CONT-A-media-32.772.png`; `V2/evidence/videos/CONT-A.webm`; **32.772–32.772s** | ItemEditorSheet, AddItemSheet, NewPurchaseSheet, BudgetEditorSheet; `Number(...replace(',', '.'))` | LOOP-S/A: parser único pt-BR; aceitar formato acordado, rejeitar malformado e manter erro localizado sem fechar/perder entrada |
| UI-004 P2 | Zero explícito vira ausência/null; editor 390×844. OBSERVADO-V2/C | `V2/evidence/screenshots/UI-004-CONT-A-media-22.355.png`; `V2/evidence/videos/CONT-A.webm`; **22.355–22.355s** | submit de ItemEditorSheet/AddItemSheet; `latestPriceFor` truthy | LOOP-S + MOTION-N: 0 persiste, renderiza BRL zero e não incrementa “sem preço”; vazio continua desconhecido |
| UI-005 P2 | Desktop com primeira linha tardia e linha muito extensa; `/app#shop`, 1280×800. OBSERVADO-V2; causa de composição INFERIDA-C | `V2/evidence/screenshots/UI-005-RESP-1280-media-1.493.png`; vídeo **v1 não incluído** `restok-ui-audit/evidence/videos/RESP-1280.webm`; seek herdado **1.493s** | Shell max-width1200, sidebar200, mesma pilha vertical, header duplicando título | AWS-H/T + LOOP-R: alvo ≥4 linhas completas em 1280×800, coluna de lista legível e contexto lateral útil; medir no produto novo |
| UI-006 P2 | Auth sugere conta compartilhada; `/login`, 390×844. OBSERVADO-V2/C | `V2/evidence/screenshots/UI-006-PUB-390-media-2.306.png`; vídeo v1 `PUB-390.webm` **não incluído**, seek herdado **2.306s** | `login-form.tsx`: “Crie a conta da casa”, “Use o email da casa”, placeholder plural | LOOP-S: copy descreve conta individual e convite para compartilhar casa; não sugerir compartilhar senha |
| UI-007 P2 | Confirmação após coleção longa; Nova compra, 390×844. OBSERVADO-V2/C | `V2/evidence/screenshots/UI-007-FINAL-390-media-12.202.png`; vídeo v1 `FINAL-390.webm` **não incluído**, seek **12.202s**; FUNC5 seleção tem só marco de script | `NewPurchaseSheet`, Sheet único overflow-y-auto com CTA no fim | AWS-H + LOOP-A/R: body rolável e footer de confirmação persistente, com contagem e foco; testar 0/33/100 produtos |
| UI-008 P2 | Quantidade extrema 999999; editor 320×640, não reexecutado integrado. OBSERVADO-V2, limite herdado | `V2/evidence/screenshots/UI-008-STRESS2-320-media-2.538.png`; vídeo v1 `STRESS2-320.webm` **não incluído**, seek **2.538s** | QuantityStepper input w-11; sem máximo explícito no handler | AWS-T + LOOP-S/R: valor legível e erro de limite explícito compatível com domínio/banco; não inventar teto sem decisão |
| UI-009 P2 | Casa sem busca para 33 produtos, proposta de UX; `/app#home`, 390×844. OBSERVADO-V2/C; impacto com usuários NÃO VERIFICADO | `V2/evidence/screenshots/UI-009-FINAL-390-media-14.294.png`; vídeo v1 `FINAL-390.webm` **não incluído**, seek **14.294s** | ProductsHome tem categoria/A–Z e inativos, não query | LOOP-S + AWS-H: busca local preserva ativos/inativos/ordem; resultado vazio oferece limpar; sem alegar melhoria medida |
| UI-010 P2 | Criar meta0 funciona; editar0 bloqueia. OBSERVADO-V2/C, 390×844 | `V2/evidence/screenshots/UI-010-CONT-A-media-40.643.png`; `V2/evidence/videos/CONT-A.webm`; **40.643–40.643s** | NewPurchaseSheet aceita >=0; BudgetEditorSheet submit>0/disabled<=0 | LOOP-S: ambos aceitam0; gasto>0 mostra excedente, sem NaN/divisão inválida |
| UI-011 P3 | Toast sobre área útil; `/app#shop`, 320×640. OBSERVADO-V2/C | `V2/evidence/screenshots/UI-011-STRESS2-320-media-9.328.png`; vídeo v1 `STRESS2-320.webm` **não incluído**, seek **9.328s**; QA2 também mostra toast | ToastMessage fixed bottom142px, footer e nav fixos | AWS-H + LOOP-R/A: anúncio sem obstruir linha/ação; erros ficam no banner/campo com retry |
| UI-012 P3 | Saída candidata160ms versus220ms atual; refinamento opcional, sem bloqueio normativo. OBSERVADO-C/V2 | `V2/evidence/screenshots/UI-012-FOCUS-390-media-4.325.png`; vídeo v1 `FOCUS-390.webm` **não incluído**; **4.325s** é quadro de estado, não medição de duração | `requestSheetClose`, ToastMessage, globals motion e timer220 | MOTION-X/F + AWS-M + LOOP-A: validar saída160, interrupção/reabertura, retorno de foco e redução sem espera; não aumentar severidade |
| UI-013 P1 | Reload muda casa; `/app`, duas memberships, 1280×800. OBSERVADO-V2/C + dois quadros revistos | `V2/evidence/screenshots/UI-013-before-CONT-B-media-11.228.png`, `UI-013-after-CONT-B-media-15.669.png`; `V2/evidence/videos/CONT-B.webm`; comparação **11.228–15.669s** (não latência) | `components/restok-app.tsx:875`, `lib/supabase/data.ts:91` | LOOP-S/E: ausência de convite usa seleção salva, membership validada, fallback explicado; duas contas/duas casas/reload/convites; sem compartilhar cache |

A v2 soma 3 P1, 8 P2, 2 P3, nenhum P0 demonstrado no recorte. Não inventar novos IDs UI para dívida técnica desta rodada; identificadores PLAN abaixo são locais ao planejamento.

## Reprodução e estratégia dos P1

**UI-013:** entrar com B em duas casas de teste; selecionar a segunda contendo compra; recarregar `/app` sem convite; conferir contexto no gestor; reselecionar a segunda e confirmar dados. Corrigir contrato da chamada do boot para usar preferência quando nenhum convite foi aceito (por exemplo normalizar ausência para `undefined`, mantendo seleção explícita e validação). Não remover RLS nem escolher primeira membership cegamente. Cobrir storage bloqueado, seleção revogada, convite ausente/inválido/válido, troca de conta e falha de snapshot. PR funcional próprio antes do polish.

**UI-001:** lista de33 itens, título de duas linhas, viewport real320×640, escala1, início do scroll; medir primeiro article e topo do dock, com e sem toast/banner. Reconstruir shell/toolbar, agrupar comandos e reservar rodapé; não apenas mudar max-height620 para640. Repetir nas seis dimensões, com valores longos e teclado. Prioridade na primeira tela core.

**UI-002:** owner com duas pessoas cujos nomes têm80 caracteres e prefixo igual; abrir gestor390 e320; confirmar nome antes de Transferir/Remover e controles alcançáveis. Reconstruir linha com identidade full width e grupo de ações posterior; manter papel e contexto no accessible name/confirm. Não expor email ou ID como solução. Gate antes de novos controles sensíveis.

## Observações novas desta rodada

| ID local | Estado / fonte | Consequência e aceite |
|---|---|---|
| PLAN-01 | OBSERVADO: tsc TS2769 em `vitest.config.ts:5` com Vitest5 instalado | Baseline de checks não está toda verde; estabilização isolada, não enfraquecer typecheck |
| PLAN-02 | OBSERVADO-C: fonte Geist e pesos limitados; conflito com fonte Manrope/Nexa aprovada | Nova tipografia exige arquivo/licença e revisão de layout real, não só font-family |
| PLAN-03 | OBSERVADO-DEMO/C: emails e categorias da prévia divergem da RPC/types reais | Não alterar contrato de privacidade/taxonomia; campos de unidade textual do mock não são schema existente |
| PLAN-04 | OBSERVADO-C: `readCurrentProfile` e `getCategoryIds` podem gravar durante leitura | Abrir app autenticado não é teste estritamente sem mutação; usar evidência anterior ou target descartável autorizado |

## Prévia explorada e limite das observações

[Demo escolhida](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/) foi navegada em Compra, Casa, Histórico e Casas e pessoas nos modos internos320/390/1440. Screenshots de inspeção foram vistos no navegador nesta rodada para Compra320/390/1440, Casa320, Histórico320 e pessoas320/1440. Os modos320/390 são **canvas do protótipo**, não certificação de viewport do produto. O browser também foi ajustado a1440×900 na inspeção desktop e restaurado depois. Não há pacote persistente de vídeo novo dessas visitas.

Alternado o controle “Movimento: padrão/reduzido” da própria demo, com navegação preservada. Isso **não prova** `prefers-reduced-motion` do SO nem timings medidos. O card de gasto, organização em lista, nomes antes de ações e sidebar/contexto são regras transferíveis. O histórico compacto da demo em320 apresentou corte na faixa numérica de resumo na inspeção; não usar a demo como golden pixel-perfect dos valores extremos.

| Divergência | Produto real a preservar / tratar |
|---|---|
| Demo tem busca/filtros em Casa e ações Já temos/adicionar direto | Produto real edita/ativa/desativa; busca é melhoria UI-009. Não criar estoque persistente nem nova regra Já temos no catálogo sem decisão |
| Mercearia/Laticínios/Hortifruti/Padaria e unidades de embalagem na demo | `CATEGORY_ORDER`: Alimentos, Bebidas, Higiene, Limpeza, Outros; quantity inteiro, sem campo de unidade/embalagem em Product |
| Demo exibe email de outras pessoas | RPC de nomes não retorna email. Manter privacidade real |
| Switcher local persiste demo | Corrigir UI-013 na resolução autorizada real, com cache e Auth; não copiar localStorage fictício |
| Demo não cobre conclusão completa/RPC/idempotência | Preservar compra anterior arquivada, resumo após gravação e todos os status no histórico |
| Motion360/180/260 anunciado no estudo | Hipótese visual; não resultado de performance do Restok |

## Cobertura herdada e nova captura necessária

| Superfície/estado |320×640|390×844|768|1024|1280×800|1440×900| Ação mínima antes do aceite |
|---|---|---|---|---|---|---|---|
| Compra longa/primeira dobra | V2 QA2 falha | V2 CONT parcial | Histórico local apenas | Histórico local apenas | V2 QA2/CONT parcial | Só demo nesta rodada | Regravar produto nas seis dimensões com retângulos e seek |
| Editor/preço/quantidade | V2/limites v1 | V2 CONT/FUNC | Histórico local | Histórico local | V2 QA2 parcial | Não verificado atual | Casos monetários e extremos em seis larguras |
| Casa/catálogo/nova compra | V2 recorte | V2 FUNC5/MOBILE | Histórico local | Histórico local | Recorte anterior | Só demo | Ativos/inativos,33/100, footer e busca |
| Histórico/detalhe/conclusão | Não verificado atual | V2 CONT/FUNC5 | Histórico local | Histórico local | Parcial herdado | Só demo | Zero/muitas compras, preços0/ausentes e cronologia |
| Casas/pessoas | V2 QA2 parcial | V2 CONT/UI-002 | Não verificado atual | Não verificado atual | V2 QA2/CONT | Só demo | Papéis, nomes80, troca/reload e falhas |
| Auth/onboarding/perfil | Recorte histórico | V2 mobile/link inválido | Histórico local | Histórico local | Guarda/logout v2 | Não verificado atual | Sucesso/erro/loading/confirm/recovery real |

“Histórico local” significa arquivos existentes em `docs/audit`/`docs/design` de setembro/outubro; não foi revalidada equivalência visual integral com o checkout atual. Não confundir “arquivo existe” com teste novo aprovado. Campos não cobertos são **NÃO VERIFICADO**.

## Registro mínimo para nova evidência

Para cada captura futura: ID, commit + hash das modificações locais, route/hash, fixture sem segredo, engine/versão, viewport CSS exato e DPR/zoom, motion real/emulado, cenário/passos, caminho PNG/WebM/trace redigido, início/fim de mídia e método de seek, expectativa, observado, severidade e responsável. Guardar script timing separado de media timing. Nenhum token, senha, email real ou sessão deve entrar na mídia.

Não há servidor local ativo na porta3000 observado nesta rodada. Não se iniciou servidor/build que alterasse artefatos do produto nem se autenticou contra backend para nova captura. Reutilizou-se a prova integrada v2 com seus limites. Hardware/leitor/mailbox/concorrência/CWV permanecem pendentes conforme documento06 e BLOCKERS da v2.
