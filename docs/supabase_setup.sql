-- 🛡️ SQL de Consagração das Tabelas - Mister Churras Chronicles

-- Tabela para os Parceiros de Honra (Açougues)
create table if not exists public.butcher_prospects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    shop_name text not null,
    specialty text,
    city text not null,
    whatsapp text not null
);

-- Habilitar RLS (Segurança de Linha)
alter table public.butcher_prospects enable row level security;

-- Política: Permitir que qualquer um insira (público)
create policy "Qualquer um pode solicitar parceria" 
on public.butcher_prospects for insert 
with check (true);

-- Política: Apenas o administrador (você) pode ler os leads
-- (Por padrão, como não há política de SELECT, ninguém lerá os dados via API pública)
