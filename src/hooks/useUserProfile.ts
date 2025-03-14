
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth.types";

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
      return {
        id: data.id,
        username: data.username,
        email: authUser.email || '',
        avatar_url: data.avatar_url,
        coins: data.coins || 0,
        role: authUser.user_metadata?.role,
        followers: 0, // Default value for followers
        following: 0  // Default value for following
      };
    }
    return null;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};
