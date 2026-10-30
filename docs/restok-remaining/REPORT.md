# Restok — telas restantes e exclusão de itens

30/10/2026. Continuação expressamente autorizada após a fase 4.1.

## Resultado

| Superfície | Alteração validada |
| --- | --- |
| Shell | Sidebar branca de 228px, quatro destinos, seletor de casa, conta no rodapé e navbar desktop de 58px com breadcrumb/perfil. |
| Casa | Catálogo plano e compacto, busca, categorias, ordenação opcional, edição pelo nome, ativação e inclusão na compra. Produto já pendente não é duplicado. Dock móvel com novo produto. |
| Histórico | Compras anteriores, três indicadores, meses derivados dos registros, coleções brancas compactas e detalhe com snapshots completos e comparação por unidade. Retorno mantém foco no registro. |
| Casas e pessoas | Página própria com casa ativa em destaque, troca de casa, membros e convites. O seletor global em sheet continua disponível. Papéis, identidade, confirmação e serviços reais foram preservados. |
| Compra | Lixeira no desktop e gesto da direita para a esquerda para revelar a exclusão no mobile. O gesto não apaga automaticamente. Botão acessível por teclado, confirmação, recálculo do total e preservação do catálogo. |

O shell usa a marca tipográfica renderizada na demonstração, com a fonte Manrope
local. O PNG legado não foi removido das demais superfícies.

## Referência e evidência

Foi navegado o site publicado nos quatro fluxos: Compra, Casa, Histórico e Pessoas.
A publicação consultada é a versão 6:
https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/.
Registro em `evidence/live-reference.json` e capturas `live-*.png`.

O código original preservado em `../restok-demo-v6-handoff/original/dist/` foi
consultado, especialmente `r2.js` e a cascata efetivamente carregada pelo HTML.
A regressão de Compra abre esse código original no navegador e compara dados,
tipografia, cores, estados e geometria contra os componentes reais. Os hashes e
as medições estão em `evidence/purchase-regression/manifest.json`.

O adaptador de QA importa as fixtures da demonstração exclusivamente em
`tests/e2e/fixtures.ts`. Produção não importa esses dados. Histórico e membros
usam também fixtures próprias para exercitar snapshots e identidades extensas;
seus valores não são apresentados como igualdade dos dados da demonstração.

As capturas finais cobrem 320, 390, 768, 1024, 1280, 1440 e 1920px, sem erros de
JavaScript ou overflow horizontal nas quatro telas. Índice visual: `../restok-remaining/index.html`.

## Verificação

- 254 testes automatizados passaram, incluindo exclusão, cancelamento, recarga,
  falha/repetição e autorização por casa/lista.
- 192 verificações de regressão de Compra contra o código original passaram.
- 108 verificações de interação das telas restantes passaram em sete larguras.
  Incluem eventos nativos de toque via Chromium/CDP para revelar a lixeira,
  confirmação, cancelamento, recálculo, duplicação de pendentes, busca,
  categorias, detalhe/retorno do histórico e seleção da casa.
- ESLint, TypeScript e build Next de produção passaram. O build foi isolado,
  sem `.env` ou backend, preservando o `.next` de desenvolvimento existente.
- O build mantém os avisos herdados sobre múltiplos lockfiles e migração futura
  de middleware para proxy; não foram introduzidas migrações de banco.

## Limites de conformidade

A composição e os fluxos foram confrontados com a demonstração. A implementação
não é uma réplica integral de dados ou de todas as regras simuladas:

- O modelo real não tem embalagem, medida livre ou estoque persistente no
  catálogo. O botão de ativação não foi convertido em “Já temos”. O resumo
  mostra ativos, categorias reais e inativos, sem inventar disponibilidade.
- As categorias reais continuam Alimentos, Bebidas, Higiene, Limpeza e Outros.
  Meses, pessoas, nomes, valores e papéis vêm dos registros reais.
- Os inputs mantêm 16px e ações utilizáveis por toque; a conta permanece
  acessível no header móvel. Esses requisitos alteram a densidade do exemplo.
- Itens incluídos pelo catálogo usam a ordem persistente existente (acréscimo
  ao final), enquanto a demonstração insere no início. Sem compra ativa, abre
  o fluxo real de criação da compra.
- A finalização real, avisos de sincronização e controles de permissão
  continuam acessíveis. Não se mostra “Prévia interativa” em produção.
- Exclusão usa a autenticação e RLS existentes: verifica a casa e lista ativa,
  limita por ID de item/lista e usa a fila de gravação da lista. Exclusões
  pendentes são repetidas antes de salvar uma edição posterior. A alteração
  é otimista, com erro acionável se a confirmação remota falhar.
- QA não substitui uma sessão Supabase real, teste simultâneo entre aparelhos
  ou inspeção física em iOS/Android. O gesto foi validado com eventos nativos
  de toque no Chromium, além do acesso por teclado.

Os relatórios das fases anteriores são registros históricos; suas restrições de
escopo e decisões de shell são substituídas por esta continuação e pelo registro
mais recente em `DESIGN.md`.

## Publicação

Commits e push foram autorizados pelo usuário. A promoção em produção deve ser
feita pelo navegador interno na Vercel conforme solicitado. Durante esta
execução, o controlador desse navegador falhou antes de disponibilizar as abas
com `failed to write kernel assets: ... (os error 3)`. O acesso via Playwright
usado no QA não representa uma execução desse deploy na Vercel.
