import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, UserPlus, Trash2, Loader2, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Guest {
  id: string;
  name: string;
  whatsapp: string;
}

interface GuestManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestManager({ isOpen, onClose }: GuestManagerProps) {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchGuests();
    }
  }, [isOpen, user]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setGuests(data || []);
    } catch (error: unknown) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('guests')
        .insert([{ user_id: user.id, name, whatsapp }]);
      
      if (error) throw error;
      
      setName('');
      setWhatsapp('');
      setMessage({ type: 'success', text: 'Convidado cadastrado!' });
      fetchGuests();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar.';
      setMessage({ type: 'error', text: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setGuests(guests.filter(g => g.id !== id));
    } catch (error: unknown) {
      console.error('Error deleting guest:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-madeira hover:text-sangue-boi transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-pergaminho border-2 border-madeira flex items-center justify-center mx-auto mb-4 text-sangue-boi shadow-md">
            <Users size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-prensa uppercase tracking-widest">Alistar Batalhão</h2>
          <p className="text-madeira/70 mt-2 font-sans italic">Cadastre as almas que honrarão sua brasa.</p>
        </div>

        <form onSubmit={handleAddGuest} className="mb-8 space-y-4 bg-pergaminho/50 p-4 border-2 border-madeira/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-madeira uppercase tracking-widest mb-1">Nome do Guerreiro</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: João da Brasa"
                className="w-full px-4 py-2 bg-pergaminho border-b-2 border-madeira rounded-none text-prensa focus:outline-none focus:border-sangue-boi font-sans placeholder:text-madeira/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-madeira uppercase tracking-widest mb-1">WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="11999999999"
                className="w-full px-4 py-2 bg-pergaminho border-b-2 border-madeira rounded-none text-prensa focus:outline-none focus:border-sangue-boi font-sans placeholder:text-madeira/30"
              />
            </div>
          </div>
          <Button type="submit" fullWidth disabled={saving} variant="primary">
            {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : <><UserPlus size={18} className="mr-2" /> Alistar</>}
          </Button>
          {message && (
            <p className={`text-sm text-center font-sans italic ${message.type === 'success' ? 'text-green-700' : 'text-sangue-boi'}`}>{message.text}</p>
          )}
        </form>

        <div className="max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-sangue-boi" size={32} />
            </div>
          ) : guests.length === 0 ? (
            <p className="text-center text-madeira/50 py-8 italic font-sans">Nenhum convidado alistado ainda.</p>
          ) : (
            <ul className="space-y-2">
              {guests.map((guest) => (
                <li key={guest.id} className="flex justify-between items-center p-3 bg-pergaminho border border-madeira/20 hover:border-sangue-boi/30 transition-all font-sans">
                  <div>
                    <p className="text-prensa font-bold">{guest.name}</p>
                    <p className="text-madeira/60 text-sm">{guest.whatsapp}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="text-madeira/40 hover:text-sangue-boi transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
