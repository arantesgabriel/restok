# Decisões de produto — Fase 2

**Data:** 30/09/2026

## Casas

- Uma conta pode participar de várias casas.
- A casa ativa é escolhida pelo usuário e salva no navegador, separada por conta.
- A criação de uma casa e de seu primeiro proprietário ocorre na mesma transação.
- `households.created_by` registra quem iniciou o cadastro. A autorização vem do papel da membership.

## Papéis

- **Owner:** gerencia administradores e membros, cria/revoga convites, transfere a propriedade e remove membros não proprietários.
- **Admin:** cria/revoga convites e remove membros; não promove pessoas nem altera/remove proprietários.
- **Member:** usa os dados da casa e pode sair dela.
- Mudanças de proprietário passam por transferência explícita. Quem transfere passa a admin.
- O último proprietário não pode sair nem ser removido. A casa deve transferir a propriedade primeiro.

## Convites

- Um token continua válido por 14 dias e só pode ser aceito uma vez.
- Cada casa pode ter até 10 convites ativos ao mesmo tempo.
- Um token antigo continua válido até expirar; seu valor em texto foi convertido para hash na migration.
- Owner e admin podem criar e revogar convites.
- O token em texto só é retornado na criação e não aparece em consultas de estado.
- Aceitar um token usado, expirado ou revogado falha sem criar membership.
