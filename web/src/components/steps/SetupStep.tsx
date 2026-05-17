import React from 'react';
import { Counter } from '../ui/Counter';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Users, User, Baby, Clock, Flame, Beer } from 'lucide-react';
import type { Guests } from '../../utils/calculator';

interface SetupStepProps {
  guests: Guests;
  setGuests: React.Dispatch<React.SetStateAction<Guests>>;
  durationHours: number;
  setDurationHours: (val: number) => void;
  onNext: () => void;
  config: {
    title: string;
    subtitle: string;
    limits: {
      minDuration: number;
      maxDuration: number;
      defaultDuration: number;
    };
  };
}

export function SetupStep({ guests, setGuests, durationHours, setDurationHours, onNext, config }: SetupStepProps) {
  const updateGuest = (key: keyof Guests, value: number) => {
    setGuests(prev => ({ ...prev, [key]: value }));
  };

  const totalAdults = guests.men + guests.women;
  const totalGuests = totalAdults + guests.kids;
  const canProceed = totalGuests > 0 && durationHours > 0;

  // Business Rule: Drinkers cannot exceed total adults
  React.useEffect(() => {
    if (guests.drinkers > totalAdults) {
      setGuests(prev => ({ ...prev, drinkers: totalAdults }));
    }
  }, [totalAdults, guests.drinkers, setGuests]);

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8 border-b-2 border-prensa pb-4">
        <p className="text-sangue-boi text-[10px] font-serif font-bold uppercase tracking-[0.4em] mb-2 ink-bleed">Chronicles of Fire</p>
        <h2 className="text-3xl font-serif font-bold text-prensa mb-2 uppercase tracking-tight ink-bleed">{config.title}</h2>
        <p className="text-madeira/70 font-sans italic text-sm">{config.subtitle}</p>
      </div>

      <div className="space-y-4 mb-8">
        <Counter 
          label="Churrasqueiros (Homens)" 
          value={guests.men} 
          onChange={(v) => updateGuest('men', v)} 
          icon={<Users size={24} className="text-madeira" />}
        />
        <Counter 
          label="Churrasqueiras (Mulheres)" 
          value={guests.women} 
          onChange={(v) => updateGuest('women', v)} 
          icon={<User size={24} className="text-madeira" />}
        />
        <Counter 
          label="Pequenos (Crianças)" 
          value={guests.kids} 
          onChange={(v) => updateGuest('kids', v)} 
          icon={<Baby size={24} className="text-madeira" />}
        />
        
        <div className="pt-4 mt-4 border-t-2 border-madeira/20 border-dotted">
          <Counter 
            label="Time da Cerveja" 
            value={guests.drinkers} 
            onChange={(v) => updateGuest('drinkers', v)} 
            max={totalAdults}
            icon={<Beer size={24} className="text-madeira" />}
          />
          <p className="text-[10px] text-madeira/50 mt-2 font-sans italic text-center uppercase tracking-widest">
            Limite: Total de Adultos no Batalhão.
          </p>
        </div>

        <div className="pt-4 mt-4 border-t-2 border-madeira/20 border-dotted">
          <Counter 
            label="Duração da Brasa (Horas)" 
            value={durationHours} 
            onChange={setDurationHours} 
            min={config.limits.minDuration}
            max={config.limits.maxDuration}
            icon={<Clock size={24} className="text-madeira" />}
          />
          <p className="text-[10px] text-center text-madeira/50 mt-2 font-sans italic uppercase tracking-widest">
            {config.limits.defaultDuration}h é o tempo mínimo para selar o destino.
          </p>
        </div>
      </div>

      <Button 
        fullWidth 
        onClick={onNext} 
        disabled={!canProceed}
        className="mt-4"
        variant="primary"
      >
        ACENDER O FOGO <Flame className="ml-2" size={24} />
      </Button>
    </Card>
  );
}
