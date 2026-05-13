import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { ArrowLeft, Flame, Check } from 'lucide-react';
import type { MenuSelection } from '../../utils/calculator';

interface MeatSelectionStepProps {
  meats: MenuSelection;
  setMeats: React.Dispatch<React.SetStateAction<MenuSelection>>;
  onNext: () => void;
  onBack: () => void;
}

export function MeatSelectionStep({ meats, setMeats, onNext, onBack }: MeatSelectionStepProps) {
  const toggleMeat = (key: keyof MenuSelection) => {
    setMeats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasSelection = Object.values(meats).some(Boolean);

  const MeatOption = ({ label, type, description }: { label: string, type: keyof MenuSelection, description: string }) => {
    const isSelected = meats[type];
    return (
      <button
        onClick={() => toggleMeat(type)}
        className={cn(
          "w-full text-left p-4 rounded-none border-2 transition-all duration-300 flex items-center justify-between",
          isSelected 
            ? "border-sangue-boi bg-sangue-boi/5 shadow-md" 
            : "border-madeira/20 bg-pergaminho/50 hover:border-madeira/50"
        )}
      >
        <div>
          <h3 className={cn("font-serif font-bold text-lg uppercase", isSelected ? "text-sangue-boi" : "text-prensa")}>
            {label}
          </h3>
          <p className="text-madeira/60 text-xs font-sans italic mt-1">{description}</p>
        </div>
        <div className={cn(
          "w-6 h-6 rounded-full border border-madeira flex items-center justify-center transition-colors",
          isSelected ? "bg-sangue-boi text-pergaminho" : "bg-transparent text-transparent"
        )}>
          <Check size={14} strokeWidth={3} />
        </div>
      </button>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-madeira hover:text-sangue-boi transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-serif font-bold text-prensa uppercase tracking-widest">O Mapa da Brasa</h2>
      </div>

      <div className="space-y-3 mb-8">
        <MeatOption type="bovino" label="Bovino" description="Picanha, Fraldinha, Ancho, Chorizo" />
        <MeatOption type="suino" label="Suíno" description="Panceta, Costelinha, Picanha Suína" />
        <MeatOption type="frango" label="Frango" description="Coraçãozinho, Tulipa, Sobrecoxa desossada" />
        <MeatOption type="linguica" label="Linguiça" description="Toscana, Apimentada, Cuiabana" />
        <div className="pt-4 pb-2">
          <h3 className="text-madeira/60 font-serif font-bold text-lg uppercase tracking-tighter border-b border-madeira/20">Guarnições da Confraria</h3>
        </div>
        <MeatOption type="paoDeAlho" label="Pão de Alho" description="O clássico intocável (2 por guerreiro)" />
        <MeatOption type="queijoCoalho" label="Queijo Coalho" description="Dourado e derretido (1 por pessoa)" />
      </div>

      <Button 
        fullWidth 
        onClick={onNext} 
        disabled={!hasSelection}
        className="text-lg"
      >
        Gerar Lista do Mestre <Flame className="ml-2" size={20} />
      </Button>
    </Card>
  );
}
