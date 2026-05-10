import React from 'react';
import { Counter } from '../ui/Counter';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Users, User, Baby, Clock, Flame } from 'lucide-react';
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

  const totalGuests = guests.men + guests.women + guests.kids;
  const canProceed = totalGuests > 0 && durationHours > 0;

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-brasa-500 mb-2">Quem vai pro abate?</h2>
        <p className="text-zinc-400">Defina o batalhão que vai honrar a brasa.</p>
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
        className="text-lg"
      >
        Avançar para as Carnes <Flame className="ml-2" size={20} />
      </Button>
    </Card>
  );
}
