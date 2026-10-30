# Restok: diagnóstico visual e plano por telas

30/10/2026, America/Sao_Paulo. **Auditoria e planejamento. Nenhuma implementação da refatoração autorizada ou realizada.**

O Restok já incorporou a paleta e parte dos componentes Raiz & Eucalipto, mas não incorporou a composição aprovada. A maior distância está na anatomia das linhas, no peso dos controles, na hierarquia do orçamento e no uso da largura desktop. Recolorir novamente o produto não resolve esses problemas.

## Resultado e limites

As quatro telas foram investigadas em navegador real, com componentes atuais e dados locais controlados, nos viewports CSS 320×640, 390×844, 768×1024, 1280×800, 1440×900 e 1920×1080. A referência foi aberta e seus quatro fluxos e interações foram examinados. Evidências e medições estão no [índice comparativo](evidence/comparison.html) e na [matriz](06-VISUAL-EVIDENCE-MATRIX.md).

Isso encerra o diagnóstico de composição e o planejamento proposto, **não o aceite visual integrado do produto**. O Next existente em localhost:3000 redirecionou a sessão isolada para login. Não se autenticou contra Supabase, não se executaram seed/migrations nem gravações remotas. Os componentes atuais foram renderizados pelo harness Vite existente e por um adaptador adicional restrito à pasta de evidências. Há uma divergência de cascata entre esse harness e as capturas fornecidas, explicitada em F-05. Não certificar cores computadas no Next a partir do Vite.

A demonstração usa canvas interno 320/390/1440 e transform de escala. Seu viewport de navegador não equivale ao tamanho do app simulado. A matriz registra ambos. Ela não certifica o comportamento responsivo intermediário do produto. Não há mockup inventado do resultado esperado: a especificação futura é textual e remete às capturas efetivas da referência.

## Cinco prioridades

1. **Orçamento:** substituir o modo compacto permanente, hoje com padding 8×12px, por anatomia responsiva com 16px mobile, 24px desktop, valor principal 32px e progresso 6px. Preservar o cálculo e os avisos de preço ausente.
2. **Linhas de Compra:** controle de estado à esquerda, nome/metadados no centro, preço à direita. Lista branca com divisores leves. Ações e semântica continuam completas.
3. **Desktop:** sidebar de 224–232px e coluna de trabalho com contexto lateral útil quando couber. Retirar a dependência do dock fixo desktop somente depois de realocar adicionar/finalizar/pendentes.
4. **Casa:** reduzir a pilha anterior à lista e as linhas ordinárias de122px no mobile. Em320×640 nenhuma row fica inteira acima da navegação. Edição e ativação/desativação precisam continuar disponíveis.
5. **Pessoas:** reduzir repetição da casa ativa e organizar identidade, papel e ações por grupos. Não comprimir nomes nem transformar confirmações de acesso em ações imediatas.

## O que não é um defeito demonstrado nesta rodada

- UI-001 antigo: Compra comum já tem duas linhas completas em 320×640 e quatro em 1280×800. Continuará como gate de regressão, não como falha atual reproduzida.
- UI-002 antigo: a fixture original produz dois nomes iguais ao cortar o sufixo A/B. Uma fixture documental com 79 caracteres comuns mais A/B confirmou leitura por quebra e ações alcançáveis. Não atribuir identidade indistinguível ao componente quando a entrada é idêntica.
- UI-013: persistência da casa ativa foi corrigida anteriormente e possui testes. Não houve nova verificação integrada com duas contas nesta rodada, nem reprodução de regressão.
- Histórico vazio é ausência de compras, não falha de carregamento. As capturas preenchidas demonstram o caminho existente.
- O círculo de desenvolvimento Next, a ferramenta rosa externa e o rótulo E2E-FIXTURE não pertencem ao produto.

## Fontes e decisões

Para composição: [demonstração aprovada](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/), versão 6 identificada pelo conector Sites. Para valores: [handoff recuperado](evidence/handoff-design-system.md), [tokens recuperados](evidence/handoff-tokens.json) e [cópia local](../design/RESTOK_DESIGN_SYSTEM_V1.md). Tokens enviados pelo usuário coincidem com os papéis de cor e dimensões consultados. Para comportamento: código atual, PRODUCT, testes e histórico das PRs 01–15. O prompt antigo disponível no handoff é contexto histórico, sem autoridade para ampliar esta execução.

O acesso HTTP inicial retornou 401. O navegador interno falhou antes da página (HRESULT 0x800700E1). A consulta autenticada ao conector Sites, cujo usuário é proprietário, forneceu acesso temporário para a leitura. Depois disso, demonstração, índice, markdown e JSON retornaram 200 em Edge. Não houve alteração de acesso, publicação ou armazenamento da credencial em artefatos.

## Decisões para o responsável pelo produto

| ID | Questão concreta | Recomendação | Efeito no plano |
|---|---|---|---|
| D-01 | A prévia mostra Pessoas como tela, mas o escopo pede modal | Manter dialog desktop e bottom sheet mobile de gestão; transportar agrupamento e identidade da prévia, sem criar rota nova | Bloco 4 deve seguir essa adaptação, sujeita ao aceite da composição |
| D-02 | Casa na prévia permite adicionar diretamente e marcar Já temos, mas o catálogo real edita/ativa/desativa | Preservar operações reais e não criar estoque ou novas gravações nesta refatoração | Diferença deliberada, não implementação estética incompleta |
| D-03 | Histórico da prévia tem três indicadores e filtros por mês; o real só agrupa por mês | Adicionar filtro local de período derivado das compras e contexto agregado só com significado explícito. Preservar todos os registros e o detalhe | Aprovar o acréscimo de apresentação no Bloco 3; sem API nova |

Nexa licenciada e master vetorial continuam pendentes. A fonte Manrope local licenciada e PNG de marca podem permanecer, sem impedir a reconstrução de composição. O handoff remoto descreve o estágio anterior à implementação; o documento local atualiza esse status. Não é uma divergência de identidade. Os tempos 160/180/260/360ms do JSON e as faixas do markdown são referências: 220ms entrada/160ms saída atuais estão dentro do intervalo documentado, sem necessidade de troca arbitrária.

## Sequência recomendada

Revisar/aprovar **Bloco 0**, depois Compra, Casa, Histórico, Casas e pessoas e validação transversal. [Roadmap](07-IMPLEMENTATION-ROADMAP.md), [aceite](08-QA-AND-ACCEPTANCE-CRITERIA.md) e [seis prompts independentes](09-EXECUTION-PROMPTS.md). A aprovação de um bloco não autoriza o seguinte. A etapa atual para aqui antes de alterar código da aplicação.

## Verificações e skills

UI Craft, UI Craft Loop, Anti-Webslop e Biblioteca de Motion foram consultadas como lentes subordinadas à direção aprovada. Visant Killer e suas referências locais foram instaladas; registros de detectores estão em evidence. Prescrições de outra marca, HSL obrigatório, troca de biblioteca, celebrações, atraso artificial de loading e reescrita automática da voz foram rejeitadas por conflito com o Restok e com o escopo de análise. Detalhes no [relatório de instrumentos](evidence/killer-report.md).

Baseline nova: **228/228 testes em39 arquivos, lint e TypeScript aprovados**. Logs em evidence. Não se executou build concorrente com o dev server. Testes passando não são prova de fidelidade. Leitor de tela, Safari/iPhone, Android físico, teclado virtual real, zoom nativo, concorrência, expiração natural e CWV permanecem sem certificação nova.
