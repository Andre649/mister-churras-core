import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Loader2, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Cadastro realizado! Verifique seu e-mail para confirmar.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro na autenticação.';
      setMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-madeira hover:text-sangue-boi transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-pergaminho border-2 border-madeira flex items-center justify-center mx-auto mb-4 text-sangue-boi shadow-md">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-prensa uppercase tracking-widest">Entrar na Confraria</h2>
          <p className="text-madeira/70 mt-2 font-sans italic">
            {isSignUp ? 'Assine o manifesto para salvar seus rituais.' : 'Acesse seus segredos de mestre.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-madeira uppercase tracking-widest mb-1">Missiva Eletrônica (Email)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@endereco.com"
              className="w-full px-4 py-3 bg-pergaminho/50 border-b-2 border-madeira rounded-none text-prensa placeholder-madeira/30 focus:outline-none focus:border-sangue-boi transition-all font-sans"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-madeira uppercase tracking-widest mb-1">Código de Acesso (Senha)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-pergaminho/50 border-b-2 border-madeira rounded-none text-prensa placeholder-madeira/30 focus:outline-none focus:border-sangue-boi transition-all font-sans"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-none text-sm border font-sans italic ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-700' : 'bg-sangue-boi/10 border-sangue-boi/30 text-sangue-boi'}`}>
              {message.text}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading || !email || password.length < 6}
            variant="primary"
            className="mt-6"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (isSignUp ? 'Assinar Manifesto' : 'Validar Credenciais')}
          </Button>

          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            className="w-full mt-4 text-xs font-bold text-madeira hover:text-sangue-boi uppercase tracking-tighter underline underline-offset-4 font-sans"
          >
            {isSignUp ? 'Já sou membro da Confraria' : 'Desejo assinar o Manifesto (Criar Conta)'}
          </button>
        </form>
      </Card>
    </div>
  );
}
