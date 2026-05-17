/**
 * set-supabase-gateway.js
 * 
 * Configura o GATEWAY_URL nos secrets da Edge Function send-whatsapp-otp.
 * 
 * COMO USAR:
 * 1. Rode o deploy-to-railway.js ou deploy-to-render.js primeiro para obter a URL
 * 2. Obtenha o Service Role Key do Supabase Dashboard:
 *    https://supabase.com/dashboard/project/swtesjrevgxmfcumwxra/settings/api
 * 3. Rode: node set-supabase-gateway.js URL_DO_GATEWAY SUPABASE_SERVICE_KEY
 * 
 * Exemplo:
 *   node set-supabase-gateway.js https://mister-churras-gateway.up.railway.app eyJhbGci...
 */

const GATEWAY_URL = process.argv[2];
const SUPABASE_SERVICE_KEY = process.argv[3];

const SUPABASE_PROJECT_REF = 'swtesjrevgxmfcumwxra';
const GATEWAY_API_KEY = 'mister-churras-secret-2024';

if (!GATEWAY_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Uso: node set-supabase-gateway.js URL_GATEWAY SUPABASE_SERVICE_KEY');
  console.error('\n   URL_GATEWAY: URL do gateway no Railway/Render (ex: https://meu-gateway.up.railway.app)');
  console.error('   SERVICE_KEY: Supabase Service Role Key de:');
  console.error(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api`);
  process.exit(1);
}

async function main() {
  console.log('🔥 Configurando GATEWAY_URL no Supabase...\n');
  console.log(`   Gateway URL: ${GATEWAY_URL}`);
  console.log(`   Projeto Supabase: ${SUPABASE_PROJECT_REF}\n`);

  const url = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/secrets`;
  
  const secrets = [
    { name: 'GATEWAY_URL', value: GATEWAY_URL },
    { name: 'GATEWAY_API_KEY', value: GATEWAY_API_KEY },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(secrets),
  });

  if (res.ok || res.status === 200 || res.status === 201) {
    console.log('✅ Secrets configurados com sucesso no Supabase!\n');
    console.log('═'.repeat(60));
    console.log('🎉 TUDO CONFIGURADO!');
    console.log('═'.repeat(60));
    console.log('\nPRÓXIMOS PASSOS:');
    console.log(`1. Aguarde o gateway ficar online: ${GATEWAY_URL}/status`);
    console.log(`2. Escaneie o QR Code: ${GATEWAY_URL}/qr`);
    console.log('3. Teste o login na app: https://mister-churras-core.vercel.app');
    console.log('4. Clique em "Entrar na Brasa" e insira seu número de WhatsApp');
    console.log('   → O código deve chegar via WhatsApp (não mais na tela)!');
  } else {
    const body = await res.text();
    console.error(`❌ Erro ao configurar secrets: HTTP ${res.status}`);
    console.error('   Resposta:', body);
    console.error('\n   Tente configurar manualmente em:');
    console.error(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/functions`);
    console.error('   → Clique em send-whatsapp-otp → Edit Secrets');
    console.error(`   → Adicione: GATEWAY_URL = ${GATEWAY_URL}`);
    console.error(`   → Adicione: GATEWAY_API_KEY = ${GATEWAY_API_KEY}`);
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
