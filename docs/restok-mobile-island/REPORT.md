# Navegação mobile em ilha

30/10/2026. Alteração solicitada após a refatoração das telas.

- A navegação inferior fica em uma cápsula flutuante, com os três destinos reais.
- Começa expandida, com ícones e rótulos. Rolagem do usuário nos dois sentidos
  compacta a superfície em 12% e deixa os ícones aparentes. Toque ou foco expande.
- Um único toque continua navegando; não é necessário tocar duas vezes.
- Os alvos permanecem maiores que 44px também no estado compacto. Os nomes
  acessíveis e o indicador de página atual permanecem no DOM.
- Apenas transform e opacity são animados, com os tokens existentes de 140/220ms.
  Movimento reduzido elimina a transição, mantendo a mudança de estado.
- Scroll de rotas e de dialogs não provoca compactação indevida. Listeners são
  removidos ao desmontar a navegação, inclusive quando o teclado móvel a oculta.
- O header mobile mostra o logo e o perfil. O seletor de casa foi ocultado nessa
  largura; a gestão de casas continua disponível no menu do perfil. O desktop
  mantém o seletor, a sidebar e a navbar.
- O espaço reservado ao rodapé considera a ilha flutuante e a safe area. As
  ações da compra/catálogo e a última linha continuam acessíveis.

Validação: 13 testes de shell/navegação/integração passaram; 40 verificações no
Chromium passaram, incluindo rolagem para cima/baixo, toque nativo, uma ação
por toque, ausência de overflow, alvos, dock e última linha. Capturas em 320,
390 e 768px e verificação de preservação do desktop em 1440px. ESLint e TypeScript
também foram executados. Não houve alteração em persistência ou backend.

Evidências: `evidence/validation.json`, `evidence/tests.json` e capturas
`*-expanded.png`, `*-compact.png`, `*-home.png`, `*-last-row.png`.
O adaptador permanece isolado de produção. Não foi usado aparelho físico.
