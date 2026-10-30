# R4.5 · QA e regressão

## Resultado

-237 testes aprovados em40 arquivos; inclui novo teste de ausência do dock/contexto vazio e preservação da finalização no menu.
-Typecheck e ESLint aprovados. git diff --check sem erro.
-77 capturas da matriz11 estados×7 viewports, zero pageerror e zero overflow horizontal; mais14 screenshots Casa/Histórico. Manifesto com dimensões CSS e geometria.
-20/20 verificações de browser: Escape/foco, busca/limpeza, ordenação, último item acima do dock e reduced motion0s em320/390/992/1920.
-Navegador interno em localhost:3000: sete capturas antes;21 capturas depois em Compra/Casa/Histórico e sete de compra preenchida. Zero overflow nos estados medidos. Sessão real já ativa; nenhuma alteração de dado feita pelo agente.
-Editor de meta aberto e fechado com Escape, foco retornou ao botão. House Switcher abriu Casas e pessoas; fechado sem trocar casa/permissão. Browser back retornou ao Histórico. Estado com um item resolvido chegou externamente durante a inspeção, foi apenas observado/capturado.

## Cobertura dos estados

empty-list, few3, long33, list100, stress(nome extenso/quantidade/preço extremo e parcialmente resolvida), money(meta zero, comprado sem preço), money-equal(totalmente resolvida), money-over, money-high, loading, error. Fixtures existentes preservadas e cenário few adicionado. Nenhum backend real usado para gerar esses estados.

Dados simulados são explicitamente identificados no topo. DevTools Next no canto inferior pertence ao ambiente3000 e pode cobrir parte da navegação na captura; não é componente Restok. Capturas internas JPEG são comprimidas pelo provedor; PNGs de fixtures mostram a geometria sem essa compressão.

## Limites

Não executado build de produção enquanto o dev3000 está ativo, para preservar .next. Sem suíte Supabase/RLS/realtime integrada, Safari/iPhone físico, teclado virtual real, screen reader, zoom200/400%, safe areas de hardware ou performance de campo. Cálculos, persistência e permissões cobertos apenas pelos testes existentes e leitura de código, sem certificar integração de ponta a ponta.

Extremos monetários crescem verticalmente e podem exigir scroll antes da primeira linha, em vez de truncar valores. Alvos44px preservados, inclusive Editar meta; avatar visual44px, maior que a sugestão32–36px para manter o alvo. Título24px, radius orçamento18px e progresso5px seguem handoff.

Visant Killer: token fallback e noise aprovados; Impeccable indisponível por DNS/npm; copy não descoberto pelo runner. Não foi emitido score agregado de aprovação. Motion scanner e Anti-Webslop executados separadamente. Não há alegação de gate integral.

Reprodução: node tests/e2e/serve.mjs; node docs/restok-lightness-density/capture.mjs before|after; node docs/restok-lightness-density/verify.mjs. Scripts usam o runtime Playwright já instalado e Edge deste Windows. Servidor isolado4173 complementa a inspeção principal no navegador interno3000.

