-- Somente desenvolvimento/testes. Nunca executar em producao.
-- Login: gabriel@teste.com | Senha: RestokTeste123!
-- Carregado pelo Supabase CLI conforme [db.seed] em config.toml.
-- Reexecucoes preservam a senha e os dados de uma conta ja existente.
begin;

set local search_path = public, extensions;

do $$
declare
  test_user_id uuid;
begin
  select id into test_user_id
  from auth.users
  where lower(email) = 'gabriel@teste.com';

  if test_user_id is null then
    test_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change, reauthentication_token,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000', test_user_id,
      'authenticated', 'authenticated', 'gabriel@teste.com',
      crypt('RestokTeste123!', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Gabriel Teste"}'::jsonb,
      '', '', '', '', '', '', now(), now()
    );

    insert into auth.identities (
      id, user_id, provider_id, provider, identity_data, created_at, updated_at
    ) values (
      gen_random_uuid(), test_user_id, test_user_id::text, 'email',
      jsonb_build_object(
        'sub', test_user_id::text,
        'email', 'gabriel@teste.com',
        'email_verified', true,
        'phone_verified', false
      ), now(), now()
    );
  end if;

  insert into public.profiles (id, display_name)
  values (test_user_id, 'Gabriel Teste')
  on conflict (id) do nothing;
end;
$$;

-- Segunda conta ficticia solicitada para validacao com duas sessoes.
do $$
declare
  test_user_id uuid;
begin
  select id into test_user_id
  from auth.users
  where lower(email) = 'restok-audit-b@teste.com';

  if test_user_id is null then
    test_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change, reauthentication_token,
      created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000', test_user_id,
      'authenticated', 'authenticated', 'restok-audit-b@teste.com',
      crypt('RestokTeste123!', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Auditoria Participante B"}'::jsonb,
      '', '', '', '', '', '', now(), now()
    );

    insert into auth.identities (
      id, user_id, provider_id, provider, identity_data, created_at, updated_at
    ) values (
      gen_random_uuid(), test_user_id, test_user_id::text, 'email',
      jsonb_build_object(
        'sub', test_user_id::text,
        'email', 'restok-audit-b@teste.com',
        'email_verified', true,
        'phone_verified', false
      ), now(), now()
    );
  end if;

  insert into public.profiles (id, display_name)
  values (test_user_id, 'Auditoria Participante B')
  on conflict (id) do nothing;
end;
$$;

commit;
