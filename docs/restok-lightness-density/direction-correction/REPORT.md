# Restok · Correção de direção da Rodada4

Status: revisão local implementada, aguardando avaliação visual. A entrega anterior da Rodada4 não foi aprovada; as decisões deste documento substituem seu header global desktop e sua terceira coluna na Compra. Nenhum push, merge, deploy ou alteração de dados reais.

## Decisões estruturais

| Região | Fonte visual primária |
|---|---|
| Marca e casa ativa | Topo da sidebar; a casa é montada uma única vez |
| Compra / Histórico / Casa | Navegação da sidebar; bottom navigation no mobile |
| Sincronização, mensagens e perfil | Rodapé da sidebar; ações leves no header mobile |
| Gasto, disponível, meta e comprado sem preço | Card financeiro |
| Andamento geral | Subtítulo acionável da Compra no desktop; dock no mobile |
| Situação da categoria | Cabeçalho da própria categoria |
| Finalizar | Ação discreta no header da Compra desktop; menu/dock mobile com confirmação original |

O shell possui uma única região global responsiva, sem duplicar perfil, feedback, live regions ou seletor de casa. A mesma região forma o header compacto mobile e a sidebar vertical desde768px. Não existe header horizontal acima do workspace desktop. Avisos de sincronização continuam diretamente acessíveis, com a mensagem anunciada por role=status; confirmações aparecem somente quando há mensagem. Menus e diálogos mantêm foco, Escape e callbacks existentes.

A Compra deixa de passar ShoppingContext ao shell. Todas as suas informações continuam no card, no andamento geral, nas categorias ou nas linhas. ShoppingContext não foi apagado, pois era arquivo preexistente; não é mais renderizado nesta composição. Nenhuma capacidade de negócio depende dele.

O workspace tem duas regiões principais: sidebar176/224px e conteúdo máximo1040px com gutter24px. Em1440 e1920 a lista mantém o mesmo limite, sem terceira coluna. O título começa a32px do topo. A antiga duplicação de pendências em botão separado foi absorvida pelo subtítulo acionável; o handler continua limpando a busca e selecionando pendentes.

O ícone de três linhas era um menu de Nova compra/Finalizar; foi substituído por MoreHorizontal, mantendo opções e semântica. Linhas e categorias perderam o enquadramento de card. O status comprado usa CircleCheck20px/stroke1.75, em alvo44px, sem fundo quadrado. Quantidade, comparação unitária, estado e ações permanecem. Preços da linha500; título600; principal financeiro700; navegação500; auxiliares400.

## Medições e evidências

Capturas antes/depois da aplicação real no navegador interno da porta3000, nos viewports CSS390×844,768×1024,992×768,1440×900 e1920×1080. As dimensões internas foram conferidas, compensando o zoom preexistente de110% do navegador. Nenhuma configuração permanente de zoom foi alterada.

- [Antes desktop1920](before/1920x1080.jpg) / [Depois desktop1920](after/1920x1080-Compra.jpg).
- [Antes mobile390](before/390x844.jpg) / [Depois mobile390](after/390x844-Compra.jpg).
- [Tablet768](after/768x1024-Compra.jpg) / [Intermediário992](after/992x768-Compra.jpg) / [Desktop1440](after/1440x900-Compra.jpg).
- [Perfil na sidebar](after/1920x1080-profile-menu.jpg). Captura do menu real, sem submissão de perfil.
- [Itens comprados sem caixa](after/fixtures/1920x1080-money-over.png).
- [Avisos na sidebar](after/fixtures/768x1024-notice-open.png) / [Confirmação mobile](after/fixtures/390x844-confirmation-open.png). São componentes reais com dados controlados, identificados como fixture.

| Medida | Mobile390 | Desktop768–1920 |
|---|---|---|
| Header global horizontal do workspace | ausente; header mobile na região global | ausente |
| Região global |52px de altura|sidebar em toda altura; perfil no rodapé|
| Avatar visual / alvo |32 /44px|32 /44px|
| Card financeiro normal |133px|145px|
| Peso do título |600|600|
| Overflow da página |0|0|

O card financeiro não aumentou de altura: preserva133/145px e fundo verde profundo. Radius18px, progresso5px e Manrope local preservados. Novas cores/fontes/dependências não foram introduzidas. O ponto do logotipo permanece.

## Arquivos alterados nesta revisão

| Arquivo | Responsabilidade |
|---|---|
| components/app/app-shell.tsx | Região global única e retirada do header desktop |
| components/app/app-shell.module.css | Sidebar/header mobile, perfil, avisos, geometria e ancoragem de painéis |
| components/app/house-switcher.tsx | Texto + chevron, sem ícone/caixa de formulário |
| components/app/navigation.module.css | Peso500 no seletor |
| components/restok-app.tsx | Perfil com avatar/label e retirada do contexto redundante da Compra |
| components/shopping/shopping-view.tsx | Andamento acionável, Finalizar no header e menu de reticências |
| components/shopping/shopping.module.css | Linhas/categorias sem card, pesos e controles mais leves |
| components/shopping/shopping-controls.module.css | Valor secundário e edição de meta em500 |
| components/shopping/status-toggle.tsx | Status circular, stroke1.75 |
| components/shopping/shopping-view.test.tsx | Preservação dos handlers e uma única instância dos controles globais |
| DESIGN.md | Nova decisão, explicitamente pendente de aprovação visual |

Backup dos arquivos no início desta correção: source-before/. As extensões de código foram preservadas como .txt para não entrar no typecheck. correction.patch mostra somente o delta desta revisão, independente das alterações anteriores no working tree.

## Validação

- 238 testes aprovados em40 arquivos. Teste de contexto adaptado à nova localização das ações; novo teste assegura um perfil, uma casa, ausência de header no main e abertura do editor pela sidebar.
- Typecheck e ESLint aprovados. git diff --check sem erro.
- Navegador interno3000:15 capturas finais, Compra preenchida/Casa/Histórico nos cinco viewports; zero overflow e nenhuma terceira coluna/header global no workspace. Perfil aberto a partir da sidebar, editor cancelado; Finalizar abriu o aviso de pendências e foi cancelado. Nenhuma compra finalizada ou dado salvo pelo agente.
- Fixtures isoladas:45 capturas,205 verificações aprovadas, zero pageerror. Incluem lista33, orçamento ultrapassado e comprado sem preço, valores extremos, vazio, aviso de sincronização aberto, confirmação aberta e regressão de Casa/Histórico.
- Testados limites dos painéis abertos (inclusive margem esquerda, largura interna e altura), retorno de foco do perfil, House Switcher, confirmação com pendências e dispensa da mensagem. A confirmação foi gerada por salvar a mesma meta apenas na fixture; nenhuma operação remota.

Reprodução: node tests/e2e/serve.mjs e node docs/restok-lightness-density/direction-correction/verify.mjs. Harness local4173 complementa, e não substitui, as capturas da aplicação real na porta3000. Runtime Playwright/Edge já instalado; sem dependência adicionada.

## Referências e precedência

[Linear](https://linear.app/now/behind-the-latest-design-refresh): reduzir competição entre chrome e conteúdo, com menos ícones e separadores. [Things](https://culturedcode.com/things/features/): listas como conteúdo e detalhes acessórios recuados. A implementação não copia suas identidades.

[Restok aprovado](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/) e handoff local docs/design/RESTOK_DESIGN_SYSTEM_V1.md continuam a reger cores, fonte e card financeiro. Referência navegável e tokens foram inspecionados na rodada anterior. A URL de handoff não abriu no extrator nesta revisão; não alegamos nova leitura remota. A instrução atual do usuário prevalece para remover o header e adotar pesos600/500, substituindo as orientações anteriores.

## Pendências e limites

Nenhuma regressão observada nos estados inspecionados. Não certificamos Safari/iPhone físico, teclado virtual de hardware, leitor de tela, performance de campo ou integração completa auth/realtime/RLS. O dev3000 permaneceu ativo; não executamos build sobre sua .next. Valores extremos podem aumentar altura e exigir rolagem, preservando texto completo. JPEGs do navegador interno têm compressão do provedor; PNGs das fixtures são complementares para inspeção nítida.

A revisão encerra aqui, aguardando a avaliação do usuário. Casa, Histórico, Casas e Pessoas, landing e backend não foram refatorados.

