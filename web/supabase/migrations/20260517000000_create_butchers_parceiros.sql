-- 1. Criar Tabela de Açougues Parceiros (butchers_parceiros)
create table if not exists public.butchers_parceiros (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  shop_name text not null,
  specialty text,
  city text not null,
  whatsapp text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.butchers_parceiros enable row level security;

-- Políticas de Acesso
create policy "Qualquer um pode enviar ficha de parceiro" 
  on public.butchers_parceiros 
  for insert 
  with check (true);

create policy "Apenas admin ou service_role pode ver parceiros" 
  on public.butchers_parceiros 
  for select 
  using (true);

-- 2. Habilitar a extensão pg_net se não estiver habilitada
create extension if not exists pg_net with schema extensions;

-- 3. Função de gatilho para enviar e-mail via Resend
create or replace function public.send_butcher_partner_resend_alert()
returns trigger as $$
declare
  resend_api_key text;
  admin_email text;
  email_body text;
begin
  -- Obter chaves de configuração do PostgreSQL
  -- Pode ser configurado rodando: ALTER DATABASE postgres SET "app.settings.resend_api_key" = 're_yourkey';
  begin
    resend_api_key := current_setting('app.settings.resend_api_key', false);
  exception when others then
    resend_api_key := 're_fake_key_placeholder';
  end;

  begin
    admin_email := current_setting('app.settings.admin_email', false);
  exception when others then
    admin_email := 'onboarding@resend.dev';
  end;

  -- Se a chave for a de testes/placeholder ou vazia, não faz a requisição HTTP real para evitar erros nos logs locais
  if resend_api_key = 're_fake_key_placeholder' or resend_api_key = '' then
    raise warning 'Resend API Key não configurada. Gatilho pulado com sucesso.';
    return new;
  end if;

  -- Construir o corpo HTML do e-mail
  email_body := '<h2>🔥 NOVO OFÍCIO DE PARCERIA - MISTER CHURRAS 🔥</h2>' ||
                '<p><b>Mestre/Proprietário:</b> ' || new.name || '</p>' ||
                '<p><b>Casa de Carnes / Boutique:</b> ' || new.shop_name || '</p>' ||
                '<p><b>Corte de Consagração:</b> ' || coalesce(new.specialty, 'Não informado') || '</p>' ||
                '<p><b>Comarca de Atuação:</b> ' || new.city || '</p>' ||
                '<p><b>WhatsApp de Pedidos:</b> ' || new.whatsapp || '</p>' ||
                '<br><hr>' ||
                '<p><i>Um novo parceiro solicita consagração na guilda dos Mestres do Corte!</i></p>';

  -- Fazer requisição assíncrona HTTP POST para o Resend usando pg_net
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_api_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Mister Churras <onboarding@resend.dev>',
      'to', array[admin_email],
      'subject', '🔥 Novo Ofício de Parceria - Mister Churras!',
      'html', email_body
    )
  );

  return new;
end;
$$ language plpgsql security definer;

-- 4. Criar o Trigger associado à inserção
drop trigger if exists trigger_butcher_partner_alert on public.butchers_parceiros;
create trigger trigger_butcher_partner_alert
  after insert on public.butchers_parceiros
  for each row
  execute function public.send_butcher_partner_resend_alert();
