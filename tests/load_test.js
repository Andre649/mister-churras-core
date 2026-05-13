import { calculateChurras } from '../src/utils/calculator.ts';

async function runLoadTest(concurrentUsers = 100) {
  console.log(`🚀 Iniciando Teste de Carga: ${concurrentUsers} usuários simultâneos...`);
  const startTime = Date.now();

  const mockGuests = { men: 10, women: 10, kids: 5, drinkers: 15 };
  const mockDuration = 6;
  const mockMeats = {
    bovino: true,
    suino: true,
    frango: true,
    linguica: true,
    paoDeAlho: true,
    queijoCoalho: true
  };

  const tasks = Array.from({ length: concurrentUsers }).map(async (_, i) => {
    try {
      // Simular processamento de cálculo
      const result = calculateChurras(mockGuests, mockDuration, mockMeats);
      
      // Simular latência de rede/DB
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
      
      if (i % 20 === 0) console.log(`✅ Usuário ${i} processado.`);
      return true;
    } catch (err) {
      console.error(`❌ Erro no usuário ${i}:`, err);
      return false;
    }
  });

  const results = await Promise.all(tasks);
  const endTime = Date.now();
  const successful = results.filter(Boolean).length;

  console.log('\n=======================================');
  console.log('RELATÓRIO DE CARGA - MISTER CHURRAS');
  console.log('=======================================');
  console.log(`Usuários Totais: ${concurrentUsers}`);
  console.log(`Sucessos: ${successful}`);
  console.log(`Falhas: ${concurrentUsers - successful}`);
  console.log(`Tempo Total: ${endTime - startTime}ms`);
  console.log(`Média por Usuário: ${(endTime - startTime) / concurrentUsers}ms`);
  console.log('=======================================\n');
}

runLoadTest(100).catch(console.error);
