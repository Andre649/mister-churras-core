import { cn } from '../../utils/cn';
import logoUrl from '../../assets/logo-oficial.png';

export function SeloBucanero({ className, onClick }: { className?: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-24 h-24 z-40 transition-transform hover:scale-110 active:scale-95 group focus:outline-none",
        className
      )}
    >
      {/* Official Wax Seal Logo */}
      <div className="relative w-full h-full">
        <img 
          src={logoUrl} 
          alt="Mister Churras Logo" 
          className="w-full h-full object-contain drop-shadow-2xl pulse-ritual"
        />
      </div>

      {/* Tooltip hint */}
      <div className="absolute -top-12 right-0 bg-madeira text-pergaminho text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif uppercase tracking-widest border border-ouro-velho shadow-lg">
        Reiniciar Ritual
      </div>
    </button>
  );
}
