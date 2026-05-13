import { cn } from '../../utils/cn';

export function SeloBucanero({ className, onClick }: { className?: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-20 h-20 rounded-full flex items-center justify-center z-40 transition-transform hover:scale-110 active:scale-95 group",
        className
      )}
    >
      {/* Cera de Lacre Background */}
      <div className="absolute inset-0 bg-ouro-velho rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.5),_4px_4px_10px_rgba(0,0,0,0.3)] pulse-ritual" />
      
      {/* Inner Label */}
      <div className="relative w-16 h-16 rounded-full border-2 border-madeira/30 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-serif font-bold text-sangue-boi leading-none uppercase">Mister</span>
        <span className="text-[14px] font-serif font-bold text-sangue-boi leading-none uppercase tracking-tighter">Bucanero</span>
        <div className="w-8 h-[1px] bg-sangue-boi/50 my-1" />
        <span className="text-[8px] font-serif font-bold text-sangue-boi leading-none uppercase">1890</span>
      </div>

      {/* Tooltip hint */}
      <div className="absolute -top-12 right-0 bg-madeira text-pergaminho text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-serif uppercase tracking-widest border border-ouro-velho">
        Manual do Mestre
      </div>
    </button>
  );
}
