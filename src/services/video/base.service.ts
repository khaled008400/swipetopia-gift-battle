
import { supabase } from '@/integrations/supabase/client';

// Get the currently authenticated user
export const getAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    console.error('Error getting authenticated user:', error);
    throw new Error('You must be logged in to perform this action');
  }
  
  return data.user;
};

// Export the supabase client
export { supabase };
