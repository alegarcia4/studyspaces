// src/hooks/useAuth.tsx
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean; // Global loading for initial session check
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // For initial load

  useEffect(() => {
      setLoading(true);
      supabase.auth.getSession()
          .then(({ data }) => {
              setSession(data.session);
              setUser(data.session?.user ?? null);
          })
          .catch(error => {
              console.error("Error getting initial session:", error);
          })
          .finally(() => {
              setLoading(false);
          });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
              setSession(session);
              setUser(session?.user ?? null);
              setLoading(false);
          }
      );

      return () => {
          subscription?.unsubscribe();
      };
  }, []);

  const signIn = async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
  };

  const signUp = async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
  };

  const signInWithGoogle = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
               queryParams: { access_type: 'offline', prompt: 'consent' },
          },
      });
      return { error };
  };

  const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
  };

  const value = { user, session, loading, signIn, signUp, signInWithGoogle, signOut };

  return (
      <AuthContext.Provider value={value}>
          {loading ? (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
          ) : (
              children
          )}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}