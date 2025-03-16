
import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for the entire app
// Use import.meta.env for Vite projects instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

console.log('Initializing Supabase client with:', {
  url: supabaseUrl.substring(0, 10) + '...',  // Log partial URL for security
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
