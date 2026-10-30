# Implementação da auditoria na interface principal — 01/10/2026

A proposta visual foi integrada em `/app`, landing, login, recuperação de senha e onboarding. A rota `/visual-system`, seus componentes, a vitrine fictícia do login, os links de demonstração, a inicialização local com produtos de exemplo e os desvios de autenticação foram removidos. As fixtures existem exclusivamente nos testes. Os relatórios anteriores permanecem como evidência histórica.

Referência: [auditoria original](../ui-phase-1-2026-09-30/AUDITORIA.md), 17 achados visuais e 5 funcionais. A instrução posterior do usuário autoriza a integração e as correções funcionais, substituindo a aprovação por fases do documento inicial.

## Conferência dos 22 achados

| ID | Resultado e evidência |
| --- | --- |
| V01 | Geist local, cores exatas da identidade e PNG oficial em todas as telas. Tokens RGB também corrigem as classes de opacidade do Tailwind. |
| V02 | Uma única barra com pendências/finalização e adicionar item; navegação separada; espaço reservado ao final do conteúdo. Última linha ficou em y=596–672, acima da barra em y=716, no teste 390×844. |
| V03 | Em entrada sem rolagem, 320×568: primeira linha inteira em y=360–436; barra inicia em y=440. Alvos de ação permanecem 44 px. |
| V04 | Total de R$ 246.913,56 não excede a largura disponível de 305 px em viewport 320 com scrollbar de 15 px. Valores longos empilham/quebram. |
| V05 | Linhas resolvidas mantêm cor legível, sem opacidade aplicada ao conjunto e sem tachado. |
| V06 | Busca com nome acessível persistente; filtros e situações com `aria-pressed`. |
| V07 | Foco inicial contextual, devolução ao gatilho conectado, outline global/stepper e bloqueio da rolagem de fundo do diálogo. Escape tratado também a partir de campos de busca. |
| V08 | Editar meta, ações de produtos, ordenação, botões e revelação da senha com área mínima de 44 px. Revelação medida em 44×44. |
| V09 | Resumo compacto, divisores, nomes em medium/regular e barra única de ações. Landing/login sem cartões de orçamento, economia ou gráficos fictícios. |
| V10 | Primitive compartilhada de menu; expanded, Escape e retorno de foco verificados no navegador. |
| V11 | Seções e detalhes sincronizados com fragmentos `#shop`, `#home`, `#history` e `#history/<id>`, preservando o estado do Next. Voltar e Avançar verificados entre Casa → Histórico → detalhe, sem sair do app. |
| V12 | Tokens de movimento, entrada/saída de diálogos/toasts, entrada discreta de linhas, progresso por transform, reduced motion e hover limitado a dispositivos compatíveis. |
| V13 | Estados distintos para lista vazia, busca sem resultado, filtro sem resultado e ausência de compra ativa, com ação contextual. |
| V14 | Busca de produtos, seleção por resultados, resumo acessível e rolagem única no sheet. |
| V15 | Nome de exibição em vez de fragmentos de UUID; edição do próprio nome; identificação indisponível explícita. Consulta de nomes limitada a membros da mesma casa, sem relaxar a RLS de perfis. **Requer aplicar a nova migration.** Pessoas sem nome não recebem ações sensíveis de gestão de acesso. |
| V16 | PNG oficial utilizado sem redesenho, conferido sobre o fundo final. **O handoff vetorial permanece dependente de arquivo aprovado não fornecido.** Não foi criado um falso SVG a partir do raster. |
| V17 | `data-scroll-behavior` presente no layout; nenhuma advertência de scroll encontrada no fluxo inspecionado. |
| F01 | Produtos inativos continuam acessíveis e podem ser reativados para a seleção da próxima compra; teste de recuperação passou. |
| F02 | Contagens e histórico usam situações reais. Navegador: finalizar com 1 comprado e 43 pendentes produziu exatamente essas contagens, com total registrado R$ 5,98. |
| F03 | Nova compra avisa que encerra a atual, move ao histórico e informa pendências antes da confirmação. |
| F04 | Demonstração removida. `/app` exige sessão; query legada não contorna autenticação. Sem Supabase, login indica indisponibilidade. |
| F05 | Preço continua opcional; total chamado “Total registrado”; ausência de preços destacada no resumo e histórico. Quantidade × preço conta somente comprados, Já temos vale zero. |

## Validação executada

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm test`: 63 testes em 17 arquivos, todos passaram. Incluem autenticação, cache por pessoa/casa, compra/histórico, reativação, navegação, preço negativo, Escape em busca, perfil e ausência de produtos fictícios em casas novas.
- `npm run build`: passou em cópia isolada do mesmo código, sem interromper o servidor de desenvolvimento. A lista de rotas não inclui `/visual-system`.
- `git diff --check`: passou.
- Navegador: 320×568, 360×800, 390×844, 430×932, 768×1024, 1280×800 e 1440×900. Nenhum overflow horizontal: comparação entre `documentElement.scrollWidth` e `clientWidth`, incluindo scrollbar convencional. [Medições](viewport-measurements.json).
- Editor: preço negativo recusado com alerta; total alto correto; foco devolvido ao item. Menu: Escape e expanded. Fluxo: nova compra, busca, finalização e histórico com status verdadeiros.
- Console do fluxo inspecionado sem warnings/errors.

As telas operacionais foram exercitadas com o componente real e estilos reais em uma cópia temporária, com os serviços Supabase substituídos por fixtures de teste. A cópia foi mantida fora do repositório; não há flag, rota ou entrada de teste no produto. Esta validação certifica UI e lógica exercitada, **não** autenticação, Realtime ou persistência em um banco remoto. Nenhuma conta ou compra real foi alterada.

## Dependências para publicação e limites

1. Aplicar `supabase/migrations/20261001000000_household_member_names.sql` após as migrations existentes. A RPC anterior permanece intacta; a nova retorna apenas ID e nome de pessoas da casa da qual o chamador participa. Perfis seguem privados; anon não pode executar. Até a aplicação, o app apresenta nomes indisponíveis de forma segura.
2. A suíte `npm run test:supabase` foi tentada, mas interrompida pela proteção que exige `RESTOK_TEST_PROJECT_KIND=disposable` e projeto local com três contas de teste. O ambiente não está configurado. O novo caso de isolamento foi incluído, mas **não foi executado contra PostgreSQL/PostgREST**. Não usar o projeto de produção para essa suíte.
3. Receber o master vetorial aprovado (V16). O PNG aprovado já está integrado.
4. Teclado virtual e safe areas foram tratados no código e nas verificações automatizadas, mas não houve certificação em Safari iOS/Android físico nem leitor de tela completo. Os screenshots usam navegador desktop com viewport reduzido.

## Evidências

- [Compra 320×568](shop-320.jpg), [390×844](shop-390.jpg), [desktop](shop-1440.jpg).
- [Total alto](shop-large-values-320.jpg), [últimos itens acessíveis](last-items-mobile.jpg).
- [Busca sem resultado](search-empty.jpg), [busca na nova compra](new-purchase-search.jpg).
- [Produtos da casa](home-desktop.jpg), [histórico](history-mobile.jpg).
- [Confirmação](finish-confirmation.jpg), [resumo com pendências](finish-summary.jpg), [detalhe com status reais](history-true-statuses.jpg).
- [Login](login-mobile.jpg), [landing](landing-mobile.jpg).
