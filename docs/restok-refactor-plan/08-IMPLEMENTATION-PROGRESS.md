# Progresso de implementação

28/10/2026 · America/Sao_Paulo

## Autorizações

- Mensagem explícita do usuário nesta execução: direção Raiz & Eucalipto e roadmap aprovados como orientação. **Somente Bloco 1, PRs 01–02, autorizado.**
- PR significa unidade local de implementação, validação e revisão. Push, PR remoto, merge e deploy não autorizados.
- Migrations e seed/reset não autorizados. Autorizações históricas não são reaplicáveis.
- Respostas explícitas do usuário nesta execução: usar contas do `seed.sql` e frontend `http://localhost:3000`; confirmou `restok-dev` em `gweynnnjcqafkhpynmrx.supabase.co` ao pedido de autorização para gravações de perfil/categorias durante carga e criação/aceitação de convites do gate. Não autoriza reset, migrations, execução do seed ou criação arbitrária de dados.
- Em mensagem subsequente, usuário autorizou explicitamente iniciar o próximo bloco, **Bloco2, PRs03–05**, e efetuar commits seguindo o padrão anterior, somente das alterações do agente. Commits locais autorizados; push/PR remoto/merge/deploy continuam não autorizados.
- Blocos3–5 permanecem pendentes de aprovação explícita.

## Estado

| Unidade | Estado | Gate |
|---|---|---|
| Bloco 1 | Concluído; aguardando decisão do usuário | PR01 e PR02 separados, gates aplicáveis satisfeitos |
| PR 01 | Concluído localmente | Checks e baseline de fixtures aprovados; checkpoint separado |
| PR 02 | Concluído localmente e no gate integrado autorizado | UI-013 vermelho antes e verde depois em duas sessões |
| Bloco 2 (03–05) | Autorizado, em andamento | PR03 primeiro, depois gates e PR04/05 sequenciais |
| Bloco 3 (06–11) | Não autorizado | Telas core, pessoas e auth |
| Bloco 4 (12–13) | Não autorizado | Motion, acessibilidade e legado global |
| Bloco 5 (14–15) | Não autorizado | Landing e limpeza final |

## Inspeção inicial e preservação

- HEAD `7c3ed3bc821adbf01966aee354eb1702ffc1cbed`, branch inicial `feat/restok-mvp`.
- Preexistentes: `next-env.d.ts`, `package.json`, `package-lock.json`, `tsconfig.json` modificados; `supabase/seed.sql` e os oito documentos 00–07 não rastreados. Não são alterações desta execução.
- Diff anterior e hashes dos cinco arquivos preservados em `evidence/pr01/preexisting.patch` e `preexisting-sha256.json`. Seed não lido nem copiado.
- Lidos integralmente documentos 00–07, PRODUCT.md, DESIGN.md, decisões de casas e skills Anti-Webslop, UI Craft Loop (incluindo quality-gates) e Biblioteca de Motion Documental. Nenhum AGENTS.md aplicável encontrado no repo ou ancestrais.
- Skills visuais lidas como exigência do pacote; sem rebuild visual/motion no Bloco 1. Aplicação estética fica nos blocos correspondentes.

## PR 01: baseline nova

- Stack instalada: Node 24.21.0, npm 12.2.1, Next 16.4.3, React/React DOM 19.2.8, TypeScript 5.9.3, Tailwind 3.4.19, Vitest 5.0.5, Vite 8.3.5.
- **Testes novos nesta execução, antes da correção:** `npm test -- --reporter=dot`: 22 arquivos, 69 testes aprovados (27,98s reportados). `npm run lint`: aprovado. `npm run typecheck -- --incremental false`: reprovado, TS2769 em vitest.config.ts.
- Correção: retirar opção esbuild obsoleta e ignorada pelo Vite 8; JSX já configurado como react-jsx no tsconfig preexistente. Sem alteração de dependências ou exclusão do config do typecheck.
- Build Turbopack falhou na criação do subprocesso PostCSS, inclusive escalonado e com Node empacotado. Webpack passou; script build fixado em `next build --webpack`. Nenhuma mudança de versão/dependência ou lockfile.
- Reexecução simultânea encontrou 2 timeouts de 5s em DOM tests. Limitados workers a 4, sem aumentar timeout ou retirar asserts. Suíte final: 22 arquivos / 69 testes aprovados, 10,64s; lint e typecheck aprovados. `npm run build` aprovado com Webpack em execução escalonada (sandbox gerou EPERM durante prerender em tentativa anterior).
- Harness isolado `tests/e2e/`: Vite instalado e Playwright/Chromium empacotados, sem instalação nova. 66 PNGs, 6 WebMs, seis viewports; zero erros de página ou tentativas de HTTP externo no manifesto final. Seeks de 40ms verificados por decodificação/MAE, não pelo relógio do script. Artefatos: `evidence/pr01/baseline/manifest.json`.
- Inspeção visual nova: Compra 320 e1280, pessoas390, landing1440. UI-001 e UI-002 reproduzidos nas fixtures, mantidos para PRs06/10. As demais capturas foram geradas/verificadas por correspondência de mídia; não equivalem a inspeção visual manual integral de66 estados.
- Unidade local de revisão: `evidence/pr01/PR01.patch`, `checkpoint.json`; sem commit de alterações preexistentes. Branch local `codex/restok-raiz-eucalipto-bloco-1`.
- `next-env.d.ts` reescrito automaticamente pelo build foi restaurado aos bytes capturados antes da execução, com hash idêntico. `tsconfig.json`, lockfile e seed conservam hashes iniciais. Package preserva mudanças preexistentes e acrescenta somente opção webpack no script build.
- Evidências herdadas da auditoria continuam identificadas no documento 03. Não são testes/capturas desta execução.

## PR 02: contexto da casa ativa

- Iniciado somente após checkpoint/gates locais do PR01. Patch próprio `evidence/pr02/PR02.patch`, hashes e resultados em `evidence/pr02/checkpoint.json`.
- `resolveRemoteContext(acceptedHouseholdId ?? undefined)`: ausência/falha de convite consulta a preferência por usuário; convite aceito continua explícito. Serviço mantém validação de membership, sem modificação em RLS/RPC/SQL.
- Persistência opcional via `browserStorage`: getter/métodos/quota indisponíveis não impedem boot, troca, ordenação ou logout. Seleção inválida recebe aviso; cache removido somente do usuário/casa afetados. Troca de conta esvazia estado visível antes de recarregar.
- UNIT/COMPONENT: 25 casos adicionados (13 boot/ativação,11 resolver real com cliente mockado,1 cache), além dos69 anteriores. Resultado final: **94/94 em24 arquivos**,13,28s. Subconjunto de risco:28/28 em3 arquivos. Lint/typecheck/build aprovados. `git diff --check` e checks reversos dos dois patches aprovados.
- Reprodução COMPONENT inicial:7 falhas/4 passes em11 casos antes da correção; depois foram fortalecidos os casos de storage e adicionados os casos restantes. Não confundir esse recorte vermelho com a suíte final de25 casos novos.
- INTEGRADO-RESTOK-DEV: contas do seed autenticadas;3 memberships cada. Duas sessões isoladas, seleção da segunda casa confirmada no DOM/storage antes do reload. **Antes:0/2 preservadas. Depois:2/2 preservadas.**
- Em cada conta após correção: convite malformado/inválido preserva preferência, convite válido prevalece e usado falha; snapshot com cache não troca casa; preferência não autorizada faz fallback explicado; getter de storage bloqueado permite carregar contexto remoto. Seis cenários adicionais aprovados por conta, zero erros de página registrados nos contextos principais filmados. O contexto auxiliar de storage foi validado por DOM, sem instrumentação própria de pageerror.
- Gravações explícitas:2 convites novos criados e consumidos sobre memberships já existentes. Conferência final de leitura:contagens/papéis iguais ao início. Carga autenticada pode fazer upserts automáticos de perfil/categorias, autorizados; esses possíveis deltas não foram auditados linha a linha. Nenhum seed/reset/migration, casa, produto ou mudança de papel executado pelo runner.
- Evidência nova integrada:10 PNGs e4 vídeos antes/depois, com seeks verificados em40ms. Antes:build PR01; depois:build PR02, ambos `next start` local em127.0.0.1:3001. Capturas do antes pegaram entrada do diálogo; identidade no fundo/seleção e resultado DOM comprovam o contexto. Não são comparação de acabamento visual.
- Inspecionados visualmente:antes selecionado/reload e depois reload da conta1; mídia das duas contas verificada por decodificação. Não declarar revisão humana integral de cada frame/captura.
- Servidores temporários4173/3001 encerrados. Servidor dev do usuário3000 preservado. `next-env.d.ts` novamente restaurado ao hash inicial após build. Sem push, commit, PR remoto, merge ou deploy.

## Limites e pendências fora do aceite deste bloco

- Target `restok-dev` e contas do seed autorizados explicitamente nesta conversa. Ainda verificar disponibilidade e memberships antes do gate; não aplicar fixtures SQL.
- Gate integrado do PR02 realizado conforme seção anterior. O harness de fixtures continua sem backend e não é apresentado como prova de Supabase.
- Revogação real, zero memberships real e troca de conta durante uso têm cobertura local/simulação; não foram produzidos por mudanças destrutivas de membership no banco. A suíte `test:supabase`, que recusa hosted, não foi executada nem flexibilizada.
- Hardware, reader/zoom nativos, mailbox, concorrência e QA completo dos seis viewports por estado continuam nos gates posteriores. UI-001 e UI-002 permanecem para PRs06/10. Fonte/master da marca continuam dependências do Bloco2/aceite final.
- Relatório de arquivos, evidências, riscos e rollback: `09-BLOCK-1-REPORT.md`.
- Registro histórico: ao concluir Bloco1, a execução parou antes do Bloco2. A autorização subsequente acima inicia uma nova etapa.

## Bloco2: início

- Checkout e histórico conferidos. Commits existentes seguem Conventional Commits em inglês (`feat(landing): ...`, `docs(ui): ...`). Serão preservados commits por unidade, com staging seletivo.
- PR03 em andamento: fundações isoladas, norma e Manrope local obtida do Google Fonts com OFL. Master vetorial continua pendente do aceite final de marca; asset raster existente será identificado como transitório.
- Nenhuma autorização nova de banco inferida para o Bloco2. Validações monetárias serão locais/fixtures; não escrever preços de teste nas casas reais.

## PR03: fundações isoladas

- Gates satisfeitos: lint/typecheck/build e95/95 testes (25 arquivos; um novo teste de compilação de alpha/pesos reais). Sem novas dependências.
- `styles/{tokens,base,motion}.css`, fronteira `RestokTheme`, Tailwind novo isolado, norma local e DESIGN.md atualizados. Config/cascata antigos continuam com dono PR13; não foram ativados globalmente.
- Manrope oficial WOFF2 latin/latin-ext,400–800, com OFL e origem registrada. Fonte custom confirmada pelo Chromium; sem fetch de fonte no build. Master vetorial continua gate final da marca.
- Contrastes computados: ink/canvas15,13; branco/action8,07; highlight/brand7,15; info/canvas4,90; danger/surface-danger4,96; warning/surface-warning4,81. Seis dimensões sem overflow. Fallback sem fonte capturado.
- Zoom nativo200/400% observado no menu da aba interna antes da interrupção por Escape, sem overflow. Métricas e limites em `evidence/pr03/native-zoom-observation.json`. Imagens nativas foram exibidas na conversa; a exportação pelo menu não produziu arquivo.
- Retomada autorizada com uso exclusivo do navegador interno. Sem novo controle de desktop/aplicativos. Foco por teclado e largura CSS320 confirmados e capturados na aba interna. O zoom atual do usuário foi preservado; override de viewport será restaurado ao fim.
- Evidências19 PNGs e6 vídeos do harness, mais capturas internas JPG. Seis quadros iniciais com seeks verificados40ms. Os6 PNGs de foco são evidência estática: frames finais não foram gravados de forma confiável e não receberam seek. A falha de correspondência não foi ocultada nem o limiar reduzido.
- PR03 concluído para fundações; PR04 pode iniciar. PR05 aguarda gates do PR04. Blocos3–5 não autorizados.
