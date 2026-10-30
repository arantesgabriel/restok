# R4.4 · Craft e referências

Todos os valores de cor usam os tokens semânticos existentes. A fonte Manrope local e o ponto do logotipo foram preservados. Sem dependência nova, gradiente, blur, sombra decorativa ou !important.

Duração de hover/focus140ms e progresso220ms por transform, usando styles/motion.css. Reduced motion resulta em0s, medido em quatro larguras. Sem count-up, bounce ou springs. Scanners motion-lint: zero achados. Anti-Webslop: aviso sobre faixa de alerta e informação sobre grid de três contagens em purchase-sheets.module.css preexistente; ambos representam estado/dados reais e ficaram intactos.

## Fontes e decisões

- [Referência Restok](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/): inspecionada no navegador, mobile, desktop, editor de meta, Casa e Histórico. Hierarquia financeira e listas orientam a implementação, sem copiar sua cascata.
- [Tokens remotos](https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/handoff/tokens.v1.json): lidos integralmente no navegador, coincidem com paleta/spacing/radius atuais. Markdown remoto bloqueado; docs/design/RESTOK_DESIGN_SYSTEM_V1.md lido integralmente como fallback autorizado.
- [Linear 2026](https://linear.app/now/behind-the-latest-design-refresh), [processo 2024](https://linear.app/now/how-we-redesigned-the-linear-ui), [changelog desktop](https://linear.app/changelog/2026-03-12-ui-refresh): navegação subordinada, alinhamento entre regiões, contexto separado da tarefa. Aplicação: sidebar discreta, header52px, largura controlada.
- [Linear Mobile](https://linear.app/changelog/2025-10-16-mobile-app-redesign): acesso persistente aos destinos. Aplicação: três destinos estáveis, ações da compra separadas; efeito de vidro não adotado.
- [Things](https://culturedcode.com/things/features/) e [OS26](https://culturedcode.com/things/blog/2025/09/things-for-os-26/): informação acessória recuada e adaptação de janelas. Aplicação: texto de linha500, controles secundários quiet e sidebar intermediária. Glass/escala não adotados.
- [Visor](https://visorfinance.app/): página consultada; lente aplicada à leitura de valores principal/secundário, sem reproduzir dashboards ou decoração.
- [AbacatePay](https://www.abacatepay.com/) e [caso Otther](https://otther.co/works/abacate-pay): lista operacional e estados antes de decoração; cor objetiva. Aplicação: menos contornos, lista protagonista e fixtures de falha.
- Apple HIG [tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars), [sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars), [toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars): URLs consultadas retornaram página JS; links Markdown não puderam ser extraídos pela ferramenta e fetch local falhou DNS. Não certificamos leitura integral dessas referências. Toque44px, safe-area e separação navegação/ações têm fundamento direto no handoff local e no pedido.

Anti-Webslop e Visant Killer já estavam instaladas. UI Craft Loop, Visant Frontend/Motion complementaram a revisão. Não foram instalados componentes ou skills. Auditoria classificada T2/B por região: shell e Compra. Não carregadas lentes de receita/marketing: não se aplica à operação doméstica. A biblioteca documental foi consultada, sem aplicar efeitos documentais nesta superfície.

