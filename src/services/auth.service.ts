
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile } from "@/hooks/useUserProfile";
import { UserRole } from "@/types/auth.types";

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

export const signupUser = async (email: string, username: string, password: string, roles: UserRole[] = ["user"]) => {
  try {
    // First, check if username is already taken
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .limit(1);
    
    if (checkError) {
      console.error('Error checking username:', checkError);
      throw checkError;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      throw new Error("Username is already taken");
    }
    
    // Register the user if username is available
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          roles // Store roles in user metadata
        }
      }
    });
    
    if (error) {
      console.error('Error signing up user:', error);
      throw error;
    }
    
    // Create the user profile if signup was successful
    if (data.user) {
      console.log('Creating profile for new user:', data.user.id);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: username,
          email: data.user.email,
          roles: roles, // Store roles array in profile
          avatar_url: `https://i.pravatar.cc/150?u=${username}` // Placeholder avatar
        });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      }
      
      console.log('Profile created successfully for:', username);
    } else {
      console.warn('No user data returned from signup');
    }
    
    return data;
  } catch (error) {
    console.error('Signup process failed:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
};

export const getCurrentUser = async () => {
  // First check the session
  const { session } = await getSession();
  
  if (!session) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  
  if (user) {
    const profile = await fetchUserProfile(user);
    return { ...user, profile };
  }
  
  return null;
};
