# Prompt para o agente — auditoria do repositório e roadmap Inside-Out

## Papel

Atue como **Staff Product Designer + Principal Design Engineer + Frontend Architect**, com rigor de auditoria de produto, arquitetura, acessibilidade e regressão. Trabalhe sobre o **repositório real do Restok**, não sobre o código do protótipo visual como se fosse produção.

## Missão e autorização

A identidade **Raiz & Eucalipto foi escolhida**. Seu trabalho nesta execução é: **inspecionar todo o repositório, documentar o estado atual, relacionar as evidências da auditoria anterior e elaborar um roadmap de implementação Inside-Out detalhado, com substituição completa do design legado**.

**Esta execução é EXCLUSIVAMENTE de auditoria e planejamento. NÃO implemente, não refatore, não delete arquivos, não instale dependências de produto, não altere banco, não rode migrations, não crie PR, não faça deploy e não modifique funcionalidades.** É permitido criar apenas os documentos de análise/roadmap solicitados, em pasta nova e claramente identificada, depois das verificações de permissões. Solicite decisão humana antes de qualquer passo de produção ou operação destrutiva.

## 0. Skills obrigatórias e instalação

Instale ou habilite e **leia integralmente** as três referências antes de auditar. Use o método oficial do seu ambiente e registre versão/commit, status de instalação e limitações. Se faltar permissão, pare e peça aprovação; não contorne o bloqueio.

1. **Anti-Webslop** — `npx skills add cesaroeduardo/antiwebslop`  
   Referência: https://antiwebslop.cesaroeduardo.com/pt  
   Instalação alternativa: **[INSERIR LINK OU COMANDO, SE NECESSÁRIO]**
2. **AI Motion Library** — https://github.com/apenasdouglas/ai-motion-library  
   Instalação: **[INSERIR LINK OU COMANDO OFICIAL AQUI]**
3. **UI Craft Loop** — https://github.com/brunobertolini/skills/tree/develop/skills/ui-craft-loop  
   Instalação: **[INSERIR LINK OU COMANDO OFICIAL AQUI]**

Não apenas cite essas skills: em cada achado importante identifique **qual critério da skill foi aplicado**, evidência observada e resultado esperado. Não copie efeitos de motion ou bibliotecas sem avaliar peso, compatibilidade e `prefers-reduced-motion`.

## 1. Insumos obrigatórios (ler integralmente)

- **`RESTOK_DESIGN_SYSTEM_V1.md`** — especificação visual consolidada e aprovada para planejar. Prevalece sobre design antigo.
- **`tokens.v1.json`** — valores de referência para novos tokens semânticos, não configuração final de framework.
- **Prévia navegável privada**: https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site — explorar Compra, Casa, Histórico, Casas e pessoas; 320, 390 e 1440; movimentos padrão e reduzido. A prévia usa dados fictícios.
- **`PRODUCT.md`** — regras de negócio e fluxo real, incluindo Supabase, compras concluídas, edição, convites e preço anterior.
- **`restok-ui-audit-v2.zip`** — ler README, FINAL-DECISION-REPORT, UPDATED-FINDINGS, UPDATED-COVERAGE-MATRIX, BLOCKERS, INTEGRATION-AUDIT, MOBILE-ACCESSIBILITY-VALIDATION, MOTION-VALIDATION, EVIDENCE-VALIDATION e vídeos/screenshots vinculados.
- **Código e instruções do repositório** — README, estrutura, arquivos de configuração, manifests, `AGENTS.md`, documentação existente, testes, rotas, layouts, componentes, estado, serviços, autenticação, banco, CI e estilos.
- **`context.md` / `design.md` / equivalentes legados**, se existirem — ler para identificar dependências e conflitos, **não para perpetuar a direção visual antiga**.

Não presuma stack, paths ou frameworks a partir do protótipo. Descubra tudo no repositório real com paths e símbolos concretos.

## 2. Decisão visual irrevogável para esta rodada de planejamento

**Direção única: Raiz & Eucalipto.**

| Papel | Valor |
|---|---|
| Brand escuro/card de gasto | `#213F1D` |
| Ação | `#2D5A27` |
| Highlight de saldo/progresso sobre escuro | `#B4D3A7` |
| Informação secundária | `#4F7566` |
| Canvas | `#F7FAF5` |
| Ink | `#18251A` |
| Surface | `#FFFFFF` |
| Border | `#E1E9DE` |

Nexa é a fonte preferida **somente com licença e arquivos válidos**; Manrope é a reserva renderizável. A assinatura `restok.` e o ponto devem respeitar master vetorial quando disponibilizado.

Não retomar Trigo, Pêssego, lime fluorescente, azul fintech, serif editorial, cards inflados, bordas pesadas, gradients genéricos, centralização excessiva ou layout desktop como mobile esticado. O card de gasto permanece a âncora visual; funcionalidades de preço/orçamento não podem ser simplificadas.

## 3. Requisito inegociável: substituição do design legado DO ZERO

Este é um **rebuild da camada visual**, não um retheme por cima de CSS e prompts antigos. Planeje explicitamente:

1. Identificar **todas** as fontes ativas de design legado: `DESIGN*.md`, instruções visuais em `AGENTS.md`, prompts, arquivos de tokens, CSS global e modular, Tailwind config, temas, design libraries, componentes customizados, assets e ícones/fontes.
2. Criar uma **matriz de substituição**: arquivo antigo → responsabilidade atual → dependências → novo destino → ação proposta (remover, reescrever do zero, manter por motivo não visual) → risco → validação.
3. Prever a **remoção integral das regras visuais antigas e conflitantes**, com reconstrução **do zero** de documentação de design, tokens, componentes e motion, usando esta nova especificação. Proibir compatibilidade permanente, `!important` em cascata para esconder legado, duplicação de temas e nomes herdados de paletas rejeitadas.
4. Distinguir arquivos mistos: preservar regras de negócio, segurança, uso de ferramentas, domínio, integrações e requisitos acessíveis. **Não deletar um `AGENTS.md` inteiro cegamente**; propor a separação precisa das seções de interface, com revisão e aprovação dos alvos.
5. Planejar migração incremental sem regressão e com rollback, ainda que o destino final seja totalmente novo. Priorizar redução de dívida visual, não reuso inercial de estilos.
6. Entregar um **checklist de remoção de legado** que permita verificar, via busca/inspeção, a ausência das referências visuais antigas depois da implementação.

**Importante:** nesta primeira execução você APENAS PLANEJA essas exclusões/substituições. Não as execute.

## 4. Auditoria técnica do estado atual

Mapeie concretamente, com paths, componentes, hooks, classes, serviços e testes:

- Framework, roteamento, renderização, bibliotecas de UI, styling, Tailwind/PostCSS, fontes, temas e build.
- Árvore completa de telas internas, autenticação, perfil, página pública/landing e modos responsivos.
- Dependências visuais compartilhadas e CSS com escopo global que pode causar regressão.
- Estados assíncronos, persistência, Supabase/Auth, sessão, casas, memberships, políticas e atualizações em tempo real.
- Ciclo do produto: catálogo → preparar compra → compra no mercado → concluir → histórico → próxima reposição.
- Estados de preço (`null`, zero e positivo), quantidade, `Já temos`, filtros, categorias, referência de preço anterior e orçamento.
- Acessibilidade atual: ordem de foco, nomes, teclado, modais/sheets, leitores de tela, reduced motion, contraste e touch target.
- Testes existentes, CI, lint, storybook, screenshots, flags, regressões e capacidade de rollback.

Identifique **onde o desenho da demo diverge funcionalmente do produto real**. A demo ilustra uma linguagem; NÃO é especificação completa de funcionalidades.

## 5. Evidência visual e cobertura

Use a auditoria v2 como baseline, mantendo seus IDs/timestamps. Explore a aplicação real em ambiente autorizado de desenvolvimento ou fixtures seguras; **não use dados sensíveis em vídeo** nem mutações na produção.

Para cada rota principal e estado prioritário, capture **screenshots e vídeo de interação com seek/timestamp verificável** em 320×640, 390×844, 768, 1024, 1280×800 e 1440×900, quando o ambiente permitir. Inclua:

- Estado inicial, scroll e primeira dobra; filtros, busca, modais, formulários e erros.
- Itens pendentes/comprados/Já temos, preço zero/ausente, excedente, conclusão e histórico.
- Casa ativa, reload, switcher, nomes longos, convites e permissões.
- Feedback de confirmação, carregamento real, falha de rede, offline/retry e reduced motion.
- Teclado, zoom, toque e leitor de tela quando acessíveis.

Para cada evidência: ID, rota, viewport, cenário, caminho de mídia, tempo inicial/final, resultado observado, expectativa e severidade. Não inventar timestamp ou afirmar teste não realizado. Se o ambiente não permitir, vincular evidência prévia ou marcar **NÃO VERIFICADO**, explicar bloqueio e plano mínimo de reprodução.

Priorize os P1 comprovados:

- **UI-013:** reload perde a casa selecionada e mostra primeira membership. Requer correção funcional explícita.
- **UI-001:** primeira linha da compra encoberta em 320×640.
- **UI-002:** nome de participante comprimido/truncado junto às ações.

Não declare auditoria 100% concluída enquanto houver lacunas já documentadas: Safari/iPhone físico, VoiceOver/NVDA, zoom/texto ampliado, concorrência, expiração real, email de recovery e performance de campo.

## 6. Plano Inside-Out — entregar, NÃO executar

Estruture em fases dependentes, com escopo por PR, ordem de migração, estimativa relativa, riscos, rollback e testes obrigatórios:

**Fase 0 — Baseline e proteção:** congelar captura de estado atual, inventário de design legado, fluxos, P1 e testes de regressão; proteger branches e dados.

**Fase 1 — Fundações do zero:** design tokens, Nexa/Manrope licenciadas, CSS reset e surfaces, grid, tipografia, ícones, focus/contrast, motion tokens, configuração no stack real e documentação nova, sem herdar valores legados.

**Fase 2 — Componentes atômicos do zero:** botão, campo, select, preço/quantidade, checkbox, Já temos, filtros, tabs, listas, card de gasto, sheet, toast, skeleton, empty, nav e HouseSwitcher; estados e testes por componente.

**Fase 3 — Telas core:** Compra primeiro, Produtos da casa, Histórico, Casas e pessoas, conta/auth e todas as variações reais; prioridade de uso mobile, adaptação desktop e correção dos P1 em seus fluxos.

**Fase 4 — Motion, acessibilidade e retirada do legado:** transições de estado, loading real, reduced motion, QA visual/funcional cruzado; remover inteiramente styles/tokens/instruções antigas após substituições validadas; verificar bundle e regressão.

**Fase 5 — Landing Page e outward-facing UI:** somente depois de estabilizado o core; reutilizar tokens/componentes novos, refinar comunicação pública separadamente sem introduzir uma segunda linguagem.

Para cada fase, defina: objetivo, arquivos prováveis **comprovados no repo**, componentes afetados, pré-requisitos, alterações visual/técnica, entregáveis, critérios de aceite verificáveis, automação, QA manual, riscos, estratégia de migração e plano de reversão. Se uma correção funcional P1 exigir antecipação, destacá-la como gate antes do polish.

## 7. Entregáveis obrigatórios

Produza na pasta nova `docs/restok-refactor-plan/` (ou equivalente que não sobrescreva mudanças do usuário) apenas documentos de planejamento:

1. `00-EXECUTIVE-SUMMARY.md` — estado atual, riscos, decisões fixadas, lacunas e recomendação.
2. `01-REPO-ARCHITECTURE-MAP.md` — rotas, componentes, serviços, estilos e dependências com paths reais.
3. `02-LEGACY-DESIGN-REMOVAL-MATRIX.md` — inventário completo e plano de retirada/substituição **do zero** por arquivo, sem apagar regras não visuais.
4. `03-UI-EVIDENCE-MATRIX.md` — problema → tela → imagem/vídeo/timestamp → código provável → critério de aceite → cobertura.
5. `04-DESIGN-SYSTEM-IMPLEMENTATION-MAPPING.md` — tokens e componentes aprovados → stack real → novo local de implementação, sem copiar cascata do protótipo.
6. `05-INSIDE-OUT-ROADMAP.md` — fases 0–5, PRs pequenos, dependências, esforço, testes, rollback e gates.
7. `06-QA-AND-REGRESSION-PLAN.md` — funcional, visual, responsivo, acessibilidade, performance e segurança.
8. `07-OPEN-DECISIONS.md` — apenas bloqueios reais ainda não resolvidos, com opções e recomendação.

Cada achado deve indicar **observado / inferido / não verificado**, fonte, path e evidência. Evite recomendações abstratas; especifique exatamente o que mudar, onde, por quê e como será considerado concluído. Só criar tarefas/PRs executáveis depois que eu aprovar este pacote.

## 8. Definition of Ready para solicitar autorização de implementação

Seu plano só estará pronto para nossa aprovação quando:

- Estiver claro quais regras/arquivos de design antigos serão **removidos** e o que nascerá **do zero**.
- Nenhuma funcionalidade atual do Restok estiver ausente da matriz de regressão.
- Os três P1 tiverem localização no código, reprodução e estratégia de correção.
- Cada fase tiver limites de PR, rollback e gate de QA.
- O novo design system for mapeado para o stack descoberto, sem assumir código da demo.
- Todas as lacunas estiverem explícitas, incluindo restrições de acesso e pendências de hardware.
- Nenhum código de produto tiver sido modificado ou publicado nesta execução.

**Resposta final esperada:** resumo executivo objetivo; links dos oito documentos; quadro com ordem dos PRs; principais riscos e no máximo cinco perguntas realmente bloqueantes. Encerre solicitando nossa aprovação do roadmap. **NÃO inicie implementação.**
