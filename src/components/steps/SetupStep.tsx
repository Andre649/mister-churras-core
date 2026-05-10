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
}

export function SetupStep({ guests, setGuests, durationHours, setDurationHours, onNext }: SetupStepProps) {
  const updateGuest = (key: keyof Guests, value: number) => {
    setGuests(prev => ({ ...prev, [key]: value }));
  };

  const totalAdults = guests.men + guests.women;
  const totalGuests = totalAdults + guests.kids;
  const canProceed = totalGuests > 0 && durationHours > 0;

  // Garantir que os bebedores não ultrapassem o total de adultos
  React.useEffect(() => {
    if (guests.drinkers > totalAdults) {
      setGuests(prev => ({ ...prev, drinkers: totalAdults }));
    }
  }, [totalAdults, guests.drinkers, setGuests]);

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#D35400] mb-2 uppercase tracking-wide">Defina o Batalhão</h2>
        <p className="text-[#BDC3C7]">Prepare sua tropa para a brasa.</p>
      </div>

      <div className="space-y-4 mb-8">
        <Counter 
          label="Guerreiros" 
          value={guests.men} 
          onChange={(v) => updateGuest('men', v)} 
          icon={<Users size={24} />}
        />
        <Counter 
          label="Guardiãs" 
          value={guests.women} 
          onChange={(v) => updateGuest('women', v)} 
          icon={<User size={24} />}
        />
        <Counter 
          label="Aprendizes" 
          value={guests.kids} 
          onChange={(v) => updateGuest('kids', v)} 
          icon={<Baby size={24} />}
        />
        
        <div className="pt-4 mt-4 border-t border-zinc-900">
          <Counter 
            label="Bebem Cerveja" 
            value={guests.drinkers} 
            onChange={(v) => updateGuest('drinkers', v)} 
            max={totalAdults}
            icon={<Beer size={24} />}
          />
          <p className="text-xs text-zinc-500 mt-2">
            Máximo igual ao número de Guerreiros + Guardiãs.
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-zinc-900">
          <Counter 
            label="Tempo de Fogo (Horas)" 
            value={durationHours} 
            onChange={setDurationHours} 
            min={1}
            max={24}
            icon={<Clock size={24} />}
          />
          <p className="text-xs text-center text-zinc-500 mt-2">
            O Mestre recomenda no mínimo 4 horas de fogo.
          </p>
        </div>
      </div>

      <Button 
        fullWidth 
        onClick={onNext} 
        disabled={!canProceed}
        className="text-lg mt-4"
        variant="primary"
      >
        INICIAR O RITUAL <Flame className="ml-2 animate-pulse" size={24} />
      </Button>
    </Card>
  );
}
