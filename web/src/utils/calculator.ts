export interface Guests {
  men: number;
  women: number;
  kids: number;
  drinkers: number;
}

export interface MenuSelection {
  [key: string]: boolean;
}

export interface CalculationResult {
  meats: {
    bovino: number; // in kg
    suino: number;
    frango: number;
    linguica: number;
    total: number;
  };
  sides: {
    paoDeAlho: number; // units
    queijoCoalho: number; // units
    farofa: number; // kg
    vinagrete: number; // kg
  };
  drinks: {
    beer: number; // in units
    sodaWater: number; // in liters
  };
  supplies: {
    coal: number; // in kg
    salt: number; // in kg
  };
}

export interface AppConfig {
  app: {
    name: string;
    tagline: string;
  };
  steps: {
    setup: {
      title: string;
      subtitle: string;
      limits: {
        minDuration: number;
        maxDuration: number;
        defaultDuration: number;
      };
    };
    meats: {
      title: string;
      options: Array<{
        id: string;
        label: string;
        description: string;
        category: string;
      }>;
    };
  };
}

// 100% Reliable Local Offline Backup Config
const DEFAULT_CONFIG: AppConfig = {
  app: {
    name: "Mister Churras",
    tagline: "Na Brasa"
  },
  steps: {
    setup: {
      title: "Tamanho do Time",
      subtitle: "Quem vai dominar a grelha hoje?",
      limits: {
        minDuration: 1,
        maxDuration: 24,
        defaultDuration: 4
      }
    },
    meats: {
      title: "O que vai pra grelha?",
      options: [
        { 
          id: "bovino", 
          label: "Bovino", 
          description: "Picanha, Fraldinha, Ancho, Chorizo",
          category: "Proteínas"
        },
        { 
          id: "suino", 
          label: "Suíno", 
          description: "Panceta, Costelinha, Picanha Suína",
          category: "Proteínas"
        },
        { 
          id: "frango", 
          label: "Frango", 
          description: "Coraçãozinho, Tulipa, Sobrecoxa desossada",
          category: "Proteínas"
        },
        { 
          id: "linguica", 
          label: "Linguiça", 
          description: "Toscana, Apimentada, Cuiabana",
          category: "Proteínas"
        },
        { 
          id: "paoDeAlho", 
          label: "Pão de Alho", 
          description: "O clássico intocável (2 por guerreiro)",
          category: "Guarnições"
        },
        { 
          id: "queijoCoalho", 
          label: "Queijo Coalho", 
          description: "Dourado e derretido (1 por pessoa)",
          category: "Guarnições"
        }
      ]
    }
  }
};

// 100% Identical Local Math Engine matching Backend Calculation
function localCalculateChurras(
  guests: Guests,
  durationHours: number,
  meats: MenuSelection,
  appetite?: 'moderado' | 'mestre' | 'ogro'
): CalculationResult {
  // 1. Base consumption for 4 hours
  let baseMeatTotal = (guests.men * 0.6) + (guests.women * 0.4) + (guests.kids * 0.25);
  
  // Appetite intensity multiplier
  const appetiteFactor = appetite === 'moderado' ? 0.8 : (appetite === 'ogro' ? 1.25 : 1.0);
  baseMeatTotal = baseMeatTotal * appetiteFactor;
  
  // Accelerator for time > 4h (10% extra per additional hour)
  if (durationHours > 4) {
    const extraHours = durationHours - 4;
    baseMeatTotal = baseMeatTotal * (1 + (0.10 * extraHours));
  }

  // Mestre's safety margin: +15% for meat
  const totalMeatKg = baseMeatTotal * 1.15;

  // Distribute based on selected meats
  let activeMeatsCount = 0;
  if (meats.bovino) activeMeatsCount++;
  if (meats.suino) activeMeatsCount++;
  if (meats.frango) activeMeatsCount++;
  if (meats.linguica) activeMeatsCount++;

  // Default proportions
  let pBovino = 0, pSuino = 0, pFrango = 0, pLinguica = 0;
  
  if (activeMeatsCount > 0) {
    if (meats.bovino && !meats.suino && !meats.frango && !meats.linguica) {
      pBovino = 1;
    } else if (meats.bovino) {
      pBovino = 0.5; // Always 50% if mixed
      const remaining = 0.5;
      const others = activeMeatsCount - 1;
      if (meats.suino) pSuino = remaining / others;
      if (meats.frango) pFrango = remaining / others;
      if (meats.linguica) pLinguica = remaining / others;
    } else {
      // No bovino selected, split evenly
      const split = 1 / activeMeatsCount;
      if (meats.suino) pSuino = split;
      if (meats.frango) pFrango = split;
      if (meats.linguica) pLinguica = split;
    }
  }

  // Drinks (4h base)
  const adults = guests.men + guests.women;
  let baseBeer = guests.drinkers * 8; // 8 units per drinker
  let baseSoda = (adults + guests.kids) * 1; // 1L per person

  if (durationHours > 4) {
    const extraHours = durationHours - 4;
    baseBeer = baseBeer * (1 + (0.10 * extraHours));
    baseSoda = baseSoda * (1 + (0.10 * extraHours));
  }

  // Safety margin for drinks +10%
  const totalBeer = Math.ceil(baseBeer * 1.10);
  const totalSoda = Math.ceil(baseSoda * 1.10);

  // Supplies
  const totalCoal = Math.ceil(totalMeatKg); // 1:1 ratio
  const totalSalt = Math.ceil((totalMeatKg / 10) * 0.5 * 10) / 10; // 500g per 10kg

  // Sides
  const totalPeople = adults + guests.kids;
  const paoDeAlho = meats.paoDeAlho ? (adults * 2 + guests.kids * 1) : 0;
  const queijoCoalho = meats.queijoCoalho ? totalPeople * 1 : 0;
  const farofa = Math.round(totalPeople * 0.1 * 10) / 10; // 100g per person
  const vinagrete = Math.round(totalPeople * 0.1 * 10) / 10; // 100g per person

  const finalSalt = totalSalt < 0.5 ? 0.5 : totalSalt;

  return {
    meats: {
      bovino: Math.round(totalMeatKg * pBovino * 10) / 10,
      suino: Math.round(totalMeatKg * pSuino * 10) / 10,
      frango: Math.round(totalMeatKg * pFrango * 10) / 10,
      linguica: Math.round(totalMeatKg * pLinguica * 10) / 10,
      total: Math.round(totalMeatKg * 10) / 10,
    },
    sides: {
      paoDeAlho,
      queijoCoalho,
      farofa,
      vinagrete,
    },
    drinks: {
      beer: totalBeer,
      sodaWater: totalSoda,
    },
    supplies: {
      coal: totalCoal,
      salt: finalSalt,
    }
  };
}

export async function fetchAppConfig(): Promise<AppConfig> {
  try {
    const response = await fetch('/api/v1/config');
    if (!response.ok) throw new Error('Falha ao carregar configuração da brasa');
    return await response.json();
  } catch (error) {
    console.warn('Usando configuração local offline de backup do Mister Churras:', error);
    return DEFAULT_CONFIG;
  }
}

export async function calculateChurras(
  guests: Guests,
  durationHours: number,
  meats: MenuSelection,
  appetite?: 'moderado' | 'mestre' | 'ogro'
): Promise<CalculationResult> {
  try {
    const response = await fetch('/api/v1/calcular-churrasco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guests, durationHours, meats, appetite }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao calcular churrasco');
    }

    return await response.json();
  } catch (error) {
    console.warn('Realizando cálculo local de backup offline do Mister Churras:', error);
    return localCalculateChurras(guests, durationHours, meats, appetite);
  }
}
