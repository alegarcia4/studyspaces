// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Improved error checking
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is missing. Please check your .env file.');
}
if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
} else if (!supabaseAnonKey.startsWith('eyJ')) {
    console.warn('VITE_SUPABASE_ANON_KEY might be invalid (does not start with "eyJ"). Please verify it in your .env file and Supabase dashboard.');
}

// Initialize client only if keys seem valid, otherwise provide a safe fallback
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      console.error("Supabase client could not be initialized due to missing/invalid configuration.");
      // Return a mock object that prevents crashes when auth/db calls are made
      const mockSupabase = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
          signUp: async () => ({ error: { message: 'Supabase not configured' } }),
           signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }), // Mock OAuth too
          signOut: async () => ({ error: { message: 'Supabase not configured' } }),
        },
        from: () => ({
          select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          // Add other methods if needed
        }),
        // Add other Supabase modules if needed
      };
      return mockSupabase as any; // Cast to any to satisfy type checks elsewhere
    })();