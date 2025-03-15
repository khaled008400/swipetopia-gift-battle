
import { supabase } from '@/integrations/supabase/client';

const VideoService = {
  // Get feed videos (personalized for user)
  getFeedVideos: async () => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feed videos:', error);
      return [];
    }
  },
  
  // Get trending videos
  getTrendingVideos: async () => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('view_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }
  },
  
  // Get videos for a specific user
  getUserVideos: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  },
  
  // Get video by ID
  getVideoById: async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', videoId)
        .single();
      
      if (error) throw error;
      
      // Increment view count
      await supabase
        .from('short_videos')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', videoId);
      
      return data;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  },
  
  // Search videos by query
  searchVideos: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('view_count', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }
};

export default VideoService;
