# Fase 3: componentes compartilhados

30/10/2026. Executada após o gate da Fase2, conforme autorização para a sequência.
Baseline visual própria: `evidence/phase2-after/`. A implementação da Fase1 e o
pacote original foram preservados. Não houve reconstrução das páginas da Fase4.

## Modificações e arquivos

| Componente / arquivo | Resultado |
|---|---|
| ui/controls.module.css | Inputs16px em todas as larguras, labels14px, lineStrong, alvos44, tabs com underline; hover não altera disabled nem apaga erro |
| ui/search-field.tsx | Ícone de busca discreto, padding próprio, label e clear/foco existentes preservados |
| ui/numeric-fields.module.css | Mesmo limite lineStrong e tamanho16px; quantidade inválida com borda danger; parser e stepper intactos |
| ui/feedback.module.css | Vazio compacto sem dupla borda, aviso informacional com limite leve, foco highlight no toast escuro, breakpoint de toast alinhado ao shell |
| ui/overlay.module.css | Header/body mais contínuos, footer separado por hairline, scrollbar estável e ações que podem quebrar linha; sheet mobile e dialog desktop mantidos |
| ui/action-menu.tsx | ArrowUp abre na última opção, ArrowDown na primeira; menu acompanha scroll/resize e remove listeners ao fechar |
| ui/primitives.test.tsx | Caso novo para abertura do menu pelas duas setas; cobertura existente de dialog/foco/toast mantida |
| shopping/shopping-controls.module.css | Budget padding16/24, valor28 no compacto e32 nos demais, progresso6px, foco highlight e adaptação a valores longos pela largura do componente |
| shopping/item-row.tsx e shopping.module.css | Lista branca/divisores, nome16px, metadados secundários, Sem preço explícito, zero preservado, preço unitário quando quantidade>1, remoção da coluna vazia de ação em itens já resolvidos |
| products/product-row.tsx e products.module.css | Rows compactas brancas, nome16/500, metadata12 e ações visíveis44px; Ativar/Desativar passa a quiet, mantendo handlers e nomes acessíveis |
| shopping/shopping-dock.tsx e app/app-shell.module.css | Valor extenso ocupa largura completa; seus dígitos não quebram. Reserva medida na Fase2 acompanha a altura real |
| components/restok-app.tsx | Toast compartilhado apresenta confirmações já emitidas pelo estado real; erros persistem inline. Com teclado aberto, anúncio permanece sem controle flutuante |

Filtros e ordenação preservam o efeito local real. No mobile, o disparador de
ordenar usa ícone e mantém nome acessível completo/tooltip, liberando largura
para a busca. Não foram adicionados filtros de domínio, APIs ou operações.

O total continua vindo de `listTotal`, e BRL de `formatBRL`. Não foram alterados
parsers, funções financeiras, regras de status, histórico, callbacks de escrita,
RLS, Auth, permissões ou cache. A confirmação visual usa o mesmo estado emitido
pelos fluxos existentes; não antecipa sucesso remoto. O Toast permanece fora da
região animada de conteúdo para seu posicionamento fixed continuar no viewport.

## Validação

Ver resumo e logs no [relatório conjunto](REPORT.md). O runner final cobre sete
larguras, estados de input/foco/erro/hover/disabled/busy, sheets100itens, menus,
toast e regressões do shell. Nos quatro viewports pedidos, verifica orçamento
zero, igual, excedido, comprado sem preço e valores extremos. Em320/390, a última
row fica livre do dock e seu valor é um único fragmento de texto sem quebra.

Os testes unitários preservam teclado virtual, retorno de foco, Escape,
interrupção/reabertura de dialogs, retry/idempotência, preços0/ausentes,
quantidades, seleção e ordenação por categoria. Não se aumentaram timeouts.

## Ciclo de correções observado

- Captura de row resolvida mostrou espaço de ação vazio e preço unitário repetido:
  removida a coluna vazia e mantido o unitário quando ajuda a interpretar quantidade.
- Busca ficava curta no compacto: disparador de ordenação passou a ícone nomeado
  no mobile, conforme a referência.
- Hover sobre campo inválido podia vencer a borda de erro na cascata: regra de
  invalid passou a preservar danger também no hover.
- Valor extremo no dock quebrava dentro de um grupo numérico: largura integral
  para esse estado e amount nowrap. A altura variável continua reservada no scroll.
- O teste de foco do Toast inicialmente usava modalidade de ponteiro; corrigido
  para Tab real antes de avaliar `:focus-visible`. Não se forçou outline no mouse.

## Limites

A navegação e os componentes estão revisáveis, sem declarar aceite humano por
checks automáticos. Não foram reordenados headers/seções de Casa e Histórico,
criados resumos novos, removidas operações do catálogo, criada rota Pessoas ou
substituída autenticação por fixture. Detalhes e nomes de embalagem da demo que
não existem no modelo real não foram inventados no produto.

Manrope/OFL permanece a fonte; Nexa e master vetorial não foram fornecidos. Next
autenticado, RLS integrado, leitor de tela e hardware permanecem sem nova
certificação. A Fase4 exige autorização própria.
