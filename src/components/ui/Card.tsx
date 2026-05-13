import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "bg-pergaminho border-vitoriana shadow-md p-6 relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-paper-texture before:opacity-20 before:pointer-events-none",
        className
      )} 
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Victorian corner ornaments placeholder (can be improved with SVG) */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-ouro-velho/30 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-ouro-velho/30 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-ouro-velho/30 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ouro-velho/30 rounded-br-sm pointer-events-none" />
    </div>
  );
}
