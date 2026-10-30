# Ajuste da ilha e do card de ações

30/10/2026. Correção solicitada pelo usuário: a ilha anterior abaixo do card de
ações produzia uma composição estranha. A navegação deve ficar acima e a seção
ativa precisa continuar destacada durante a rolagem.

O rodapé agora tem um único contêiner fixo, com a ilha primeiro e o card de ações
abaixo, separados por 8px. O card recebe borda e cantos do sistema, margens de
12px e safe area. A ilha continua compactando/expandindo e mantém um círculo
verde no ícone ativo quando os rótulos estão recolhidos. `aria-current` permanece
preservado nas duas apresentações.

Um ResizeObserver mede o conjunto inteiro para reservar o espaço do conteúdo,
inclusive quando a descrição do card ocupa mais linhas. A última linha continua
acima da ilha. Desktop preservado.

Validação: 13 testes de shell/navegação/integração, ESLint e TypeScript passaram.
46 verificações no Chromium passaram: ordem e separação dos elementos, última
linha, seleção de Compra/Casa durante scroll, toque nativo, rolagem nos dois
sentidos, movimento reduzido e header mobile. Capturas em 320, 390 e 768px,
com verificação do desktop em 1440px, em `evidence/`.
