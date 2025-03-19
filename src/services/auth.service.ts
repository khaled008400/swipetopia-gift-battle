
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth.types";

export const loginUser = async (email: string, password: string) => {
  console.log(`Attempting to login user with email: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Login error:", error);
    throw error;
  }
  
  console.log("Login successful, checking/creating profile...");
  
  // Ensure profile exists after login
  try {
    if (data.user) {
      await ensureProfileExists(data.user);
    }
  } catch (profileError) {
    console.error("Profile check failed after login:", profileError);
    // Continue with login despite profile issues
  }
  
  return data;
};

export const signupUser = async (email: string, username: string, password: string, roles: UserRole[] = ["user"]) => {
  console.log(`Starting signup process for ${email} with username ${username}`);
  
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
      console.error('Username already taken:', username);
      throw new Error("Username is already taken");
    }
    
    // Register the user if username is available
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          roles
        }
      }
    });
    
    if (error) {
      console.error('Error signing up user:', error);
      throw error;
    }
    
    console.log('User signup successful, user data:', data.user?.id);
    
    // Immediately create profile after successful signup
    if (data.user) {
      await createProfile(data.user.id, username, email, roles);
    } else {
      console.warn('No user data returned from signup, profile creation deferred');
    }
    
    return data;
  } catch (error) {
    console.error('Signup process failed:', error);
    throw error;
  }
};

// Helper function to create a profile
const createProfile = async (userId: string, username: string, email: string, roles: UserRole[]) => {
  console.log(`Creating profile for user ${userId} with username ${username}`);
  
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingProfile) {
      console.log('Profile already exists for user:', userId);
      return existingProfile;
    }
    
    // Create new profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username,
        email: email,
        roles: roles,
        avatar_url: `https://i.pravatar.cc/150?u=${username}`, // Placeholder avatar
        coins: 1000, // Default starting coins
        followers: 0,
        following: 0
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', profile.id);
    return profile;
  } catch (error) {
    console.error('Profile creation failed:', error);
    throw error;
  }
};

// Ensure a profile exists for a user
const ensureProfileExists = async (user: any) => {
  console.log(`Ensuring profile exists for user: ${user.id}`);
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
    
  if (profile) {
    console.log('Profile found for user:', user.id);
    return profile;
  }
  
  // If no profile, create one with data from user metadata
  console.log('No profile found, creating one for user:', user.id);
  const username = user.user_metadata?.username || user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`;
  const roles = user.user_metadata?.roles || ["user"];
  
  return await createProfile(user.id, username, user.email, roles);
};

export const logoutUser = async () => {
  console.log('Logging out user');
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  console.log('Getting current session');
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    throw error;
  }
  return data;
};

export const getCurrentUser = async () => {
  console.log('Fetching current user');
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
    
    try {
      // First try to get existing profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      // If profile exists, return user with profile
      if (profile) {
        console.log('Profile found for user:', user.id);
        return { ...user, profile };
      }
      
      // If profile doesn't exist, create it
      console.log('Profile not found, creating new profile for user:', user.id);
      const username = user.user_metadata?.username || user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`;
      const roles = user.user_metadata?.roles || ["user"];
      
      const newProfile = await createProfile(user.id, username, user.email || '', roles);
      
      return { ...user, profile: newProfile };
    } catch (profileError) {
      console.error('Error handling profile:', profileError);
      
      // Create a minimal profile object to prevent UI errors
      const fallbackProfile = {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`,
        email: user.email || '',
        roles: user.user_metadata?.roles || ["user"],
        avatar_url: `https://i.pravatar.cc/150?u=${user.id}`,
        coins: 1000,
        followers: 0,
        following: 0
      };
      
      console.log('Using fallback profile:', fallbackProfile);
      return { ...user, profile: fallbackProfile };
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
