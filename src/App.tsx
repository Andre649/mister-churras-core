import React, { useState } from 'react';
import { SetupStep } from './components/steps/SetupStep';
import { MeatSelectionStep } from './components/steps/MeatSelectionStep';
import { ResultsStep } from './components/steps/ResultsStep';
import { calculateChurras, type Guests, type MenuSelection, type CalculationResult } from './utils/calculator';
import { Flame } from 'lucide-react';

type Step = 'setup' | 'meats' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  
  // State for Setup
  const [guests, setGuests] = useState<Guests>({ men: 0, women: 0, kids: 0 });
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

  const handleGenerateList = () => {
    const calcResult = calculateChurras(guests, durationHours, meats);
    setResult(calcResult);
    setCurrentStep('results');
  };

  const handleReset = () => {
    setGuests({ men: 0, women: 0, kids: 0 });
    setDurationHours(4);
    setMeats({ bovino: false, suino: false, frango: false, linguica: false, paoDeAlho: false, queijoCoalho: false });
    setResult(null);
    setCurrentStep('setup');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-[#0a0807] text-offwhite font-sans antialiased">
      {/* Background rustic texture (wood/charcoal) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1c1410]/20 to-black/80 pointer-events-none mix-blend-multiply" />
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brasa-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="py-6 flex justify-center items-center gap-3 relative z-10">
        <Flame className="text-brasa-500 animate-[pulse-brasa_2s_infinite]" size={36} />
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-offwhite drop-shadow-lg">
          Mister <span className="text-brasa-500">Churras</span>
        </h1>
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
            onBack={() => setCurrentStep('meats')}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
