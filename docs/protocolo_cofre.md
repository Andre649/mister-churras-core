# 🛡️ Protocolo do Cofre (Vault Config) - Mister Churras

Este documento estabelece as regras de governança e segurança para o repositório privado sob o comando do Mestre Bucanero.

## 1. Classificação de Segurança
- **Status do Repositório**: PRIVADO
- **Nível de Sigilo**: TOP_SECRET
- **Proprietário**: André Pereira dos Santos (Bucanero)

## 2. Mecânica de Acesso (The Human Proxy)
Como os agentes operam em um ambiente isolado, a ponte de confiança é o próprio Bucanero.
1.  **Processamento**: O agente gera o código e a lógica.
2.  **Transferência**: O código é apresentado no chat.
3.  **Consagração (Commit)**: Bucanero revisa o código e realiza o commit/push manual para as branches protegidas.

## 3. Gestão de Segredos (GitHub Secrets)
Para evitar o vazamento de chaves no histórico:
1.  As chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` devem ser inseridas em:
    *   **GitHub**: `Settings > Secrets and variables > Actions`
    *   **Vercel**: `Project Settings > Environment Variables`
2.  **Limpeza de Histórico**: Foi identificado que o `.env.local` já esteve no histórico. Para uma limpeza definitiva (Top Secret), Bucanero deve executar o comando de limpeza de histórico (Git Filter-Repo) localmente.

## 4. Governança de Código
- **Revisão Manual**: Nenhum código deve ser fundido (Merged) na `main` sem a revisão visual de Bucanero.
- **Segurança de Branch**: A branch `main` é considerada a "Sala do Trono", inviolável e sempre estável.

_Protocolo estabelecido pelo Maestro em conformidade com as ordens do Bucanero._
