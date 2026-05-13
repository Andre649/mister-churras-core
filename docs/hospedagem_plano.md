# Plano de Hospedagem e Deploy - Mister Churras Chronicles

Bucanero, o ritual está pronto para ganhar o mundo. Abaixo, a estratégia de infraestrutura para garantir que o "Mestre da Brasa" esteja sempre disponível.

## 🏗️ Arquitetura de Nuvem Proposta

| Componente | Provedor | Motivo |
| :--- | :--- | :--- |
| **Frontend (SPA)** | **Vercel** | Integração nativa com Vite, deploy atômico e CDN global ultrarrápida. |
| **Backend (DB/Auth)** | **Supabase** | Já integrado. Escalabilidade PostgreSQL e autenticação robusta. |
| **CI/CD** | **GitHub Actions** | Automatiza testes de QA antes de cada deploy em produção. |

## 🚀 Passos para o Lançamento

### 1. Preparação do Repositório
- Conectar o repositório `Andre649/mister-churras-core` à conta Vercel.
- Configurar as Variáveis de Ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) no painel da Vercel.

### 2. Otimização PWA (Vite PWA Plugin)
- Instalar `vite-plugin-pwa` para habilitar cache offline (essencial para uso em locais sem sinal).
- Gerar o manifesto e ícones oficiais baseados no novo Logo Bucanero.

### 3. Registro de Domínio
- **Recomendação**: `misterchurras.com.br` ou `misterchurras.app`.
- Configuração de SSL automático via Vercel.

## 🛡️ Segurança e Monitoramento
- **Supabase RLS**: Garantir que cada Mestre só veja seus próprios eventos e convidados.
- **Vercel Analytics**: Monitorar o tráfego e possíveis quedas de performance.

---
> [!IMPORTANT]
> **AÇÃO IMEDIATA**: Recomendo iniciarmos o deploy na Vercel (Free Tier) ainda hoje para validar a performance em ambiente real.

_Bucanero, o fogo nunca apaga com a infraestrutura correta._
