
import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for the entire app
// Use import.meta.env for Vite projects instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make sure we're using a proper URL
const validSupabaseUrl = supabaseUrl || 'https://ifeuccpukdosoxtufxzi.supabase.co';
const validSupabaseKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZXVjY3B1a2Rvc294dHVmeHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM2MjAsImV4cCI6MjA1NzMxOTYyMH0.I4wy6OFJY_zYNrhYWjw7xphFTBc5vT9sgNM3i2iPUqI';

console.log('Initializing Supabase client with:', {
  url: validSupabaseUrl.substring(0, 25) + '...',  // Log partial URL for security
  hasKey: !!validSupabaseKey
});

export const supabase = createClient(validSupabaseUrl, validSupabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  }
});

// Export a function to check if the client is properly initialized
export const isSupabaseInitialized = () => {
  return !!supabase && !!validSupabaseUrl && !!validSupabaseKey;
};
