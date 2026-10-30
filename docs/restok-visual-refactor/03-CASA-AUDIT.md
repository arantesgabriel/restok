# Casa: produtos recorrentes

Comparar [atual390](evidence/current/390-844-casa-filled.png), [aprovado390](evidence/reference/390-844-casa-canvas.png), [atual1440](evidence/current/1440-900-casa-filled.png), [aprovado1440](evidence/reference/1440-900-casa-canvas.png). A Casa prepara o catálogo; não deve herdar o orçamento e o dock da Compra.

## H-01: contexto empilhado posterga os produtos

**Tela:** Casa. **Viewport:**320×640 e390×844. **Severidade:**alta. **Evidência:** primeira row em y490,98/471,98px; capturas preenchidas e supplied/U01. **Componente:** `products/products-home.tsx:26–30`, `products.module.css:1–10`, AppShell.

**Problema atual:** casa repetida no switcher e eyebrow, descrição extensa, faixa de compra em andamento, busca, segunda linha de comandos e título da seção precedem o catálogo. Em320, a primeira row termina em612,98px e a navegação começa em580px: **nenhuma row inteira fica acima da barra**. Em390 há duas rows completas. Não confundir com UI-001 antigo da Compra, que já passa no caso comum. **Referência aprovada:** preview coloca título+quantidade e busca antes da coleção; contexto de casa é curto e subordinado.

**Correção proposta:** agrupar título/contexto e resumir compra atual em uma linha de apoio ou contexto lateral desktop, mantendo “Nova compra” descobrível com aviso de arquivamento. **Especificação sugerida:** título24px700 mobile/32px800 desktop; contexto14px; 8px dentro do grupo e16/24px entre blocos; busca44px; alvo proposto primeira row y≤360px em320 e390, sem ocultar informação funcional. Esse teto é critério proposto, não uma medida obrigatória já publicada no handoff.

**Aceite:** ao menos uma row completa com suas ações acima da navegação em320; busca e criar produto acessíveis sem scroll; título longo da compra não expande uma faixa dominante. **Impacto:** criação de compra e seleção de produtos; sem remover o aviso de que a atual será arquivada.

## H-02: linha ordinária mobile consome122px

**Tela:**Casa. **Viewport:**320×640 e390×844; desktop para comparação. **Severidade:**alta. **Evidência:** current/390-844-casa-filled.png, geometria row122px; reference/390-844-casa-canvas.png. **Componente:** `products/product-row.tsx:8–13`, `products.module.css:16–20,24`.

**Problema:** grid de uma coluna põe duas ações com44px numa linha posterior mesmo para nomes curtos. Nomes longos precisam dessa largura; todos os nomes não precisam pagar a mesma altura. **Referência:** coleção branca com identidade e ações compactas no mesmo alinhamento, metadados secundários.

**Correção/especificação proposta:** row normal em grid minmax(0,1fr) auto, editar com ícone44px e ativar/desativar em menu de ações44px nomeado; menus preservam labels completas. Para nome80, identidade ganha linha integral e ações abaixo. Alvo64–80px para nomes comuns, sem limite máximo em conteúdo longo; texto16/600 e metadados12/14px. Agrupar a coleção em surface com divisores line e radius12, sem card individual.

**Aceite:** nomes comuns mostram≥2 produtos completos em390 sem esconder ações no hover; nomes80 A/B e quantidade999999 legíveis; desativar/reativar retém o destino de foco e seção de inativos. **Impacto:** controle de ações e foco; manter quantidade padrão e categoria atuais, sem inventar “estoque disponível”.

## H-03: vazio e busca sem correspondência têm tratamento/ação inconsistentes

**Tela:**Casa. **Viewport:**320×640,390×844,1440×900. **Severidade:**média. **Evidência:** current/*-casa-empty.png, *-casa-no-result.png e *-casa-long-names.png; supplied/U01/U05. **Componente:** `products-home.tsx:31–35`, `use-product-view.ts`, EmptyState.

**Problema:** catálogo vazio repete botão primário de adicionar no toolbar e no painel; busca sem resultado usa mensagem mas não CTA explícito de limpar junto ao resultado. O campo tem clear acessível, que deve continuar. **Referência:** DS distingue ausência real, inativos e busca, com próxima ação útil; a demo não oferece golden de todos esses estados.

**Correção/especificação:** aplicar F-04; uma ação primária por contexto; no vazio real, mensagem curta com criar produto; na busca, resultado compacto16px/600 e “Limpar busca”44px; todos inativos mantêm disclosure aberto e reativação disponível. **Aceite:** ativo/inativo e contagem não são confundidos; limpar retorna foco ao campo; erro remoto nunca comunica catálogo0. **Impacto:** apenas apresentação e filtros; preservar edição e reativação reais.

## Diferença funcional deliberada

A demo contém botões de adicionar à compra e Já temos no catálogo, categorias Mercearia/Laticínios etc. O produto real tem Alimentos/Bebidas/Higiene/Limpeza/Outros, `defaultQuantity`, `active`, edição e preparação de Nova compra. `Product` não contém estoque ou unidade de embalagem. Não adicionar esses comportamentos por fidelidade cosmética. D-02 precisa constar do aceite. Desktop pode exibir quantidade de produtos ativos/inativos e casa, sem fingir que “ativos” significa “já disponíveis”.

Estados investigados:33 produtos,100 na seleção de Nova compra, vazios, nomes80, quantidade999999, um inativo, busca sem resultado, editor e rolagem. Loading/erro de snapshot pertencem ao shell; erros do editor permanecem no formulário. Preservar testes de snapshots: editar catálogo não muda o registro histórico nem os itens de compras anteriores.
