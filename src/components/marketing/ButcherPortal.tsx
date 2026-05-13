import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Flame, ShieldCheck, Truck, TrendingUp, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ButcherPortal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', shopName: '', city: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('butcher_prospects')
        .insert([formData]);
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar manifesto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-4xl my-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-madeira hover:text-sangue-boi transition-colors z-50"
        >
          <X size={32} />
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Manifesto */}
          <div className="text-pergaminho space-y-6 p-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-sangue-boi uppercase leading-tight tracking-tighter">
              O Manifesto do <span className="text-ouro-velho">Fornecedor Oficial</span>
            </h2>
            <p className="text-lg italic font-sans opacity-80 border-l-4 border-sangue-boi pl-4">
              "Um ritual sagrado exige provisões de elite. Não somos apenas um app; somos a ponte entre o Mestre da Brasa e o seu açougue."
            </p>
            
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Escalabilidade</h4>
                  <p className="text-xs opacity-60">Acesse centenas de churrasqueiros na sua região que calculam listas exatas todos os finais de semana.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Logística Direta</h4>
                  <p className="text-xs opacity-60">Receba pedidos pré-formatados via WhatsApp, prontos para separação e entrega.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Selo de Elite</h4>
                  <p className="text-xs opacity-60">Torne-se um 'Açougue Consagrado' e ganhe destaque nos resultados de cálculo do app.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lead Form */}
          <Card className="bg-pergaminho p-8">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <Flame className="text-sangue-boi mx-auto animate-pulse" size={64} />
                <h3 className="text-2xl font-serif font-bold text-prensa uppercase">Manifesto Recebido!</h3>
                <p className="text-sm italic">"Em breve, um arauto da Confraria entrará em contato para consagrar sua parceria."</p>
                <Button variant="primary" fullWidth onClick={onClose}>Voltar ao Ritual</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-prensa uppercase tracking-widest mb-4 border-b border-madeira/20 pb-2">
                  Pré-Cadastro de Parceiro
                </h3>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-madeira mb-1">Seu Nome</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b-2 border-madeira/30 focus:border-sangue-boi outline-none py-2 font-sans"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-madeira mb-1">Nome do Açougue/Butique</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b-2 border-madeira/30 focus:border-sangue-boi outline-none py-2 font-sans"
                    value={formData.shopName}
                    onChange={e => setFormData({...formData, shopName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-madeira mb-1">Cidade/UF</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b-2 border-madeira/30 focus:border-sangue-boi outline-none py-2 font-sans"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-madeira mb-1">WhatsApp de Vendas</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-transparent border-b-2 border-madeira/30 focus:border-sangue-boi outline-none py-2 font-sans"
                      placeholder="11999999999"
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="primary" fullWidth type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando Manifesto...' : 'Solicitar Consagração'}
                  </Button>
                </div>
                <p className="text-[9px] text-center opacity-40 uppercase tracking-tighter mt-4">
                  Ao enviar, você aceita os termos da Confraria Mister Churras.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
