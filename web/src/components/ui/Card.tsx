import React from 'react';
import { cn } from './Button'; // reuse cn utility

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-pergaminho/95 border-prensa shadow-[2px_2px_10px_rgba(0,0,0,0.1)] p-6 relative overflow-hidden",
        className
      )} 
      {...props}
    >
      {/* Newspaper texture overlay */}
      <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none mix-blend-multiply" />
      
      {/* Decorative newspaper line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-prensa opacity-10" />
      
      <div className="relative z-10 ink-bleed">
        {children}
      </div>
    </div>
  );
}
