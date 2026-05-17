import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../ui/Button';
import { ArrowLeft, RefreshCw, ShoppingCart, Flame, Droplets, Package, Wheat, Loader2, X } from 'lucide-react';
import type { CalculationResult, Guests } from '../../utils/calculator';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, CheckCircle2 } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  whatsapp: string;
}

interface ResultsStepProps {
  result: CalculationResult | null;
  durationHours: number;
  guests: Guests;
  onReset: () => void;
  onBack: () => void;
  onRequestAuth: () => void;
}

export function ResultsStep({ result, durationHours, guests, onReset, onBack, onRequestAuth }: ResultsStepProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [availableGuests, setAvailableGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailableGuests();
    }
  }, [user]);

  useEffect(() => {
    if (isGuestSelectorOpen && user) {
      fetchAvailableGuests();
    }
  }, [isGuestSelectorOpen, user]);

  const fetchAvailableGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name');
      if (error) throw error;
      setAvailableGuests(data || []);
    } catch (err) {
      console.error('Error fetching guests:', err);
    }
  };

  if (!result) return null;

  const handleSave = async () => {
    if (!user) {
      onRequestAuth();
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // 1. Gravar o Evento
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([
          {
            user_id: user.id,
            title: `Churrasco do Mestre - ${new Date().toLocaleDateString('pt-BR')}`,
            data: {
              result,
              durationHours,
              guests: guests
            }
          }
        ])
        .select()
        .single();

      if (eventError) throw eventError;

      // 2. Vincular Convidados (se houver selecionados)
      if (selectedGuests.length > 0 && eventData) {
        const guestLinks = selectedGuests.map(guestId => ({
          event_id: eventData.id,
          guest_id: guestId
        }));

        const { error: linkError } = await supabase
          .from('event_guests')
          .insert(guestLinks);

        if (linkError) throw linkError;
      }

      setSaveMessage({ type: 'success', text: 'Churrasco e convidados gravados com sucesso!' });
      setSelectedGuests([]); // Limpar sele├º├úo ap├│s salvar
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.';
      setSaveMessage({ type: 'error', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const CategorySection = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: { label: string, value: string }[] }) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6 break-inside-avoid">
        <h3 className="text-lg font-serif font-bold text-sangue-boi mb-3 flex items-center gap-2 border-b-2 border-prensa pb-1 uppercase tracking-tighter ink-bleed">
          {icon} {title}
        </h3>
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-baseline py-1 border-b border-madeira/10 border-dotted">
              <span className="text-madeira font-sans text-xs uppercase tracking-wider">{item.label}</span>
              <div className="flex-1 border-b border-madeira/5 mx-2 border-dotted" />
              <span className="font-bold text-prensa font-mono text-sm whitespace-nowrap">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const meatItems: { label: string, value: string }[] = [];
  if (result.meats.bovino > 0) meatItems.push({ label: 'Cortes Bovinos', value: `${result.meats.bovino} kg` });
  if (result.meats.suino > 0) meatItems.push({ label: 'Cortes Suínos', value: `${result.meats.suino} kg` });
  if (result.meats.frango > 0) meatItems.push({ label: 'Cortes de Frango', value: `${result.meats.frango} kg` });
  if (result.meats.linguica > 0) meatItems.push({ label: 'Embutidos/Ling.', value: `${result.meats.linguica} kg` });
  
  if (meatItems.length > 0) {
    meatItems.push({ label: 'CARGA TOTAL', value: `${result.meats.total} kg` });
  }

  const sideItems: { label: string, value: string }[] = [];
  if (result.sides.paoDeAlho > 0) sideItems.push({ label: 'Pão de Alho', value: `${result.sides.paoDeAlho} un` });
  if (result.sides.queijoCoalho > 0) sideItems.push({ label: 'Queijo Coalho', value: `${result.sides.queijoCoalho} un` });
  if (result.sides.farofa > 0) sideItems.push({ label: 'Farofa da Casa', value: `${result.sides.farofa} kg` });
  if (result.sides.vinagrete > 0) sideItems.push({ label: 'Vinagrete Especial', value: `${result.sides.vinagrete} kg` });

  const drinkItems = [
    { label: 'Cerveja (Cevada)', value: `${result.drinks.beer} un` },
    { label: 'Hidratação Geral', value: `${result.drinks.sodaWater} L` },
  ];

  const supplyItems = [
    { label: 'Carvão de Carvalho', value: `${result.supplies.coal} kg` },
    { label: 'Sal de Parrilla', value: `${result.supplies.salt} kg` },
  ];

  const formatWhatsAppMessage = () => {
    if (!result) return '';
    
    let message = '*🔥 MISTER CHURRAS - O RITUAL 🔥*\n\n';
    message += `_O chamado da brasa foi atendido! Duração prevista: ${durationHours} horas._\n\n`;
    message += '*📜 MANIFESTO DO AÇOUGUE*\n';
    
    if (meatItems.length > 0) {
      meatItems.forEach(item => {
        message += `- ${item.label.toUpperCase()}: ${item.value}\n`;
      });
      message += '\n';
    }
    
    if (sideItems.length > 0) {
      message += '*🥗 GUARNIÇÕES DO MESTRE*\n';
      sideItems.forEach(item => {
        message += `- ${item.label}: ${item.value}\n`;
      });
      message += '\n';
    }
    
    if (drinkItems.length > 0) {
      message += '*🍺 SUPRIMENTOS LÍQUIDOS*\n';
      drinkItems.forEach(item => {
        message += `- ${item.label}: ${item.value}\n`;
      });
      message += '\n';
    }
    
    message += '_Lista gerada pelo Mister Churras - A Bíblia da Brasa._';
    return encodeURIComponent(message);
  };

  const handleSendToWhatsApp = () => {
    const phone = '5511999999999';
    const message = formatWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleBulkSend = async () => {
    if (selectedGuests.length === 0) return;
    
    setBulkLoading(true);
    const message = formatWhatsAppMessage();
    
    for (const guestId of selectedGuests) {
      const guest = availableGuests.find(g => g.id === guestId);
      if (guest) {
        window.open(`https://wa.me/${guest.whatsapp}?text=${message}`, '_blank');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setBulkLoading(false);
    setIsGuestSelectorOpen(false);
    setSelectedGuests([]);
  };

  const toggleGuestSelection = (id: string) => {
    setSelectedGuests(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-6 border-b-2 border-prensa pb-4">
        <button onClick={onBack} className="text-madeira hover:text-sangue-boi transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-serif font-bold text-prensa uppercase tracking-tighter ink-bleed">
          Manifesto da Brasa
        </h2>
      </div>

      <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar md:columns-2 gap-6 newspaper-column">
        <CategorySection title="Cortes" icon={<Flame size={20} className="text-sangue-boi ink-stamp" />} items={meatItems} />
        <CategorySection title="Extras" icon={<Wheat size={20} className="text-sangue-boi ink-stamp" />} items={sideItems} />
        <CategorySection title="Líquidos" icon={<Droplets size={20} className="text-sangue-boi ink-stamp" />} items={drinkItems} />
        <CategorySection title="Fogo" icon={<Package size={20} className="text-sangue-boi ink-stamp" />} items={supplyItems} />
      </div>

      <div className="mt-8 space-y-3">
        {saveMessage && (
          <div className={`p-3 rounded-none text-sm border text-center font-sans italic ${saveMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-700' : 'bg-sangue-boi/10 border-sangue-boi/30 text-sangue-boi'}`}>
            {saveMessage.text}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin mx-auto" size={20} /> : (
              <><ShoppingCart className="mr-2" size={18} /> Gravar</>
            )}
          </Button>
          <Button variant="primary" onClick={handleSendToWhatsApp}>
            <Flame className="mr-2" size={18} /> Lista do Açougue
          </Button>
        </div>

          <Button 
            variant="secondary" 
            fullWidth 
            disabled={availableGuests.length === 0}
            onClick={() => {
              if (!user) { onRequestAuth(); return; }
              setIsGuestSelectorOpen(true);
            }}
          >
          <Users className="mr-2" size={18} /> Convidar o Pessoal
        </Button>
        {availableGuests.length === 0 && (
          <p className="text-[10px] text-center text-sangue-boi/60 italic">Cadastre convidados no topo para liberar o convite.</p>
        )}

        {isGuestSelectorOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <Card className="w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-prensa uppercase tracking-tighter">Quem vai pro espeto?</h3>
                <button onClick={() => setIsGuestSelectorOpen(false)} className="text-madeira hover:text-sangue-boi"><X size={20} /></button>
              </div>
              <div className="max-h-[40vh] overflow-y-auto mb-6 pr-2 custom-scrollbar font-sans">
                {availableGuests.length === 0 ? (
                  <p className="text-center text-madeira py-4 italic text-sm">Ninguém na lista ainda. Cadastre o time lá no topo.</p>
                ) : (
                  <ul className="space-y-2">
                    {availableGuests.map(guest => (
                      <li key={guest.id}>
                        <button 
                          onClick={() => toggleGuestSelection(guest.id)}
                          className={cn(
                            "w-full flex justify-between items-center p-3 border transition-all rounded-none",
                            selectedGuests.includes(guest.id) 
                              ? "bg-sangue-boi/10 border-sangue-boi text-prensa" 
                              : "bg-pergaminho border-madeira/20 text-madeira/60"
                          )}
                        >
                          <span className="font-bold">{guest.name}</span>
                          {selectedGuests.includes(guest.id) && <CheckCircle2 size={18} className="text-sangue-boi" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button 
                fullWidth 
                variant="primary" 
                onClick={handleBulkSend}
                disabled={selectedGuests.length === 0 || bulkLoading}
              >
                {bulkLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : `Avisar ${selectedGuests.length} do Time`}
              </Button>
            </Card>
          </div>
        )}

        <Button variant="outline" fullWidth onClick={onReset} className="text-madeira/50 hover:text-prensa border-none">
          <RefreshCw className="mr-2" size={18} /> Refazer Cálculo
        </Button>
      </div>
    </Card>
  );
}
