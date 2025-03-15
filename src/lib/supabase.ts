
import { createClient } from '@supabase/supabase-js';

// Use import.meta.env instead of process.env for Vite projects
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
);
