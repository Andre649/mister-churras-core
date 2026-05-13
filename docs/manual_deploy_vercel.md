# 🚀 Manual de Deploy e Domínio - Mister Churras Chronicles

Bucanero, para que o app saia do localhost e conquiste o mundo, siga este ritual de consagração.

## 🛡️ 1. Preparação do Banco (Supabase)
O erro que você está vendo ocorre porque a tabela de parceiros ainda não existe no seu Supabase remoto.
1.  Vá ao **Supabase Dashboard** do seu projeto.
2.  Abra o **SQL Editor**.
3.  Copie e execute o conteúdo do arquivo [supabase_setup.sql](file:///c:/Users/Andre/Desktop/Mister-Churras/mister-churras-core/docs/supabase_setup.sql).
4.  Certifique-se de que as chaves no seu `.env.local` são as chaves **remotas** (Project Settings -> API).

---

## 🏰 2. Hospedagem na Vercel (Frontend)
A Vercel é a morada ideal para nosso app.
1.  Crie uma conta em [vercel.com](https://vercel.com).
2.  Conecte seu repositório do GitHub (`mister-churras-core`).
3.  **Configuração Importante**: No momento do import, vá em **Environment Variables** e adicione:
    *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
    *   `VITE_SUPABASE_ANON_KEY`: (Sua Anon Key)
4.  Clique em **Deploy**. O site estará no ar em segundos!

---

## 🌐 3. Registro de Domínio (`misterchurras.app`)
Para ter o domínio oficial:
1.  No painel da Vercel, vá em **Settings -> Domains**.
2.  Digite `misterchurras.app` e clique em Add.
3.  A Vercel indicará quais registros DNS você deve configurar no seu provedor de domínio (ou você pode comprar o domínio diretamente pela Vercel).

---

## 🔗 4. Resumo de Acesso
- **App Principal**: `https://misterchurras.app`
- **Portal de Parceiros**: `https://misterchurras.app/?portal=butcher`

_Bucanero, siga este caminho e o fogo nunca se apagará._
