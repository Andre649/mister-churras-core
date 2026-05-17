/**
 * deploy-to-railway.js
 * 
 * Script para fazer o deploy do Mister Churras Gateway no Railway via API.
 * 
 * COMO USAR:
 * 1. Acesse: https://railway.app/account/tokens
 * 2. Clique em "Create Token", dê o nome "mister-churras-deploy", copie o token
 * 3. Rode: node deploy-to-railway.js SEU_TOKEN_AQUI
 */

const RAILWAY_TOKEN = process.argv[2];
const GITHUB_REPO = 'Andre649/mister-churras-core';
const SERVICE_NAME = 'mister-churras-gateway';
const ROOT_DIR = 'messaging-gateway';
const GATEWAY_API_KEY = 'mister-churras-secret-2024';

if (!RAILWAY_TOKEN) {
  console.error('❌ Uso: node deploy-to-railway.js SEU_TOKEN_AQUI');
  console.error('   Obtenha o token em: https://railway.app/account/tokens');
  process.exit(1);
}

const RAILWAY_GQL = 'https://backboard.railway.app/graphql/v2';

async function gql(query, variables = {}) {
  const res = await fetch(RAILWAY_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RAILWAY_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function main() {
  console.log('🔥 Mister Churras Gateway — Deploy no Railway\n');

  // 1. Get user/team info
  console.log('1. Verificando autenticação...');
  const me = await gql(`query { me { id name email } }`);
  console.log(`   ✅ Logado como: ${me.me.name} (${me.me.email})\n`);

  // 2. Create project
  console.log('2. Criando projeto no Railway...');
  const proj = await gql(`
    mutation CreateProject($input: ProjectCreateInput!) {
      projectCreate(input: $input) { id name }
    }
  `, { input: { name: 'mister-churras-gateway' } });
  const projectId = proj.projectCreate.id;
  console.log(`   ✅ Projeto criado: ${proj.projectCreate.name} (${projectId})\n`);

  // 3. Create service from GitHub repo
  console.log('3. Criando serviço a partir do GitHub...');
  const svc = await gql(`
    mutation CreateService($input: ServiceCreateInput!) {
      serviceCreate(input: $input) { id name }
    }
  `, {
    input: {
      projectId,
      name: SERVICE_NAME,
      source: {
        repo: GITHUB_REPO,
        branch: 'main',
      },
    }
  });
  const serviceId = svc.serviceCreate.id;
  console.log(`   ✅ Serviço criado: ${svc.serviceCreate.name} (${serviceId})\n`);

  // 4. Get environment ID
  console.log('4. Obtendo ambiente...');
  const envData = await gql(`
    query GetEnvironments($projectId: String!) {
      project(id: $projectId) {
        environments { edges { node { id name } } }
      }
    }
  `, { projectId });
  const envId = envData.project.environments.edges[0]?.node?.id;
  const envName = envData.project.environments.edges[0]?.node?.name;
  console.log(`   ✅ Ambiente: ${envName} (${envId})\n`);

  // 5. Set ROOT_DIRECTORY variable
  console.log('5. Configurando Root Directory...');
  await gql(`
    mutation UpsertVariable($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }
  `, {
    input: {
      projectId,
      environmentId: envId,
      serviceId,
      name: 'RAILWAY_SERVICE_ROOT_DIR',
      value: ROOT_DIR,
    }
  });

  // 6. Set environment variables
  console.log('6. Configurando variáveis de ambiente...');
  const vars = [
    { name: 'GATEWAY_API_KEY', value: GATEWAY_API_KEY },
    { name: 'NODE_ENV', value: 'production' },
  ];
  for (const v of vars) {
    await gql(`
      mutation UpsertVariable($input: VariableUpsertInput!) {
        variableUpsert(input: $input)
      }
    `, {
      input: { projectId, environmentId: envId, serviceId, name: v.name, value: v.value }
    });
    console.log(`   ✅ ${v.name} configurado`);
  }

  // 7. Generate public domain
  console.log('\n7. Gerando domínio público...');
  try {
    const domain = await gql(`
      mutation GenerateDomain($serviceId: String!, $environmentId: String!) {
        serviceDomainCreate(serviceId: $serviceId, environmentId: $environmentId) {
          domain
        }
      }
    `, { serviceId, environmentId: envId });
    const publicUrl = `https://${domain.serviceDomainCreate.domain}`;
    console.log(`   ✅ URL pública: ${publicUrl}\n`);
    
    // 8. Trigger deploy
    console.log('8. Iniciando deploy...');
    await gql(`
      mutation Deploy($serviceId: String!, $environmentId: String!) {
        serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
      }
    `, { serviceId, environmentId: envId });
    console.log('   ✅ Deploy iniciado!\n');

    console.log('═'.repeat(60));
    console.log('🎉 DEPLOY INICIADO COM SUCESSO!');
    console.log('═'.repeat(60));
    console.log(`\n📍 URL do Gateway: ${publicUrl}`);
    console.log(`📍 QR Code:        ${publicUrl}/qr`);
    console.log(`📍 Status:         ${publicUrl}/status`);
    console.log('\n⏳ O build vai levar alguns minutos (Docker multi-stage).');
    console.log('   Acompanhe em: https://railway.app/dashboard\n');
    console.log('PRÓXIMO PASSO: Configure o Supabase com esta URL');
    console.log(`   GATEWAY_URL = ${publicUrl}`);

  } catch (domainErr) {
    console.log('   ⚠️ Não foi possível gerar domínio automaticamente.');
    console.log('   Acesse o dashboard do Railway para gerar manualmente.');
    console.log(`\n   Projeto ID: ${projectId}`);
    console.log(`   Serviço ID: ${serviceId}`);
  }
}

main().catch(err => {
  console.error('\n❌ Erro durante o deploy:', err.message);
  process.exit(1);
});
