import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  fullWidth = false,
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-sangue-boi text-pergaminho border-2 border-madeira shadow-[2px_2px_0px_#4A3728] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
    secondary: "bg-ouro-velho text-prensa border-2 border-madeira shadow-[2px_2px_0px_#4A3728] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
    outline: "bg-transparent border-2 border-madeira text-prensa hover:bg-madeira/10",
    ghost: "bg-transparent text-zinc-500 hover:text-prensa hover:bg-madeira/5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-2.5 font-serif font-bold uppercase tracking-[0.2em] text-sm transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
