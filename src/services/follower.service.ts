
import { supabase } from "@/integrations/supabase/client";
import { Follower } from "@/types/gift.types";

/**
 * Service for handling follower-related operations
 */
const FollowerService = {
  /**
   * Follow or unfollow a user
   * @param userId The user ID to follow or unfollow
   * @returns A promise that resolves to an object with the action performed
   */
  toggleFollow: async (userId: string): Promise<{ action: 'followed' | 'unfollowed', success: boolean }> => {
    try {
      const response = await supabase.functions.invoke('increment-followers', {
        body: { streamerId: userId }
      });
      
      if (!response.data) {
        throw new Error('Failed to toggle follow status');
      }
      
      return response.data as { action: 'followed' | 'unfollowed', success: boolean };
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    }
  },
  
  /**
   * Check if the current user is following another user
   * @param userId The user ID to check
   * @returns A promise that resolves to a boolean indicating if the user is followed
   */
  isFollowing: async (userId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is not_found error
      console.error('Error checking follow status:', error);
    }
    
    return !!data;
  },
  
  /**
   * Get followers for a user
   * @param userId The user ID to get followers for
   * @returns A promise that resolves to an array of followers
   */
  getFollowers: async (userId: string): Promise<Follower[]> => {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        id,
        follower_id,
        created_at,
        profiles:follower_id (
          username,
          avatar_url
        )
      `)
      .eq('following_id', userId);
      
    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Get users that a user is following
   * @param userId The user ID to get following for
   * @returns A promise that resolves to an array of followers
   */
  getFollowing: async (userId: string): Promise<Follower[]> => {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        id,
        following_id,
        created_at,
        profiles:following_id (
          username,
          avatar_url
        )
      `)
      .eq('follower_id', userId);
      
    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }
    
    return data || [];
  }
};

export default FollowerService;
