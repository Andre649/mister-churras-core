#!/usr/bin/env node
/**
 * deploy-gateway.js — Script unificado de deploy do Mister Churras Gateway
 * 
 * ══════════════════════════════════════════════════════════════
 *  OPÇÃO A — Railway (recomendado, sem sleep):
 *   1. Acesse: https://railway.app/account/tokens
 *   2. Clique "Create Token" → nome "mister-churras" → Copie
 *   3. node deploy-gateway.js railway SEU_TOKEN
 * 
 *  OPÇÃO B — Render.com (free tier dorme após 15 min):
 *   1. Acesse: https://dashboard.render.com/u/settings → API Keys
 *   2. Clique "Create API Key" → nome "mister-churras" → Copie
 *   3. node deploy-gateway.js render SEU_TOKEN
 * ══════════════════════════════════════════════════════════════
 * 
 *  Após o deploy, configure o Supabase com:
 *   node deploy-gateway.js supabase URL_GATEWAY SUPABASE_SERVICE_ROLE_KEY
 * 
 *  O Service Role Key está em:
 *   https://supabase.com/dashboard/project/swtesjrevgxmfcumwxra/settings/api
 */

const [,, platform, ...args] = process.argv;
const SUPABASE_PROJECT_REF = 'swtesjrevgxmfcumwxra';
const GATEWAY_API_KEY_VALUE = 'mister-churras-secret-2024';
const GITHUB_REPO = 'https://github.com/Andre649/mister-churras-core';

// ═══════════════════════════════════════════════════
// RAILWAY DEPLOY
// ═══════════════════════════════════════════════════
async function deployRailway(token) {
  const GQL = 'https://backboard.railway.app/graphql/v2';
  
  async function gql(query, variables = {}) {
    const res = await fetch(GQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
  }

  console.log('\n🚂 RAILWAY DEPLOY\n');
  
  console.log('1. Verificando autenticação...');
  const me = await gql(`query { me { id name email } }`);
  console.log(`   ✅ ${me.me.name} (${me.me.email})\n`);

  console.log('2. Criando projeto...');
  const proj = await gql(`
    mutation($input: ProjectCreateInput!) { projectCreate(input: $input) { id name } }
  `, { input: { name: 'mister-churras-gateway' } });
  const projectId = proj.projectCreate.id;
  console.log(`   ✅ Projeto: ${proj.projectCreate.name}\n`);

  console.log('3. Criando serviço a partir do GitHub...');
  const svc = await gql(`
    mutation($input: ServiceCreateInput!) { serviceCreate(input: $input) { id name } }
  `, { input: { projectId, name: 'gateway', source: { repo: 'Andre649/mister-churras-core', branch: 'main' } } });
  const serviceId = svc.serviceCreate.id;
  console.log(`   ✅ Serviço criado (${serviceId})\n`);

  console.log('4. Obtendo ambiente...');
  const envData = await gql(`
    query($projectId: String!) { project(id: $projectId) { environments { edges { node { id name } } } } }
  `, { projectId });
  const envId = envData.project.environments.edges[0]?.node?.id;
  console.log(`   ✅ Ambiente: ${envData.project.environments.edges[0]?.node?.name}\n`);

  console.log('5. Configurando variáveis...');
  for (const [name, value] of [
    ['GATEWAY_API_KEY', GATEWAY_API_KEY_VALUE],
    ['NODE_ENV', 'production'],
    ['ROOT_DIRECTORY', 'messaging-gateway'],
  ]) {
    await gql(`mutation($input: VariableUpsertInput!) { variableUpsert(input: $input) }`, {
      input: { projectId, environmentId: envId, serviceId, name, value }
    });
    console.log(`   ✅ ${name}`);
  }

  console.log('\n6. Gerando domínio público...');
  const domain = await gql(`
    mutation($serviceId: String!, $environmentId: String!) {
      serviceDomainCreate(serviceId: $serviceId, environmentId: $environmentId) { domain }
    }
  `, { serviceId, environmentId: envId });
  
  const url = `https://${domain.serviceDomainCreate.domain}`;
  printSuccess(url, 'railway');
  return url;
}

// ═══════════════════════════════════════════════════
// RENDER DEPLOY
// ═══════════════════════════════════════════════════
async function deployRender(token) {
  const BASE = 'https://api.render.com/v1';
  
  async function api(path, method = 'GET', body = null) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return res.json();
  }

  console.log('\n🎨 RENDER DEPLOY\n');

  console.log('1. Verificando autenticação...');
  const owners = await api('/owners?limit=1');
  if (!Array.isArray(owners) || owners[0]?.message === 'Unauthorized') {
    throw new Error('Token inválido. Gere um novo em: https://dashboard.render.com/u/settings');
  }
  const ownerId = owners[0].owner.id;
  console.log(`   ✅ ${owners[0].owner.name || owners[0].owner.email}\n`);

  console.log('2. Criando serviço Docker...');
  const created = await api('/services', 'POST', {
    type: 'web_service',
    name: 'mister-churras-gateway',
    ownerId,
    repo: GITHUB_REPO,
    branch: 'main',
    rootDir: 'messaging-gateway',
    serviceDetails: {
      env: 'docker',
      dockerfilePath: 'Dockerfile',
      plan: 'free',
      region: 'oregon',
      numInstances: 1,
      envVars: [
        { key: 'GATEWAY_API_KEY', value: GATEWAY_API_KEY_VALUE },
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '10000' },
      ],
      healthCheckPath: '/status',
    }
  });

  if (created.message || created.errors) throw new Error(JSON.stringify(created));

  const url = `https://${created.service?.name || 'mister-churras-gateway'}.onrender.com`;
  printSuccess(url, 'render');
  return url;
}

// ═══════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════
async function configSupabase(gatewayUrl, serviceKey) {
  console.log('\n⚡ CONFIGURANDO SUPABASE\n');
  console.log(`   Gateway URL: ${gatewayUrl}`);

  const res = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/secrets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      { name: 'GATEWAY_URL', value: gatewayUrl },
      { name: 'GATEWAY_API_KEY', value: GATEWAY_API_KEY_VALUE },
    ]),
  });

  if (res.ok || res.status <= 299) {
    console.log('   ✅ GATEWAY_URL configurado!');
    console.log('   ✅ GATEWAY_API_KEY configurado!\n');
    console.log('════════════════════════════════════════════');
    console.log('🎉 SUPABASE CONFIGURADO COM SUCESSO!');
    console.log('════════════════════════════════════════════');
    console.log(`\n📍 Escaneie o QR: ${gatewayUrl}/qr`);
    console.log('📱 Depois teste o login na app!');
  } else {
    const body = await res.text();
    console.error(`❌ HTTP ${res.status}: ${body}`);
    console.log('\n   Configure manualmente:');
    console.log(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/functions`);
    console.log(`   → send-whatsapp-otp → Secrets → Adicione:`);
    console.log(`     GATEWAY_URL = ${gatewayUrl}`);
    console.log(`     GATEWAY_API_KEY = ${GATEWAY_API_KEY_VALUE}`);
  }
}

function printSuccess(url, platform) {
  console.log('\n' + '═'.repeat(55));
  console.log('🎉 DEPLOY INICIADO!');
  console.log('═'.repeat(55));
  console.log(`\n📍 URL:    ${url}`);
  console.log(`📍 QR:     ${url}/qr`);
  console.log(`📍 Status: ${url}/status`);
  if (platform === 'render') {
    console.log('\n⚠️  Render free tier dorme após 15 min sem uso.');
    console.log('   Para produção real, use Render Starter ($7/mês).');
  }
  console.log('\n⏳ Build leva ~5-10 min. Acompanhe em:');
  console.log(`   ${platform === 'railway' ? 'https://railway.app/dashboard' : 'https://dashboard.render.com'}`);
  console.log('\nPRÓXIMO PASSO — Configure o Supabase:');
  console.log(`   node deploy-gateway.js supabase ${url} SUA_SUPABASE_SERVICE_ROLE_KEY`);
  console.log('\n   Service Role Key em:');
  console.log(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api`);
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════
async function main() {
  if (!platform || !['railway', 'render', 'supabase'].includes(platform)) {
    console.log(`
🔥 Mister Churras Gateway — Deploy Script
══════════════════════════════════════════

Uso:
  node deploy-gateway.js railway TOKEN    — Deploy no Railway
  node deploy-gateway.js render TOKEN    — Deploy no Render
  node deploy-gateway.js supabase URL KEY — Config Supabase

Tokens:
  Railway: https://railway.app/account/tokens
  Render:  https://dashboard.render.com/u/settings → API Keys
  Supabase Service Key:
           https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/api
`);
    process.exit(0);
  }

  try {
    if (platform === 'railway') {
      if (!args[0]) { console.error('❌ Forneça o token: node deploy-gateway.js railway TOKEN'); process.exit(1); }
      await deployRailway(args[0]);
    } else if (platform === 'render') {
      if (!args[0]) { console.error('❌ Forneça o token: node deploy-gateway.js render TOKEN'); process.exit(1); }
      await deployRender(args[0]);
    } else if (platform === 'supabase') {
      if (!args[0] || !args[1]) {
        console.error('❌ Forneça: node deploy-gateway.js supabase URL_GATEWAY SERVICE_KEY');
        process.exit(1);
      }
      await configSupabase(args[0], args[1]);
    }
  } catch (err) {
    console.error('\n❌ Erro:', err.message);
    process.exit(1);
  }
}

main();
