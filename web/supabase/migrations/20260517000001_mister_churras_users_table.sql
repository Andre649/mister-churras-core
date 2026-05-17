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
begin
  insert into public.mister_churras_users (id, whatsapp, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'whatsapp', ''),
    coalesce(new.raw_user_meta_data->>'name', 'Mestre Assador')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- 3. Função Reativa de Autoexclusão (Inatividade > 1 Ano)
create or replace function public.cleanup_expired_mister_churras_users()
returns trigger as $$
begin
  -- Excluir eventos associados aos usuários expirados (previne violação de FK)
  delete from public.events
  where user_id in (
    select id from auth.users
    where last_sign_in_at < now() - interval '1 year'
  );

  -- Excluir perfis públicos associados
  delete from public.mister_churras_users
  where id in (
    select id from auth.users
    where last_sign_in_at < now() - interval '1 year'
  );

  -- Excluir credenciais de autenticação
  delete from auth.users 
  where last_sign_in_at < now() - interval '1 year';
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparada a cada novo login/cadastro para varrer e autopurgar inativos (Custo Zero / Sem Cron externo!)
drop trigger if exists on_user_login_sweep on public.mister_churras_users;
create trigger on_user_login_sweep
  after insert or update on public.mister_churras_users
  for each statement execute function public.cleanup_expired_mister_churras_users();
