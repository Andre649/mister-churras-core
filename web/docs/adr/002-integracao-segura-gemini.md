# ADR 002: Integração Segura com a API do Gemini para a Inteligência do Mestre

## Status
Aceito

## Contexto
O ecossistema **Mister Churras** está evoluindo para incluir recursos de inteligência artificial (como geração de receitas personalizadas, sugestão de cortes e dicas de churrasco sob medida do "Mestre da Brasa"). O usuário deseja integrar sua própria conta do Gemini para utilizar seus tokens e créditos. 

Expor a chave privada `GEMINI_API_KEY` diretamente no frontend (React com prefixo `VITE_`) é uma vulnerabilidade grave (Excessive Data Exposure - OWASP Top 10 API Security). Terceiros maliciosos poderiam extrair o token do bundle do cliente e utilizar indevidamente a cota e os créditos do usuário. Portanto, faz-se necessária uma arquitetura robusta de intermediação de credenciais.

## Decisão
Decidimos implementar uma arquitetura **Server-Side Proxy/Middleware** para a integração com a API do Gemini, adotando as seguintes medidas técnicas:

1.  **Exposição Zero de API Keys:** A chave `GEMINI_API_KEY` do usuário será mantida estritamente no backend. O frontend React jamais terá conhecimento direto da chave.
2.  **Intermediação por Supabase Edge Functions ou Vercel Serverless:**
    *   Toda requisição de inteligência artificial vinda do frontend chamará uma rota intermediária segura no backend (ex: Supabase Edge Function `v1/perguntar-ao-mestre` ou rota serverless na Vercel `/api/v1/gemini`).
    *   Esta rota validará a sessão JWT do usuário autenticado no Supabase para garantir que apenas usuários legítimos façam chamadas.
    *   O serviço backend injetará o cabeçalho seguro de autenticação do Gemini (consumindo a chave segura do ambiente) e fará a chamada direta para a API oficial do Google Gemini.
3.  **Segurança em Camadas (OWASP Top 10 for LLM):**
    *   **Higienização de Entradas (Prompt Injection Shield):** Todo texto livre inserido pelo usuário será envolto em tags e delimitadores rígidos nas instruções do sistema no backend.
    *   **Filtros de Segurança e Moderação:** Ativar os filtros de segurança nativos do Gemini (Hate Speech, Harassment, Sexual Content, Dangerous Content) configurados no payload do backend para manter a resposta estritamente focada no "Churrasco Life Style".
    *   **Controle de Orçamento de Tokens:** Implementar rate-limiting nas rotas de API para evitar esgotamento acidental de tokens e abuso de cota.

## Consequências
*   **Positivas:**
    *   **Proteção Absoluta:** O token do Gemini do usuário está completamente blindado contra vazamento para o cliente.
    *   **Rastreabilidade e Auditoria:** Todas as chamadas de IA podem ser monitoradas e logadas de forma centralizada pelo backend.
    *   **Independência de Provedor:** Facilidade para alternar ou atualizar modelos do Gemini no futuro sem alterar o código de distribuição do cliente React.
*   **Negativas:**
    *   **Configuração Adicional:** Exige que o usuário configure a variável de ambiente `GEMINI_API_KEY` no painel administrativo da Vercel ou via CLI do Supabase (`supabase secrets set`).
    *   **Latência Mínima Adicional:** Um salto de rede intermediário (Frontend -> Edge Function/Serverless -> Gemini API).

## Notas Técnicas
*   O arquivo `.env.example` foi atualizado para documentar claramente a separação de escopos das chaves de ambiente.
*   As diretrizes foram incorporadas ao prompt do **Guardião da Brasa (Agente de Segurança)** para auditoria de código.
