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

Sem variáveis de ambiente, o app abre em modo demonstração local com a seed baseada na planilha `Compras Brunnel.xlsx`. O estado é salvo no `localStorage` para permitir testar o fluxo completo sem criar um projeto Supabase.

## Supabase

1. Crie um projeto Supabase.
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave anon pública.
3. Execute `supabase/migrations/20260901000000_initial_schema.sql` no SQL Editor.
4. Em Authentication > Providers, mantenha Email habilitado e defina se a confirmação de email será obrigatória.
5. Para o login por email e senha, não é necessário configurar Google OAuth ou Magic Link.

O SQL cria profiles, households, membros, categorias, produtos, compras, itens, índices de histórico de preço, RLS e a publicação Realtime dos itens da compra. A tela também pode continuar sendo explorada em modo demonstração quando as credenciais ainda não estão disponíveis.

## Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Não use service role key no navegador ou em variáveis `NEXT_PUBLIC_*`.

## Rodar migrations

Use o SQL Editor do Supabase ou o Supabase CLI apontando para o projeto. A migration não depende da planilha em runtime; os nomes e quantidades de referência estão em `lib/seed.ts`.

## Deploy Vercel

Importe o repositório na Vercel, defina as duas variáveis públicas no ambiente de produção e atualize as URLs de redirect do Supabase para o domínio publicado. O projeto não depende de filesystem persistente.

## Principais rotas

- `/` — landing page
- `/login` — criação de conta e login com email e senha, além da entrada de demonstração
- `/app` — modo mercado, histórico e produtos da casa
- `/auth/callback` — retorno da autenticação Supabase

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
