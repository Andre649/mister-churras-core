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
        <p className="text-sangue-boi text-[10px] font-serif font-bold uppercase tracking-[0.3em] mb-2">Chronicles of Fire</p>
        <h2 className="text-3xl font-serif font-bold text-prensa mb-2 uppercase tracking-wide">Tamanho do Time</h2>
        <p className="text-madeira/70 font-sans italic">Quem vai dominar a grelha hoje?</p>
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
        
        <div className="pt-4 mt-4 border-t border-madeira/20">
          <Counter 
            label="Bebem Cerveja" 
            value={guests.drinkers} 
            onChange={(v) => updateGuest('drinkers', v)} 
            max={totalAdults}
            icon={<Beer size={24} className="text-madeira" />}
          />
          <p className="text-[10px] text-madeira/50 mt-2 font-sans italic">
            Máximo igual ao número de adultos no time.
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-madeira/20">
          <Counter 
            label="Tempo de Brasa (Horas)" 
            value={durationHours} 
            onChange={setDurationHours} 
            min={1}
            max={24}
            icon={<Clock size={24} className="text-madeira" />}
          />
          <p className="text-[10px] text-center text-madeira/50 mt-2 font-sans italic">
            Recomendamos no mínimo 4 horas para uma boa brasa.
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
        ACENDER O FOGO <Flame className="ml-2" size={24} />
      </Button>
    </Card>
  );
}
