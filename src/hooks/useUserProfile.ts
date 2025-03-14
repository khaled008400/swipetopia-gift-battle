
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth.types";

export const fetchUserProfile = async (authUser: User): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user ID:", authUser.id);
    
    // Get user metadata from auth user object
    const userRole = authUser.user_metadata?.role || authUser.app_metadata?.role;
    
    console.log("User metadata:", authUser.user_metadata);
    console.log("App metadata:", authUser.app_metadata);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      // Rather than returning null, return a basic profile
      return {
        id: authUser.id,
        username: authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        avatar_url: null,
        coins: 0,
        role: userRole || 'viewer',
        followers: 0,
        following: 0
      };
    }
    
    if (data) {
      // Create a type safe profile object
      const profile: UserProfile = {
        id: data.id,
        username: data.username || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        avatar_url: data.avatar_url,
        coins: data.coins || 0,
        role: userRole || data.role || 'viewer',
        // Type safe access to optional fields with fallback values
        followers: typeof data.followers === 'number' ? data.followers : 0,
        following: typeof data.following === 'number' ? data.following : 0
      };
      
      console.log("Constructed profile:", profile);
      return profile;
    }
    
    // If no profile exists yet, return a basic profile with just the auth data
    return {
      id: authUser.id,
      username: authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      avatar_url: null,
      coins: 0,
      role: userRole || 'viewer',
      followers: 0,
      following: 0
    };
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    // Return a fallback profile to prevent the app from breaking
    return {
      id: authUser.id,
      username: authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      avatar_url: null,
      coins: 0,
      role: 'viewer',
      followers: 0,
      following: 0
    };
  }
};
