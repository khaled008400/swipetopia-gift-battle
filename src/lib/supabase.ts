
// Re-export the supabase client from our integrations
import { supabase, isSupabaseInitialized } from '@/integrations/supabase/client';

// Log supabase initialization status to help with debugging
console.log("Supabase client initialized:", isSupabaseInitialized());

export { supabase, isSupabaseInitialized };
