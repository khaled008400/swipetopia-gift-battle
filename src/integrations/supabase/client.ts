
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
    storage: localStorage,
  }
});

// Export a function to check if the client is properly initialized
export const isSupabaseInitialized = () => {
  return !!supabase && !!validSupabaseUrl && !!validSupabaseKey;
};

// Function for creating test users (used in development)
export const createTestUsers = async () => {
  const { data: { user: adminUser }, error: adminError } = await supabase.auth.signUp({
    email: 'admin@example.com',
    password: 'adminpassword',
    options: {
      data: {
        username: 'admin',
        roles: ['admin']
      }
    }
  });
  
  if (adminError) {
    console.error('Failed to create admin user:', adminError);
  } else {
    console.log('Created admin user:', adminUser?.id);
    await supabase.from('profiles').insert({
      id: adminUser?.id,
      username: 'admin',
      email: 'admin@example.com',
      roles: ['admin'],
      role: 'admin',
      avatar_url: `https://i.pravatar.cc/150?u=admin`
    });
  }
  
  const { data: { user: sellerUser }, error: sellerError } = await supabase.auth.signUp({
    email: 'seller@example.com',
    password: 'sellerpassword',
    options: {
      data: {
        username: 'seller',
        roles: ['seller']
      }
    }
  });
  
  if (sellerError) {
    console.error('Failed to create seller user:', sellerError);
  } else {
    console.log('Created seller user:', sellerUser?.id);
    await supabase.from('profiles').insert({
      id: sellerUser?.id,
      username: 'seller',
      email: 'seller@example.com',
      roles: ['seller'],
      role: 'seller',
      avatar_url: `https://i.pravatar.cc/150?u=seller`
    });
  }
  
  const { data: { user: streamerUser }, error: streamerError } = await supabase.auth.signUp({
    email: 'streamer@example.com',
    password: 'streamerpassword',
    options: {
      data: {
        username: 'streamer',
        roles: ['streamer']
      }
    }
  });
  
  if (streamerError) {
    console.error('Failed to create streamer user:', streamerError);
  } else {
    console.log('Created streamer user:', streamerUser?.id);
    await supabase.from('profiles').insert({
      id: streamerUser?.id,
      username: 'streamer',
      email: 'streamer@example.com',
      roles: ['streamer'],
      role: 'streamer',
      avatar_url: `https://i.pravatar.cc/150?u=streamer`
    });
  }
  
  return {
    adminId: adminUser?.id,
    sellerId: sellerUser?.id,
    streamerId: streamerUser?.id
  };
};
