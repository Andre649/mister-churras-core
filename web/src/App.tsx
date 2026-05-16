import { useState } from 'react';
import { SetupStep } from './components/steps/SetupStep';
import { MeatSelectionStep } from './components/steps/MeatSelectionStep';
import { ResultsStep } from './components/steps/ResultsStep';
import { calculateChurras, type Guests, type MenuSelection, type CalculationResult } from './utils/calculator';
import { Flame, LogIn, LogOut, Users } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { GuestManager } from './components/auth/GuestManager';
import { SeloBucanero } from './components/ui/SeloBucanero';
import { ButcherPortal } from './components/marketing/ButcherPortal';

type Step = 'setup' | 'meats' | 'results';

function AppContent() {
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuestManagerOpen, setIsGuestManagerOpen] = useState(false);
  const [isButcherPortalOpen, setIsButcherPortalOpen] = useState(window.location.search.includes('portal=butcher'));
  const { user, signOut } = useAuth();
  
  // State for Setup
  const [guests, setGuests] = useState<Guests>({ men: 0, women: 0, kids: 0, drinkers: 0 });
  const [durationHours, setDurationHours] = useState<number>(4);
  
  // State for Meats
  const [meats, setMeats] = useState<MenuSelection>({
    bovino: false,
    suino: false,
    frango: false,
    linguica: false,
    paoDeAlho: false,
    queijoCoalho: false,
  });

  // State for Results
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleGenerateList = async () => {
    try {
      const calcResult = await calculateChurras(guests, durationHours, meats);
      setResult(calcResult);
      setCurrentStep('results');
    } catch (error) {
      console.error('Falha no cálculo:', error);
      // Aqui poderíamos mostrar um toast de erro se tivéssemos um componente de toast
    }
  };

  const handleReset = () => {
    setGuests({ men: 0, women: 0, kids: 0, drinkers: 0 });
    setDurationHours(4);
    setMeats({ bovino: false, suino: false, frango: false, linguica: false, paoDeAlho: false, queijoCoalho: false });
    setResult(null);
    setCurrentStep('setup');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden font-sans antialiased">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-paper-texture opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="py-4 md:py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 w-full max-w-4xl mx-auto border-b-2 border-madeira/20">
        <div className="flex items-center gap-2 md:gap-3">
          <Flame className="text-sangue-boi w-8 h-8 md:w-9 md:h-9" />
          <h1 className="font-serif text-xl md:text-3xl font-bold tracking-tight text-prensa drop-shadow-sm uppercase">
            Mister <span className="text-sangue-boi">Churras</span>
          </h1>
          <p className="hidden sm:block text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-madeira font-bold font-serif ml-1 md:ml-2">Na Brasa</p>
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          {user ? (
            <div className="flex items-center gap-4 font-sans">
              <button 
                onClick={() => setIsGuestManagerOpen(true)} 
                className="hidden md:flex items-center gap-2 text-madeira hover:text-sangue-boi transition-colors"
                title="Gerenciar Batalh├úo"
              >
                <Users size={20} /> <span className="text-xs font-bold uppercase tracking-widest">Time</span>
              </button>
              <button onClick={signOut} className="flex items-center gap-2 text-madeira hover:text-sangue-boi transition-colors" title="Sair da Brasa">
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 text-sangue-boi hover:text-madeira transition-colors font-serif font-bold px-4 py-2 border-2 border-madeira/50 uppercase tracking-widest text-xs">
              <LogIn size={20} /> <span className="hidden md:inline">Entrar na Brasa</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center w-full relative z-10 py-8">
        {currentStep === 'setup' && (
          <SetupStep 
            guests={guests} 
            setGuests={setGuests} 
            durationHours={durationHours} 
            setDurationHours={setDurationHours} 
            onNext={() => setCurrentStep('meats')} 
          />
        )}
        
        {currentStep === 'meats' && (
          <MeatSelectionStep 
            meats={meats} 
            setMeats={setMeats} 
            onBack={() => setCurrentStep('setup')}
            onNext={handleGenerateList} 
          />
        )}
        
        {currentStep === 'results' && (
          <ResultsStep 
            result={result}
            durationHours={durationHours}
            guests={guests}
            onBack={() => setCurrentStep('meats')}
            onReset={handleReset}
            onRequestAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer / B2B Link */}
      <footer className="py-4 text-center relative z-10">
        <button 
          onClick={() => setIsButcherPortalOpen(true)}
          className="text-[10px] uppercase tracking-[0.2em] text-madeira/50 hover:text-sangue-boi transition-colors font-serif font-bold"
        >
          Sou A├ºougueiro? <span className="underline">Seja um Parceiro da Confraria</span>
        </button>
      </footer>

      {isButcherPortalOpen && <ButcherPortal onClose={() => setIsButcherPortalOpen(false)} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <GuestManager isOpen={isGuestManagerOpen} onClose={() => setIsGuestManagerOpen(false)} />
      <SeloBucanero onClick={handleReset} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
