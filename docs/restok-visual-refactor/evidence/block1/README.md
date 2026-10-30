# Bloco 1 — Compra

Implementação concluída após autorização explícita. Escopo restrito à apresentação e às evidências da tela Compra; Bloco 2 ainda depende de aprovação.

## O que mudou

- Orçamento reorganizado como resumo responsivo: “Total registrado”, disponível/excedente, progresso e ação textual “Editar meta”. Cálculos seguem `listTotal` e `formatBRL` existentes.
- Linhas da compra usam estado acionável de 44px à esquerda, conteúdo no centro e preço alinhado à direita. “Já temos” e “Sem preço” continuam explícitos; preço ausente não vira zero.
- Ordenação global fica em um menu “Organizar”; direção por categoria permanece independente. Busca e filtros não persistem nem alteram dados.
- Dock e ações mobile permanecem. A partir da largura útil definida pelo Bloco 0, adicionar vai para o título e pendentes/finalização ficam no contexto da compra; sem dock desktop.
- O apoio de contexto aparece somente na tela Compra e deriva contagens/ações da lista ativa e da seleção atual da casa.
- Em viewports largos (1600px ou mais), o frame e a coluna principal deixam de ficar limitados a 90rem/65rem; a lista ocupa o espaço até o contexto lateral, em vez de manter margens internas grandes.

## Evidências visuais e funcionais

`manifest.json` registra 47 capturas e 122 verificações, sem falhas ou erros de página, nos viewports 320×640, 390×844, 768×1024, 1024×768, 1280×800, 1440×900 e 1920×1080. A captura 1920×1080 foi atualizada após tornar a composição fluida em desktop largo, com asserção de uso da coluna central e do contexto próximo à borda direita. Cobriu compra cheia/vazia, 100 itens, orçamento zero/igual/excedido/alto, preço ausente, nome/total longos, busca vazia, loading e erro.

Critérios observados: uma linha acionável completa acima do dock em 320px, quatro em 1280px, alvos de estado/edição com 44px, sem overflow horizontal ou texto monetário cortado. Também foram verificadas ações hover/pressed/teclado, Escape e retorno de foco no editor, reduced motion, desfazer, “Já temos”, organização global/local e smoke de landing/login/reset nas rotas locais.

As PNGs estão em `screens/`. A captura-base anterior está em `../block0/screens/`.

### Vídeo

`compra-interaction.mp4` é a gravação real do navegador em 390×844, com filtro, edição, marcação, nova filtragem, confirmação com pendentes e recibo. Os sete quadros são comparados a seeks reais do elemento de vídeo a cada 0,04s; todos passam com erro RGB médio ≤10/255 após codificação H.264. `journey-manifest.json` registra tempos, métrica, motor e resultados. O arquivo `compra-interaction-source.webm` preserva a captura Playwright anterior à normalização usada para obter um índice de busca.

O harness usa dados e persistência locais. O recibo de conclusão vem de resposta simulada; não representa gravação nem confirmação do Supabase. O smoke de autenticação também usa somente as rotas/harness local.

## Checks

- `npm test -- --maxWorkers=4` — 40 arquivos, 236 testes passaram. Uma execução padrão altamente paralela teve uma falha intermitente de foco no login; o caso passou isoladamente e a suíte completa passou com quatro workers.
- `npm run lint` — passou.
- `npx tsc --noEmit --incremental false` — passou.
- `next build --webpack` — passou em cópia isolada do projeto; `experimental.cpus: 1` e `distDir` próprio foram aplicados somente à configuração temporária após `EPERM` ao gravar artefatos no diretório de build anterior. A configuração do repositório não foi alterada pelo build.
- `git diff --check` — sem erros de whitespace.

O build ainda emite o aviso preexistente de que a convenção `middleware` foi depreciada no Next 16; migração para `proxy` está fora deste bloco.

## Limites, riscos e rollback

- Os valores extremos servem para validar apresentação/overflow; não certificam aritmética acima do intervalo seguro de `Number`.
- Não foram feitas chamadas a Auth/Supabase, gravação remota, testes de RLS/schema ou alterações de domínio/API.
- `block1.patch` contém somente a diferença deste bloco sobre o estado após Bloco 0. Para rollback seletivo, revisar e aplicar em reverso a partir do estado correspondente; não usar `git checkout` nos arquivos do projeto, pois há modificações preexistentes preservadas.

Próxima etapa autorizável: Bloco 2 (Casa), após revisão e aprovação deste resultado.
