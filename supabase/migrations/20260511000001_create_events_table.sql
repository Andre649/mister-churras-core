-- Criar Tabela de Eventos (Churrascos)
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.events enable row level security;

-- Políticas de Segurança
create policy "Usuários podem ver seus próprios eventos" on events for select using (auth.uid() = user_id);
create policy "Usuários podem inserir seus próprios eventos" on events for insert with check (auth.uid() = user_id);
