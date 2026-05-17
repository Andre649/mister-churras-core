import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface CustomUser {
  id: string;
  user_metadata: {
    name: string;
    whatsapp: string;
  };
}

interface AuthContextType {
  session: any | null;
  user: CustomUser | null;
  signOut: () => Promise<void>;
  loading: boolean;
  loginCustom: (userData: { id: string; name: string; whatsapp: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar sessão no início
  useEffect(() => {
    const saved = localStorage.getItem('mister_churras_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mockUser: CustomUser = {
          id: parsed.id,
          user_metadata: {
            name: parsed.name,
            whatsapp: parsed.whatsapp
          }
        };
        setUser(mockUser);
        setSession({ user: mockUser });
      } catch (e) {
        console.error('Erro ao carregar sessão customizada:', e);
        localStorage.removeItem('mister_churras_session');
      }
      setLoading(false);
    } else {
      // Tentar carregar sessão legada do Supabase se existir
      supabase.auth.getSession().then(({ data: { session: legacySession } }) => {
        if (legacySession) {
          const mockUser: CustomUser = {
            id: legacySession.user.id,
            user_metadata: {
              name: legacySession.user.user_metadata?.name || 'Assador',
              whatsapp: legacySession.user.user_metadata?.whatsapp || ''
            }
          };
          setUser(mockUser);
          setSession({ user: mockUser });
        }
        setLoading(false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, legacySession) => {
      if (legacySession && !localStorage.getItem('mister_churras_session')) {
        const mockUser: CustomUser = {
          id: legacySession.user.id,
          user_metadata: {
            name: legacySession.user.user_metadata?.name || 'Assador',
            whatsapp: legacySession.user.user_metadata?.whatsapp || ''
          }
        };
        setUser(mockUser);
        setSession({ user: mockUser });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginCustom = (userData: { id: string; name: string; whatsapp: string }) => {
    localStorage.setItem('mister_churras_session', JSON.stringify(userData));
    const mockUser: CustomUser = {
      id: userData.id,
      user_metadata: {
        name: userData.name,
        whatsapp: userData.whatsapp
      }
    };
    setUser(mockUser);
    setSession({ user: mockUser });
  };

  const signOut = async () => {
    localStorage.removeItem('mister_churras_session');
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut, loading, loginCustom }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
