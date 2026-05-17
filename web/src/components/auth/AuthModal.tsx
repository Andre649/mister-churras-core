// AuthModal.tsx - Premium Sovereign WhatsApp Gateway
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Phone, Loader2, BookOpen, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const getFormattedPhone = () => {
    return phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formattedPhone = getFormattedPhone();

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone: formattedPhone },
      });

      if (error) throw error;
      if (data?.error === 'gateway_offline') throw new Error('gateway_offline');
      if (data?.error) throw new Error(data.error);
      
      setStep('otp');
      setMessage({ type: 'success', text: 'Código enviado via WhatsApp!' });
    } catch (error: any) {
      let errorMsg = 'Erro ao enviar código.';
      if (error.message === 'gateway_offline') {
        errorMsg = 'Parece que você está sem internet, só será possível calcular o seu churrasco';
      } else if (error.message?.includes('non-2xx')) {
        errorMsg = 'Erro ao conectar com o servidor. Tente novamente.';
      } else {
        errorMsg = error.message || 'Erro ao enviar código.';
      }
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formattedPhone = getFormattedPhone();

    try {
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { phone: formattedPhone, token: otp },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      const { error: loginError } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password: data.session_password
      });

      if (loginError) throw loginError;

      onClose(); // Login successful
    } catch (error: any) {
      const errorMsg = error.message?.includes('non-2xx') 
        ? 'Código inválido ou expirado. Peça um novo código.' 
        : error.message || 'Código inválido.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-madeira hover:text-sangue-boi transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6 border-b-2 border-prensa pb-4">
          <div className="w-16 h-16 rounded-none bg-pergaminho border-prensa flex items-center justify-center mx-auto mb-4 text-sangue-boi shadow-sm ink-stamp">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-prensa uppercase tracking-tighter ink-bleed">Caderneta do Mestre</h2>
          <p className="text-madeira/70 mt-2 font-sans italic text-sm">Identifique-se via WhatsApp para assinar seus rituais.</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-serif font-bold text-madeira uppercase tracking-widest mb-1">WhatsApp (DDD + Número)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-madeira/40" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="11999999999"
                  className="w-full pl-10 pr-4 py-3 bg-pergaminho/50 border-2 border-madeira/20 rounded-none text-prensa placeholder-madeira/30 focus:outline-none focus:border-sangue-boi transition-all"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-none text-xs border text-center font-sans italic ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-700' : 'bg-sangue-boi/10 border-sangue-boi/30 text-sangue-boi'}`}>
                {message.text}
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading || phone.length < 10}
              variant="primary"
              className="mt-6"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'RECEBER CÓDIGO'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
             <div>
              <label htmlFor="otp" className="block text-xs font-serif font-bold text-madeira uppercase tracking-widest mb-1">Código de 6 dígitos</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-madeira/40" />
                </div>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-pergaminho/50 border-2 border-madeira/20 rounded-none text-prensa placeholder-madeira/30 focus:outline-none focus:border-sangue-boi transition-all text-center tracking-[0.5em] font-mono font-bold text-xl"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-none text-xs border text-center font-sans italic ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-700' : 'bg-sangue-boi/10 border-sangue-boi/30 text-sangue-boi'}`}>
                {message.text}
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading || otp.length !== 6}
              variant="primary"
              className="mt-6"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'ASSINAR CADERNETA'}
            </Button>
            <button 
              type="button" 
              onClick={() => { setStep('phone'); setMessage(null); setOtp(''); }}
              className="w-full mt-4 text-xs text-madeira/60 hover:text-sangue-boi transition-colors uppercase tracking-widest font-serif"
            >
              Corrigir Número
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
