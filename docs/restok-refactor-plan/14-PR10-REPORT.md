# PR10: Casas e pessoas e onboarding

29/10/2026 · America/Sao_Paulo · Unidade local de implementação e revisão, sobre `83091a4`. Usuário autorizou especificamente PR10, nomes temporários e gate integrado na casa isolada. Sem push, PR remoto, merge, deploy, migration, seed ou reset. Parar antes do PR11.

## Resultado

Gestão de casas reconstruída em `components/households`, com identidade completa antes das ações. Dois nomes de 80 caracteres com os primeiros 79 iguais permanecem distinguíveis em320/390. Nome próprio aparece junto de “Você”, papel e data; IDs e emails de outras pessoas não são apresentados. Papéis e ações seguem owner/admin/member, com proteção da última pessoa proprietária.

Alterar papel, transferir propriedade, remover, sair e revogar exigem confirmação dentro do sheet, identificando a casa e a pessoa quando aplicável. Cancelar recebe foco inicialmente e retorna ao controle original. Falha mantém confirmação e mensagem para retry; sucesso depende da resposta da RPC. Troca com falha mantém a casa anterior. Criação com falha de ativação retém o ID e tenta carregar a mesma casa, sem criar outra. Locks evitam submissão paralela e versões de leitura descartam respostas antigas.

Onboarding usa os mesmos tokens, campos e botões, com dois caminhos separados por divisor; erro e retry de ativação permanecem explícitos. Direção Raiz & Eucalipto V3/M2/D7, Manrope local e primitivos existentes. Não há nova dependência ou motion decorativo.

O gate real encontrou uma falha preexistente na inicialização de convites: o StrictMode repetia o efeito e consumia o convite duas vezes. O vínculo era criado pela primeira execução cancelada, enquanto a segunda mostrava erro e selecionava outra casa. Um ref por montagem agora compartilha o resultado pendente para o mesmo token. O teste de regressão falhou antes e passou após a correção; novo convite real também passou, com mensagem de aceite e casa correta. Regras de RPC, RLS, expiração, token e seleção autorizada não mudaram.

## Arquivos e consumidores

- Produto: `components/households/{household-manager.tsx,household-onboarding.tsx,member-row.tsx,household-model.ts,use-household-manager.ts,households.module.css}`; consumidor e correção do boot em `components/restok-app.tsx`.
- Testes: `components/households/households.test.tsx`, regressão em `components/restok-app.household-context.test.tsx`.
- Entradas antigas `components/household-manager.tsx` e `components/household-onboarding.tsx` são reexports de compatibilidade. O app importa diretamente os novos módulos.
- Harnesses históricos06–08 apontam para cópias anteriores `tests/e2e/before-pr10-{manager,onboarding}.tsx`, preservadas a partir de83091a4. Não são importadas pelo produto. `tests/e2e/pr10-onboarding-preview.tsx` documenta a composição visual de onboarding.
- Legado restante: auth/conta/perfil e BrandMark no PR11; estilos globais e retirada geral no PR13; landing no PR14. Nenhuma migração estética antecipada nesses consumidores.

## Verificação nova

**192/192 testes em35 arquivos**,17 adicionais desde PR09. Os16 de households cobrem nomes80, confirmação/foco, falha/retry, papéis, último owner, troca com falha, locks, criação/ativação sem duplicata, clipboard indisponível, ocultação do link, estados dos convites e onboarding. A regressão adicional do boot usa StrictMode e RPC de uso único, verificando chamada única, casa correta, mensagem de sucesso e remoção do token da URL.

Lint, typecheck sem incremental, build Webpack e diff-check aprovados. Recorte de contexto14/14 passou após reproduzir e corrigir o defeito. Não foram ampliados timeouts ou retirados contratos. Avisos existentes: convenção middleware do Next e config CommonJS do Vitest. Slop-lint: nenhum erro; faixa lateral de erro é um estado real de falha, não decoração. O aviso informativo de quebra do título foi tratado com text-wrap:balance.

Package, lock, tsconfig, next-env e seed preservam os SHA256 anteriores, registrados no checkpoint. Build reescreveu next-env; restaurado aos bytes capturados antes, hashB8B3…1000. As alterações preexistentes do usuário não foram incluídas no commit.

## Integração autorizada

Somente `QA PR10 Casas e pessoas 2026-10-29`, ID `8c4535dd-e835-4194-ae27-837342404983`, no restok-dev, via navegador interno e app3001. A rejeição automática inicial de um convite foi respeitada; nenhum efeito daquele lote foi executado. Usuário então autorizou explicitamente criar/aceitar/reutilizar/revogar, papéis, transferência, remoção e saída nessa casa, resolvendo o impedimento sem contorno.

Criada uma casa e quatro convites: três usados, um revogado, zero ativos ao final. Segunda conta entrou três vezes, foi promovida e rebaixada, recebeu e devolveu a propriedade, foi removida uma vez e saiu voluntariamente duas vezes. As ações e os novos papéis foram confirmados na UI após respostas reais. Member não recebeu controles administrativos; administrador não recebeu controles de papel/transferência sobre owner. Último owner permaneceu impedido de sair. Reutilização de convite usado recebeu erro.

Nomes temporários das duas contas foram restaurados para **Gabriel Teste** e **Auditoria Participante B**, ambos confirmados em nova sessão. Propriedade final é da conta inicial; participante sem acesso à casa QA. Sessão inicial e preferência de lembrar email restabelecidas. Os registros de teste foram preservados. Nenhuma membership ou dado de casa preexistente foi alterado; a mudança temporária de nome global foi a exceção explicitamente autorizada e restaurada.

## Evidências e limites

Tudo em `evidence/pr10`, adquirido pelo navegador interno. Nenhum navegador externo, desktop, runner Playwright ou servidor4173 usado neste PR.

| Evidência | Cobertura |
| --- | --- |
| `*-before-manager.jpg` | Seis larguras anteriores com uma pessoa e nome original. Não é o cenário extremo80. A tentativa de obter o antes com nomes80 não concluiu; import temporário do produto foi restaurado. |
| `after-geometry.json`, `*-after-manager.jpg` | Seis larguras CSS exatas320/390/768/1024/1280/1440 ×900, zero overflow horizontal, dois nomes80 com prefixo79 igual. Inspeção visual focal320/1440. |
| `390-member.jpg`, `390-admin.jpg`, `390-confirm-role.jpg`, `390-confirm-exit.jpg` | Matriz real de acesso e confirmações; nome completo antes de agir. |
| `390-invite-accepted.jpg`, `390-revoked-final.jpg`, `final-restored-session.jpg` | Aceite após correção, revogação e sessão final com perfil restaurado. |
| `*-onboarding-preview.jpg`, `320-onboarding-error*-preview.jpg`, `onboarding-preview-geometry.json` | Composição autenticada e somente leitura no dev3001, seis larguras sem overflow e erro em320×640; último campo alcançável. Não representa conta real sem memberships. Nenhum formulário enviado. Rota temporária com guarda de sessão e restrição a development removida; fonte arquivada em `onboarding-preview-route.txt`, sem rota no produto final. |
| `interaction.webm`, `recording.json`, `media-checks.json`, `frames/*` |120 JPEGs sequenciais reais/~4,7s, cancelamento e confirmação de revogação. Mediana29,5ms/máximo43ms; container25fps sem interpolação. Cinco seeks de40ms, MAE≤1,517. Não mede latência de motion. |
| `integrated-progress.json`, `house.json`, `profile-restoration.json` | Identificação do ambiente e resultado integrado, sem tokens/credenciais. |

Keyboard: Escape fecha a gestão e retorna ao seletor de casa, observado após o fechamento; cancelar confirmação devolve ao controle original em teste. Labels e árvore DOM inspecionados; isso não substitui leitor real. Capturas e vídeo não incluem tokens de convite: links foram ocultados antes da observação e os usados já foram consumidos/revogados.

Expirado e limite10 são cobertura COMPONENT, sem esperar14 dias ou criar10 convites remotos. Erros de transporte/retry e onboarding sem memberships também são COMPONENT, com visual do onboarding em composição isolada. Integração usou duas contas; não comprova matriz concorrente de três contas, RLS adversarial ou sessão simultânea. Antes/depois possuem cenários diferentes; não se declara reprodução nova do truncamento80 no antes. Leitor real, zoom nativo, reduced em SO, hardware, engines e release global continuam gates transversais conforme06. Esses limites não foram declarados como testes feitos nem como adiamentos adicionais autorizados.

## Rollback e parada

Reverter apenas o commit localPR10 como unidade, após revisar dependentes: módulos, consumidores, ajuste do boot, testes e documentação. Preservar IDs e registros; rollback visual não reverte papéis ou memberships no banco. Não reverter PR09 ou arquivos preexistentes. Evidências e histórico de autorização devem permanecer consultáveis.

Implementação e validação local disponíveis para conferência. **Não iniciar PR11 sem autorização específica.**
