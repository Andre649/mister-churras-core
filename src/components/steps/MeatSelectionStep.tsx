import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../ui/Button';
import { ArrowLeft, Flame, Check } from 'lucide-react';
import type { MeatSelection } from '../../utils/calculator';

interface MeatSelectionStepProps {
  meats: MeatSelection;
  setMeats: React.Dispatch<React.SetStateAction<MeatSelection>>;
  onNext: () => void;
  onBack: () => void;
}

export function MeatSelectionStep({ meats, setMeats, onNext, onBack }: MeatSelectionStepProps) {
  const toggleMeat = (key: keyof MeatSelection) => {
    setMeats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasSelection = Object.values(meats).some(Boolean);

  const MeatOption = ({ label, type, description }: { label: string, type: keyof MeatSelection, description: string }) => {
    const isSelected = meats[type];
    return (
      <button
        onClick={() => toggleMeat(type)}
        className={cn(
          "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between",
          isSelected 
            ? "border-brasa-500 bg-brasa-500/10 shadow-[0_0_15px_rgba(234,88,12,0.1)]" 
            : "border-zinc-800 bg-carvao-950/50 hover:border-zinc-600"
        )}
      >
        <div>
          <h3 className={cn("font-bold text-lg", isSelected ? "text-brasa-500" : "text-offwhite")}>
            {label}
          </h3>
          <p className="text-zinc-400 text-sm mt-1">{description}</p>
        </div>
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
          isSelected ? "bg-brasa-500 text-white" : "bg-zinc-800 text-transparent"
        )}>
          <Check size={14} strokeWidth={3} />
        </div>
      </button>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-serif font-bold text-brasa-500">O que vai pra grelha?</h2>
      </div>

      <div className="space-y-3 mb-8">
        <MeatOption type="bovino" label="Bovino" description="Picanha, Alcatra, Fraldinha, Costela" />
        <MeatOption type="suino" label="Suíno" description="Panceta, Costelinha, Lombo" />
        <MeatOption type="frango" label="Frango" description="Coraçãozinho, Coxinha da asa, Sobrecoxa" />
        <MeatOption type="linguica" label="Linguiça" description="Toscana, Apimentada, Cuiabana" />
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
