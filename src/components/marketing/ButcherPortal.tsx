import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Flame, ShieldCheck, Truck, TrendingUp, X, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ButcherPortal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    shopName: '', 
    specialty: '',
    city: '', 
    whatsapp: '' 
  });
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
      alert('Erro ao submeter o ofício. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl overflow-y-auto">
      <div className="w-full max-w-5xl my-auto py-12">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 text-madeira hover:text-sangue-boi transition-colors z-[80]"
        >
          <X size={40} />
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Left: The Guild Manifesto */}
          <div className="text-pergaminho space-y-8 p-6 flex flex-col justify-center">
            <div className="inline-block p-4 border-2 border-ouro-velho/40 rounded-full w-fit mb-4">
              <Award className="text-ouro-velho" size={48} />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-sangue-boi uppercase leading-tight tracking-tighter">
              A Confraria convoca os <span className="text-ouro-velho">Mestres do Corte</span>
            </h2>
            
            <p className="text-xl italic font-sans opacity-90 border-l-4 border-sangue-boi pl-6 leading-relaxed">
              "O ritual só atinge a perfeição nas mãos de quem conhece o ofício. Queremos o seu talento como a assinatura oficial do nosso Batalhão."
            </p>
            
            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-5">
                <div className="bg-sangue-boi/20 p-2 rounded-sm"><TrendingUp className="text-ouro-velho" size={24} /></div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-ouro-velho">Curadoria de Elite</h4>
                  <p className="text-sm opacity-70">Não buscamos apenas carne, buscamos a sua curadoria e maestria no balcão.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-sangue-boi/20 p-2 rounded-sm"><Truck className="text-ouro-velho" size={24} /></div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-ouro-velho">Pacto de Honra</h4>
                  <p className="text-sm opacity-70">Sem custos de adesão. O valor está no que você entrega para a comunidade da brasa.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-sangue-boi/20 p-2 rounded-sm"><ShieldCheck className="text-ouro-velho" size={24} /></div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm text-ouro-velho">Ordem Direta</h4>
                  <p className="text-sm opacity-70">Receba ordens completas via WhatsApp. Você prepara a excelência, nós cuidamos da logística.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Honor Form (Contract style) */}
          <div className="relative">
            {/* Wax Seal Decoration */}
            <div className="absolute -top-6 -right-6 z-20 w-24 h-24 rotate-12 drop-shadow-2xl">
              <div className="w-full h-full bg-sangue-boi rounded-full border-4 border-sangue-boi/50 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <Award className="text-pergaminho/30" size={40} />
              </div>
            </div>

            <Card className="bg-pergaminho p-10 border-8 border-double border-madeira/30 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Parchment background subtle grain overlay */}
              <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none" />

              {success ? (
                <div className="text-center py-16 space-y-6 relative z-10">
                  <Flame className="text-sangue-boi mx-auto animate-pulse" size={80} />
                  <h3 className="text-3xl font-serif font-bold text-prensa uppercase tracking-tighter">Ofício Recebido!</h3>
                  <p className="text-lg italic font-sans max-w-xs mx-auto">
                    "O seu ofício foi recebido pela Confraria. Nossa equipe avaliará a sua casa e entrará em contato em breve para firmar o pacto da brasa."
                  </p>
                  <div className="pt-8">
                    <Button variant="primary" fullWidth onClick={onClose}>Retornar ao Batalhão</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-serif font-bold text-prensa uppercase tracking-widest border-b-2 border-madeira/20 pb-4 inline-block">
                      Ficha de Honra
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Nome do Mestre / Proprietário</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Mestre Assador Silva"
                        className="w-full bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">A Casa de Carnes / Boutique</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Boutique Imperial"
                        className="w-full bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all"
                        value={formData.shopName}
                        onChange={e => setFormData({...formData, shopName: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Corte de Consagração (O que faz sua fama?)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Picanha de Wagyu, Costela 12h..."
                        className="w-full bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all"
                        value={formData.specialty}
                        onChange={e => setFormData({...formData, specialty: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Comarca de Atuação</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Cidade/Bairro"
                          className="w-full bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-madeira mb-2 tracking-[0.2em]">Telégrafo de Contato</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="WhatsApp de Pedidos"
                          className="w-full bg-transparent border-b-2 border-madeira/20 focus:border-sangue-boi outline-none py-2 font-serif text-lg placeholder:opacity-30 transition-all"
                          value={formData.whatsapp}
                          onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      type="submit" 
                      disabled={isSubmitting}
                      className="py-6 text-xl shadow-xl hover:shadow-sangue-boi/20"
                    >
                      {isSubmitting ? 'Firmando Acordo...' : 'Submeter Ofício de Parceria'}
                    </Button>
                  </div>
                  <p className="text-[10px] text-center opacity-40 uppercase tracking-widest mt-6 font-serif">
                    Mister Churras Chronicles - Selo de Honra 1890
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
