import React from 'react';
import { cn } from './Button'; // reuse cn utility

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-carvao-900 border border-zinc-800 rounded-2xl p-6 shadow-xl",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
