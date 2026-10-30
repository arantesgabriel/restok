# Rodada 4 · Baseline

Branch: codex/restok-raiz-eucalipto-bloco-1. HEAD e4de8bc. Working tree já modificado; patch e status anteriores preservados em evidence/. Nenhum reset, commit, push ou deploy.

Interface B (operação doméstica), Next/React, CSS Modules, Manrope local, V3/M2/D7. Trabalho: tornar a lista escaneável no mercado e controlar sua geometria no desktop. Design system: docs/design/RESTOK_DESIGN_SYSTEM_V1.md, styles/tokens.css e DESIGN.md.

Baseline: 14 screenshots reais de componentes em Edge, fixtures isoladas, sete viewports CSS medidos. Em 1920 o card chega a 1352px e 171px de altura; o painel vazio repete zeros e oferece finalizar. Mobile tem seletor com aparência de input e seleção inferior em retângulo amplo. Em 992 ainda há bottom navigation.

Contratos preservados: auth/sessão; casa ativa e permissões; chamadas Supabase/realtime; listTotal/listResolved; preço ausente diferente de zero; filtros e ordenação; confirmação com pendências; browser back; foco e fechamento de overlays. Alterações somente de apresentação. Serviços e modelos não serão editados.

Handoff remoto Markdown bloqueado pelo navegador; cópia local lida integralmente. JSON remoto lido integralmente. Preservar radius orçamento18/controle8, progresso5–6px e pesos600–700 em ações/labels apesar dos alvos diferentes do prompt. Sidebar224px está na interseção das faixas. Escala de títulos24/32px do handoff prevalece sobre28px sugerido.

Histórico: commits PR01–15 disponíveis; PR13 migra cascata, PR14 landing, PR15 assets. Modificações anteriores locais da Compra são a baseline, não serão revertidas. Harness Vite existente não carrega env, usa auth/dados locais; não certifica integração Supabase.
