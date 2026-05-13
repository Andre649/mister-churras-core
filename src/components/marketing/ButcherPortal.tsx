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
      alert('Erro ao enviar ficha. Tente novamente.');
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
          {/* Left: BBQ Value Prop */}
          <div className="text-pergaminho space-y-6 p-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-sangue-boi uppercase leading-tight tracking-tighter">
              Seja o Fornecedor <span className="text-ouro-velho">Oficial da Brasa</span>
            </h2>
            <p className="text-lg italic font-sans opacity-80 border-l-4 border-sangue-boi pl-4">
              "Um bom churrasco começa no carvão e termina na carne de qualidade. Conectamos seu açougue direto com quem domina a grelha."
            </p>
            
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Mais Brasa no seu Negócio</h4>
                  <p className="text-xs opacity-60">Acesse churrasqueiros que planejam cada detalhe do espeto e da parrilha toda semana.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Pedidos Direto na Grelha</h4>
                  <p className="text-xs opacity-60">Receba listas de carnes prontas via WhatsApp, sem complicação na hora da entrega.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-ouro-velho shrink-0" size={24} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Selo de Qualidade</h4>
                  <p className="text-xs opacity-60">Destaque seu açougue como o parceiro oficial para quem não abre mão de uma boa defumação.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lead Form */}
          <Card className="bg-pergaminho p-8">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <Flame className="text-sangue-boi mx-auto animate-pulse" size={64} />
                <h3 className="text-2xl font-serif font-bold text-prensa uppercase">Ficha Recebida!</h3>
                <p className="text-sm italic">"Em breve entraremos em contato para colocar sua carne na nossa vitrine."</p>
                <Button variant="primary" fullWidth onClick={onClose}>Voltar ao Início</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-prensa uppercase tracking-widest mb-4 border-b border-madeira/20 pb-2">
                  Quero ser Parceiro
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
                  <label className="block text-[10px] uppercase font-bold text-madeira mb-1">Nome do Açougue / Casa de Carnes</label>
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
                    <label className="block text-[10px] uppercase font-bold text-madeira mb-1">Cidade / Região</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-transparent border-b-2 border-madeira/30 focus:border-sangue-boi outline-none py-2 font-sans"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-madeira mb-1">WhatsApp para Pedidos</label>
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
                    {isSubmitting ? 'Enviando...' : 'Quero ser Parceiro'}
                  </Button>
                </div>
                <p className="text-[9px] text-center opacity-40 uppercase tracking-tighter mt-4">
                  Seu açougue em destaque para quem entende de brasa.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
