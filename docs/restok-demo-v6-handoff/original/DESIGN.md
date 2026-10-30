# Restok — Design System v1 (Raiz & Eucalipto)

**Status:** direção visual consolidada para planejamento em 28/10/2026. Ainda não aplicada ao produto real.

**Fonte canônica:** [`dist/handoff/RESTOK_DESIGN_SYSTEM_V1.md`](dist/handoff/RESTOK_DESIGN_SYSTEM_V1.md)

**Tokens de referência:** [`dist/handoff/tokens.v1.json`](dist/handoff/tokens.v1.json)

**Prompt do agente:** [`dist/handoff/PROMPT_AGENTE_AUDITORIA_ROADMAP.md`](dist/handoff/PROMPT_AGENTE_AUDITORIA_ROADMAP.md)
**Preview:** [`dist/index.html`](dist/index.html)

## Decisão visual

| Papel | Hex |
|---|---|
| Marca/card de gasto | `#213F1D` |
| Ação | `#2D5A27` |
| Acento Eucalipto | `#B4D3A7` |
| Informação | `#4F7566` |
| Canvas | `#F7FAF5` |
| Superfície | `#FFFFFF` |
| Texto | `#18251A` |
| Borda | `#E1E9DE` |

**Fonte:** Nexa apenas com licença e arquivos válidos; Manrope como fallback efetivo. **Composição:** lista como núcleo da compra, card de gasto como principal superfície de destaque, mobile ergonômico e desktop em colunas quando útil. Motion serve ao feedback e respeita reduced motion.

## Regra de migração

**Este arquivo substitui as instruções visuais anteriores da demo.** Os documentos antigos permanecem recuperáveis no histórico do repositório, mas não são diretrizes ativas. As folhas CSS de rodadas anteriores usadas pela demo são somente implementação histórica de uma comparação, não base para produção.

No repositório real, o próximo agente deverá **inventariar e planejar a remoção de todas as instruções e estilos visuais legados**, reconstruindo documentação, tokens e componentes do zero. **Nesta etapa ele não apagará arquivos nem modificará o aplicativo:** entregará a matriz exata de substituições, roadmap em fases, testes e rollback para aprovação.

Documentação factual de produto, segurança, dados, integrações e instruções de trabalho necessárias não deve ser removida indiscriminadamente. `PRODUCT.md` e o repositório real determinam as funcionalidades que devem ser preservadas.
