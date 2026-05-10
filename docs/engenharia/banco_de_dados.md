# Modelagem de Dados e Segurança (Supabase)

## 1. Schema do Banco de Dados

A base de dados será construída em PostgreSQL utilizando o Supabase.

### Tabela: `users`
*(Gerenciada parcialmente pelo Supabase Auth `auth.users` e dados estendidos)*
- `id` (uuid, PK, references auth.users)
- `name` (text)
- `avatar_url` (text)
- `created_at` (timestamp)

### Tabela: `events`
- `id` (uuid, PK)
- `user_id` (uuid, FK users.id)
- `title` (text)
- `date` (timestamp)
- `duration_hours` (numeric)
- `created_at` (timestamp)

### Tabela: `guests_summary`
- `id` (uuid, PK)
- `event_id` (uuid, FK events.id)
- `men_count` (integer)
- `women_count` (integer)
- `kids_count` (integer)

### Tabela: `shopping_list`
- `id` (uuid, PK)
- `event_id` (uuid, FK events.id)
- `category` (text) - Ex: 'Carnes', 'Bebidas', 'Suprimentos'
- `item_name` (text)
- `quantity` (numeric)
- `unit` (text) - Ex: 'kg', 'un', 'litros'

## 2. Row Level Security (RLS)
Para garantir privacidade total dos eventos dos usuários, as seguintes políticas RLS serão aplicadas no Supabase:

- **Events / Guests Summary / Shopping List:**
  - `SELECT`: `auth.uid() = user_id` (O usuário só pode ver seus próprios eventos).
  - `INSERT`: `auth.uid() = user_id` (O usuário só pode criar eventos para si mesmo).
  - `UPDATE`: `auth.uid() = user_id`
  - `DELETE`: `auth.uid() = user_id`

Isso assegura que nenhum usuário acesse as informações de churrasco ou os perfis de consumo de terceiros.
