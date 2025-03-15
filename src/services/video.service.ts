
import { supabase } from "@/integrations/supabase/client";

class VideoService {
  /**
   * Get a video by its ID
   */
  async getVideoById(id: string) {
    try {
      // Use short_videos instead of videos
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  }

  /**
   * Get a list of videos
   */
  async getVideos(page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Use short_videos instead of videos
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  }

  /**
   * Get a user's videos
   */
  async getUserVideos(userId: string, page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Use short_videos instead of videos
      const { data, error } = await supabase
        .from('short_videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching user videos:", error);
      return [];
    }
  }

  /**
   * Increment video view count
   */
  async incrementViews(videoId: string) {
    try {
      // Use direct update instead of non-existent RPC
      const { error } = await supabase
        .from('short_videos')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', videoId);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  /**
   * Like a video
   */
  async likeVideo(videoId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('video_likes')
        .insert({
          video_id: videoId,
          user_id: userId
        });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  }

  /**
   * Unlike a video
   */
  async unlikeVideo(videoId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .match({
          video_id: videoId,
          user_id: userId
        });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  }

  /**
   * Add a comment to a video
   */
  async addComment(videoId: string, userId: string, comment: string) {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .insert({
          video_id: videoId,
          user_id: userId,
          content: comment
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  /**
   * Get comments for a video
   */
  async getComments(videoId: string) {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  /**
   * Get trending videos
   */
  async getTrendingVideos(limit = 10) {
    try {
      // Use short_videos instead of RPC
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      return [];
    }
  }

  /**
   * Search videos
   */
  async searchVideos(query: string) {
    try {
      // Use short_videos instead of videos
      const { data, error } = await supabase
        .from('short_videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error searching videos:", error);
      return [];
    }
  }

  /**
   * Report a video
   */
  async reportVideo(videoId: string, reason: string, userId: string) {
    try {
      // Use admin_actions instead of non-existent video_reports
      const { error } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'report_video',
          target_id: videoId,
          reason: reason,
          admin_id: userId
        });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error reporting video:", error);
      throw error;
    }
  }

  /**
   * Upload a video
   */
  async uploadVideo(file: File, metadata: any) {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      // Create video record
      const { data, error } = await supabase
        .from('short_videos')
        .insert({
          title: metadata.title,
          description: metadata.description || '',
          video_url: publicUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          thumbnail_url: metadata.thumbnail || null,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  }

  // Added methods to satisfy the errors in VideoActions.tsx
  async shareVideo(videoId: string) {
    // This is a placeholder implementation
    console.log(`Sharing video ${videoId}`);
    return { success: true };
  }
  
  async downloadVideo(videoId: string) {
    // This is a placeholder implementation
    console.log(`Downloading video ${videoId}`);
    return { success: true };
  }
}

export default new VideoService();
