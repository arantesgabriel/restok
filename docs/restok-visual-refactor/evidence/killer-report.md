# Restok: relatório de instrumentos

Auditoria, sem implementação. Score visual não certificado: medição de componentes em fixture e referência em canvas, não sessão autenticada Next. Gate incompleto não será aprovado por nota.

| Route | File | Surface | Business variable | Persuasion |
|---|---|---|---|---|
| /app#shop | components/shopping/shopping-view.tsx | B/C | Velocidade de resolver itens e correção do gasto registrado | Nenhuma |
| /app#home | components/products/products-home.tsx | B | Localizar e manter produtos recorrentes | Nenhuma |
| /app#history | components/history/history-view.tsx | B/C | Recuperar registros e comparar preço unitário corretamente | Nenhuma |
| /app, Casas e pessoas | components/households/household-manager.tsx | C | Identificar pessoa e efeito de uma alteração de acesso | Nenhuma |

## Screen seen

| Route | Width | Data state | What happened |
|---|---|---|---|
| /app#shop | 320,390,768,1280,1440,1920 | 33 itens, vazio, stress, orçamento zero | Componentes atuais renderizados em fixture local; primeira dobra medida |
| /app#home | 320,390,768,1280,1440,1920 | 33 produtos e vazio | Busca, linhas e densidade capturadas |
| /app#history | 320,390,768,1280,1440,1920 | Uma compra e vazio; 24 compras em 320,390,1440 | Lista, detalhe e retorno de foco observados |
| /app, Casas e pessoas | 320,390,768,1280,1440,1920 | Três pessoas, nomes extensos; falha e confirmação em 320,390,1440 | Sheet, scroll, Escape e retorno de foco observados |

## Limites

Sem modificação do produto ou de detectores. Tokens RGB semânticos do Restok são válidos; prescrição HSL da skill não rege o projeto. Separadores de metadados não serão reescritos por gosto da skill. Contratos de confirmação de acesso prevalecem sobre sugestões genéricas de undo. Não se importam componentes de outra marca. Revenue/conversão e distribuição pública estão fora deste recorte operacional.

## Resultados executados

| Instrumento | Resultado | Interpretação |
|---|---|---|
| killer --roots e --report |3/4 gates integrados: impeccable0, token fallback0, noise1; copy não localizado em ~/.claude | Gate fechado; não declarar protocolo integral ou fidelidade aprovada |
| copy-lint separado no perfil Codex |9 ocorrências em59 arquivos, inclusive testes | A–Z/Z–A e separadores de metadata; convenções do produto, sem reescrita automática |
| motion-lint | Sem padrões sinalizados no alvo executado | Não mede fluidez, latência, hardware ou timings reais |
| refine-scan |0 em1 arquivo efetivamente lido | Não cobre toda a composição do orçamento/CSS |
| antiwebslop |0 erros,3 warnings,6 infos em76 arquivos | Bordas laterais de status e grids de contagens têm função; wrap já é compartilhado pela base |
| Testes do repo |228/228 em39 arquivos | Baseline funcional; não é prova estética |
| Typecheck/lint finais | Ambos exit0 | Incluem scripts documentais novos; falhas iniciais de globals nesses scripts foram corrigidas sem mudar o produto |

Noise aponta household-manager.tsx:53/57, com63% de palavras compartilhadas em mensagens condicionais de conta desconectada. Esse estado não foi visto na sessão atual habilitada. A sugestão de repetição fica como candidato de copy, não como defeito de produção confirmado. P-01 tem evidência própria da tripla identidade de casa, independente desse scanner. Nenhum detector foi editado ou silenciado.

## Interrogação aplicada ao produto

| Pergunta | Resposta com fonte | Consequência |
|---|---|---|
| Qual tarefa governa a primeira dobra? | Resolver itens no mercado, PRODUCT e shopping-view.tsx:16 | Orçamento/controles precisam liberar lista; C-01/C-03 |
| O destaque representa dado confiável? | BudgetSummary usa listTotal e explicita comprados sem preço, budget-summary.tsx:7–10 | Preservar semântica de total parcial, sem zero silencioso |
| O default tem regra? | use-shopping-view.ts:10 inicia categoria; use-purchase-selection preserva seleção | Não mudar ordenação/seleção como gosto de designer |
| Que informação merece menos peso? | Categoria e status repetidos em item-row.tsx:23; cabeçalhos CategorySection | C-02/C-03, sem apagar estado acessível |
| Ações reversíveis dependem de confirmação nova? | Ativar/desativar usa fluxo e foco existentes em restok-app.tsx | Não adicionar confirmação para operação frequente |
| Acesso pode ser alterado por engano? | ConfirmationView e memberPermissions em household-manager/member-row | Manter confirmação e identidade integral; P-02 |
| Vazio poderia esconder erro? | SnapshotFailed/syncWarning em restok-app; captura snapshot-error | Erro e vazio separados, retry preservado |
| Comparação usa mesma unidade/tempo? | previousHistoryPrice e HistoryPriceComparison | Preservar referência anterior unitária; R-03 |
| Mais espaço cria informação? | Shell de992px e ausência de apoio em app-shell.module.css:2/25 | F-01/C-04, só contexto útil, sem painéis de preenchimento |
| Nomes A/B são realmente diferentes? | Fixture anterior corta o sufixo; nova audit-data-fixture.ts gera79+A/B | Teste de dados corrigido isoladamente, sem falso UI-002 |

F1 reutilização: primitives existentes suficientes, sem kit externo. F2 sistema: paleta/Manrope/radius aprovados prevalecem sobre defaults da skill. F3 responsividade: seis viewports medidos; performance de campo não medida. F4 fluxo: catálogo→compra→histórico preservado, sem estoque inventado. F5 compactar: rows122 e contexto de Casa são alvos; nomes e avisos de acesso não devem ser escondidos. F6 maiores ganhos: orçamento/row/grid antes de motion; leitores/hardware/Next integrado continuam gates próprios.

## Craft Report

Checked: composição, anatomia, fontes/tokens, seis viewports, dados comuns/longos, alguns erros/loading, Escape/foco/reduced, baseline funcional e scanners listados. Passed: UI-001 comum, footer100, nomes80 com quebra, confirmação simulada e navegação atual testada. Changed: somente documentação, capturas e adaptador de dados restrito às evidências. Left alone: produto, domínio, backend, identidade e artefatos preexistentes. Verdict: planejamento revisável; iniciar fundações após aprovação, sem declarar aceite integrado ou score certificável.
