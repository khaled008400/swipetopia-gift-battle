
import { supabase } from '@/lib/supabase';

// Get the currently authenticated user
export const getAuthenticatedUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting authenticated user:', error);
      throw new Error('Authentication required');
    }
    
    if (!data.user) {
      console.error('No user found in session');
      throw new Error('You must be logged in to perform this action');
    }
    
    return data.user;
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    throw error;
  }
};

// Export the supabase client
export { supabase };
