import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Mail, Loader2, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Elo Mágico enviado! Verifique seu email para entrar na tribo.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-[#D35400] transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-[#D35400] shadow-[inset_0_0_15px_rgba(211,84,0,0.2)]">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#F4F4F4]">Acesse o Cofre</h2>
          <p className="text-[#BDC3C7] mt-2">Identifique-se para salvar suas Listas do Mestre permanentemente.</p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#BDC3C7] mb-1">Seu Email de Guerreiro</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="mestre@brasa.com"
                className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border-2 border-neutral-700 rounded-lg text-[#F4F4F4] placeholder-neutral-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#C0392B]/10 border-[#C0392B]/30 text-[#C0392B]'}`}>
              {message.text}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading || !email}
            variant="primary"
            className="mt-6"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Enviar Elo Mágico'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
