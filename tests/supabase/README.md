# Supabase authorization integration suite

This suite sends requests through PostgREST using the public anon key and three
pre-created, email-confirmed test users. It creates household fixtures as A and
B and adds C to A through the invite RPC. Fixture rows are left in the target;
run it only against a disposable Supabase project. A must own its oldest
household because invite creation selects that house; B owns its own household;
C should have no other memberships. Reruns reuse the first A/B households and
accept the same A invitation relationship idempotently.

Set these environment variables before running `npm run test:supabase`:

- `RESTOK_TEST_PROJECT_KIND=disposable`
- `RESTOK_TEST_SUPABASE_URL`
- `RESTOK_TEST_SUPABASE_ANON_KEY`
- `RESTOK_TEST_USER_A_EMAIL` / `RESTOK_TEST_USER_A_PASSWORD`
- `RESTOK_TEST_USER_B_EMAIL` / `RESTOK_TEST_USER_B_PASSWORD`
- `RESTOK_TEST_USER_C_EMAIL` / `RESTOK_TEST_USER_C_PASSWORD`

The suite refuses to run without the explicit disposable-target marker and
refuses to target the same URL as `NEXT_PUBLIC_SUPABASE_URL`. It does not use a
service-role key. The A/B/C accounts must be provisioned in the isolated test
project before execution.
