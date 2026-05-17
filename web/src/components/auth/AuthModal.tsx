// AuthModal.tsx - Premium Sovereign WhatsApp & Password Authentication
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Phone, Loader2, BookOpen, KeyRound, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'register' | 'login'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const getSanitizedPhone = () => {
    return phone.replace(/\D/g, ''); // Mantém apenas números
  };

  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const sanitizedPhone = getSanitizedPhone();
    if (sanitizedPhone.length < 10) {
      setMessage({ type: 'error', text: 'Por favor, insira um número válido com DDD.' });
      setLoading(false);
      return;
    }

    try {
      // Verificar se o usuário existe na nossa tabela pública de perfis
      const { data, error } = await supabase
        .from('mister_churras_users')
        .select('whatsapp')
        .eq('whatsapp', sanitizedPhone)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Já possui cadastro! Transiciona para etapa de Login
        setStep('login');
      } else {
        // Novo usuário! Transiciona para etapa de Cadastro
        setStep('register');
      }
    } catch (error: any) {
      console.error('Erro ao verificar número:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao conectar. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const sanitizedPhone = getSanitizedPhone();
    const email = `${sanitizedPhone}@gmail.com`;

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        if (loginError.message.includes('Invalid login credentials')) {
          throw new Error('Senha incorreta para este número.');
        }
        throw loginError;
      }

      // Atualiza last_login_at para registrar o acesso ativo
      await supabase
        .from('mister_churras_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('whatsapp', sanitizedPhone);

      onClose(); // Sucesso
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao efetuar login.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const sanitizedPhone = getSanitizedPhone();
    const email = `${sanitizedPhone}@gmail.com`;

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve conter no mínimo 6 caracteres.' });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas digitadas não conferem.' });
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira o seu nome.' });
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            whatsapp: sanitizedPhone
          }
        }
      });

      if (signUpError) throw signUpError;

      onClose(); // Sucesso
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao efetuar o cadastro.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setMessage(null);
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200 bg-pergaminho border-4 border-double border-madeira/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Parchment subtle texture */}
        <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-madeira hover:text-sangue-boi transition-colors z-20"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6 border-b-2 border-prensa pb-4 relative z-10">
          <div className="w-16 h-16 rounded-none bg-pergaminho border-2 border-madeira/40 flex items-center justify-center mx-auto mb-4 text-sangue-boi shadow-inner ink-stamp relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-prensa uppercase tracking-tighter ink-bleed">Caderneta do Mestre</h2>
          <p className="text-madeira/70 mt-2 font-sans italic text-xs md:text-sm">
            {step === 'phone' && 'Identifique-se via WhatsApp para assinar seus rituais.'}
            {step === 'login' && 'Bem-vindo de volta! Insira sua senha para acessar.'}
            {step === 'register' && 'Novo por aqui! Escolha o seu nome e crie uma senha.'}
          </p>
        </div>

        <div className="relative z-10">
          {step === 'phone' && (
            <form onSubmit={handleCheckPhone} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">WhatsApp (DDD + Número)</label>
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
                    placeholder="Ex: 11999999999"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all text-prensa"
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
                className="mt-6 py-4 font-serif font-bold uppercase tracking-wider"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Prosseguir'}
              </Button>
            </form>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-madeira/5 border border-madeira/20 text-xs text-madeira font-sans italic text-center">
                Mestre associado ao WhatsApp: <strong className="font-bold">{phone}</strong>
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Insira sua Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-madeira/40" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="******"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all text-prensa"
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
                disabled={loading || password.length < 1}
                variant="primary"
                className="mt-6 py-4 font-serif font-bold uppercase tracking-wider"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Assinar Caderneta'}
              </Button>

              <button 
                type="button" 
                onClick={handleBackToPhone}
                className="w-full mt-4 text-[10px] text-madeira/60 hover:text-sangue-boi transition-colors uppercase tracking-[0.2em] font-serif font-bold"
              >
                Corrigir Número / Voltar
              </button>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 bg-madeira/5 border border-madeira/20 text-xs text-madeira font-sans italic text-center">
                Criando nova assinatura para: <strong className="font-bold">{phone}</strong>
              </div>

              <div>
                <label htmlFor="name" className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Nome do Mestre Assador</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-madeira/40" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Mestre Silva"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all text-prensa"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Criar Senha (mín. 6 dígitos)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-madeira/40" />
                  </div>
                  <input
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="******"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all text-prensa"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Confirmar Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-madeira/40" />
                  </div>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="******"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all text-prensa"
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
                disabled={loading}
                variant="primary"
                className="mt-6 py-4 font-serif font-bold uppercase tracking-wider"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Concluir Pacto'}
              </Button>

              <button 
                type="button" 
                onClick={handleBackToPhone}
                className="w-full mt-4 text-[10px] text-madeira/60 hover:text-sangue-boi transition-colors uppercase tracking-[0.2em] font-serif font-bold"
              >
                Corrigir Número / Voltar
              </button>
            </form>
          )}

          <p className="text-[9px] text-center opacity-40 uppercase tracking-widest mt-6 font-serif">
            Mister Churras Chronicles - Selo de Honra 1890
          </p>
        </div>
      </Card>
    </div>
  );
}
