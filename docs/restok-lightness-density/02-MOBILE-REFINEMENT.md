# R4.2 · Compra mobile

Orçamento normal133px, padding16px, valor32px/700, disponível20px/600, radius18px, progresso5px. Hierarquia compactada por line-height e proximidade; botão Editar meta sem contorno, com alvo44px. Valores tabulares e cálculos intactos.

Busca mantém campo16px e toque44px; Organizar passa a ação sem caixa; tabs mantêm underline2px e semântica aria-pressed. Nome de linha14px/500, metadados12px. Título24px/700 preserva escala e pesos explícitos do handoff.

Lista vazia: CTA primário no empty state; adicionar do header fica oculto; dock e contexto não montam. Finalização continua no menu e abre a confirmação existente. Lista com dados: adicionar no dock mobile e no header desktop; atalho de pendências/finalização continua chamando handlers existentes.

components/restok-app.tsx só condiciona apresentação por items.length; components/shopping/shopping-view.tsx identifica estado vazio e escolhe ênfase do botão. Regras de conclusão e persistência não mudaram.

Em320×640, fixture33 mostra uma linha inteira acima do dock. Em390×844, quatro. Com nome/preço extremo o card pode crescer e requerer rolagem; não se usa altura fixa para cortar conteúdo.


Refino após inspeção de stress: total extremo no dock quebra com overflow-wrap:anywhere dentro da sua coluna, sem avançar sob Adicionar item.
