// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types for your database tables if needed (optional but recommended)
// interface Database {
//   public: {
//     Tables: {
//       users_space: { // ** MATCH YOUR TABLE NAME HERE **
//         Row: { // The shape of data returned from SELECT
//           id: string;
//           created_at: string;
//           name: string;
//           address: string;
//           coordinates: { lat: number; lng: number } | null;
//           description: string | null;
//           hours: string | null;
//           amenities: string[] | null;
//           images: string[] | null;
//           submitted_by: string | null; // UUID of the user
//           rating: number | null;
//           review_count: number | null;
//           // Add distance property dynamically if needed, not in DB
//           distance?: string;
//         };
//         Insert: { // The shape of data passed to INSERT
//           id?: string; // default gen_random_uuid()
//           created_at?: string; // default now()
//           name: string;
//           address: string;
//           coordinates?: { lat: number; lng: number } | null;
//           description?: string | null;
//           hours?: string | null;
//           amenities?: string[] | null;
//           images?: string[] | null;
//           submitted_by?: string | null;
//           rating?: number | null;
//           review_count?: number | null;
//         };
//         Update: { // The shape of data passed to UPDATE
//           // Define fields allowed for update
//         };
//       };
//       // Add other tables like 'reviews' here later
//     };
//   };
// }


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Improved error checking
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is missing. Please check your .env file.');
}
if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
} else if (!supabaseAnonKey.startsWith('eyJ')) {
    // This warning is helpful! It caught the 'P' issue.
    console.warn('VITE_SUPABASE_ANON_KEY might be invalid (does not start with "eyJ"). Please verify it in your .env file and Supabase dashboard.');
}

// Initialize client only if keys seem valid, otherwise provide a safe fallback
// Explicitly type the client if you defined the Database interface
// export const supabase: SupabaseClient<Database> = (supabaseUrl && supabaseAnonKey)
export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ')) // Add the startsWith check here for extra safety before creating client
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      // Log error only if the fallback is actually used
      if (!supabaseUrl || !supabaseAnonKey || !supabaseAnonKey.startsWith('eyJ')) {
        console.error("Supabase client could not be initialized due to missing/invalid configuration.");
      }
      // Return a mock object that prevents crashes when auth/db calls are made
      const mockSupabase = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: { name: 'ConfigError', message: 'Supabase not configured' } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { user: null, session: null}, error: { name: 'ConfigError', message: 'Supabase not configured' } }),
          signUp: async () => ({ data: { user: null, session: null}, error: { name: 'ConfigError', message: 'Supabase not configured' } }),
          signInWithOAuth: async () => ({ data: { provider: '', url: ''}, error: { name: 'ConfigError', message: 'Supabase not configured' } }),
          signOut: async () => ({ error: { name: 'ConfigError', message: 'Supabase not configured' } }),
           getUser: async () => ({ data: { user: null }, error: { name: 'ConfigError', message: 'Supabase not configured' } }),
        },
        from: (table: string) => ({
          select: async () => ({ data: null, error: { message: `Supabase not configured for table ${table}`, details: '', hint: '', code: '500' } }),
          insert: async () => ({ data: null, error: { message: `Supabase not configured for table ${table}`, details: '', hint: '', code: '500' } }),
          update: async () => ({ data: null, error: { message: `Supabase not configured for table ${table}`, details: '', hint: '', code: '500' } }),
          delete: async () => ({ data: null, error: { message: `Supabase not configured for table ${table}`, details: '', hint: '', code: '500' } }),
          eq: () => mockSupabase.from(table), // Chainable methods need to return the mock
          single: () => Promise.resolve({ data: null, error: { message: `Supabase not configured for table ${table}`, details: '', hint: '', code: '500' } })
          // Add other methods if needed
        }),
        // Add other Supabase modules if needed
      };
      return mockSupabase as any; // Cast to any to satisfy type checks elsewhere
    })();