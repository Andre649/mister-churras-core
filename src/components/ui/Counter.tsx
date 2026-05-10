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
    <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-carvao-950/50">
      <div className="flex items-center gap-3">
        {icon && <div className="text-brasa-500">{icon}</div>}
        <span className="font-medium text-offwhite text-lg">{label}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-300 hover:bg-brasa-600 hover:text-white disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-300 transition-colors"
        >
          <Minus size={20} />
        </button>
        <span className="text-2xl font-bold w-8 text-center">{value}</span>
        <button 
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-300 hover:bg-brasa-600 hover:text-white disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-300 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
