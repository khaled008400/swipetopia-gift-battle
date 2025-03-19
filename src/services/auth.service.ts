
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
    console.log(`Starting signup process for ${email} with username ${username}`);
    
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
    
    console.log('User signup successful, user data:', data);
    
    // Create the user profile if signup was successful
    if (data.user) {
      console.log('Creating profile for new user:', data.user.id);
      
      try {
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
          
          // Additional debugging information
          console.log("Attempted to create profile with:", {
            id: data.user.id,
            username,
            email: data.user.email,
            roles
          });
          
          throw profileError;
        }
        
        console.log('Profile created successfully for:', username);
        
        // Verify profile was created by fetching it
        const { data: profileData, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (fetchError) {
          console.error('Error verifying profile creation:', fetchError);
        } else {
          console.log('Profile verification successful:', profileData);
        }
      } catch (profileCreateError) {
        console.error('Profile creation failed:', profileCreateError);
        // Continue with signup process even if profile creation fails
        // The getCurrentUser function will attempt to create the profile later
      }
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
    console.log('Current user found:', user.id);
    
    // Try to fetch user profile
    let profile = await fetchUserProfile(user);
    console.log('Profile fetch result:', profile ? 'Profile found' : 'No profile found');
    
    // If profile doesn't exist, try to create it
    if (!profile) {
      console.log("Profile not found for existing user, attempting to create one");
      
      // Get username from metadata or use email as fallback
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
      const roles = user.user_metadata?.roles || ["user"];
      
      try {
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: username,
            email: user.email,
            roles: roles,
            avatar_url: `https://i.pravatar.cc/150?u=${username}`
          })
          .select('*')
          .single();
          
        if (profileError) {
          console.error("Error creating profile for existing user:", profileError);
        } else {
          console.log("Created profile for existing user:", user.id);
          profile = newProfile;
        }
      } catch (err) {
        console.error("Failed to create profile for existing user:", err);
      }
    }
    
    return { ...user, profile };
  }
  
  return null;
};
