
import { supabase } from './base.service';
import { Video } from '@/types/video.types';

class VideoFetchService {
  // Get video by ID
  async getVideoById(id: string): Promise<Video | null> {
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
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in getVideoById:", error);
      throw error;
    }
  }

  // Get videos for feed
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

  // Get videos for a specific user
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

  // Get trending videos
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

  // Get all videos - for VideosPage
  async getVideos(limit: number = 50): Promise<Video[]> {
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
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error in getVideos:", error);
      return [];
    }
  }

  // Get liked videos - updated to handle optional userId
  async getLikedVideos(userId?: string): Promise<Video[]> {
    try {
      const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) return [];

      const { data, error } = await supabase
        .from('likes')
        .select(`
          video_id,
          videos:video_id (
            *,
            user:user_id (
              id,
              username,
              avatar_url,
              avatar
            )
          )
        `)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Extract the videos from the joined data and filter out any nulls
      const videos: Video[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.videos) {
            // Ensure item.videos is treated as a Video object, not an array
            const videoData = item.videos as unknown;
            videos.push(videoData as Video);
          }
        }
      }
      
      return videos;
    } catch (error) {
      console.error("Error in getLikedVideos:", error);
      return [];
    }
  }

  // Get saved videos - updated to handle optional userId
  async getSavedVideos(userId?: string): Promise<Video[]> {
    try {
      const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) return [];

      const { data, error } = await supabase
        .from('saved_videos')
        .select(`
          video_id,
          videos:video_id (
            *,
            user:user_id (
              id,
              username,
              avatar_url,
              avatar
            )
          )
        `)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Extract the videos from the joined data and filter out any nulls
      const videos: Video[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.videos) {
            // Ensure item.videos is treated as a Video object, not an array
            const videoData = item.videos as unknown;
            videos.push(videoData as Video);
          }
        }
      }
      
      return videos;
    } catch (error) {
      console.error("Error in getSavedVideos:", error);
      return [];
    }
  }

  // Search videos by title or hashtags
  async searchVideos(query: string): Promise<Video[]> {
    if (!query.trim()) return [];
    
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
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('view_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error in searchVideos:", error);
      return [];
    }
  }
}

// Important: Export an instance, not the class itself
export default new VideoFetchService();
