import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Flame, ShieldAlert, Users, Store, X, Search } from 'lucide-react';

interface MisterChurrasUser {
  id: string;
  whatsapp: string;
  name: string;
  last_login_at: string;
  created_at: string;
}

interface ButcherPartner {
  id: string;
  name: string;
  shop_name: string;
  specialty: string;
  city: string;
  whatsapp: string;
  created_at: string;
}

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'users' | 'butchers'>('users');
  const [users, setUsers] = useState<MisterChurrasUser[]>([]);
  const [butchers, setButchers] = useState<ButcherPartner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MisterChurras2026!') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setError('Senha incorreta. Acesso negado pelo Comando.');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('mister_churras_users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (usersError) throw usersError;
      if (usersData) setUsers(usersData as MisterChurrasUser[]);

      // Fetch butchers
      const { data: butchersData, error: butchersError } = await supabase
        .from('butchers_parceiros')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (butchersError) throw butchersError;
      if (butchersData) setButchers(butchersData as ButcherPartner[]);
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-prensa flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none" />
        <div className="bg-pergaminho border-4 border-double border-madeira p-8 max-w-md w-full relative z-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <ShieldAlert className="text-sangue-boi w-16 h-16 mb-4" />
            <h1 className="text-2xl font-serif font-bold text-prensa uppercase tracking-widest text-center">
              QG do Comando
            </h1>
            <p className="text-sm italic text-madeira text-center mt-2">Área Restrita aos Generais da Brasa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-madeira uppercase tracking-widest mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-madeira/30 py-3 text-prensa font-mono text-center text-xl focus:border-sangue-boi focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sangue-boi text-sm text-center font-bold bg-sangue-boi/10 p-2 border border-sangue-boi/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-prensa text-pergaminho py-4 font-serif font-bold tracking-widest uppercase hover:bg-sangue-boi transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame size={20} /> Romper Barreira
            </button>
            
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="w-full text-madeira text-sm underline hover:text-sangue-boi text-center block mt-4"
            >
              Voltar ao Acampamento
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.whatsapp.includes(searchTerm)
  );

  const filteredButchers = butchers.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-pergaminho overflow-y-auto">
      <div className="absolute inset-0 bg-paper-texture opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="bg-prensa text-pergaminho py-4 px-6 sticky top-0 z-20 shadow-lg border-b-4 border-sangue-boi">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-sangue-boi w-8 h-8" />
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-widest uppercase">
              QG do Comando
            </h1>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pergaminho/50 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar tropas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-pergaminho/10 border border-pergaminho/20 text-pergaminho pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sangue-boi transition-colors"
              />
            </div>
            <button onClick={() => window.location.href = '/'} className="p-2 hover:bg-sangue-boi transition-colors text-pergaminho" title="Fechar QG">
              <X size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-madeira/20 pb-4">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 font-serif font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab === 'users' ? 'bg-madeira text-pergaminho shadow-md' : 'text-madeira hover:bg-madeira/10'}`}
          >
            <Users size={20} /> Tropa da Brasa ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('butchers')}
            className={`flex items-center gap-2 font-serif font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab === 'butchers' ? 'bg-madeira text-pergaminho shadow-md' : 'text-madeira hover:bg-madeira/10'}`}
          >
            <Store size={20} /> Açougues Aliados ({butchers.length})
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-madeira">
            <Flame className="w-12 h-12 animate-pulse text-sangue-boi mb-4" />
            <p className="font-serif font-bold uppercase tracking-widest">Inspecionando os registros...</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-madeira/30 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === 'users' ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-prensa text-pergaminho font-serif uppercase tracking-widest text-xs">
                    <tr>
                      <th className="p-4">Mestre</th>
                      <th className="p-4">WhatsApp</th>
                      <th className="p-4 hidden md:table-cell">Última Inspeção (Login)</th>
                      <th className="p-4 hidden md:table-cell">Alistamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-madeira/10 text-prensa">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center italic text-madeira">Nenhuma tropa encontrada no braseiro.</td></tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-madeira/5 transition-colors">
                          <td className="p-4 font-bold">{user.name}</td>
                          <td className="p-4 font-mono text-madeira">{user.whatsapp}</td>
                          <td className="p-4 hidden md:table-cell opacity-70">{new Date(user.last_login_at).toLocaleString('pt-BR')}</td>
                          <td className="p-4 hidden md:table-cell opacity-70">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-prensa text-pergaminho font-serif uppercase tracking-widest text-xs">
                    <tr>
                      <th className="p-4">Açougue</th>
                      <th className="p-4">Mestre</th>
                      <th className="p-4">Especialidade</th>
                      <th className="p-4 hidden md:table-cell">Comarca (Cidade)</th>
                      <th className="p-4 hidden sm:table-cell">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-madeira/10 text-prensa">
                    {filteredButchers.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center italic text-madeira">Nenhum aliado comercial na região.</td></tr>
                    ) : (
                      filteredButchers.map(butcher => (
                        <tr key={butcher.id} className="hover:bg-madeira/5 transition-colors">
                          <td className="p-4 font-bold text-sangue-boi">{butcher.shop_name}</td>
                          <td className="p-4">{butcher.name}</td>
                          <td className="p-4 opacity-80">{butcher.specialty || '-'}</td>
                          <td className="p-4 hidden md:table-cell">{butcher.city}</td>
                          <td className="p-4 hidden sm:table-cell font-mono text-madeira">{butcher.whatsapp}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
