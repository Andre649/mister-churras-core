# Audit de Segurança e Blindagem - Mister Churras Chronicles

Bucanero, as muralhas da Confraria foram reforçadas. Abaixo, o relatório de auditoria e as instruções de blindagem.

## 🛡️ Status de Proteção Local
- [x] **.gitignore**: Verificado. `.env`, `.env.local` e outros arquivos sensíveis estão devidamente ignorados pelo Git.
- [x] **Secrets Isolation**: Removidas referências diretas a chaves no código fonte (usando `import.meta.env`).

## 🔐 Blindagem em Produção (GitHub Secrets)

Para garantir a segurança máxima, as seguintes chaves **DEVEM** ser configuradas no GitHub (Settings -> Secrets -> Actions):

| Variável | Descrição |
| :--- | :--- |
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | (Opcional) Apenas se houver scripts de automação backend. |

## 🚀 Configuração Vercel
As mesmas variáveis acima devem ser inseridas no painel da Vercel (Project Settings -> Environment Variables) para que o build de produção funcione.

---
> [!CAUTION]
> **AVISO**: Nunca faça commit manual do arquivo `.env`. Se um segredo for exposto, realize o "Ritual de Rotação" (gerar novas chaves imediatamente no console do Supabase).

_Bucanero, o segredo é a alma do ritual._
