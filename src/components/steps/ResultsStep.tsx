import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, RefreshCw, ShoppingCart, Flame, Droplets, Package, Wheat } from 'lucide-react';
import type { CalculationResult } from '../../utils/calculator';

interface ResultsStepProps {
  result: CalculationResult | null;
  onReset: () => void;
  onBack: () => void;
}

export function ResultsStep({ result, onReset, onBack }: ResultsStepProps) {
  if (!result) return null;

  const CategorySection = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: { label: string, value: string }[] }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-serif font-bold text-brasa-500 mb-3 flex items-center gap-2">
          {icon} {title}
        </h3>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-carvao-950/50 border border-zinc-800">
              <span className="text-zinc-300">{item.label}</span>
              <span className="font-bold text-offwhite">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const meatItems = [];
  if (result.meats.bovino > 0) meatItems.push({ label: 'Bovino', value: `${result.meats.bovino} kg` });
  if (result.meats.suino > 0) meatItems.push({ label: 'Suíno', value: `${result.meats.suino} kg` });
  if (result.meats.frango > 0) meatItems.push({ label: 'Frango', value: `${result.meats.frango} kg` });
  if (result.meats.linguica > 0) meatItems.push({ label: 'Linguiça', value: `${result.meats.linguica} kg` });
  
  // Total line for meats
  if (meatItems.length > 0) {
    meatItems.push({ label: 'Total de Carnes', value: `${result.meats.total} kg` });
  }

  const sideItems = [];
  if (result.sides.paoDeAlho > 0) sideItems.push({ label: 'Pão de Alho', value: `${result.sides.paoDeAlho} un` });
  if (result.sides.queijoCoalho > 0) sideItems.push({ label: 'Queijo Coalho', value: `${result.sides.queijoCoalho} un` });
  if (result.sides.farofa > 0) sideItems.push({ label: 'Farofa Pronta', value: `${result.sides.farofa} kg` });
  if (result.sides.vinagrete > 0) sideItems.push({ label: 'Vinagrete', value: `${result.sides.vinagrete} kg` });

  const drinkItems = [
    { label: 'Cerveja (Latas/Long Neck)', value: `${result.drinks.beer} un` },
    { label: 'Refrigerante / Água', value: `${result.drinks.sodaWater} L` },
  ];

  const supplyItems = [
    { label: 'Carvão', value: `${result.supplies.coal} kg` },
    { label: 'Sal Grosso', value: `${result.supplies.salt} kg` },
  ];

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 border-brasa-500/30">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-brasa-500 to-red-500">
          Lista do Mestre
        </h2>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <CategorySection title="Carnes" icon={<Flame size={20} />} items={meatItems} />
        <CategorySection title="Guarnições" icon={<Wheat size={20} />} items={sideItems} />
        <CategorySection title="Bebidas" icon={<Droplets size={20} />} items={drinkItems} />
        <CategorySection title="Suprimentos" icon={<Package size={20} />} items={supplyItems} />
      </div>

      <div className="mt-8 space-y-3">
        <Button fullWidth className="text-lg">
          <ShoppingCart className="mr-2" size={20} /> Salvar Lista (Em breve)
        </Button>
        <Button variant="outline" fullWidth onClick={onReset}>
          <RefreshCw className="mr-2" size={18} /> Novo Churrasco
        </Button>
      </div>
    </Card>
  );
}
