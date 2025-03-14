
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types/auth.types";

export const fetchUserProfile = async (authUser: User): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    if (data) {
      // Convert single role to array of roles if present
      let userRoles: UserRole[] = [];
      if (data.role) {
        userRoles = [data.role as UserRole];
      } else if (authUser.user_metadata?.role) {
        userRoles = [authUser.user_metadata.role as UserRole];
      } else {
        userRoles = ["user"]; // Default role
      }

      return {
        id: data.id,
        username: data.username,
        email: authUser.email || '',
        avatar_url: data.avatar_url,
        coins: data.coins || 0,
        roles: userRoles, // Changed from 'role' to 'roles' to match UserProfile interface
        followers: 0, // Default value since it doesn't exist in the database yet
        following: 0  // Default value since it doesn't exist in the database yet
      };
    }
    return null;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};
