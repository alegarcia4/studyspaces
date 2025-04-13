// src/hooks/useAuth.tsx
import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
    useCallback // Import useCallback
  } from 'react';
  import { Session, User, AuthError, Provider } from '@supabase/supabase-js'; // Import Provider type
  import { supabase } from '@/lib/supabase';
  import { Loader2 } from 'lucide-react';
  import { useToast } from './use-toast'; // Import useToast
  
  type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean; // Global loading for initial session check
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithProvider: (provider: Provider) => Promise<{ error: AuthError | null }>; // Updated name
    signOut: () => Promise<{ error: AuthError | null }>;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true); // For initial load
    const { toast } = useToast(); // Get toast function
  
    // Wrap session fetching and auth listener setup in useCallback
    const initializeAuth = useCallback(async () => {
      try {
        setLoading(true);
         console.log("AuthProvider: Attempting getSession..."); // <--- ADD LOG
        const { data, error } = await supabase.auth.getSession();
         console.log("AuthProvider: getSession result", { data, error }); // <--- ADD LOG
        if (error) {
          throw error;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error: any) {
        console.error("Error getting initial session:", error);
         toast({
             title: "Session Error",
             description: "Could not retrieve your session. Please try refreshing.",
             variant: "destructive",
         });
      } finally {
        setLoading(false);
         console.log("AuthProvider: Initial loading complete."); // <--- ADD LOG
      }
  
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            console.log("AuthProvider: onAuthStateChange triggered!", { _event, session }); // <--- ADD LOG
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false); // Ensure loading is false after state change
        }
      );
       console.log("AuthProvider: Subscribed to onAuthStateChange."); // <--- ADD LOG
  
      return () => {
         console.log("AuthProvider: Unsubscribing from onAuthStateChange."); // <--- ADD LOG
        subscription?.unsubscribe();
      };
    }, [toast]); // Add toast as dependency
  
    useEffect(() => {
      const cleanupPromise = initializeAuth();
      // Return the cleanup function from initializeAuth
      return () => {
         // Ensure we wait for the async init to finish before cleaning up
         cleanupPromise.then(cleanup => cleanup && cleanup());
      };
    }, [initializeAuth]); // Depend on the memoized initializer
  
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };
  
    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { error };
    };
  
    const signInWithProvider = async (provider: Provider) => {
        console.log(`AuthProvider: Attempting signInWithOAuth for ${provider}`); // <--- ADD LOG
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                 redirectTo: window.location.origin,
            },
        });
         console.log(`AuthProvider: signInWithOAuth for ${provider} result`, { error }); // <--- ADD LOG
        return { error };
    };
  
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };
  
    const value = { user, session, loading, signIn, signUp, signInWithProvider, signOut };
  
    return (
        <AuthContext.Provider value={value}>
            {loading && ( // Show loader only during initial load
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
             )}
             {/* Render children regardless of loading state after initial check */}
             {!loading && children}
             {loading && !children && ( // Fallback if children aren't ready during loading
                   <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                       <Loader2 className="h-12 w-12 animate-spin text-primary" />
                   </div>
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