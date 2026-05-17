-- 1. Dropar dependências de auth.users antigas
alter table if exists public.events drop constraint if exists events_user_id_fkey;

-- 2. Recriar a Tabela de Usuários Customizada (Mister Churras Custom Auth)
drop table if exists public.mister_churras_users cascade;
create table public.mister_churras_users (
  id uuid default gen_random_uuid() primary key,
  whatsapp text unique not null,
  name text not null,
  password_hash text not null,
  last_login_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Desabilitar RLS para permitir login customizado livre de SMTP
alter table public.mister_churras_users disable row level security;

-- 3. Ajustar a Tabela de Eventos para a nova autenticação customizada
alter table if exists public.events disable row level security;

-- Adicionar a restrição referenciando nossa nova tabela de usuários customizada
alter table public.events 
  add constraint events_user_id_fkey 
  foreign key (user_id) 
  references public.mister_churras_users(id) 
  on delete cascade;

-- 4. Função de Varredura e Autoexclusão Customizada (Custo Zero!)
create or replace function public.cleanup_expired_mister_churras_users_custom()
returns trigger as $$
begin
  -- A. Deletar usuários inativos por mais de 1 ano
  delete from public.mister_churras_users
  where last_login_at < now() - interval '1 year';

  -- B. Deletar usuários de teste criados anteriormente
  delete from public.mister_churras_users
  where whatsapp like '1199999%' 
     or whatsapp like '1199777%'
     or whatsapp = '1234567890'
     or lower(name) like '%teste%'
     or lower(name) like '%test%';
     
  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparada a cada novo login/cadastro para varrer e autopurgar inativos e testes
drop trigger if exists on_user_login_sweep_custom on public.mister_churras_users;
create trigger on_user_login_sweep_custom
  after insert or update on public.mister_churras_users
  for each statement execute function public.cleanup_expired_mister_churras_users_custom();
