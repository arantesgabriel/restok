# Rodada4 · Lightness & Density

**Entrega histórica, não aprovada visualmente.** Sua direção foi corrigida em [direction-correction/REPORT.md](direction-correction/REPORT.md), que substitui as decisões de header desktop e painel direito. O restante deste arquivo registra a entrega anterior. Sem commit/push/merge/deploy. Branch e alterações anteriores preservadas. Sem redesign de Casa, Histórico, modal de pessoas, landing ou backend.

## Antes e depois

| Região | Antes | Depois |
|---|---|---|
| Mobile | seleção como botão preenchido, header com input aparente | indicador discreto, seletor quiet, avatar circular |
|992px|mobile esticado com bottom nav|sidebar compacta176px, ações de workspace|
|1920px|orçamento1352×171px, conteúdo sem limite|lista1024px com contexto272px; vazio máximo1040px|
|Orçamento mobile|aproximadamente143px|aproximadamente133px, Editar meta sem borda|
|Lista vazia|adicionar repetido e finalizar dominante|um CTA primário, finalizar preservado no menu|
|Lista longa|texto desktop16px e600|nome14px/500 e hierarquia de metadados|

## Arquivos desta rodada

components/app/{app-shell.tsx,app-shell.module.css,navigation.tsx,navigation.module.css,house-switcher.tsx}; components/restok-app.tsx; components/shopping/{shopping-view.tsx,shopping.module.css,shopping-controls.module.css,shopping-view.test.tsx}; tests/e2e/fixtures.ts; DESIGN.md; documentação e scripts desta pasta. BudgetSummary TSX e serviços não receberam alteração nesta rodada: sua anatomia foi refinada por CSS.

## Evidências

- [Antes desktop1920](evidence/before/1920x1080-empty-list.png) e [depois vazio](evidence/after/1920x1080-empty-list.png).
- [Depois desktop1920 preenchido](evidence/after/1920x1080-long.png), [tablet768](evidence/after/768x1024-long.png), [mobile390](evidence/after/390x844-long.png), [mobile320](evidence/after/320x640-long.png).
- [Aplicação real3000 desktop](evidence/after/1920x1080-live-filled.jpg), [mobile](evidence/after/390x844-live-filled.jpg), [antes](evidence/before/1920x1080-live.jpg).
- Todas as sete larguras e estados: evidence/before/, evidence/after/ e manifestos JSON.

## Validação e pendências

237/237 testes; typecheck; lint;20/20 verificações de interação;77 capturas controladas sem overflow/pageerror. Casa/Histórico conferidos no navegador interno nas sete larguras. Detalhes e limitações em05-QA-REGRESSION.md: hardware mobile/Safari, integração Supabase, build de produção, HIG não extraída e gate Impeccable sem rede permanecem sem certificação.

Diferenças intencionais da demonstração: handlers, menu de finalizar, organização por categoria e estados completos do produto real; sidebar compacta intermediária e contexto condicionado. Mantidos tokens e fonte efetiva do handoff. Não há nova identidade.

Recomendação: revisar visualmente esta rodada na porta3000 antes de qualquer publicação. Aguardamos avaliação, sem avançar para outras telas.

