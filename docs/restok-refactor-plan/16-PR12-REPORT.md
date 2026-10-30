# PR12: ciclo de motion e acessibilidade cruzada

29/10/2026 · America/Sao_Paulo. Autorizado junto do PR13 pelo usuário. Base a667b6c. Commit local separado; sem push, PR remoto, banco ou deploy.

## Resultado de implementação

Saída do sheet tem um ciclo único em components/ui/exit-lifecycle.ts: término ou cancelamento da animação correta, mudança para reduced motion e timeout de segurança encerram no máximo uma vez. Eventos dos filhos e cancelamento da animação de entrada não encerram a saída. Desmontagem cancela listeners e timer; diálogo desconectado não aplica callback antigo. Mantidos220ms de entrada e160ms de saída, só transform/opacidade, sem atrasar dados financeiros. CSS de saída usa a curva compartilhada. Efeito: deslizar e desaparecer (slide out/fade out), sem biblioteca nova.

Avisos persistem por padrão. Confirmação explicitamente transitória pausa o prazo durante foco, hover ou aba oculta, retomando o tempo restante. Aviso continua no live region enquanto o teclado oculta seu controle visual. Retirada a key por mensagem para atualizar uma única região em vez de remontá-la. Foco e dados não dependem do relógio de animação.

Testes novos cobrem eventos concorrentes, reduced durante saída, disposal, diálogo obsoleto e fallback em segundos; avisos cobrem foco/hover e anúncio durante teclado. Suíte completa219/219 em37 arquivos passou; último ajuste de filtragem recebeu recorte7/7, com um caso adicional (total esperado220). Lint e typecheck sem incremental passaram antes desse ajuste; build final também valida seus tipos. Resultados posteriores de conjunto serão registrados no PR13, sem atribuí-los retroativamente a esta rodada.

## Validações externas e evidências adiadas

Usuário confirmou que concluiu troca de senha, novo login e cadastro do PR11. Registrado como relato do usuário, não execução observada pelo agente. Entrega do reset já havia sido demonstrada na imagem fornecida. Nenhuma credencial alterada pelo agente.

O navegador interno voltou a falhar ao iniciar: processo confiável encerra e a criação do ambiente de segurança retorna HRESULT0x800700E1. Duas tentativas novas nesta rodada não chegaram a uma página. Shell isolado também falhou; comandos de leitura/checks foram executados com a escalada permitida, sem desativar proteção do sistema. Não houve browser externo, runner ou controle de desktop.

Assim, **não foram produzidos novos screenshots/vídeos, reader real, zoom nativo ou medição em aparelho**. Evidências adiadas dos PR04–05/07 continuam abertas; autorização para implementar12–13 não foi interpretada como dispensa desses gates. Tests happy-dom não substituem esses ensaios. Capturas anteriores não foram reclassificadas como novas. Aceite visual/acessível e release permanecem pendentes.

PR12 implementado para revisão local; não declarar auditoria ou acessibilidade integral concluída. PR13 autorizado será implementado em unidade separada, mantendo explícito esse risco de validação visual indisponível. Rollback reverte somente helper/hook, toast, consumidor, CSS e testes deste PR; sem banco. Direção e parâmetros existentes em DESIGN.md preservados. Skills UI Craft Loop e Biblioteca de Motion aplicadas, sem nova direção estética.
