
import { supabase } from './base.service';

class VideoFetchService {
  // Get video by ID
  async getVideoById(id: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getVideoById:', error);
      throw error;
    }
  }

  // Alternative name for getVideoById for backward compatibility
  async fetchVideo(id: string) {
    return this.getVideoById(id);
  }

  // Get videos for feed
  async getForYouVideos(limit: number = 20) {
    try {
      console.log('Fetching For You videos...');
      // Modified to not use the foreign key relationship that's causing issues
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error in getForYouVideos:', error);
        throw error;
      }

      // Fetch user profiles separately and combine the data
      const userIds = [...new Set(data.map(video => video.user_id))];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          // Create a map for quick lookups
          const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
          
          // Add profile information to videos
          return data.map(video => ({
            ...video,
            profiles: profileMap.get(video.user_id) || null
          }));
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in getForYouVideos:', error);
      // Return empty array instead of throwing to avoid app crashes
      return [];
    }
  }

  // Get videos for a specific user
  async getUserVideos(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getUserVideos:', error);
      throw error;
    }
  }

  // Alias for getUserVideos for backward compatibility
  async fetchUserVideos(userId: string, limit: number = 20) {
    return this.getUserVideos(userId, limit);
  }

  // Get trending videos
  async getTrendingVideos(limit: number = 10) {
    try {
      // In a real app, this would use more complex criteria
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getTrendingVideos:', error);
      throw error;
    }
  }

  // Get all videos - for VideosPage
  async getVideos(limit: number = 50) {
    try {
      // Instead of using foreign key relationship that doesn't exist,
      // fetch videos first, then get related profiles separately
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      if (!videos || videos.length === 0) return [];
      
      // Get unique user IDs
      const userIds = [...new Set(videos.map(video => video.user_id))];
      
      // Fetch profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Return videos without profile data if profiles fetch fails
        return videos;
      }
      
      // Create a map for quick profile lookups
      const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
      
      // Combine video and profile data
      const videosWithProfiles = videos.map(video => ({
        ...video,
        profiles: profileMap.get(video.user_id) || null
      }));
      
      return videosWithProfiles;
    } catch (error) {
      console.error('Error in getVideos:', error);
      return [];
    }
  }

  // Alias for getVideos for backward compatibility
  async fetchVideos(limit: number = 50) {
    return this.getVideos(limit);
  }

  // Get liked videos - updated to handle optional userId
  async getLikedVideos(userId?: string, limit: number = 20) {
    try {
      // If no userId provided, attempt to get the current user's ID
      if (!userId) {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user?.id) {
          console.warn('No userId provided to getLikedVideos and no authenticated user');
          return [];
        }
        userId = authData.user.id;
      }
      
      const { data, error } = await supabase
        .from('video_likes')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);

      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const videoIds = data.map(like => like.video_id);
      
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);
        
      if (videosError) throw videosError;
      
      return videos;
    } catch (error) {
      console.error('Error in getLikedVideos:', error);
      return [];
    }
  }

  // Get saved videos - updated to handle optional userId
  async getSavedVideos(userId?: string, limit: number = 20) {
    try {
      // If no userId provided, attempt to get the current user's ID
      if (!userId) {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user?.id) {
          console.warn('No userId provided to getSavedVideos and no authenticated user');
          return [];
        }
        userId = authData.user.id;
      }
      
      const { data, error } = await supabase
        .from('saved_videos')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);

      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const videoIds = data.map(saved => saved.video_id);
      
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);
        
      if (videosError) throw videosError;
      
      return videos;
    } catch (error) {
      console.error('Error in getSavedVideos:', error);
      return [];
    }
  }

  // Search videos by title or hashtags
  async searchVideos(query: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in searchVideos:', error);
      throw error;
    }
  }
}

export default new VideoFetchService();
