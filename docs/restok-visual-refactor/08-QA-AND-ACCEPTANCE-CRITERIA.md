# QA e aceite

Define validação futura. Resultados efetivamente executados estão nos manifestos e documento06. Uma lista de casos não é alegação de execução.

## Identificar a evidência

Registrar commit/hash do diff, timestamp, rota/hash, cenário/origem dos dados, engine/versão, viewport confirmado por innerWidth/innerHeight, DPR, zoom, movimento, scroll, PNG e geometria. Na demo, também offsetWidth/offsetHeight/transform do canvas. Screenshot do viewport e do elemento têm enquadramentos distintos. Nome de arquivo320 não prova viewport320.

Esperar fontes e hidratação/interação efetiva; aquecer a rota antes de medir. Compilação não é loading de dados. Medir overflow no documento, conferir ancestrais que recortam elementos e registrar erros. Não guardar sessão/cookies/senhas/convites ou traces sem redação. Vídeo precisa existir, abrir e ter seeks comparados com frames. Tempo de script não equivale a mídia ou latência.

## Matriz mínima

Quatro fluxos em320×640,390×844,768×1024,1280×800,1440×900,1920×1080; acrescentar1024×768 para mudança de navegação. Repetir safe area, navegador dinâmico, teclado e scroll de sheet em hardware disponível.

| Área | Cenários | Resultado objetivo |
|---|---|---|
| Compra/densidade |0/33/100, categorias abertas/recolhidas, título2 linhas | ≥1 row integral acionável acima do dock320;≥4 em1280; última alcançável |
| Dinheiro |0, ausente,3×5, orçamento0, gasto igual/maior, anterior0, valor alto seguro | BRL correto, subtotal15,0 diferente de desconhecido, sem divisão0/NaN, excedente positivo nomeado |
| Busca/organização | Quatro status, busca+filtro, A–Z/categoria e direção por grupo | Resultado certo, estado acessível, clear/foco, nenhuma mutação por filtro |
| Gravação/conclusão | Sucesso/falha/local não sincronizado/retry/clique duplo | Sem sucesso antes de ok&&synced; pendentes e rascunho preservados; sem duplicação |
| Catálogo | Ativos/inativos/todos inativos, busca0/alguns,80 A/B, quantidade999999 | Nome/quantidade legíveis, duas rows comuns390, editar/reativar/foco e histórico imutável |
| Nova compra |0/alguns/todos/resultados e100 produtos | Footer alcançável, contagem correta, aviso de arquivar atual preservado |
| Histórico |0/1/24/100, meses, hash direto/back/forward | Só concluídas, cronologia certa, nome/data/total legíveis, foco e scroll no retorno |
| Comparação | Anterior0/ausente/igual/diferente; próprias/ativas/futuras/datas iguais | Unidade explícita; referência estritamente anterior; base0 sem percentual impossível |
| Pessoas | Papéis/self, nomes79 comuns+A/B, várias casas | Identidade antes de ações, permissões e reload correto |
| Convites/acesso | Loading/erro/retry, ativo/usado/revogado/expirado/limite, confirmar/cancelar | Erro persistente, tokens protegidos, alvos certos, último owner bloqueado |
| Estado compartilhado | Snapshot com/sem cache, offline/reconnect/write falhou | Erro nunca vira lista0 legítima; casa correta, retry/aviso acessível |
| Controles | Default/hover/focus/pressed/disabled/busy | Alvos44 frequentes, labels íntegros, foco2px/offset3; estado além da cor |
| Overlay | Curto/longo, confirmação dentro da gestão, reabrir durante saída | Um scroll, header/Fechar alcançáveis, Escape/cancelar/foco certos; callback antigo não fecha novo |
| Motion | Padrão/reduced, interrupção, orçamento | Dado imediato, sem stagger geral; reduced sem espera; transform/opacity com função |

Magnitude além da precisão segura de Number é teste de layout, não prova contábil. Incluir valores altos com centavos representáveis. Não impor limite de domínio para um screenshot caber.

## Fidelidade e acessibilidade

1. Comparar composição/papéis, além de cores. Dados distintos não permitem pixel diff bruto como veredicto.
2. Conferir cor/font/cascata no Next autenticado em carregamento direto e após navegar; resolver F-05 antes de certificar contraste com Vite.
3. Texto normal≥4,5:1 e texto grande≥3:1 quando aplicável; controles/foco perceptíveis segundo WCAG2.2. Razões do DS não cobrem todos os estados.
4. Tab/Shift+Tab, Enter/Espaço, Escape, skip, labels, live regions e retorno de foco em browser; NVDA/VoiceOver em ensaio separado. DOM não certifica anúncio real.
5. Zoom nativo200/400%, texto do SO, touch/teclado virtual, Safari/iPhone e Android físico: execução registrada ou gate pendente. Emulação não substitui.
6. Não aprovar desktop768 só porque @media640 foi ativado. Ações e conteúdo precisam de largura útil.

## Checks e regressão

Executar npm test, npm run lint e npx tsc --noEmit --incremental false. Build Webpack somente sem concorrência prejudicial com next dev na mesma .next. A suíte Supabase conserva sua recusa a projetos hospedados. Não flexibilizar guardas nem rodar seed/reset/migrations ou helpers de acesso com autorizações históricas copiadas de relatórios.

Mudanças globais exigem smoke de auth/onboarding/landing por compartilhar primitives, sem redesenhar a Landing. Não apagar invariantes antigas nem criar testes que apenas espelhem marcação nova.

## Encerramento

Cada bloco entrega diff, causa, IDs fechados/abertos, evidências reais, checks e limitações. Usuário aprova o resultado concreto e autoriza o próximo. Gate aberto não está dispensado por nova PR. Hardware/integração ausentes impedem certificar esses eixos, sem impedir o restante da documentação.

Release/deploy não é consequência automática de aprovar layout. Rollback visual não modifica dados, autenticação, memberships, convites ou banco.
