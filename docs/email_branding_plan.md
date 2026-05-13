# Branding de Comunicação (SMTP) - Mister Churras Chronicles

Bucanero, o mensageiro da Confraria agora possui trajes oficiais. Abaixo, o plano de configuração para o sender `Mestre@misterchurras.app`.

## 📧 Configuração do Provedor (Resend)

Recomendo o uso do **Resend** integrado ao Supabase pela sua simplicidade e taxa de entrega superior.

1.  **Domínio**: Autenticar `misterchurras.app` via registros DNS (SPF, DKIM, DMARC).
2.  **API Key**: Inserir a chave do Resend no console do Supabase (Auth -> Email Settings).
3.  **Sender**: Definir `Mestre <mestre@misterchurras.app>` como o remetente oficial.

## 📜 Template de E-mail (Estética 1890)

Abaixo, o código base para o e-mail de "Boas-vindas à Confraria" ou "Convite para o Ritual".

```html
<div style="background-color: #F4ECD8; padding: 40px; font-family: 'Georgia', serif; color: #1A1A1A; border: 8px double #4A3728;">
  <div style="text-align: center; border-bottom: 2px solid #8B0000; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="text-transform: uppercase; letter-spacing: 5px; margin: 0; color: #8B0000;">Mister Churras</h1>
    <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px; margin: 5px 0;">Chronicles</p>
  </div>
  
  <p style="font-style: italic; font-size: 18px;">Saudações, Guerreiro da Brasa!</p>
  
  <p>Você foi convocado para integrar a elite da Confraria Mister Churras. Seu ritual de acesso está pronto para ser validado.</p>
  
  <div style="text-align: center; margin: 40px 0;">
    <a href="{{ .ConfirmationURL }}" style="background-color: #8B0000; color: #F4ECD8; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 2px solid #B8860B; display: inline-block; text-transform: uppercase; letter-spacing: 2px;">Consagrar Acesso</a>
  </div>
  
  <p style="font-size: 12px; color: #4A3728; border-top: 1px solid #4A3728; padding-top: 20px; margin-top: 40px;">
    "O segredo do fogo é guardado por quem o respeita."<br>
    Mister Churras Chronicles © 1890
  </p>
</div>
```

---
> [!IMPORTANT]
> **Ação**: Após o deploy do domínio, Bucanero deve realizar a verificação de DNS para habilitar o envio oficial.

_Bucanero, o fogo se espalha pela rede._
