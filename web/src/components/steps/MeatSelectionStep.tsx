import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../ui/Button';
import { ArrowLeft, Flame, Check } from 'lucide-react';
import type { MenuSelection } from '../../utils/calculator';

interface MeatSelectionStepProps {
  meats: MenuSelection;
  setMeats: React.Dispatch<React.SetStateAction<MenuSelection>>;
  onNext: () => void;
  onBack: () => void;
  config: {
    title: string;
    options: Array<{
      id: string;
      label: string;
      description: string;
      category: string;
    }>;
  };
}

export function MeatSelectionStep({ meats, setMeats, onNext, onBack, config }: MeatSelectionStepProps) {
  const toggleMeat = (key: string) => {
    setMeats(prev => ({ ...prev, [key]: !prev[prev.hasOwnProperty(key) ? key : ''] }));
    // Note: Since MenuSelection might have fixed keys in TS, we use a more robust way if it's dynamic
    setMeats(prev => ({ ...prev, [key]: !prev[key as keyof MenuSelection] }));
  };

  const hasSelection = Object.values(meats).some(Boolean);

  const categories = Array.from(new Set(config.options.map(o => o.category)));

  const MeatOption = ({ label, id, description }: { label: string, id: string, description: string }) => {
    const isSelected = meats[id as keyof MenuSelection];
    return (
      <button
        onClick={() => toggleMeat(id)}
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
        <h2 className="text-2xl font-serif font-bold text-brasa-500">{config.title}</h2>
      </div>

      <div className="space-y-3 mb-8">
        {categories.map(category => (
          <React.Fragment key={category}>
            <div className="pt-4 pb-2">
              <h3 className="text-zinc-400 font-serif font-bold text-lg">{category}</h3>
            </div>
            {config.options
              .filter(o => o.category === category)
              .map(option => (
                <MeatOption 
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  description={option.description}
                />
              ))}
          </React.Fragment>
        ))}
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
