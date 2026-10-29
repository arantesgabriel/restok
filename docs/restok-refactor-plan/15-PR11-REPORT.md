# PR11: Conta, autenticação e perfil

29/10/2026 · America/Sao_Paulo · Unidade local sobre `9678210`. Autorização específica: “implemente o pr11”. Sem push, PR remoto, merge, deploy, migration ou alteração de dependências. PR12 não iniciado nem autorizado.

## Resultado

Login, cadastro, redefinição e edição do próprio nome usam os tokens Raiz & Eucalipto e os primitivos já adotados no core. A composição é de formulário, com uma coluna legível, marca pequena e uma ação primária. A copy trata a conta como individual: nome e email próprios, casas compartilhadas por convite. UI-006 não aparece mais nos consumidores do produto; textos anteriores ficam somente nas fontes históricas.

Login e signup compartilham um controlador em `use-login-form.ts`, separado da apresentação. Bloqueio síncrono impede autenticar, enviar recuperação e trocar de modo enquanto uma operação está pendente. Login sem sessão confirmada não navega. Cadastro sem sessão mostra confirmação de email e foca o título; senha é limpa ao mudar de modo ou concluir cadastro sem sessão. Recuperação valida email antes de enviar e conserva resposta genérica, sem anunciar existência da conta.

Campos de senha têm controles independentes de exibição, nome acessível, aria-controls e autocomplete adequado. O reset mantém a validação de divergência, erro persistente e retry, e só navega após resposta sem erro. Não houve mudança do contrato do callback, das URLs permitidas ou das guardas. Editor de perfil extraído do monólito, com validação de nome aparado de1 a80 caracteres, lock de gravação, Cancelar/Salvar no footer, erro com foco e manutenção do conteúdo para retry. Fechamento durante gravação fica bloqueado.

BrandMark passou para `components/ui`, preservando PNG, alt e dimensões normal/compacta; entrada antiga é reexport. Não se criou master vetorial ou nova identidade de marca. Nenhuma animação decorativa ou biblioteca foi adicionada.

## Arquivos e consumidores

- `components/auth/{auth-frame.tsx,auth-error.tsx,password-field.tsx,login-form.tsx,use-login-form.ts,reset-password-form.tsx,profile-editor-sheet.tsx,auth.module.css,auth.test.tsx}`.
- `components/ui/brand-mark.tsx` e CSS Module; reexport `components/brand-mark.tsx`. Shell e onboarding importam o primitivo diretamente, sem mudar seus fluxos.
- `app/login/page.tsx`, compatibilidade `app/login/login-form.tsx`, e `app/reset-password/page.tsx` apontam para os novos componentes. `components/restok-app.tsx` importa o editor; persistência e controladores de compras não mudaram.
- `app/login/login-form.test.tsx`: assertions de copy atualizadas e seis casos adicionais. `components/auth/auth.test.tsx`:12 casos novos. Fontes anteriores de login/reset preservadas em `tests/e2e/before-pr11-{login,reset}.tsx`; não importadas pelo produto.
- Legado restante: classes globais antigas de auth ainda existem para retirada coordenada no PR13; novos consumidores não as usam. Landing/demos e identidade vetorial final continuam fora deste PR.

## Verificação nova

**210/210 testes em36 arquivos**,18 adicionais desdePR10. Recorte auth41/41: login/cadastro com/sem sessão, nomes inválidos, lembrança de email/storage bloqueado, controle da senha, auth indisponível, erros de credencial/rede, recuperação, bloqueios cruzados, SSR/hidratação, confirmação e foco. Reset cobre divergência, minLength/autocomplete, exibição independente, bloqueio duplo, resposta atrasada, link expirado/usado simulado, indisponibilidade e transporte. Perfil cobre vazio/>80/80 aparado, falha/retry, exceção, cancelamento e bloqueio de fechamento/gravação repetida.

Lint, typecheck sem incremental, build Webpack e diff-check aprovados. Avisos preexistentes de middleware do Next e configuração CommonJS do Vitest permanecem. Slop-lint: zero erro e zero warning; dois avisos informativos de text-wrap já atendidos pela regra compartilhada de títulos em styles/base.css. Sem exclusão de teste, aumento de timeout ou relaxamento de guardas.

Next-env restaurado após build aos bytes anteriores. Package, lock, tsconfig e seed permanecem com hashes idênticos ao checkpointPR10; `preserved-sha256.json` registra comparação. Alterações preexistentes do usuário não entram na unidade local.

## Navegador e sessão real

Somente navegador interno, app já ativo3001. Baseline nova do login nas seis dimensões e cadastro/reset em amostras; depois: login, signup, reset e perfil nas seis dimensões CSS exatas320×640,390×844,768×1024,1024×768,1280×800 e1440×900, sem overflow horizontal. Footer do perfil permanece dentro da altura útil. Houve uma tentativa de override ignorada após mudança de aba pelo usuário; imagens finais foram sobrescritas com nova aba e medidas verificadas, sem aceitar nomes nominais como geometria.

Inspeção visual focal: login320, cadastro390, reset1440 e erro de perfil320. Formulários longos têm scroll normal; não se declara toda a página na primeira dobra320. Nome80 no perfil ficou somente no campo não salvo e foi cancelado. Nome remoto permaneceu Gabriel Teste. Erro de nome em branco, foco no erro, Escape e cancelamento foram exercitados sem gravação remota de perfil.

Logout e novo login reais com conta fictícia existente confirmados. `/app?demo=1` sem sessão redirecionou para `/login?next=%2Fapp`, sem catálogo/demo. Callback de recuperação sem código redirecionou ao erro de link inválido. Login real com next externo rejeitou o destino e terminou em localhost3001/app, perfil e casa autorizados preservados. Não se mudou nenhuma senha, membership, produto ou compra.

## Gate específico de email: aberto

Usuário forneceu caixa controlada. Foi feito **um** pedido de recuperação, com resposta genérica do serviço; isso não comprova cadastro ou entrega. Depois autorizou consultar no Gmail somente a chegada dessa mensagem e usar o link/código. Busca restrita à mensagem recente de Restok/Supabase/localhost, incluindo todas as pastas, não encontrou resultado nas consultas realizadas. Nenhuma mensagem não relacionada foi aberta. Não houve leitura/arquivo de código, token ou corpo de outras mensagens, reenvio em sequência ou alteração de SMTP/configurações.

Entrega, abertura de link válido, consumo, reuso e expiração natural permanecem **não verificados**. Cadastro real e confirmação por mailbox também permanecem não verificados; suas ramificações são COMPONENT. Foi solicitada informação sobre existência da conta nessa caixa; não se presume que ela já exista. Quando houver link, o agente pode abri-lo dentro da autorização dada; escolha e submissão da nova senha precisam ser realizadas pelo usuário, conforme regra do navegador para credenciais.

Esse gate não foi dispensado ou adiado por autorização inferida. PR11 está implementado e disponível para revisão local, com aceite integrado de email pendente. Não ampliar a autorização para cadastro de credenciais ou configuração do serviço.

## Evidências

| Arquivo em evidence/pr11 | Cobertura e limite |
| --- | --- |
| `before-geometry.json`, `*-before-login.jpg` | Baseline atual anterior nas seis dimensões; signup1440 e reset390 são amostras anteriores adicionais. |
| `after-geometry.json`, `*-after-login/signup/reset.jpg` |18 medições reais, seis por formulário, sem overflow; email ilustrativo reservado, não cadastro de exemplo. Nenhum campo de nova senha foi preenchido/submetido pelo agente no navegador. |
| `profile-geometry.json`, `*-after-profile-unsaved80.jpg`, `320-profile-error.jpg` | Seis larguras e footer dentro da altura; nome80 não salvo, validação local e foco. Não prova write de perfil real nesta rodada. |
| `390-recovery-request-status.jpg`, `320-invalid-recovery-link.jpg`, `login-real-final.jpg` | Resposta genérica do pedido, callback sem código e sessão real. Não comprova entrega da mensagem. |
| `interaction.webm`, `recording.json`, `frames/*`, `media-checks.json` |120 aquisições sequenciais reais/~4,7s: troca cadastro/login, validação local de email e limpeza de erro. Container25fps sem interpolação; mediana27ms/máximo46ms; cinco seeks40ms MAE≤1,251. Não mede latência de motion nem representa signup remoto. |
| `checkpoint.json`, `preserved-sha256.json` | Checks e preservação. Sem segredos, cookies, tokens ou credenciais. |

JPEGs originais preservados; PNGs de referência/seek são decodificações/conversões, não aquisições novas. Nenhum screenshot da caixa Gmail foi incluído. Leitor real, zoom nativo, teclado virtual/hardware, outras engines e release global não foram aprovados; continuam gates transversais conforme06. Matriz de autenticação com mocks não certifica serviço externo ou RLS. Não houve nova execução de4173 ou navegador externo.

## Rollback e parada

Reverter a unidade localPR11 com seus consumidores, componentes e testes, preservando estado da autenticação e arquivos do usuário. Não reverter credenciais ou registros no banco; não houve troca de senha pelo agente. Preservar relatório e histórico do gate de email para retomada. Não reverter o PR10.

**Parar no PR11 para revisão e fechamento explícito do gate de email. PR12 não iniciado.**
