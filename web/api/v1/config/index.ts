import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const config = {
    app: {
      name: "Mister Churras",
      tagline: "Na Brasa",
      version: "2.0.0-backend-sovereign"
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
    },
    businessRules: {
      guestCalculation: {
        kidFactor: 0.5,
        baseGramPerAdult: 600
      },
      validation: {
        maxDrinkersVsAdults: true
      }
    }
  };

  return res.status(200).json(config);
}
