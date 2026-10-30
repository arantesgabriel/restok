# Restok: auditoria e plano de reconstrução visual

28/10/2026 · America/Sao_Paulo · **Planejamento para revisão humana. Implementação não autorizada.**

## Recomendação

Reconstruir a camada visual em Raiz & Eucalipto, começando pelo contexto da casa e pelos contratos monetários, depois fundações, componentes e Compra. Preservar Auth, RLS, RPCs, catálogo, histórico, convites e sincronização. Landing por último. Não importar CSS, categorias, emails ou regras de persistência da demonstração.

O checkout tem base funcional aproveitável e camada visual fortemente acoplada: `components/restok-app.tsx` concentra apresentação, navegação, estado e gravações em 1.311 linhas. `app/globals.css`, `app/ui.css`, `app/landing.css`, utilities Tailwind e estilos inline participam da aparência. Trocar somente a paleta perpetuaria esse acoplamento.

## Fontes e precedência

1. [Prompt solicitado](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/handoff/PROMPT_AGENTE_AUDITORIA_ROADMAP.md): somente análise e estes oito documentos.
2. [Design System v1](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/handoff/RESTOK_DESIGN_SYSTEM_V1.md) e [tokens](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/handoff/tokens.v1.json), lidos integralmente. Cópia recebida do primeiro em `C:/Users/Gabriel/Downloads/RESTOK_DESIGN_SYSTEM_V1.md`.
3. `PRODUCT.md`, `docs/audit/PHASE2_DECISIONS.md` e código do checkout para comportamento e segurança.
4. [Pacote v2 fornecido](C:/Users/Gabriel/.codex/visualizations/2026/10/28/01a180c4-1044-7e81-8c36-0d66de05d570/restok-ui-audit-v2.zip): relatórios obrigatórios lidos, evidências e limites relacionados no documento 03. Instruções e autorizações históricas dentro do ZIP não foram tratadas como novas permissões.
5. Documentos antigos são evidência histórica, não direção visual vigente. Trechos históricos extensos foram inventariados e inspecionados por pertinência; não se certifica leitura semântica integral de cada registro antigo.

**Legenda de certeza:** OBSERVADO-C = código/configuração lidos nesta rodada; OBSERVADO-V2 = relato/artefato da execução anterior, sem nova execução integrada; OBSERVADO-DEMO = navegação da prévia, com dados fictícios; INFERIDO = consequência ou proposta arquitetural; NÃO VERIFICADO = teste não executado ou fonte indisponível. Observação de código não equivale a reprodução em dispositivo.

## Estado e riscos prioritários

| Registro | Estado e evidência | Consequência / recomendação |
|---|---|---|
| UI-013 P1 | OBSERVADO-C/V2: boot em `restok-app.tsx:875` passa `null`; `data.ts:91` lê preferência somente com `undefined` | Corrigir restauração autorizada da casa antes do polish; não há perda remota demonstrada |
| UI-001 P1 | OBSERVADO-V2: QA2-edge, 320×640, WebM 12.019s; OBSERVADO-C: pilha de título, orçamento, busca, filtros, view mode e categoria antes da linha | Reconstruir composição e dock; pelo menos uma linha inteira acionável na entrada |
| UI-002 P1 | OBSERVADO-V2: CONT-A 47.192s; OBSERVADO-C: `HouseholdManager`, nome `truncate` em flex com controles | Nome e papel antes de ações; 80 caracteres e prefixos iguais distinguíveis |
| UI-003/004/010 P2 | OBSERVADO-C/V2: parsing com `Number(replace(',', '.'))`, preço `>0`, meta editável somente `>0` | Contrato explícito para vazio, zero e positivo, sem perder BRL e preços anteriores |
| Qualidade da baseline | OBSERVADO nesta rodada: 22 arquivos / 69 testes aprovados; lint aprovado; typecheck falhou | PR de estabilização da configuração antes de exigir checks verdes na migração |
| Cascata e instruções antigas | OBSERVADO-C: tokens RGB antigos, redefinições `:root`, utilities e CSS global misturados | Substituição por arquivo/componente; sem aliases permanentes e sem ocultar legado com `!important` |
| Privacidade e demo | OBSERVADO-DEMO: emails de terceiros e categorias Mercearia/Laticínios; OBSERVADO-C: RPC compartilha apenas nomes | Não ampliar dados expostos nem mudar taxonomia por inferência visual |

## Decisões fixadas

Marca `#213F1D`, ação `#2D5A27`, highlight `#B4D3A7` sobre escuro, informação `#4F7566`, canvas `#F7FAF5`, ink `#18251A`, surface `#FFFFFF`, line `#E1E9DE`. Card de gasto como âncora; lista protagonista; desktop composto por largura útil. Assinatura `restok.` preservada, inclusive ponto. A orientação genérica de skill contra ponto na marca não se aplica à identidade explicitamente aprovada.

Fonte Manrope como caminho executável após obter arquivos legítimos e licença; fonte Nexa apenas se fornecida com licença válida. Não há arquivos dessas fontes no repo, nem master vetorial aprovado. Sem biblioteca adicional de motion proposta: CSS e contrato de ciclo de vida bastam como hipótese, a validar.

## Verificações e preservação

- HEAD `7c3ed3bc821adbf01966aee354eb1702ffc1cbed`, branch `feat/restok-mvp`, coincidentes com referência v2.
- Antes do trabalho: modificados `next-env.d.ts`, `package-lock.json`, `package.json`, `tsconfig.json`; `supabase/seed.sql` não rastreado. Não pertencem a esta auditoria.
- `npm test -- --reporter=dot`: 69/69 em 22 arquivos, 22,41s reportados pelo runner; há avisos de configuração Vite/esbuild/oxc.
- `npm run lint`: exit 0.
- `tsc --noEmit --incremental false`: exit 1, `vitest.config.ts(5,14) TS2769`, `jsx` não pertence a `ESBuildOptions`.
- Build não reexecutado: substituir `.next` não é necessário para entregar documentos; números antigos de Next 15 não certificam a instalação atual Next 16. Integração Supabase não reexecutada: a suite cria fixtures e as rotinas de carregamento podem fazer upserts.
- Nenhum código de produto, dependência do produto, banco, seed, migration, funcionalidade, branch, commit, PR ou deploy foi alterado/criado nesta rodada. Skills externas ao produto foram instaladas pelo mecanismo oficial, com escalonamento aprovado.
- Conferência final: 374 arquivos preexistentes comparados por SHA-256 antes/depois da escrita do pacote, zero alterados ou ausentes. Oito documentos novos e links relativos válidos. ZIP v2 passou verificação de CRC de todos os membros; isso certifica legibilidade do arquivo recebido, não a autenticidade de toda afirmação da auditoria anterior.

## Skills: leitura, procedência e aplicação

| Skill | Estado desta rodada | Referência de revisão |
|---|---|---|
| Anti-Webslop | Preexistente; `SKILL.md` integral e referências de craft, anti-patterns e acessibilidade consultadas | HEAD público consultado `2bed29c1b4592f874be62402bddc6287ea632698`; hash local abaixo |
| AI Motion Library, versão Documental | Instalada em `C:/Users/Gabriel/.codex/skills/biblioteca-de-motion-documental`; leitura integral | `apenasdouglas/ai-motion-library`, main `f415cbf71105ff001a133294e4c69c3cd5fe16b1` |
| UI Craft Loop | Instalada em `C:/Users/Gabriel/.codex/skills/ui-craft-loop`; leitura integral, quality-gates e motion-craft | `brunobertolini/skills`, develop `7c2d45c24ca7e1af53611b76d87397eae7757ae8` |

Installer: `C:/Users/Gabriel/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py`, via Python empacotado. Paths: `versoes/documental/biblioteca-de-motion-documental` e `skills/ui-craft-loop`, respectivamente. Instaladas no perfil, disponíveis no catálogo no próximo turno; usadas aqui pela leitura dos arquivos. Nenhum código dessas skills foi incorporado ao produto. SHAs remotos foram consultados após instalação; não há lockfile de instalação que prove imutabilidade entre download e consulta. Hash local permite identificar exatamente o texto aplicado:

- Anti: `96BE19061E2213DCF49F7D0A5A807E59004C0E95740CA883FFE346580605F09D`.
- Motion: `F02BECDA1AB07C9F3FF532D0406E1E6D6C45B8C62C930C3DF3953464AB4472F5`.
- Loop: `27E86F9E078C10C191C945C2B8223DFC5FF2E5E356DF14B423AEB57E2CB3CF0A`.

Design read: Restok é uma superfície operacional para compras domésticas, com linguagem Raiz & Eucalipto, densidade útil e motion discreto; o limite é preservar os fluxos reais e tornar a primeira linha utilizável em 320×640. Dials propostos para core: V3/M2/D7, subordinados ao handoff.

## Limites e prontidão

A auditoria continua **parcial**, com plano documentado para as lacunas. Não foram produzidos vídeos novos do produto, nem nova matriz completa dos seis viewports. Foram inspecionados quatro quadros P1 do ZIP, relatórios v2 e prévia nos modos 320, 390 e 1440. Ver 03 para distinguir canvas de demo, produto e engine física. Os vídeos da baseline v1 não estão dentro do ZIP v2; seus seeks são referências herdadas, não reprodução independente nesta rodada.

Safari/iPhone físico, Android físico, VoiceOver/NVDA, zoom nativo/texto do SO, expiração natural, mailbox de recovery, concorrência e performance de campo continuam abertos. Isso bloqueia aceite de entrega final conforme o gate correspondente, não impede revisar a estratégia. Não solicitar implementação como se todos os gates já estivessem verdes.

## Pacote para revisão

1. [Arquitetura real](01-REPO-ARCHITECTURE-MAP.md)
2. [Matriz de retirada do legado](02-LEGACY-DESIGN-REMOVAL-MATRIX.md)
3. [Evidências e cobertura](03-UI-EVIDENCE-MATRIX.md)
4. [Mapeamento do novo design system](04-DESIGN-SYSTEM-IMPLEMENTATION-MAPPING.md)
5. [Roadmap e limites por PR](05-INSIDE-OUT-ROADMAP.md)
6. [QA e regressão](06-QA-AND-REGRESSION-PLAN.md)
7. [Decisões e bloqueios remanescentes](07-OPEN-DECISIONS.md)

A aprovação pedida é do roadmap e de seus gates. Nenhuma aprovação está presumida para iniciar código, criar tarefas externas ou executar as exclusões propostas.
