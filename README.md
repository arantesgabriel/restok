# RESTOK

MVP mobile-first para organizar a lista recorrente da casa e acompanhar a compra dentro do mercado.

## Stack

- Next.js + App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS e Realtime (quando configurado)
- Vitest

## Setup local

```bash
npm install
npm run dev
```

Configure o Supabase para acessar a interface principal com uma conta autenticada. Sem configuração, o login informa a indisponibilidade; nenhum catálogo ou compra fictícia é criado.

## Supabase

1. Crie um projeto Supabase.
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave anon pública.
3. Execute as migrations de `supabase/migrations/` em ordem de nome no SQL Editor. A migration de 01/10/2026 permite identificar pessoas dentro da casa compartilhada.
4. Em Authentication > Providers, mantenha Email habilitado e defina se a confirmação de email será obrigatória.
5. Para o login por email e senha, não é necessário configurar Google OAuth ou Magic Link.

O SQL cria profiles, households, membros, categorias, produtos, compras, itens, índices de histórico de preço, RLS e a publicação Realtime dos itens da compra.

## Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Não use service role key no navegador ou em variáveis `NEXT_PUBLIC_*`.

## Rodar migrations

Use o SQL Editor do Supabase ou o Supabase CLI apontando para o projeto. O catálogo começa vazio. Fixtures em `tests/fixtures/shopping.ts` são usadas exclusivamente pelos testes.

## Deploy Vercel

Importe o repositório na Vercel, defina as duas variáveis públicas no ambiente de produção e atualize as URLs de redirect do Supabase para o domínio publicado. O projeto não depende de filesystem persistente.

## Principais rotas

- `/` — landing page
- `/login` — criação de conta e login com email e senha
- `/app` — modo mercado, histórico e produtos da casa
- `/auth/callback` — retorno da autenticação Supabase

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
