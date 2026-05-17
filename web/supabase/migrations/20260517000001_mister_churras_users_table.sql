-- 1. Criar Tabela de Perfis de Usuário
create table if not exists public.mister_churras_users (
  id uuid references auth.users on delete cascade primary key,
  whatsapp text unique not null,
  name text not null,
  last_login_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.mister_churras_users enable row level security;

-- Política de leitura pública (necessária para verificar se o número já existe no Step 1 do modal)
drop policy if exists "Acesso de leitura pública para verificação de WhatsApp" on public.mister_churras_users;
create policy "Acesso de leitura pública para verificação de WhatsApp"
  on public.mister_churras_users
  for select
  using (true);

-- 2. Gatilho para Sincronizar Novos Usuários do Supabase Auth com o Perfil Público
create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  val_whatsapp text;
  val_name text;
begin
  val_whatsapp := coalesce(new.raw_user_meta_data->>'whatsapp', '');
  val_name := coalesce(new.raw_user_meta_data->>'name', '');

  -- 1. Validar se o WhatsApp foi fornecido e possui apenas dígitos (mínimo 10)
  if val_whatsapp = '' or length(regexp_replace(val_whatsapp, '\D', '', 'g')) < 10 then
    raise exception 'Cadastro rejeitado: Número de WhatsApp inválido.';
  end if;

  -- 2. Validar se o Nome do Mestre Assador foi fornecido e não é vazio
  if trim(val_name) = '' then
    raise exception 'Cadastro rejeitado: O nome do Mestre Assador é obrigatório.';
  end if;

  -- 3. Inserir na tabela pública de perfis
  insert into public.mister_churras_users (id, whatsapp, name)
  values (
    new.id,
    regexp_replace(val_whatsapp, '\D', '', 'g'),
    trim(val_name)
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- 3. Função Reativa de Autoexclusão (Inatividade > 1 Ano & Purga Automática de Testes)
create or replace function public.cleanup_expired_mister_churras_users()
returns trigger as $$
begin
  -- A. Excluir eventos associados aos usuários expirados ou de teste
  delete from public.events
  where user_id in (
    select id from auth.users
    where last_sign_in_at < now() - interval '1 year'
       or raw_user_meta_data->>'whatsapp' like '1199999%'
       or raw_user_meta_data->>'whatsapp' like '1199777%'
       or raw_user_meta_data->>'whatsapp' = '1234567890'
       or lower(raw_user_meta_data->>'name') like '%teste%'
       or lower(raw_user_meta_data->>'name') like '%test%'
  );

  -- B. Excluir perfis públicos associados
  delete from public.mister_churras_users
  where id in (
    select id from auth.users
    where last_sign_in_at < now() - interval '1 year'
       or raw_user_meta_data->>'whatsapp' like '1199999%'
       or raw_user_meta_data->>'whatsapp' like '1199777%'
       or raw_user_meta_data->>'whatsapp' = '1234567890'
       or lower(raw_user_meta_data->>'name') like '%teste%'
       or lower(raw_user_meta_data->>'name') like '%test%'
  );

  -- C. Excluir credenciais de autenticação
  delete from auth.users 
  where last_sign_in_at < now() - interval '1 year'
     or raw_user_meta_data->>'whatsapp' like '1199999%'
     or raw_user_meta_data->>'whatsapp' like '1199777%'
     or raw_user_meta_data->>'whatsapp' = '1234567890'
     or lower(raw_user_meta_data->>'name') like '%teste%'
     or lower(raw_user_meta_data->>'name') like '%test%';
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparada a cada novo login/cadastro para varrer e autopurgar inativos e testes (Custo Zero!)
drop trigger if exists on_user_login_sweep on public.mister_churras_users;
create trigger on_user_login_sweep
  after insert or update on public.mister_churras_users
  for each statement execute function public.cleanup_expired_mister_churras_users();
