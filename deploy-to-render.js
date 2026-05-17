/**
 * deploy-to-render.js
 * 
 * Script para fazer o deploy do Mister Churras Gateway no Render.com via API.
 * 
 * COMO USAR:
 * 1. Acesse: https://dashboard.render.com/u/YOUR_USER/account/api-keys
 *    (ou Account Settings → API Keys no menu do Render)
 * 2. Clique em "Create API Key", dê o nome "mister-churras", copie o token
 * 3. Rode: node deploy-to-render.js SEU_TOKEN_AQUI
 * 
 * Nota: No Render free tier, o serviço "dorme" após 15 min sem requisições.
 * Para um gateway WhatsApp que mantém sessão persistente, use Railway (pago)
 * ou Render Starter ($7/mês) para evitar sleep.
 */

const RENDER_TOKEN = process.argv[2];
const GITHUB_REPO = 'https://github.com/Andre649/mister-churras-core';
const SERVICE_NAME = 'mister-churras-gateway';
const ROOT_DIR = 'messaging-gateway';
const GATEWAY_API_KEY = 'mister-churras-secret-2024';

if (!RENDER_TOKEN) {
  console.error('❌ Uso: node deploy-to-render.js SEU_TOKEN_AQUI');
  console.error('   Obtenha o token em: https://dashboard.render.com/u/settings → API Keys');
  process.exit(1);
}

const RENDER_API = 'https://api.render.com/v1';

async function renderApi(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${RENDER_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${RENDER_API}${path}`, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  console.log('🔥 Mister Churras Gateway — Deploy no Render.com\n');

  // 1. Verify token
  console.log('1. Verificando autenticação...');
  const owner = await renderApi('/owners?limit=1');
  if (owner.message === 'Unauthorized' || !Array.isArray(owner)) {
    console.error('❌ Token inválido ou sem permissão. Verifique o token e tente novamente.');
    process.exit(1);
  }
  const ownerId = owner[0]?.owner?.id;
  const ownerName = owner[0]?.owner?.name || owner[0]?.owner?.email;
  console.log(`   ✅ Autenticado como: ${ownerName} (${ownerId})\n`);

  // 2. Create web service
  console.log('2. Criando serviço no Render...');
  const servicePayload = {
    type: 'web_service',
    name: SERVICE_NAME,
    ownerId,
    repo: GITHUB_REPO,
    branch: 'main',
    rootDir: ROOT_DIR,
    serviceDetails: {
      env: 'docker',
      dockerfilePath: 'Dockerfile',
      plan: 'free',
      region: 'oregon',
      numInstances: 1,
      envVars: [
        { key: 'GATEWAY_API_KEY', value: GATEWAY_API_KEY },
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '3333' },
      ]
    }
  };

  const created = await renderApi('/services', 'POST', servicePayload);
  
  if (created.message || created.errors) {
    console.error('❌ Erro ao criar serviço:', JSON.stringify(created, null, 2));
    process.exit(1);
  }

  const serviceId = created.service?.id;
  const serviceUrl = `https://${SERVICE_NAME}.onrender.com`;
  const dashboardUrl = `https://dashboard.render.com/web/${serviceId}`;

  console.log(`   ✅ Serviço criado!\n`);
  console.log('═'.repeat(60));
  console.log('🎉 DEPLOY INICIADO COM SUCESSO!');
  console.log('═'.repeat(60));
  console.log(`\n📍 URL do Gateway:  ${serviceUrl}`);
  console.log(`📍 QR Code:         ${serviceUrl}/qr`);
  console.log(`📍 Status:          ${serviceUrl}/status`);
  console.log(`📍 Dashboard:       ${dashboardUrl}`);
  console.log('\n⏳ O build vai levar 5-10 minutos (Docker).');
  console.log('   Acompanhe em: https://dashboard.render.com\n');
  console.log('⚠️  IMPORTANTE: No free tier, o serviço dorme após 15 min sem uso.');
  console.log('   Para produção, considere o plano Starter ($7/mês).\n');
  console.log('PRÓXIMO PASSO: Configure o Supabase com esta URL');
  console.log(`   GATEWAY_URL = ${serviceUrl}`);
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
});
