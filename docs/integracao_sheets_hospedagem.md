# 📊 Guia de Automação: Google Sheets e Webhooks

Bucanero, para que os dados fluam automaticamente para sua planilha, siga este ritual técnico.

## 🛡️ 1. Criar a Planilha
1.  Crie uma planilha no Google Sheets com o nome: **Mister Churras - Leads de Parceiros**.
2.  Crie os cabeçalhos na primeira linha: `Data`, `Nome`, `Açougue`, `Especialidade`, `Cidade`, `WhatsApp`.

## 🏰 2. Configurar o Make.com (Ponte)
1.  Crie uma conta gratuita no [Make.com](https://make.com).
2.  Crie um novo **Scenario**.
3.  **Gatilho (Trigger)**: Procure pelo módulo **Webhooks** -> **Custom Webhook**.
4.  Clique em **Add** e copie o endereço URL gerado (ex: `https://hook.us1.make.com/xxxxxx`).
5.  **Ação (Action)**: Procure pelo módulo **Google Sheets** -> **Add a Row**.
6.  Conecte sua conta do Google e selecione a planilha criada no passo 1.
7.  Mapeie as colunas da planilha com os dados que virão do Webhook.

## 🔗 3. Ativar o Webhook no Supabase
1.  Vá ao painel do **Supabase** -> **Database** -> **Webhooks**.
2.  Crie um novo Webhook:
    *   **Name**: `notify_make_leads`
    *   **Table**: `butcher_prospects`
    *   **Events**: `INSERT`
    *   **Webhook URL**: Cole a URL do Make.com obtida no passo 2.
3.  Salve.

---

## 📱 4. Fluxo de Notificação WhatsApp
Eu já configurei o código para que, assim que o açougueiro clicar em enviar:
1.  Os dados são gravados no **Supabase**.
2.  O **Supabase** dispara o Webhook para o **Make.com**, que alimenta sua **Planilha**.
3.  O navegador do usuário abrirá automaticamente o **seu WhatsApp** com o "Ofício de Honra" preenchido com todos os dados dele.

_Bucanero, o sistema agora é uma sinfonia de fogo e dados._
