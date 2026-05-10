import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  fullWidth = false,
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-4 rounded-none border-y-2 border-zinc-900 font-serif font-bold text-lg uppercase tracking-wide transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        {
          "bg-gradient-to-r from-[#8e2900] via-brasa-600 to-[#8e2900] text-offwhite pulse-brasa hover:glow-brasa-hover shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border-x-4 border-x-zinc-900": variant === 'primary',
          "bg-carvao-900 text-offwhite hover:bg-carvao-950 border-x-4 border-zinc-800 hover:border-zinc-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]": variant === 'secondary',
          "bg-transparent border-2 border-brasa-500 text-brasa-500 hover:bg-brasa-500/10": variant === 'outline',
          "w-full": fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
