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

export function calculateChurras(
  guests: Guests,
  durationHours: number,
  meats: MenuSelection
): CalculationResult {
  // 1. Base consumption for 4 hours
  let baseMeatTotal = (guests.men * 0.6) + (guests.women * 0.4) + (guests.kids * 0.25);
  
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
      salt: totalSalt < 0.5 ? 0.5 : totalSalt,
    }
  };
}
