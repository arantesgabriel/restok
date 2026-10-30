# PR15 — limpeza final e pacote de aprovação

29/10/2026 · Base `d94c9aa` (PR14). Candidato local **restok-raiz-eucalipto-rc.1**, identificado pelo commit deste relatório. Sem tag, push, publicação ou mudança da versão em package.json.

## Resultado

Retirada final dos assets antigos da distribuição pública e encerramento da autoridade normativa dos planos visuais anteriores. A interface segue DESIGN.md e RESTOK_DESIGN_SYSTEM_V1.md. PRODUCT mantém o domínio e passa a registrar a assinatura aprovada e o master pendente.

| Alvo revisado | Destino e motivo |
| --- | --- |
| public/fonts/geist-latin.woff2 | tests/e2e/legacy/assets; reprodução histórica, sem consumidor de produção |
| public/fonts/Geist-OFL.txt | Mesmo arquivo junto à fonte; obrigação legal preservada |
| public/landing/pantry-leaves.svg | Arquivo histórico fora de public, sem consumidor |
| CSS histórico | URL da fonte relativa ao arquivo arquivado; harness Vite preservado |
| Planos de landing e Visual System Fase2 | Aviso de supersessão, conteúdo e evidências anteriores preservados |
| public/brand/restok-logo.png | Mantido: consumidor ativo e fallback aprovado; master vetorial pendente |
| Manrope/OFL, brand, auditorias e testes históricos | Mantidos por uso ativo, responsabilidade legal ou rastreabilidade |

Os três assets arquivados têm conteúdo idêntico ao Git da base; diferenças de CRLF da cópia Windows foram normalizadas para os bytes originais. A auditoria em evidence/pr15/retirement-audit.json registra hashes e busca em fontes de produção. Não há imports históricos, Geist, folhas ou aliases monetários/cores antigos nos fontes inspecionados. Não é uma prova universal de ausência de todo defeito visual.

## QA do candidato

- 228/228 testes em39 arquivos; lint sem warnings, TypeScript sem incremental e build Webpack aprovados. Avisos existentes de convenção middleware e configuração CommonJS do Vitest continuam fora desta limpeza.
- Nenhum componente, estilo ativo, domínio, autenticação, SQL, RPC ou política de segurança foi alterado. Nenhuma gravação remota. Arquivos preexistentes do usuário permanecem fora do commit.
- Evidência renderizada herdada explicitamente do [PR14](18-PR14-REPORT.md): antes/depois em seis dimensões, valores extremos, teclado/menu/âncoras, demos locais, vídeo com cinco seeks e smoke de login. Não houve nova captura ou nova execução integrada no PR15, pois a limpeza não muda consumidores visuais. Os testes e o build acima foram executados novamente.
- Referência de orçamento: PR14 mediu o grafo público em28213 bytes gzip e todos os JS/CSS emitidos em416251. Esta limpeza de assets sem import não promete melhora de primeiro acesso, CWV ou performance de campo.

## Gates de aprovação e release

| Gate | Estado e evidência necessária |
| --- | --- |
| Implementações01–15 e retirada de legado ativo | Unidades locais concluídas, com limites de cada relatório; não substitui revisão humana |
| Email11 | Usuário confirmou cadastro, troca de senha e novo login; não atribuir execução ao agente |
| Marca final | Aberto: fornecer master vetorial aprovado; PNG transitório permanece |
| Evidências adiadas04–05/07 e revisão cruzada12–13 | Abertas conforme relatórios anteriores; vídeo14 não encerra esses cenários |
| Leitor real, zoom/texto nativo, touch e dispositivos | Abertos: NVDA/VoiceOver, Safari/iPhone e Android físico; registrar resultados ou decisão explícita de risco pelo responsável |
| Navegação sem JS em navegador | HTML SSR inspecionado14; sessão real JS-off pendente |
| Concorrência, expiração natural, engines e CWV | Cobertura parcial anterior; concluir os cenários remanescentes ou documentar aceite explícito de risco |
| Publicação | Não autorizada nem executada; depende dos gates e decisão humana separada |

O pacote está pronto para revisão local. A release não está aprovada. Não há dispensa implícita por encerrar o último PR do roteiro. Responsável pela aprovação: usuário/mantenedor; não foi inventado prazo ou aceite.

## Rollback

Reverter somente o commit PR15 restaura os paths públicos e as referências documentais anteriores. Validar imports, harness e build. Não restaurar globals antigos sobre a interface nova, não reverter migrations nem alterar dados, contas, permissões ou IDs. PR14 e os demais commits continuam unidades separadas. Não executar rollback automaticamente.
