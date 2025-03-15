
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id: string;
  view_count: number;
  created_at: string;
  isPublic?: boolean;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  views?: number;
  comments_count?: number;
  creator?: {
    username: string;
    avatar_url: string;
  };
}

const VideoService = {
  // Get feed videos (most recent videos)
  getFeedVideos: async () => {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
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
  
  // Get videos from a specific user
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
  
  // Get a specific video by ID
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
      
      // Transform data to match Video interface
      const video: Video = {
        ...data,
        creator: {
          username: data.profiles.username,
          avatar_url: data.profiles.avatar_url
        },
        views: data.view_count,
        comments_count: 0, // This would need to be calculated from comments table
        likes: 0 // This would need to be calculated from likes table
      };
      
      return video;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  },
  
  // Like a video
  likeVideo: async (videoId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('video_likes')
        .insert({
          video_id: videoId,
          user_id: userId
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error liking video:', error);
      return false;
    }
  },
  
  // Unlike a video
  unlikeVideo: async (videoId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unliking video:', error);
      return false;
    }
  },
  
  // Download a video (placeholder - actual implementation would depend on your requirements)
  downloadVideo: async (videoId: string) => {
    try {
      const { data } = await supabase
        .from('short_videos')
        .select('video_url')
        .eq('id', videoId)
        .single();
      
      if (data && data.video_url) {
        // In a real implementation, you might generate a download link
        // or directly trigger a download
        window.open(data.video_url, '_blank');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error downloading video:', error);
      return false;
    }
  }
};

export default VideoService;
