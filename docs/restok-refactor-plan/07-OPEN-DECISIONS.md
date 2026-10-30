# Bloqueios reais e decisões remanescentes

28/10/2026 · Não reabrir a identidade aprovada. Raiz & Eucalipto, card de gasto, lista primeiro, rebuild visual e landing por último estão definidos. Implementação continua aguardando aprovação humana do pacote.

## Dependências de entrega

| ID | Evidência / certeza | Opções e recomendação | Gate afetado |
|---|---|---|---|
| D01 Fonte e marca finais | OBSERVADO-C: só fonte Geist e PNG no repo; handoff declara fonte Nexa condicionada e master pendente | Usar fonte Manrope de origem legítima com licença para a implementação executável; incorporar fonte Nexa apenas quando fornecida legalmente. Solicitar master SVG de `restok.` aprovado; não vetorizar/redesenhar automaticamente | PR03 para font assets; aceite final da marca/PR15 para SVG |
| D02 Evidência anterior ausente | OBSERVADO: ZIP v2 remete à pasta irmã `restok-ui-audit`, não incluída; alguns vídeos UI-005–012 dependem dela | Fornecer pacote v1 ou recapturar os cenários no target seguro. Recomendação: aproveitar os quadros v2 e recapturar cenários relevantes antes de aceitar novos componentes; não inventar duração/media seek | PR01, comparações visuais e rastreabilidade03 |
| D03 Ambiente e recursos de QA | NÃO VERIFICADO: não há frontend ativo3000 nem nova execução integrada/hardware nesta rodada; helpers de carga podem gravar | Disponibilizar target descartável com contas e mailbox, Safari/iPhone/Android, NVDA/VoiceOver e zoom real. Alternativa: aceite por fase com risco aberto explicitamente; não alegar100% | Gates integrado, acessibilidade e release |

Ausência de assets não exige parar o desenho do contrato: o fallback está definido. Ausência de hardware não impede escrever tokens/testes locais, mas impede aceitar testes físicos como realizados. Falha atual do typecheck tem ação concreta no PR01, não precisa pergunta de preferência.

## Decisões funcionais recomendadas para aprovar junto do roadmap

- **Preço0 conhecido:** manter0 distinto de vazio em UI/domínio/banco; comprado0 não conta como “sem preço”. Avulso com preço válido presente, inclusive0, pode começar comprado; vazio começa pendente. Isso altera a condição `>0` atual de maneira deliberada e testada.
- **Meta0:** permitir criar e editar0; gasto positivo comunica excedente igual ao gasto; progresso não divide por0. O schema já aceita0, sem migration proposta.
- **Preço anterior0:** exibir referência e diferença unitária, sem percentual impossível por base0. Produto recorrente tem ligação por productId, não matching pelo nome.
- **Quantidade:** manter inteiro≥1 atual. Definir teto somente se limites de domínio/banco e uso real exigirem; não escolher99/999 por conveniência de layout. O campo deve suportar a entrada válida atual sem clipping.
- **Catálogo:** busca é melhoria UI-009. Não converter “Já temos” em estoque persistente nem adicionar unidade textual/categorias da demo sem requisito de produto separado.
- **Retirada final:** fase4 fecha core/global; fase5 fecha a composição pública e todos os consumidores antigos. Preservar relatórios/licenças históricos, com norma antiga explicitamente superseded. Não confundir manter prova com manter tema ativo.

Essas são propostas concretas, não mudanças realizadas. A aprovação pode destacar exceções; o PR correspondente não deve executar decisão funcional contestada.

## Perguntas realmente necessárias

1. O roadmap, os alvos da matriz02 e os contratos monetários acima estão aprovados para uma próxima execução de implementação?
2. Onde serão fornecidos os arquivos licenciados da fonte escolhida e o master SVG aprovado da marca? Até lá, manter a fonte Manrope legítima como caminho recomendado e a marca final como gate aberto.
3. É possível disponibilizar o pacote v1 e os recursos/ambiente de QA indicados em D02/D03, ou o responsável prefere aprovar fases locais com esses gates externos ainda abertos?

Nenhuma pergunta sobre paleta, stack, biblioteca de motion ou nova arquitetura de backend é necessária: as fontes e o código já permitem decisão. Não foi enviado nada a terceiros nem criado PR/tarefa para obter respostas.
