
import { supabase } from "@/integrations/supabase/client";

class VideoService {
  /**
   * Get a video by its ID
   */
  async getVideoById(id: string) {
    try {
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
      // Use the increment_counter function
      const { data: newCount, error } = await supabase
        .rpc('increment_counter', {
          row_id: videoId,
          counter_name: 'view_count'
        });
      
      if (error) {
        throw error;
      }
      
      // Update using the return value from the function
      const { error: updateError } = await supabase
        .from('short_videos')
        .update({ view_count: newCount })
        .eq('id', videoId);
      
      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  /**
   * Helper method to safely get incremented count
   */
  private async getIncrementedCount(videoId: string, field: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('short_videos')
        .select(field)
        .eq('id', videoId)
        .single();
        
      if (error) throw error;
      
      return (data?.[field] || 0) + 1;
    } catch (error) {
      console.error(`Error getting ${field}:`, error);
      return 1; // Default to 1 if we can't get the current count
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
      console.log('Starting video upload with metadata:', metadata);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User must be authenticated to upload videos");
      }
      
      console.log('Authenticated user:', user.id);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Uploading file to storage:', filePath);
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      console.log('Public URL:', publicUrl);
      
      // Create video record
      const videoData = {
        title: metadata.title,
        description: metadata.description || '',
        video_url: publicUrl,
        user_id: user.id,
        thumbnail_url: metadata.thumbnail || null,
      };
      
      console.log('Creating video record:', videoData);
      
      const { data, error } = await supabase
        .from('short_videos')
        .insert(videoData)
        .select()
        .single();
      
      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }
      
      console.log('Video record created:', data);
      return data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  }

  /**
   * Share video implementation
   */
  async shareVideo(videoId: string) {
    console.log(`Sharing video ${videoId}`);
    return { success: true };
  }
  
  /**
   * Download video implementation
   */
  async downloadVideo(videoId: string) {
    console.log(`Downloading video ${videoId}`);
    return { success: true };
  }
}

export default new VideoService();
