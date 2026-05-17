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
        "px-6 py-4 rounded-none font-serif font-bold text-lg uppercase tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ink-bleed",
        {
          "bg-sangue-boi text-papel ink-stamp hover:scale-[1.02] active:scale-95 shadow-[4px_4px_0px_#4A3728]": variant === 'primary',
          "bg-madeira text-papel ink-stamp hover:brightness-110": variant === 'secondary',
          "bg-transparent border-prensa text-prensa hover:bg-prensa/5": variant === 'outline',
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
