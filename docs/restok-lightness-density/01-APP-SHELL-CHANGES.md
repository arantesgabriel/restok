# R4.1 · App Shell

| Arquivo | Alteração e motivo |
|---|---|
| components/app/app-shell.module.css | Sidebar176px desde768,224px desde1200; header52px; workspace máximo1376px; conteúdo1040px; contexto272px desde1440. Removida expansão ilimitada acima1600. Avatar44px de toque. |
| components/app/app-shell.tsx | Header desktop informa casa ativa, sem repetir o destino consecutivamente. |
| components/app/navigation.module.css | Mobile60px com indicador2px e sem bloco preenchido; desktop40px e superfície de seleção discreta. |
| components/app/navigation.tsx | Ícones20px/stroke1.75 e label separado; aria-current preservado. |
| components/app/house-switcher.tsx | Mesmo handler/aria-label, botão quiet, sem label redundante Casa ativa. |

Não foi necessário introduzir rail icon-only: sidebar compacta de176px mantém destinos e nome de casa legíveis em768/992. Nomes extensos quebram sem truncar a identidade da casa. Foco, permissões e persistência continuam nas implementações existentes.

Header/CTA/dock conservam alvos44px. Safe-area top/bottom e detecção de teclado existentes preservadas. Casa e Histórico só receberam o shell compartilhado; seus componentes não foram refatorados nesta rodada.

