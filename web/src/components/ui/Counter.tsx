import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  icon?: React.ReactNode;
}

export function Counter({ label, value, onChange, min = 0, max = 99, icon }: CounterProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-pergaminho/50 border-b-2 border-madeira/30 transition-all duration-300">
      <div className="flex items-center gap-3">
        {icon && <div className="text-sangue-boi">{icon}</div>}
        <span className="font-serif font-bold text-prensa text-base uppercase tracking-tight">{label}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center bg-madeira text-papel hover:bg-sangue-boi disabled:opacity-30 transition-colors shadow-sm"
        >
          <Minus size={20} />
        </button>
        <span className="text-2xl font-mono font-bold w-8 text-center text-prensa">{value}</span>
        <button 
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center bg-madeira text-papel hover:bg-sangue-boi disabled:opacity-30 transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
