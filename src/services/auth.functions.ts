
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile } from "@/hooks/useUserProfile";

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

export const signupUser = async (email: string, username: string, password: string) => {
  // First, check if username is already taken
  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .limit(1);
  
  if (checkError) throw checkError;
  
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
        role: 'viewer' // Default role
      }
    }
  });
  
  if (error) throw error;
  
  // Create the user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: username,
        avatar_url: `https://i.pravatar.cc/150?u=${username}` // Placeholder avatar
      });
    
    if (profileError) {
      console.error("Error creating profile:", profileError);
      throw profileError;
    }
  }
  
  return data;
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  return data.session;
};

export const setupAuthListener = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
