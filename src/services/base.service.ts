
import { supabase } from '@/lib/supabase';

// Get the currently authenticated user
export const getAuthenticatedUser = async () => {
  try {
    console.log("Checking for authenticated user");
    
    // First check if there's a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication error: ' + sessionError.message);
    }
    
    if (!sessionData.session) {
      console.error('No active session found');
      throw new Error('Authentication required');
    }
    
    // Get the user details
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting authenticated user:', error);
      throw new Error('Authentication required');
    }
    
    if (!data.user) {
      console.error('No user found in session');
      throw new Error('You must be logged in to perform this action');
    }
    
    console.log("Found authenticated user:", data.user.id);
    return data.user;
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    throw error;
  }
};

// Export the supabase client
export { supabase };
