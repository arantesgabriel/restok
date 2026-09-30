# Fase 7 — baseline de performance

**Data:** 30/09/2026  
**Fonte:** `npm run build` no workspace, com Next.js 15.5.25.

## Bundle de produção

| Rota | Tipo | Tamanho da rota | First Load JS |
| --- | --- | ---: | ---: |
| `/app` | Renderizada sob demanda | 23,8 kB | 193 kB |
| JavaScript compartilhado | — | — | 103 kB |

**Orçamento inicial para `/app`:** manter o First Load JS em até 193 kB durante esta fase. Qualquer aumento deve vir acompanhado de medição que justifique o custo.

Esse número é uma medida do bundle gerado, não representa LCP, INP ou CLS em um celular real.

## Medições ainda necessárias

- Medir LCP, INP e CLS no percentil 75 em um celular de referência e registrar aparelho, navegador e condições de rede antes de definir metas de campo.
- Executar `EXPLAIN ANALYZE` em staging para as consultas reais de lista ativa e itens por `shopping_list_id`; comparar planos antes de adicionar índices.
- Exercitar uma lista longa no aparelho de referência. Só considerar virtualização se a medição mostrar custo perceptível.

Essas medições não foram feitas nesta etapa: não há resultado de staging nem amostra de dispositivo móvel neste workspace. Nenhum índice ou mecanismo de telemetria foi adicionado sem essas evidências.
