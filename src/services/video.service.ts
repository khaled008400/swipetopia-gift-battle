
import { supabase } from '@/lib/supabase';
import { Video } from '@/types/video.types';

class VideoService {
  async getForYouVideos(): Promise<Video[]> {
    console.log("Fetching For You videos...");
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            avatar
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching videos:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error in getForYouVideos:", error);
      throw error;
    }
  }

  async getTrendingVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            avatar
          )
        `)
        .order('view_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error in getTrendingVideos:", error);
      throw error;
    }
  }

  async getUserVideos(userId: string): Promise<Video[]> {
    console.log(`Fetching videos for user: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            avatar
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user videos:", error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} videos for user ${userId}`);
      return data || [];
    } catch (error) {
      console.error(`Error in getUserVideos for ${userId}:`, error);
      throw error;
    }
  }

  async getVideoById(videoId: string): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:user_id (
            id,
            username,
            avatar_url,
            avatar
          )
        `)
        .eq('id', videoId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in getVideoById:", error);
      throw error;
    }
  }

  async incrementViewCount(videoId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        video_id: videoId
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing view count:", error);
      throw error;
    }
  }

  async likeVideo(videoId: string): Promise<void> {
    try {
      // First, insert into likes table
      const { error: likesError } = await supabase
        .from('likes')
        .insert({ video_id: videoId, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (likesError) throw likesError;

      // Increment likes count
      const { error: countError } = await supabase.rpc('increment_likes_count', {
        video_id: videoId
      });

      if (countError) throw countError;
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  }

  async unlikeVideo(videoId: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Delete from likes table
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (likesError) throw likesError;

      // Decrement likes count
      const { error: countError } = await supabase.rpc('decrement_likes_count', {
        video_id: videoId
      });

      if (countError) throw countError;
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  }

  async saveVideo(videoId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_videos')
        .insert({ video_id: videoId, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving video:", error);
      throw error;
    }
  }

  async unsaveVideo(videoId: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error unsaving video:", error);
      throw error;
    }
  }

  async checkIfVideoLiked(videoId: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if video liked:", error);
      return false;
    }
  }

  async checkIfVideoSaved(videoId: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('saved_videos')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if video saved:", error);
      return false;
    }
  }
}

// Export a singleton instance
export default new VideoService();
