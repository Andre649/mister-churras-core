# Integração Google Sheets e Plano de Hospedagem

Bucanero, para que os dados dos parceiros fluam como vinho em banquete, apresento a arquitetura de automação e as recomendações de morada para o app.

## 📊 1. Integração Google Sheets (Automação)

Para que o formulário do **Portal dos Fornecedores** alimente uma planilha automaticamente, recomendo a **Arquitetura de Fluxo Espelho**:

| Método | Ferramenta | Vantagem |
| :--- | :--- | :--- |
| **Ponte Inteligente** | **Make.com (Integromat)** | Extremamente rápido de configurar. Monitora a tabela `butcher_prospects` no Supabase e insere no Google Sheets em tempo real. |
| **Elite Técnica** | **Supabase Edge Functions** | Código puro (Deno) que dispara um POST para a API do Google Sheets. Sem ferramentas terceiras. |

### 🚀 Minha Recomendação: Make.com
Para o lançamento, usaremos o **Make.com**. Ele permite criar um "Webhook" no Supabase que avisa o Make sempre que um novo açougue se cadastrar. O Make então formata os dados e preenche sua planilha.
- **Custo**: Zero (Plano Free cobre até 1000 operações/mês).

---

## 🏰 2. Recomendações de Hospedagem (Veredito)

Após analisar o terreno, minha recomendação de "Luxo Técnico" para o **Mister Churras Chronicles** é:

### **Vercel (A Morada do Frontend)**
- **Por que?**: É o padrão ouro para aplicações Vite/React. Possui deploy automático via GitHub e uma rede global que garante que o app abra em milissegundos.
- **Domínio**: Facilidade extrema para apontar `misterchurras.app`.
- **Custo**: Free para o tráfego inicial.

### **Supabase (O Cofre do Ritual)**
- **Por que?**: Já estamos usando para Banco de Dados e Auth. É imbatível em segurança (RLS) e escalabilidade.
- **Hospedagem**: O backend já mora lá.

---

## 🛠️ Próximos Passos Imediatos

1.  **Conectar GitHub à Vercel**: Realizar o primeiro deploy em ambiente de staging.
2.  **Criar Planilha "Mister Churras - Leads"**: Criar a planilha no Google Drive.
3.  **Configurar Webhook**: Ativar o gatilho no Supabase para enviar os dados ao Make.com.

_Bucanero, a engrenagem está pronta. Devo proceder com a configuração do Webhook no Supabase?_
