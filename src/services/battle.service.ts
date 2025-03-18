
import { supabase } from "@/integrations/supabase/client";

export class BattleService {
  /**
   * Get a battle by ID
   */
  static async getBattle(battleId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("battles")
        .select(`
          *,
          creator:profiles!battles_creator_id_fkey(id, username, avatar_url),
          videos:battle_videos(
            id, 
            position, 
            score,
            video_id,
            videos:video_id(
              id, 
              title, 
              description, 
              video_url, 
              thumbnail_url,
              view_count,
              likes_count,
              comments_count,
              user_id,
              profiles:user_id(username, avatar_url)
            )
          ),
          categories:battle_categories(category_id, categories:category_id(name))
        `)
        .eq("id", battleId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching battle:", error);
      throw error;
    }
  }
  
  /**
   * Get related battles
   */
  static async getRelatedBattles(battleId: string): Promise<any[]> {
    try {
      // Get categories of the current battle
      const { data: battleData, error: battleError } = await supabase
        .from("battle_categories")
        .select("category_id")
        .eq("battle_id", battleId);
        
      if (battleError) throw battleError;
      
      if (!battleData || battleData.length === 0) {
        // If no categories, just return recent battles
        const { data, error } = await supabase
          .from("battles")
          .select(`
            id, 
            title, 
            creator:profiles!battles_creator_id_fkey(username, avatar_url),
            thumbnail_url
          `)
          .neq("id", battleId)
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        return data || [];
      }
      
      // Get category IDs
      const categoryIds = battleData.map(cat => cat.category_id);
      
      // Get battles with the same categories
      const { data, error } = await supabase
        .from("battle_categories")
        .select(`
          battles:battle_id(
            id, 
            title, 
            creator:profiles!battles_creator_id_fkey(username, avatar_url),
            thumbnail_url
          )
        `)
        .in("category_id", categoryIds)
        .neq("battle_id", battleId)
        .limit(5);
        
      if (error) throw error;
      
      // Extract battle data and remove duplicates
      const battles = data
        .map(item => item.battles)
        .filter(Boolean)
        .filter((battle, index, self) => 
          index === self.findIndex(b => b.id === battle.id)
        );
        
      return battles;
    } catch (error) {
      console.error("Error fetching related battles:", error);
      return [];
    }
  }
  
  /**
   * Vote for a video in a battle
   */
  static async voteForVideo(battleId: string, videoId: string): Promise<void> {
    try {
      // Mock implementation for now
      console.log(`Voting for video ${videoId} in battle ${battleId}`);
      
      // In a real implementation, we would insert a record in a votes table
      // and increment the video's score
      
      // For now, we'll just increment the video's score
      const { error } = await supabase.rpc('increment_battle_video_score', {
        p_video_id: videoId,
        p_battle_id: battleId
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error voting for video:", error);
      throw error;
    }
  }
  
  /**
   * Check if user has already voted in a battle
   */
  static async getUserVote(battleId: string, userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("battle_votes")
        .select("*")
        .eq("battle_id", battleId)
        .eq("user_id", userId)
        .single();
        
      if (error && error.code !== "PGRST116") throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching user vote:", error);
      return null;
    }
  }
  
  /**
   * Get popular battles
   */
  static async getPopularBattles(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("battles")
        .select(`
          id, 
          title, 
          creator:profiles!battles_creator_id_fkey(username, avatar_url),
          thumbnail_url,
          view_count,
          vote_count,
          status
        `)
        .eq("status", "active")
        .order("vote_count", { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching popular battles:", error);
      return [];
    }
  }
}

export default BattleService;
