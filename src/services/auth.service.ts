
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
    
    // Create the user profile if signup was successful and user is immediately available
    if (data.user) {
      console.log('Creating profile for new user:', data.user.id);
      
      try {
        const { error: profileError, data: profileData } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username,
            email: data.user.email,
            roles: roles, // Store roles array in profile
            avatar_url: `https://i.pravatar.cc/150?u=${username}` // Placeholder avatar
          })
          .select('*')
          .single();
        
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
        
        console.log('Profile created successfully:', profileData);
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
  try {
    // First check the session
    const { session } = await getSession();
    
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    
    if (!user) {
      console.log('No user found in current session');
      return null;
    }
    
    console.log('Current user found:', user.id);
    
    // Try to fetch user profile
    let profile = await fetchUserProfile(user);
    console.log('Profile fetch result:', profile ? 'Profile found' : 'No profile found');
    
    // If profile doesn't exist, create it
    if (!profile) {
      console.log("Profile not found for existing user, creating new profile");
      
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
          
          // Try to check if profile was actually created despite the error
          const { data: checkProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!checkError && checkProfile) {
            console.log("Profile exists despite error, using existing profile:", checkProfile);
            profile = checkProfile;
          } else {
            console.error("Failed to create or find profile:", checkError || profileError);
          }
        } else {
          console.log("Created profile for existing user:", newProfile);
          profile = newProfile;
        }
      } catch (err) {
        console.error("Failed to create profile for existing user:", err);
      }
    }
    
    // Return the user with profile, but ensure we don't return null if profile creation failed
    return { 
      ...user, 
      profile: profile || {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        email: user.email || '',
        roles: user.user_metadata?.roles || ["user"],
        avatar_url: `https://i.pravatar.cc/150?u=${user.id}`,
        coins: 0,
        followers: 0,
        following: 0
      }
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
