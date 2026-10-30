# Fase 2: App Shell

30/10/2026. Instrução vigente: executar Fases2 e3 em sequência. O pedido aceita a
continuidade após a Fase1 e autoriza o avanço para3 após a validação de2 nesta
execução; não constitui aceite visual de screenshots ainda não apresentados.

## Direção e resultado

| Decisão | Implementação |
|---|---|
| Interface operacional de compras domésticas | Lista continua protagonista; sem painel decorativo |
| Raiz & Eucalipto / Manrope / V3 M2 D7 | Tokens existentes preservados |
| Região global única | Casa, perfil e avisos na mesma região, header compacto mobile / sidebar desktop |
| Sem header superior redundante desktop | Mantido; sidebar228px desde1024px |
| Largura útil |768px mantém navegação inferior; ações desktop da Compra passam a aparecer desde1024, junto do shell |
| Gutter compartilhado |12px em320,16px desde390,24px desde1024; início compacto10px conforme pacote |
| Contexto útil opcional | Coluna256px somente com espaço para560px de trabalho +32px de gap +48px de gutters; nenhum contexto novo no produto |
| Ações e fim da lista alcançáveis | Dock mobile com reserva medida por ResizeObserver, cleanup e fallback; teclado continua ocultando controles fixos |

Casa ativa volta a estar explícita na região global, com nome acessível completo;
nomes extensos usam ellipsis no disparador e título completo, sem mudar as
identidades no gestor de casas. O seletor chama o handler real de gestão.
O atalho existente do menu de conta permanece para compatibilidade de acesso.

Avisos de sincronização saem da pilha anterior à lista para um details global.
Erros abrem automaticamente e mantêm retry acessível. Escape fecha o painel e
retorna foco ao summary. Não há consulta remota nem mudança de estado de domínio.

## Arquivos desta fase

- components/app/app-shell.tsx e app-shell.module.css: região global, grid,
  contexto por container query, aviso, reserva de dock e responsividade.
- components/app/navigation.module.css e house-switcher.tsx: breakpoint comum,
  alvos44px, peso500 e nome completo acessível.
- components/restok-app.tsx: conexão dos handlers/estado existentes ao shell;
  nenhum cálculo, write ou serviço alterado.
- components/shopping/shopping.module.css: somente visibilidade das ações
  contextuais acompanhando o breakpoint do shell nesta fase.
- components/app/app-shell.test.tsx e shopping/shopping-view.test.tsx: cobertura
  de contexto/casa/foco/retry e atualização da expectativa antiga que exigia zero seletores.
- tests/e2e/fixtures.ts e data-fixture.ts: adaptação da fixture v6 apenas no harness.
- tests/e2e/shell.html, shell.tsx e capture-phase23.mjs: preview e runner local.

## Gate anterior à Fase3

148 checks Playwright/Edge156 aprovados em320×640,390×844,768×1024,1024×768,
1280×800,1440×900 e1920×1080, sem pageerror. Incluem overflow, um seletor de casa,
uma navegação visível, largura da sidebar, total50,68 da referência, primeira row
inteira em320, contexto opcional, painéis dentro do viewport, sheets100itens,
teclado de menu, Escape e retorno de foco. Manifesto e PNGs em
`evidence/phase2-after/`; baseline separada em `evidence/phase2-before/`.

243/243 testes, lint e TypeScript aprovados. Logs phase2-* em evidence.
Uma execução concorrente com o navegador teve timeout no teste de categorias;
a suíte serial com um worker passou integralmente, sem ampliar timeouts ou mudar
o contrato de ordenação.
A primeira verificação expôs6px de sobreposição da row pelo dock em320. Corrigidos
o início compacto do conteúdo e o padding vertical do resumo do dock, preservando
alvos44px. Reserva dinâmica cobre variações de altura sem cortar valores.

A fixture v6 mantém nomes, quantidades, preços, estados e orçamento; categorias
são mapeadas para o vocabulário real e detalhes de embalagem não existentes no
modelo real não são inventados. Histórico vazio do adaptador não é comparado
como se contivesse as compras fictícias da demo. Sem afirmar equivalência de
fixtures que não existe.

## Limites e passagem para3

Implementação do shell revisada em capturas reais e pronta para a sequência
autorizada de componentes. Aceite humano permanece pendente. Anatomia das telas,
header de Casa/Histórico e fluxos do core não foram reconstruídos. Next autenticado,
hardware e leitor de tela continuam sem nova certificação. Nenhum commit, push,
deploy, migration ou alteração de backend foi realizado.
