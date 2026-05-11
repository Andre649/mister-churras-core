create table if not exists public.whatsapp_otps (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  otp_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Tabela acessada apenas pelo backend (service_role via Edge Functions)
alter table public.whatsapp_otps enable row level security;
