# Auditoria Mobile First

**Data:** 30/09/2026 · **Prioridade de produto:** smartphone no mercado.  
**Escopo:** inspeção estática de estilos/componentes e percurso real em cópia demo local.

## Método e limites

O projeto não inclui Playwright nem configuração de viewport/E2E. O navegador in-app foi usado para observar landing, login/signup, compra, editor, Casa e rolagem numa cópia temporária sem `.env` (modo demo). Screenshot da compra foi observado em viewport estreito de aproximadamente **525 × 852 CSS px**. Não houve emulação visual dos tamanhos solicitados nem dispositivo físico; a coluna “código” abaixo significa análise dos breakpoints, não screenshot em runtime. Não foram submetidos formulários de auth.

Legenda: **R** = visto em runtime (~525px); **C** = inferido por CSS/DOM; **NR** = não executado naquele viewport.

| Tela/fluxo | 320 | 360 | 375 | 390 | 412 | 430 | Tablet 768 | 1024 | 1440 | Problemas observados |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Landing `/` | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | Links do nav são escondidos até 800px; botão menu mobile não tem handler. Hero/menu requer verificação visual real nas larguras. |
| Login/cadastro | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | Formulário único empilhado em <=800; sem onboarding familiar; demo link não funciona como demo se Supabase configurado. Autofill só foi avaliado no DOM. |
| Compra (lista ativa) | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | **R em ~525:** barra fixa encobre último item no scroll máximo. Lista longa, filtros horizontais, ações de status via editor. |
| Editor / adicionar item | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | **R em ~525:** bottom sheet de até 92dvh e scroll interno; autoFocus no input pode abrir teclado e reduzir espaço; foco não é confinado. |
| Nova compra | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | Sheet largo vira largura total mobile; lista de produtos tem max-height 42vh. Seleção de muitos itens no teclado/tela pequena precisa device check. |
| Histórico / detalhe | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | Linhas usam truncamento e preço em coluna; não executado visualmente. |
| Casa / produtos | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | C/NR | **R em ~525:** telas funcionam no nav; muitas linhas longas e controles editar/desativar. Header de household é hardcoded e não existe roster de membros. |

Os breakpoints mais relevantes são `max-width:800px` na landing/login e Tailwind `sm` em 640px para sidebar/nav da aplicação. Entre 320–430, body declara `min-width:320px`; ajustes específicos de landing/login vão até 430px. Em 768px a app sai da navegação inferior e usa sidebar, embora o espaço principal fique relativamente estreito. A validação detalhada de 320–430 permanece pendente em navegador com viewport controlável.

## Percurso real e compra

Percurso feito na cópia demo: `/app` → observar lista, preço/orçamento e navegação inferior → abrir editor de produto → fechar → abrir Casa → voltar à Compra → rolar até o fim. Não alterei itens nem dados do projeto remoto. Foram observados 44 itens e categorias expansíveis.

### Problemas por tela

- **Compra: reachability bloqueada.** A `main` recebe `pb-24` (96px), enquanto o sumário fixo e a bottom nav ocupam juntos mais espaço que isso. Ao rolar até o limite, a barra “44 pendentes / Continuar compra” cobre a parte final da lista; na captura do percurso, “Sabão Liquido…” é o último item exposto e a categoria indica mais um item. Ver `components/restok-app.tsx:651,663-664`.
- **Compra: ação primária profunda.** A linha do item inteiro abre o editor; só “Já temos” é ação direta. Para confirmar compra com preço: abrir item, escolher “Comprado”, inserir/confirmar preço, salvar. Isso é 3+ toques e teclado enquanto se anda. Filtros têm 40px de altura, abaixo do target recomendado de 44px.
- **Compra: status e preço discordam.** Editor diz “Ao informar um preço, o item vira comprado”, mas a situação inicia como `pending` e permanece assim se salvar sem selecionar `Comprado` (UX-001).
- **Compra: resumo fixo ocupa grande área.** Orçamento fica no alto e a barra de pendências/total/ação no rodapé, junto da nav e FAB. Em altura baixa, sobra pouca área útil para itens; no teclado aberto a colisão cresce.
- **Sheet: modal e teclado.** O sheet tem `max-height:92dvh`, `overflow-y:auto` e safe area inferior — boa base. `autoFocus` em preço/nome abre teclado imediatamente; falta modo de teclado visual testado e gestão de foco modal (trap/restauração/Escape).
- **Casa: identidade falsa.** “Casa Gabriel & Brunna” e “GB” aparecem estáticos para todo usuário, e o botão Perfil não é funcional. Compartilhar não mostra membros/convites e não tem gestão de acesso.
- **Landing: navegação mobile ausente.** Até 800px links “Como funciona” e “Para a casa” somem; “Abrir menu” aparece sem evento. Os CTAs ainda permitem chegar ao login.
- **Login:** uma coluna, campos com `autocomplete` de nome/email/senha e inputs associados a labels. Cadastro pede 3 campos; inclui nome, que é útil, mas copy “conta da casa” implica entidade que não é criada no formulário. Erros usam `role=alert`; não há teste de teclado virtual ou autofill real.
- **Histórico:** sem busca/filtro demonstrado e ainda não observado em viewport; por arquitetura, lista longa cresce inteira no DOM.

## Navigation

Compra/Histórico/Casa é bottom navigation fixa no mobile (alvos de 48px de altura e min-width 80px); adequada ao polegar em geral. No desktop, a mesma navegação vira sidebar. O active state é só visual; `aria-current`/`aria-pressed` não anuncia aba selecionada. Não há menu de conta, troca de household nem logout.

## Forms

- Labels e `autoComplete` corretos para nome/email/password; email usa `type=email`, senha tem `minLength=6` e signup usa `new-password`.
- Não há campo de confirmação de senha, fluxo pode ser conciso; validação server provider ainda precisa ser complementada com mensagens curtas e não enumeráveis.
- Preço/quantidade/orçamento usam inputMode `decimal`/`numeric`; inputs de valor aceitam texto parcialmente e fazem parse por remoção de caracteres. Valor com separador de milhar pt-BR como `1.234,50` pode virar inválido. `quantity` não permite campo vazio durante edição.
- Erros do Supabase são exibidos como texto bruto. Operações não possuem timeout/loading global consistente. Botão de submit muda texto, mas a chamada sem try/finally pode manter loading caso uma Promise rejeite.
- “Lembrar email” grava email em localStorage; padrão selecionado. Cache de lista também fica persistido localmente.

## Lists, modals e dialogs

- Busca, filtros e disclosure de categoria ajudam a reduzir conjunto visível; filtro horizontal esconde parte do overflow sem barra visível.
- Linhas com nome longo truncam; editor permite nome/categoria em “Mais detalhes”.
- Sheet é bottom sheet no mobile com hit-area de fechar 44px, scroll e padding safe-area. Sem `<dialog>` ou primitive acessível, sem focus trap/restore/escape.
- Finalizar compra tem confirmação e alerta pendências. Marcar “já temos” é imediato sem undo ou confirmação; feedback toast expira em 2,6 s. Reverter exige abrir editor.
- FAB de adicionar fica acima da barra; sobreposição com resumo é visível na captura, embora o botão permaneça tocável. `z-index`/área segura merecem teste em telas com browser chrome e teclado.

## Touch targets

Pontos bons: navegação tem 48px; botões genéricos usam `min-h-11` (44px); linha de item tem 78px; botões de fechar sheet são 44px; steppers são 40px por botão.

Pontos a revisar: filtros 40px; ação Já temos 40×40; stepper 40×40; botão revelar senha 32×32; botão perfil 40×40; edição de orçamento 28px min-height; controles de desativar parecem texto e não têm área/padding clara. Os alvos menores importam com mãos ocupadas e movimento. As linhas têm áreas amplas para editar, mas o alvo não é um toggle rápido para comprado.

## Typography and spacing

Sans legível no app, título 25–30px, row text 15px, metadados 12px. `truncate` previne overflow mas oculta parte do nome/produto; categoria usa nome/código visual. A landing usa heading 48px até 430px, que ocupa bastante dobra. Em 320px avaliar quebra de heading e CTA. Contraste visual dos estados combina texto/ícone/cor, não apenas cor.

## Keyboard, scrolling e safe areas

- `viewportFit: cover`, `100dvh` e `env(safe-area-inset-bottom)` estão presentes em body/nav/sheet.
- `main` tem padding inferior insuficiente para duas superfícies fixas (MOBILE-001).
- Header de app é `sticky`; nav/summary/FAB fixos. Usar teclado pode cobrir inputs ou reduzir modal; não houve device keyboard visual test.
- Lista inteira rola no documento, categorias podem colapsar. Lista longa usa render de todos os itens (44 atualmente), sem virtualização; aceitável no volume atual, monitorar crescimento.
- Não foram testados notch físico, orientação landscape, zoom 200%, teclado aberto em iOS/Android, scroll chaining nem touch no Safari/Chrome real.

## Performance e conexão fraca

Build local: `/app` First Load JS 185 kB, landing 106 kB; sem imagem pesada identificada, lista seed 44 produtos. O gargalo mais provável é carga inicial e gravação remota repetitiva, não render das 44 linhas: cada item novo chama `getUser`, busca membership e categorias novamente. Writes otimistas não mostram falha/retry/pendente; cache local pode encobrir falha ou vazar entre contas. Sem service worker, fila offline ou sincronização de reconciliação.

## Recomendações de produto mobile

1. Corrigir espaço de scroll antes de qualquer polish visual.
2. Uma ação direta e reversível de compra por linha, com preço opcional/rápido; reduzir dependência de abrir sheet e teclado.
3. Manter resumo compacto e configurável; evitar cobrir o próximo item e preservar safe areas/teclado.
4. Exibir estado de sincronização e permitir retry quando sem rede; definir que operações podem ser marcadas offline.
5. Fazer household/membro/conta visíveis no app; implementar menu de perfil com logout e troca de casa.
6. Atingir targets de ao menos 44px, estados anunciados e sheet acessível.
7. Repetir matriz completa em 320, 360, 375, 390, 412, 430, 768, 1024 e 1440 com browser configurável; medir também landscape, zoom e teclado.

