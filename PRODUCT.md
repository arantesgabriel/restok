# RESTOK

## Register

product

## Platform

web

## Product context

RESTOK é uma lista de compras compartilhada para duas pessoas que cuidam da mesma casa. O momento crítico é dentro do supermercado: alguém está andando com uma mão no carrinho, sob luz forte e com pouco tempo para parar. A interface deve tornar o próximo toque óbvio, manter o total visível e preservar o contexto entre uma compra e outra.

O valor do produto é o ciclo completo: itens que acabam, uma lista recorrente, a compra, preços reais, colaboração e uma casa novamente abastecida. O MVP evita administração pesada e privilegia o modo mercado.

## Strategic principles

- velocidade e legibilidade antes de densidade decorativa;
- ações essenciais com alvos de toque grandes e próximas ao polegar;
- preço informado vira compra registrada, mas qualquer item continua editável;
- “já temos” resolve a pendência sem inflar o total;
- histórico guarda contexto para a próxima compra sem virar dashboard;
- local-first mantém o fluxo explorável, enquanto Supabase fornece persistência, autenticação e colaboração em produção.

## Accessibility & Inclusion

WCAG AA como alvo. Labels e foco visível são obrigatórios; a cor não é o único indicador de status; tamanhos mobile devem funcionar de 360px a 430px; motion reduz com `prefers-reduced-motion`.
