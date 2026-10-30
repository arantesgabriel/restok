# Matriz de evidências visuais

30/10/2026. HEAD e4de8bcdf91ed98d6e82731a7bff4c3f076c7043. [Galeria comparativa](evidence/comparison.html). [Inventário PNG com hashes](evidence/media-inventory.json). [Integridade de fontes](evidence/source-integrity.json).

## Proveniência e cobertura

- CURRENT: 90 capturas novas dos componentes atuais via Vite4173, dados fictícios, SDK/backend substituídos, requests externos abortados. Engine 156.0.4314.50, DPR1, zoom1; viewport confirmado no DOM. Erros de página: 0.
- EXTRA: 30 capturas novas via Vite4174, adaptações de dados somente documentais:24 compras e nomes80 realmente distintos, além de erro/confirm/Nova100/conclusão. Erros de página: 0.
- REF: 24 estados de fluxo nos seis viewports, cada um com PNG de viewport e de canvas. Mais 22 estados de interação em390/1440. Dados simulados. Erros de página registrados: 0.
- SUPPLIED:8 imagens recebidas, copiadas sem transformação; raster não é viewport. U08 é onboarding fora do escopo, mantido apenas como contexto.
- Next3000: visita isolada retornou login; sem sessão Supabase de auditoria. Não confundir fixture com validação integrada.
- Sem vídeos novos nesta rodada. Capturas não demonstram latência, timings exatos ou hardware. Vídeo com seeks permanece requisito futuro dos blocos, não evidência inventada.

| Viewport CSS atual | Cobertura atual | Referência |
|---|---|---|
| 320×640 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 320 |
| 390×844 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 390 |
| 768×1024 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 390 |
| 1280×800 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 1440 |
| 1440×900 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 1440 |
| 1920×1080 | Compra/Casa/Histórico/Pessoas + edição/detalhe/vazios/scroll | Quatro fluxos capturados; canvas 1440 |

## Medições atuais

Linhas completas consideram o topo do dock ou da navegação inferior quando houver. Contagem descreve a primeira dobra sem scroll, não todo o fluxo. Não usar as rows do fundo quando o modal está aberto como medida de sua densidade.

| Tela | Viewport | Rows no DOM | Topo da primeira px | Altura ordinária px | Rows completas acima das barras | Overflow documental px |
|---|---|---|---|---|---|---|
| Compra | 320×640 | 33 | 367.19 | 64.59 | 2 | 0 |
| Casa | 320×640 | 33 | 490.98 | 122.00 | 0 | 0 |
| Compra | 390×844 | 33 | 367.19 | 64.59 | 5 | 0 |
| Casa | 390×844 | 33 | 471.98 | 122.00 | 2 | 0 |
| Compra | 768×1024 | 33 | 427.39 | 72.00 | 7 | 0 |
| Casa | 768×1024 | 33 | 421.98 | 72.00 | 8 | 0 |
| Compra | 1280×800 | 33 | 427.39 | 72.00 | 4 | 0 |
| Casa | 1280×800 | 33 | 421.98 | 72.00 | 5 | 0 |
| Compra | 1440×900 | 33 | 427.39 | 72.00 | 5 | 0 |
| Casa | 1440×900 | 33 | 421.98 | 72.00 | 6 | 0 |
| Compra | 1920×1080 | 33 | 427.39 | 72.00 | 7 | 0 |
| Casa | 1920×1080 | 33 | 421.98 | 72.00 | 9 | 0 |

## Viewport versus canvas da referência

O modo “Ver só o app” oculta o estudo, mas não transforma seu canvas em layout responsivo nativo. O controle Voltar ao estudo pode sobrepor o topo e não é produto.

| Viewport de navegador | Canvas interno | Transform observado | Overflow documental px |
|---|---|---|---|
| 320×640 | 320×640 | scale(0.8875) | 0 |
| 390×844 | 390×844 | scale(0.907692) | 0 |
| 768×1024 | 390×844 | scale(1) | 0 |
| 1280×800 | 1440×900 | scale(0.863889) | 0 |
| 1440×900 | 1440×900 | scale(0.975) | 0 |
| 1920×1080 | 1440×900 | scale(1) | 0 |

## Matriz de fidelidade

| Tela | Elemento | Estado atual | Referência aprovada | Divergência | Correção proposta | Prioridade |
|---|---|---|---|---|---|---|
| Todas | Shell desktop | Lista única até992px, sidebar desde640 | Sidebar/trabalho/contexto útil | F-01 | Região opcional e breakpoint por conteúdo | Alta |
| Todas | Gutter390 |12px |16px no DS | F-02 | Responsivo12/16/24 | Média |
| Todas | Controles | Borda info em repouso | Limite discreto | F-03 | lineStrong, foco action | Média |
| Compra/Casa/Histórico | Vazio | Caixa tintada/centralizada universal | Condição real e próxima ação, sem golden de todos os vazios | F-04 | Variantes por tarefa | Média |
| Compra | Cor no harness | Ink no orçamento | Texto claro; supplied também claro | F-05, produção não confirmada | Confrontar cascata Next/Vite | Alta para evidência |
| Compra | Orçamento | Padding8×12,24px mobile,barra4 depois da meta | Padding14–16/20–24,27–34,barra5–6 antes da meta | C-01 | Anatomia responsiva | Alta |
| Compra | Rows/status | Ações à direita,72px desktop | Controle esquerdo,preço ao fim,58–68 | C-02 | Grid44/identidade/preço e coleção branca | Alta |
| Compra | Organização | Atalhos globais duplicados | Uma entrada com efeito real | C-03 | Separar global/local sem perder direção por grupo | Média |
| Compra | Ações desktop | Dock fixo | Adicionar no heading/contexto lateral | C-04 | Realocar antes de retirar dock | Alta |
| Compra | Valores longos | Quebra entre dígitos em duas colunas | Legibilidade de números, sem golden extremo | C-05 | Valor em linha própria quando necessário | Média |
| Casa | Contexto | Primeira row perto de472/491 | Catálogo mais cedo | H-01 | Subordinar compra atual/título/contexto | Alta |
| Casa | Rows |122px mobile comum | Identidade/ações compactas | H-02 |64–80 comum, expandir longos | Alta |
| Casa | Vazio/resultado | Primária repetida, limpar distante | Ação por condição | H-03 | Compactar e limpar junto ao resultado | Média |
| Histórico | Registro | Total abaixo e metadata extensa | Nome/data e total em eixo legível | R-01 | Row/coleção compacta | Média |
| Histórico | Período/contexto | Só agrupamento mensal | Filtro e resumo | R-02, D-03 | Apresentação local derivada se aprovada | Média |
| Histórico | Detalhe | Pilha longa também desktop | Informação contextual associada | R-03 | Resumo lateral/compare por unidade | Média |
| Pessoas | Casa ativa | Repetida3 vezes | Grupo único | P-01 | Remover redundância sem perder troca | Média |
| Pessoas | Ações | Select full-width também desktop | Identidade primeiro/ações subordinadas | P-02 | Ações adaptativas e nomes80 | Alta |
| Pessoas | Fluxo/formato | Dialog/sheet longo | Demo é tela; DS permite overlay | P-03, D-01 | Seções progressivas, sem comprimir Sheet global | Média |

## Vínculos de evidência

Cada ID acima remete ao diagnóstico01–05 para fonte/componente/linha/especificação/aceite/impacto. Para pares de fluxo use a galeria com seis tamanhos. Para casos especiais use o manifesto correspondente:

- [CURRENT](evidence/current/manifest.json): cada linha contém arquivo, rota e geometria; estado e viewport formam ID único, por exemplo CUR-390-844-compra-filled.
- [EXTRA](evidence/extra/manifest.json): EXT-390-844-people-distinct-names-bottom, EXT-320-640-new-purchase-100-bottom, EXT-390-844-finish-result etc.
- [REF](evidence/reference/manifest.json) e [interações](evidence/reference-interactions/manifest.json): REF-390-844-compra e REFINT-390-844-budget-editor etc.
- [SUPPLIED](evidence/supplied-manifest.json): U01 Casa mobile;U02 Histórico mobile;U03 Compra vazia mobile;U04 gestão desktop;U05 Casa desktop;U06 Histórico desktop;U07 Compra vazia desktop;U08 onboarding. Originais/hash/raster registrados.

## Ausências e diferenças deliberadas

A demo não prova offline/Supabase/concorrência, a confirmação remota de conclusão, todas as permissões/erros, unidade real do schema ou extremos. Pessoas é tela, não golden de modal. O catálogo demo contém Já temos/adicionar direto, que não existem no contrato Product real. O Histórico demo simplifica estados. Não preencher essas lacunas com falsas referências.

Loading/erro foram capturados nos componentes atuais em320/390/1440, mas não em todos os tamanhos; read-error/confirmação de Pessoas e24 compras têm a mesma amostra. Testes de papéis e datas são baseline automatizada, não nova integração. Sessões reais/troca de casa/reload, leitor, zoom nativo, hardware, engines adicionais e performance de campo permanecem sem execução nova.

O risco de cascata F-05 e o erro da fixture antiga de nomes são registrados para impedir conclusões falsas. UI-001 comum não foi reproduzido; os gates UI-001/UI-002/UI-013 não foram apagados. O resultado esperado é a especificação textual de cada achado, não uma imagem gerada de produto futuro.
