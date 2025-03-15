
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifeuccpukdosoxtufxzi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZXVjY3B1a2Rvc294dHVmeHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM2MjAsImV4cCI6MjA1NzMxOTYyMH0.I4wy6OFJY_zYNrhYWjw7xphFTBc5vT9sgNM3i2iPUqI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
