import React from 'react';
import { cn } from './Button'; // reuse cn utility

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-carvao-950/90 border-4 border-zinc-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_30px_rgba(0,0,0,0.5)] rounded-xl p-6 relative overflow-hidden backdrop-blur-sm",
        className
      )} 
      {...props}
    >
      {/* Textura de madeira carbonizada via CSS gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1c1410]/30 to-black/80 pointer-events-none mix-blend-multiply" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
