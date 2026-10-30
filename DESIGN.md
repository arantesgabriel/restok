# Restok · Raiz & Eucalipto

Norma visual: [Design System v1](docs/design/RESTOK_DESIGN_SYSTEM_V1.md).
Domínio e limites continuam em [PRODUCT.md](PRODUCT.md).

Interface operacional para compras da casa. Lista protagonista, card de gasto
verde profundo, fonte Manrope e estados legíveis por texto/ícone. V3 / M2 / D7.
A assinatura `restok.` e seu ponto são parte da marca aprovada. O PNG atual é
transitório; master vetorial permanece um gate de marca final.

## Implementação e migração

- `styles/tokens.css`: primitivos e17 papéis semânticos, escopo `.restok-theme`.
- `styles/base.css`: Manrope local400–800 com OFL, foco e tipografia escopados.
- `styles/motion.css`: timing reduzido a zero pela preferência do usuário.
- `tailwind.raiz.config.ts`: vocabulário novo com alpha e pesos reais, sem preflight global.
- `components/ui/theme.tsx`: fronteira explícita dos novos consumidores.
- Preview `/foundations.html` no harness local4173, fora das rotas/auth de produção.

PR13: app/layout.tsx ativa a fronteira restok-theme; globals.css importa apenas
base/motion/reset novos e utilitários Tailwind semânticos. CSS e configuração
anteriores existem somente em tests/e2e/legacy, carregados nas rotas históricas
/before-*. Não há aliases entre paletas. PR14 reconstrói a landing e as demos em
CSS Modules site/demos, com os mesmos papéis e primitivos do app. Lista ilustrativa
no hero, navegação por etapas e exemplos locais; sem moldura de navegador, folhas
decorativas, depoimentos ou números inventados. O CSS público anterior é histórico,
sem import no produto. PR15 retira assets sem consumidores de public e encerra a autoridade das normas
anteriores. O relatório19 registra os gates de release ainda abertos.

```design-tokens
brand #213F1D; action #2D5A27; highlight #B4D3A7; info #4F7566;
canvas #F7FAF5; surface #FFFFFF; ink #18251A; muted #526452;
line #E1E9DE; lineStrong #C9D9C5; danger #B94132; warning #946127;
spacing 4/8/12/16/24/32/48; radius control8/panel12/budget18;
font Manrope400/500/600/700/800; type12/14/16/20/24/32;
```

## Decisões

30/10/2026, Fase4.1: Compra segue o código v6 e as capturas corretas anexadas
posteriormente. Títulos22/25/33px; gasto23/27/34px; rows ordinárias57/62/67px
em320/390/1440. A lista abre na ordem real da compra, como purchaseRows() da demo;
categoria e A–Z continuam operações reais do menu. O resumo lateral da referência
foi restabelecido somente em Compra e quando houver largura útil, com filtros
derivados da lista e conclusão real. Não se repete o card de casa ativa.
O controle quadrado de marcação substitui o circular nesta tela, conforme as
referências corretas atuais; alvos44px e foco permanecem. Esta decisão prevalece
sobre as anotações anteriores conflitantes de composição da Compra. As demais
telas não integram esta fase. Ver docs/restok-phase41/REPORT.md e CONFORMANCE.md.

30/10/2026, Fases2 e3 autorizadas em sequência. Shell usa gutter compartilhado,
sidebar228px desde1024 e header mobile52px, com casa/perfil/avisos na região global.
Contexto256px permanece opcional e exige560px de trabalho; nenhuma tela recebeu
painel redundante. Dock reserva altura medida, inclusive para valores extensos.
Componentes usam campos16px, labels14px, limites lineStrong, listas brancas com
divisores, foco contextual em superfícies escuras e progresso6px no orçamento.
Esta entrada atualiza as medidas anteriores conflitantes da Rodada4. As novas
capturas estão submetidas à revisão; Fase4 ainda não autorizada. Relatórios em
[docs/restok-phase23/REPORT.md](docs/restok-phase23/REPORT.md).

30/10/2026, Fase 1 autorizada: fundamentos confrontados com o pacote v6,
commit `f0214b71d9497caa62ccaa3b804579f7cd757959`. Paleta, fonte local, escala,
raios e timings existentes preservados. Foco de teclado passa a action2px/offset3
também em campos monetários e de quantidade, substituindo o halo informacional
de baixa ênfase. Esta decisão prevalece sobre a regra de foco antiga abaixo.
Ícones Lucide usam traço1.75; sem alterar tamanho/área de toque dos consumidores.
Tokens de gutter12/16/24 preparados em styles/responsive.css; sua aplicação no
shell depende da Fase 2. Mapeamento, evidências e limites em
[docs/restok-phase1/REPORT.md](docs/restok-phase1/REPORT.md).
Implementação submetida à revisão; nenhuma fase seguinte autorizada por silêncio.

28/10/2026: Bloco2 autorizado. Fundações isoladas e fonte legal local antecedem
campos monetários e componentes. Corpo16px em inputs; contorno de controles usa
info com contraste suficiente, `line` apenas para divisão. Sem sombra em linhas.
Fonte Nexa somente com licença/arquivos fornecidos. Nenhuma fonte é buscada no build.

## Rodada4 · Lightness & Density (30/10/2026)

Shell: sidebar176px desde768px e224px desde1200px; contexto272px só desde1440px e com dados úteis. Workspace1376px, conteúdo1040px máximo. Mobile bottom nav60px com indicador2px, ações separadas. Compra vazia mantém um CTA de adicionar e finalização no menu. Card financeiro133px mobile/145px desktop em valores normais, sem limitar altura de valores extremos. Radius18px, controles8px e progresso5px preservam o handoff. Evidências e limitações: docs/restok-lightness-density/06-FINAL-REPORT.md. Implementação submetida à aprovação visual, sem declarar aceite do usuário.

### Correção de direção da Rodada4 (30/10/2026)

A entrega anterior da Rodada4 não recebeu aprovação visual. Nova instrução do usuário substitui a decisão de header global desktop: a região global é uma sidebar desde768px, com marca/casa no topo, navegação no meio e avisos/perfil no rodapé. No mobile, a mesma instância forma o header52px (texto+chevron, avatar32px em alvo44px). Compra usa sidebar + workspace de1040px, sem resumo redundante à direita. Finalização fica no header contextual desktop; menu/dock mantêm acesso mobile. Linhas e categorias sem enquadramento, status circular sem fundo quadrado; títulos600, navegação500, dinheiro principal700. Card133/145px preservado. Evidências: docs/restok-lightness-density/direction-correction/REPORT.md. Aguardando avaliação visual, sem presumir aprovação.

### Continuação autorizada: demonstração v6 e telas restantes (30/10/2026)

A instrução mais recente do usuário substitui as restrições anteriores de shell: reproduzir a sidebar branca de 228px desde 1024px, quatro destinos e navbar desktop de 58px com breadcrumb e perfil. No mobile, marca, casa e acesso à conta permanecem disponíveis, com navegação inferior e dock sem cobrir a última linha. A marca tipográfica do shell segue o exemplo renderizado em Manrope; o PNG legado continua disponível nas demais superfícies.

Casa usa catálogo plano, busca, categorias, ordenação opcional, edição pelo nome e inclusão na compra. Não duplicar produto já pendente. O ícone de ativação mantém o significado real de ativo/inativo; não representa estoque. Histórico mantém snapshots completos, totais reais, meses dinâmicos e comparação por unidade. Casas e pessoas passa a ter página própria, mantendo também o seletor em sheet e todas as permissões e confirmações existentes.

A solicitação adicional autoriza excluir itens da compra: lixeira desktop, gesto horizontal no mobile para revelar a ação e confirmação antes de excluir. Teclado e leitor de tela acessam o mesmo botão. A exclusão usa RLS, casa/lista/ID e fila existente, preserva o catálogo e não demanda migração. Dados da demonstração são usados somente no adaptador de QA.

Referência: código original e navegação pela publicação v6. Evidências, verificações e diferenças materiais: docs/restok-remaining/REPORT.md. Commits, push e deploy em produção foram expressamente solicitados. Não presumir aprovação visual do usuário.

### Navegação mobile em ilha (30/10/2026)

Nova instrução do usuário substitui o header móvel com seletor de casa: manter apenas logo e perfil nessa largura. Navegação inferior vira cápsula flutuante; inicia expandida para descoberta, compacta em scroll do usuário para cima ou para baixo e expande com toque/foco. Todos os destinos permanecem acionáveis em um toque e com alvos de pelo menos 44px. Animação usa transform/opacity e os tokens existentes; sem transição com reduced motion. Área reservada no layout mantém dock, safe area e última linha acessíveis. Desktop e regras de dados preservados. Evidências: docs/restok-mobile-island/REPORT.md.
