# Restok: Fases 2 e 3 submetidas à revisão

30/10/2026, America/Sao_Paulo. Pedido vigente: “prossiga para a fase 2 e 3 em
sequencia”. Fase2 executada e validada primeiro; Fase3 executada em seguida.
Não se tratou a autorização de sequência como aceite visual antecipado.

Baseline Git `e1565f8b3399a8eb500a06657dafdc165653536b`, com todos os diffs da Fase1
preservados. Pacote v6 original mantido intacto, commit de referência
`f0214b71d9497caa62ccaa3b804579f7cd757959`.

[Fase2: arquivos, decisões e gate](PHASE2.md) ·
[Fase3: arquivos, componentes e limites](PHASE3.md) ·
[Galeria comparativa](index.html).

## Resultado

O shell concentra casa, navegação, avisos e conta na sidebar desktop e em região
compacta mobile. O gutter vem da fundação; sidebar228px desde1024 e contexto
opcional só quando sobra largura útil. Não há novo header global desktop ou
painel decorativo. O dock reserva sua altura efetiva.

Componentes compartilham campos16px, limites discretos, foco acessível, listas
brancas e tipografia mais leve. Orçamento usa16/24px, progresso6px e mantém
cálculos reais. Valores grandes e ausentes ficam explícitos. Menus, sheets,
toasts e ações de produto preservam suas operações e estados.

## Evidências e verificações

| Gate | Resultado |
|---|---|
| Fase2: Playwright/Edge156, DPR1 |148 checks aprovados, zero pageerror |
| Fase2: suíte |243/243 em41 arquivos, execução serial |
| Fase3: suíte |244/244 em41 arquivos; log phase3-tests.log |
| Fase3: navegador |271 checks aprovados, zero pageerror; manifesto phase3-after |
| Lint e TypeScript |Aprovados; logs phase3-lint.log e phase3-typecheck.log |
| Build Next16.4.3/webpack |Aprovado em cópia temporária isolada, sem .env/backend; build.log e build.json |
| git diff --check |Aprovado |

O build foi feito fora do `.next` existente, com cópia dos fontes para um
diretório temporário próprio dentro do workspace. Nenhum lock de desenvolvimento
foi removido. A cópia foi apagada após verificar seu caminho absoluto; somente
os logs permanecem. O warning de múltiplos lockfiles decorre dessa cópia; a
depreciação de middleware e avisos de cache são anteriores/independentes desta
mudança. Não se migrou a arquitetura para resolver avisos do build.

Screenshots e manifestos separados em `evidence/phase2-before/`, `phase2-after/`
e `phase3-after/`. Viewports:320×640,390×844,768×1024,1024×768,1280×800,
1440×900 e1920×1080. Quatro resoluções pedidas mais transições intermediárias.
1920 é derivado de QA, sem fingir um modo original da demo.

O harness bloqueia todas as requisições fora de localhost e substitui o acesso a
serviços somente no runner. Produção não importa essas fixtures. Dados v6 usados
para Compra/Casa: mesmos nomes, quantidades, preços, status e orçamento. Categorias
adaptadas ao domínio real e sem inventar campo de embalagem. Gestor e Histórico
mantêm os dados locais do harness; esses estados não recebem aceite por igualdade
de conteúdo com a demo. Referências originais ficam na galeria da Fase1.

O navegador integrado estava indisponível na sessão (falha de assets do kernel
registrada na Fase1); a inspeção real foi feita por Playwright/Edge e leitura dos
PNGs. Não se usou pontuação de pixels como único critério.

## Classificação e divergências residuais

| Item | Classificação | Evidência / destino |
|---|---|---|
| Sidebar228, casa ativa, um nav visível, sem header redundante |Conforme | Capturas e checks do shell |
| Gutter12/16/24, primeira row ordinária em320, dock reservado |Conforme | Geometria dos manifestos |
| Contexto256 com trabalho≥560 |Conforme | Preview isolado; nenhum painel inútil no produto |
| Campos16, foco/erro, disabled/busy e menu por teclado |Conforme | Checks computados, capturas e testes |
| Budget, BRL, meta0/igual/excedido e ausência de preço |Conforme no harness | Código financeiro preservado e suíte funcional |
| Valores extremos / última row fora do dock |Conforme nos casos testados | Checks de overflow, fragmento de texto e geometria |
| Header antigo da demo versus sidebar atual |Exceção aprovada | Decisão posterior explícita do usuário |
| Categorias, detalhes de embalagem e operações reais do catálogo |Exceção aprovada | Produto real prevalece sobre simulação |
| Headers e ordem de seções nas telas do core |Divergente | Preservados; pertencem à Fase4 |
| Primeira dobra320 com nome e valor extremos simultâneos |Divergente | Valores permanecem íntegros e a última row fica acessível por scroll; compactação da composição extrema fica para a Fase4 |
| Next autenticado / F-05 integrado / persistência e permissões reais |Não verificado | Build aprovado não substitui sessão integrada |
| Safari/Android físicos, leitor de tela e zoom nativo |Não verificado | Sem certificação nova nesta entrega |
| Marca vetorial e Nexa licenciada |Não verificado | Assets não fornecidos; Manrope local/OFL preservada |

## Prontidão e rollback

Fases2 e3 implementadas, com evidências técnicas/visuais disponíveis para revisão.
A Fase4 não foi iniciada. Os arquivos por fase estão nos dois relatórios vinculados;
os manifestos guardam hashes dos fontes renderizados.

Rollback local: reverter somente os diffs dessas fases e seus novos arquivos de
teste/documentação, preservando a Fase1, o handoff original e dados. Nenhum commit,
push, PR, migration, deploy ou gravação remota foi realizado.
