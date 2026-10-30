# Restok — demonstração completa v6

Pacote de referência visual para implementação do Restok.

**Origem:** https://restok-casa-contemporanea-rodada25.lemonypark35.chatgpt.site/  
**Site versionado:** 6  
**Commit integral:** `f0214b71d9497caa62ccaa3b804579f7cd757959`  
**Direção:** Raiz & Eucalipto.

## Conteúdo

- `original/`: **todos os arquivos rastreados do código-fonte publicado**, sem alterações (HTML, CSS, JavaScript, Design System, handoff, tokens, manifesto). Sem `.git` ou credenciais.
- `fixtures/demo-seed.json`: cópia estruturada dos **dados reais da demonstração**, extraídos de `original/dist/r2.js` (duas casas, orçamento, itens, catálogo, membros, histórico, metadados e paleta). São fictícios, não dados de produção.
- `fixtures/initial-state.json`: estado inicial da interface e chave de seleção de casa.
- `fixtures/scenarios.json`: casos de QA baseados nas fixtures e casos adicionais explicitamente marcados como sintéticos.
- `responsive/viewports.json`: dimensões e medidas para 320, 390, 1440 e cenário derivado 1920.
- `responsive/RESPONSIVE-SPEC.md`: explicação técnica dos modos, breakpoints e limitações.
- `handoff/AGENT-START-HERE.md`: instruções para o agente implementar sem desvirtuar o design ou as regras do produto.
- `scripts/extract-fixtures.mjs`: reextrai os dados completos do JavaScript original com Node 24+.

## Prévia local

```bash
cd original/dist
python3 -m http.server 8765
```

Abra `http://localhost:8765/`. Os botões originais alternam 320×640, 390×844 e 1440×900. A página inclui uma **moldura de laboratório** com notas e opções de comparação: essa moldura não deve ser implementada no produto.

## Limites que o agente precisa conhecer

1. O projeto original é **HTML/CSS/JavaScript estático**, não Next.js. Não contém Supabase, Auth, banco, RLS, API ou testes funcionais de produção.
2. Os dados são declarados em `r2.js`; alterações interativas são simuladas em memória. Apenas a casa selecionada persiste em `localStorage` (`restok-r25-active-house`).
3. O seletor da demonstração **não tem modo 1920**. 1920×1080 é QA derivado do desktop, não um breakpoint oficial.
4. A fonte renderizada é **Manrope** obtida via Google Fonts. Nexa é preferencial somente com licença/arquivos; **não está incluída**. Também não há master SVG da marca.
5. A cascata de CSS contém aliases e estilos históricos para preservar o funcionamento do protótipo. São necessários para reproduzir **a prévia**, mas **não devem ser copiados integralmente ao aplicativo real**.
6. O Design System aprovado está em `original/dist/handoff/RESTOK_DESIGN_SYSTEM_V1.md` e `tokens.v1.json`. Regras reais de produto prevalecem sobre demonstrações.
7. Decisões posteriores do usuário prevalecem sobre o header antigo da demo: **sidebar desktop como centro da navegação, sem header superior global redundante; mobile enxuto, ícones e traços leves**.

Ordem de leitura: `handoff/AGENT-START-HERE.md` → Design System → responsividade → fixtures → código original.
