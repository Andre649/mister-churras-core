# Arquitetura do Sistema - Mister Churras

## 1. Visão Geral
O **Mister Churras** é uma aplicação focada na experiência do usuário para planejamento e cálculo de eventos de churrasco. A arquitetura visa alta performance, disponibilidade offline e segurança dos dados dos usuários.

## 2. Stack Tecnológico
- **Frontend:** React (versão 18+)
- **Linguagem:** TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Backend / BaaS:** Supabase
  - Banco de Dados: PostgreSQL
  - Autenticação: Supabase Auth (Google OAuth, Magic Link)
  - Segurança: Row Level Security (RLS)

## 3. PWA (Progressive Web App)
Para garantir que o app funcione na beira da churrasqueira (mesmo sem internet), a aplicação será configurada como PWA:
- Utilização de **Service Workers** para cache de assets estáticos.
- Manifesto Web (`manifest.json`) para instalação como aplicativo no celular.
- Cache de dados locais temporários usando `localStorage` ou `IndexedDB` para cálculos rápidos offline (se necessário antes da sincronização com o Supabase).

## 4. Estrutura de Diretórios Proposta
```text
src/
├── assets/         # Imagens, ícones, fontes
├── components/     # Componentes reutilizáveis (Botões, Cards, Inputs)
├── contexts/       # Contextos globais (Auth, Configurações do Churrasco)
├── hooks/          # Hooks customizados
├── lib/            # Configurações de terceiros (Supabase client)
├── pages/          # Páginas da aplicação (Home, Calculadora, Resultados)
├── types/          # Definições de tipos TypeScript
└── utils/          # Funções utilitárias e de cálculo (lógica do Arquiteto)
```
