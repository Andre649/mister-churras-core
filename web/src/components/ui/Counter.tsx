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
    <div className="flex items-center justify-between p-4 mb-3 bg-[#1A1A1A] border-x-4 border-neutral-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] transition-all duration-300">
      <div className="flex items-center gap-3">
        {icon && <div className="text-brasa-500">{icon}</div>}
        <span className="font-medium text-offwhite text-lg">{label}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center bg-neutral-900 text-zinc-300 hover:bg-[#D35400] hover:text-[#F4F4F4] disabled:opacity-50 disabled:hover:bg-neutral-900 transition-colors shadow-[inset_0_0_5px_rgba(0,0,0,0.8)] border border-neutral-800"
        >
          <Minus size={20} />
        </button>
        <span className="text-2xl font-mono font-bold w-8 text-center text-[#F4F4F4]">{value}</span>
        <button 
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center bg-neutral-900 text-zinc-300 hover:bg-[#D35400] hover:text-[#F4F4F4] disabled:opacity-50 disabled:hover:bg-neutral-900 transition-colors shadow-[inset_0_0_5px_rgba(0,0,0,0.8)] border border-neutral-800"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
