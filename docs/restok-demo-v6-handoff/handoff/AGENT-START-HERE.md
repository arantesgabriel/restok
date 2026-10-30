# Codex — implementação fiel ao Restok demonstrado

## Missão

Replicar a aparência e os componentes da demonstração **versão 6**, mantendo funcionalidade, autenticação, Supabase/RLS, dados, histórico, pessoas, permissões e testes do repositório real.

## Entradas obrigatórias

1. `original/dist/handoff/RESTOK_DESIGN_SYSTEM_V1.md` e `tokens.v1.json` (canônicos).
2. `original/dist/index.html` + `r2.js` + todos os CSS (implementação histórica da prévia).
3. `fixtures/demo-seed.json` + `initial-state.json` (dados estáveis, não produção).
4. `responsive/viewports.json` (320, 390, 1440 e 1920 derivado).
5. Código, regras de negócio, segurança e componentes do produto real.

## Restrições

- Não incluir hero, controles de viewport, notas ou moldura do laboratório no produto.
- Não usar CSS legado da prévia como tema global; criar tokens e componentes semânticos nativos no stack real.
- Não carregar paletas rejeitadas nem aliases `lime`/`blue` como tokens finais.
- Usar Manrope enquanto Nexa licenciada e master vetorial não estiverem disponíveis.
- **Decisão posterior prevalente:** sem header global redundante no desktop; sidebar lateral concentra navegação/informações; mobile com navegação compacta, traços finos e densidade moderna.
- Não inventar 1920 como breakpoint original; validar a tela real nessa resolução.
- Não publicar nem modificar a demonstração original.

## Primeira execução — SOMENTE diagnóstico

Inventariar componentes e estilos reais, mapear telas, analisar conflitos e criar um plano por fases: App Shell → componentes → telas core → interações → QA. Preservar comportamento real. **Parar e aguardar aprovação antes de refatorar.**

## Ciclo obrigatório após aprovação

Implementar um componente → fixar mesma fixture/viewport/estado → comparar screenshots original × local → corrigir fonte, spacing, alinhamento, bordas e pesos → validar funcionamento e teclado → apresentar evidências → aguardar aprovação para avançar.

Cobertura mínima: Compra, Produtos da casa, Histórico e Casas/Pessoas; filtros, busca, itens marcados/Já temos, orçamento, detalhes, troca de casa, modais e vazios.

O protótipo é uma **referência visual e de dados fictícios**, não uma substituição das especificações do aplicativo real.
