# Supabase authorization integration suite

This suite sends requests through PostgREST using the public anon key and three
pre-created, email-confirmed test users. It creates fresh household fixtures as
A and B and adds C to A through the invite RPC. It covers cross-house reads and
writes, direct membership and role forgery, owner/admin/member permissions,
single-use invitations, last-owner protection, and idempotent list creation.
Fixture rows remain in the target, so reset the local project between runs.

Set these environment variables before running `npm run test:supabase`:

- `RESTOK_TEST_PROJECT_KIND=disposable`
- `RESTOK_TEST_SUPABASE_URL`
- `RESTOK_TEST_SUPABASE_ANON_KEY`
- `RESTOK_TEST_USER_A_EMAIL` / `RESTOK_TEST_USER_A_PASSWORD`
- `RESTOK_TEST_USER_B_EMAIL` / `RESTOK_TEST_USER_B_PASSWORD`
- `RESTOK_TEST_USER_C_EMAIL` / `RESTOK_TEST_USER_C_PASSWORD`

The suite refuses to run without the explicit disposable-target marker and
refuses any URL that is not `localhost`, `127.0.0.1`, or `::1`. It also refuses
to target the same URL as `NEXT_PUBLIC_SUPABASE_URL`. Assertions use only the
anon key; the suite does not use a service-role key. The A/B/C accounts must be
provisioned in the local Supabase Auth instance before execution. Apply the
repository migrations to that instance before running the suite.

The workspace currently has no Supabase CLI config, so the disposable local
project must be initialized before this command can run. Do not point these
fixture-creating tests at a hosted or production project.
