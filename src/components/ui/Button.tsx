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
        "px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        {
          "bg-gradient-to-r from-brasa-600 to-red-600 text-offwhite glow-brasa hover:glow-brasa-hover hover:-translate-y-0.5 border border-brasa-500/30": variant === 'primary',
          "bg-carvao-900 text-offwhite hover:bg-carvao-950 border border-zinc-700 hover:border-zinc-500": variant === 'secondary',
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
