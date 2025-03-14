
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
      // Get roles from database if available, otherwise from metadata, or default to "user"
      let userRoles: UserRole[] = [];
      
      // Check if roles exists in database (array format)
      if (data.roles && Array.isArray(data.roles)) {
        userRoles = data.roles as UserRole[];
      } 
      // Handle legacy single role field in database
      else if (data.role) {
        userRoles = [data.role as UserRole];
      } 
      // Check in user metadata for roles array
      else if (authUser.user_metadata?.roles && Array.isArray(authUser.user_metadata.roles)) {
        userRoles = authUser.user_metadata.roles as UserRole[];
      } 
      // Check in user metadata for single role
      else if (authUser.user_metadata?.role) {
        userRoles = [authUser.user_metadata.role as UserRole];
      } 
      else {
        userRoles = ["user"]; // Default role
      }

      return {
        id: data.id,
        username: data.username,
        email: authUser.email || '',
        avatar_url: data.avatar_url,
        coins: data.coins || 0,
        roles: userRoles,
        bio: data.bio || undefined,
        location: data.location || undefined,
        followers: data.followers || 0,
        following: data.following || 0,
        interests: data.interests || undefined,
        shop_name: data.shop_name || undefined,
        stream_key: data.stream_key || undefined
      };
    }
    return null;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};
