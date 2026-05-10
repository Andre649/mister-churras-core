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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Format phone minimally if needed, but user should type DDI+DDD
    const formattedPhone = phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`;

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone: formattedPhone },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setStep('otp');
      // Adicionando (DEV) para facilitar o teste local caso a Evolution não esteja ligada
      const extraText = data?.dev_otp ? ` (DEV: ${data.dev_otp})` : '';
      setMessage({ type: 'success', text: 'Código enviado via WhatsApp!' + extraText });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar código.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formattedPhone = phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`;

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
      setMessage({ type: 'error', text: error.message || 'Código inválido.' });
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
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#F4F4F4]">Caderneta do Mestre</h2>
          <p className="text-[#BDC3C7] mt-2">Identifique-se via WhatsApp para acessar seus rituais.</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#BDC3C7] mb-1">WhatsApp (DDD + Número)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="11999999999"
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
              disabled={loading || phone.length < 10}
              variant="primary"
              className="mt-6"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Receber Código'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
             <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[#BDC3C7] mb-1">Código de 6 dígitos</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border-2 border-neutral-700 rounded-lg text-[#F4F4F4] placeholder-neutral-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all text-center tracking-widest font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
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
              disabled={loading || otp.length !== 6}
              variant="primary"
              className="mt-6"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Assinar Caderneta'}
            </Button>
            <button 
              type="button" 
              onClick={() => { setStep('phone'); setMessage(null); setOtp(''); }}
              className="w-full mt-4 text-sm text-[#BDC3C7] hover:text-[#F4F4F4] transition-colors"
            >
              Voltar e corrigir número
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
