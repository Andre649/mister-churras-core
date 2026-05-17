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
          "w-full text-left p-4 rounded-none border-b border-madeira/20 transition-all duration-300 flex items-center justify-between group",
          isSelected 
            ? "bg-sangue-boi/5 shadow-[inset_0_0_10px_rgba(142,43,12,0.05)]" 
            : "hover:bg-pergaminho/50"
        )}
      >
        <div>
          <h3 className={cn("font-serif font-bold text-lg uppercase tracking-tight transition-colors", isSelected ? "text-sangue-boi" : "text-prensa")}>
            {label}
          </h3>
          <p className="text-madeira/60 text-xs italic font-sans">{description}</p>
        </div>
        <div className={cn(
          "w-6 h-6 border-prensa flex items-center justify-center transition-all",
          isSelected ? "bg-sangue-boi border-sangue-boi text-papel" : "border-madeira/30 text-transparent group-hover:border-madeira"
        )}>
          <Check size={14} strokeWidth={4} />
        </div>
      </button>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6 border-b-2 border-prensa pb-4">
        <button onClick={onBack} className="text-madeira hover:text-sangue-boi transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-serif font-bold text-prensa uppercase tracking-tighter ink-bleed">{config.title}</h2>
      </div>

      <div className="space-y-1 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {categories.map(category => (
          <React.Fragment key={category}>
            <div className="pt-6 pb-2 first:pt-0">
              <h3 className="text-madeira font-serif font-bold text-xs uppercase tracking-[0.2em] border-b border-madeira/10 pb-1">{category}</h3>
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
        variant="primary"
        className="mt-4"
      >
        SELAR O DESTINO <Flame className="ml-2" size={20} />
      </Button>
    </Card>
  );
}
