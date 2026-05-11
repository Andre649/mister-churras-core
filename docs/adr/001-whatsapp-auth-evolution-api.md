# ADR 001: Autenticação via WhatsApp com Evolution API e Edge Functions

## Status
Aceito

## Contexto
O projeto "Mister Churras" exigia um método de autenticação que fosse familiar aos usuários (WhatsApp) e que evitasse os custos elevados de provedores oficiais como Twilio/Meta por mensagem enviada (OTP). O Supabase, por padrão, não oferece suporte nativo a APIs de terceiros para envio de SMS/WhatsApp OTP além dos provedores listados no painel.

## Decisão
Decidimos implementar uma infraestrutura personalizada utilizando:
1. **Evolution API**: Um serviço de API de WhatsApp de código aberto para envio de mensagens sem custo por transação.
2. **Supabase Edge Functions**: Para atuar como ponte segura (Backend) entre o Frontend e a Evolution API.
3. **Fluxo de OTP Customizado**: 
   - Uma função para gerar e armazenar o código no banco de dados (`send-whatsapp-otp`).
   - Uma função para verificar o código e autenticar o usuário (`verify-whatsapp-otp`).
4. **Login via Email/Password "Shadow"**: Para contornar a desativação nativa de telefone no Supabase Auth em certos cenários, as funções criam e autenticam usuários usando uma senha determinística baseada em um segredo de servidor.

## Consequências
- **Positivas**: Custo zero de envio de mensagens, total controle sobre a mensagem enviada, flexibilidade para trocar de API de WhatsApp no futuro.
- **Negativas**: Aumenta a complexidade da infraestrutura (necessidade de manter o serviço Evolution API e gerenciar Edge Functions), exige gerenciamento manual de expiração de tokens OTP.

## Notas Técnicas
- Bug de normalização de telefone (+ vs sem +) corrigido em 11/05/2026.
- Implementado fallback de "Modo DEV" caso as chaves da Evolution não estejam configuradas.
