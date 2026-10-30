# Casas e pessoas

Comparar [gestão atual390](evidence/current/390-844-pessoas-filled.png), [prévia390](evidence/reference/390-844-pessoas-canvas.png), [gestão atual1440](evidence/current/1440-900-pessoas-filled.png) e [prévia1440](evidence/reference/1440-900-pessoas-canvas.png). A prévia apresenta uma **tela** de Pessoas; não existe golden de um dialog final com todos os contratos reais. O plano adapta a linguagem, sem fingir equivalência de formato.

## P-01: casa ativa repetida e conteúdo pouco agrupado

**Tela:**Modal Casas e pessoas. **Viewport:**320×640,390×844,1440×900, supplied/U04. **Severidade:**média. **Evidência:** current/*-pessoas-filled.png e referência correspondente. **Componente:** `households/household-manager.tsx:47–55`, `households.module.css:1–10`.

**Problema atual:** heading Casa ativa, nome e opção selecionada repetem a mesma identidade antes de chegar aos membros. Nova casa divide atenção com troca. **Referência:** casa ativa compacta, depois identidade e acesso; o card escuro da demo existe nessa tela, mas o modal não precisa duplicar a âncora de Compra sem finalidade.

**Correção/especificação proposta:** um grupo Casa ativa com nome/role e seletor; remover somente o parágrafo de nome redundante quando o select já o apresenta; criar casa em disclosure explícito. Header20px700/descrição14px; gaps8/16px internos e24px entre seções. Preservar descrição de conta individual e efeito da troca.

**Aceite:** casa e papel sempre identificáveis, troca falha mantém casa anterior, nova casa pendente tem retry, seleção persiste após reload integrado. **Impacto:** hook de gestão e onboarding preservados; não concluir UI-013 com simples mudança de select.

## P-02: ações dos membros mantêm layout móvel no desktop

**Tela:**Modal Casas e pessoas. **Viewport:**390×844,1280×800,1440×900. **Severidade:**alta por densidade, sem truncamento80 reproduzido. **Evidência:** extra/*-people-distinct-names.png e *-bottom.png; current/1440-900-pessoas-filled.png. **Componente:** `households/member-row.tsx:13–26`, `households.module.css:11–16`.

**Problema:** cada membro administrável usa nome, data, select de largura total e duas ações esticadas, inclusive em704px desktop. Isso exige rolagem com apenas três membros. **Referência:** identidade completa ocupa faixa própria, ações subordinadas, sem competir com o nome.

**Correção/especificação proposta:** conservar identidade antes das ações; desktop colocar Papel num controle de aproximadamente200px e Transferir/Remover no restante do grupo; mobile mantém100% no papel e botões44px após identidade, podendo recolher ações menos frequentes em menu nomeado. Nome16px600 com quebra livre; papel/data14px; padding16px por membro e gap8–12px. Não usar ellipsis ou sufixo oculto como economia.

**Aceite:** nomes de80 caracteres com79 comuns+A/B são distinguíveis visualmente e nos nomes acessíveis; confirmações repetem nome e casa; papel owner/admin/member e self continuam determinando permissões; ações alcançáveis com teclado/scroll. **Impacto:** UI-002 e ações sensíveis. A fixture documental corrige apenas dados de teste; o produto não foi alterado.

## P-03: gestão extensa precisa de navegação de seções, não compactação global do Sheet

**Tela:**Modal Casas e pessoas. **Viewport:**320×640 e390×844,1280×800 e1440×900. **Severidade:**média. **Evidência:** em390 o painel mede390×793,36px; em1440 mede704×810px com três pessoas. current/*-pessoas-bottom.png e extra/*-people-read-error.png. **Componente:** `ui/overlay.module.css:4–10,20`, `ui/sheet.tsx:7`, `households/household-manager.tsx:58–69`.

**Problema:** toda a gestão é uma sequência longa, com convites e orientação após membros. O header fixo e body rolável já funcionam; reduzir padding de todos os sheets esconderia o problema sem tratar a hierarquia.

**Referência:** DS pede dialog compacto desktop e sheet mobile; identidade/permissão completas. **Correção/especificação proposta:** manter width desktop máximo704px e max-height90dvh, header fixo e um body scroll; adaptar para até640px apenas se o conteúdo de papel/casa couber. Mobile manter bottom sheet até94dvh; seções Casa/Pessoas/Convites com navegação interna ou disclosure, com contagem/estado resumidos e erro sempre visível no grupo pertinente. Convites expandem após criação ou falha, sem revelar tokens históricos. Ação Sair deve ficar junto do contexto de acesso, danger subordinado.

**Justificativa:** é gestão eventual invocada sobre o catálogo, com retorno ao disparador. Um bottom sheet alto conserva contexto e o padrão existente; fullscreen/rota nova exigiria decisão de navegação adicional e não resolveria a hierarquia por si. Não implementar drag-to-close como condição para sair.

**Aceite:** header/Fechar acessíveis em320; último convite/ação crítica alcançável por um scroll; sem dupla rolagem; Escape/cancelar retorna ao controle; confirme/cancele não desmontam erradamente a gestão; erro persistente e retry; teclado virtual em aparelho como gate futuro. **Impacto:** variantes do Sheet precisam ser específicas da gestão para não comprimir editores e seleção100.

## Contratos de segurança e estados

Preservar `memberPermissions`, `useHouseholdManager`, bloqueio de último owner, limite/expiração de convites, confirmação para papel/transferir/remover/sair/revogar, refresh de memberships e escolha de casa autorizada. Não mostrar email de outros participantes: a demo usa emails fictícios, mas o contrato real fornece nomes e papéis. Não inferir autorização a partir do layout.

Observado nesta rodada: três membros, nomes80 distintos, rolagem final, erro de leitura, confirmação de transferência cancelada, Escape e retorno, reduced. Criação/aceite/revogação remotos, sucessos de papéis, múltiplas sessões, expiração e concorrência **não foram reexecutados**. A fixture responde false/null às mutações de acesso; não tomar o seu erro simulado como bug do backend. A evidência integrada de PR10 é histórica e seus limites continuam válidos.
