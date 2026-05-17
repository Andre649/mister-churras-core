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
    <div className="flex flex-row items-center justify-between p-3 sm:p-4 mb-3 bg-pergaminho/50 border-b-2 border-madeira/30 transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
        {icon && <div className="text-sangue-boi shrink-0">{icon}</div>}
        <span className="font-serif font-bold text-prensa text-xs sm:text-base uppercase tracking-tight leading-tight whitespace-normal break-words">{label}</span>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button 
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-8 h-8 sm:w-10 sm:h-10 flex shrink-0 items-center justify-center bg-madeira text-papel hover:bg-sangue-boi disabled:opacity-30 transition-colors shadow-sm"
        >
          <Minus size={18} className="sm:w-5 sm:h-5" />
        </button>
        <span className="text-xl sm:text-2xl font-mono font-bold w-6 sm:w-8 text-center text-prensa shrink-0">{value}</span>
        <button 
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-8 h-8 sm:w-10 sm:h-10 flex shrink-0 items-center justify-center bg-madeira text-papel hover:bg-sangue-boi disabled:opacity-30 transition-colors shadow-sm"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
