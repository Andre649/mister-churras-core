import { cn } from './Button';
import logoUrl from '../../assets/logo-oficial.png';

export function SeloBucanero({ className, onClick }: { className?: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-24 h-24 z-40 transition-transform hover:scale-110 active:scale-95 group focus:outline-none ink-stamp",
        className
      )}
    >
      {/* Official Wax Seal Logo */}
      <div className="relative w-full h-full drop-shadow-[0_5px_15px_rgba(142,43,12,0.4)]">
        <img 
          src={logoUrl} 
          alt="Mister Churras Logo" 
          className="w-full h-full object-contain pulse-ritual"
        />
      </div>

      {/* Tooltip hint */}
      <div className="absolute -top-12 right-0 bg-prensa text-papel text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif uppercase tracking-[0.2em] border border-madeira shadow-lg ink-bleed">
        NOVA RODADA
      </div>
    </button>
  );
}
