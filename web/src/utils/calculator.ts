export interface Guests {
  men: number;
  women: number;
  kids: number;
  drinkers: number;
}

export interface MenuSelection {
  bovino: boolean;
  suino: boolean;
  frango: boolean;
  linguica: boolean;
  paoDeAlho: boolean;
  queijoCoalho: boolean;
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

export async function fetchAppConfig(): Promise<AppConfig> {
  const response = await fetch('/api/v1/config');
  if (!response.ok) throw new Error('Falha ao carregar configuração da brasa');
  return response.json();
}

export async function calculateChurras(
  guests: Guests,
  durationHours: number,
  meats: MenuSelection
): Promise<CalculationResult> {
  const response = await fetch('/api/v1/calcular-churrasco', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guests, durationHours, meats }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao calcular churrasco');
  }

  return await response.json();
}

