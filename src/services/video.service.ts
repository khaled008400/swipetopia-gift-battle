
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

  async uploadVideo(
    videoFile: File, 
    title: string, 
    description: string, 
    thumbnailUrl: string | null, 
    isPrivate: boolean = false, 
    hashtags: string[] = []
  ): Promise<any> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      // Create a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload video to storage
      console.log(`Uploading video file ${filePath}`);
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading video:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Insert video record in database
      const videoData = {
        title,
        description,
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl || `${publicUrl}?preview`,
        is_private: isPrivate,
        user_id: user.id,
        hashtags,
        view_count: 0,
        likes_count: 0
      };

      const { data, error } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single();

      if (error) {
        console.error("Error inserting video data:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in uploadVideo:", error);
      throw error;
    }
  }

  async checkVideoExists(videoId: string): Promise<boolean> {
    try {
      const { data, error, count } = await supabase
        .from('videos')
        .select('id', { count: 'exact' })
        .eq('id', videoId)
        .limit(1);

      if (error) {
        console.error("Error checking if video exists:", error);
        return false;
      }

      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error("Error in checkVideoExists:", error);
      return false;
    }
  }

  async reportVideo(videoId: string, report: string | { category: string, description: string }): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      let reportCategory = 'other';
      let reportDescription = '';

      if (typeof report === 'string') {
        reportDescription = report;
      } else {
        reportCategory = report.category;
        reportDescription = report.description;
      }

      const { error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: user.id,
          report_category: reportCategory,
          report_description: reportDescription,
          status: 'pending'
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error reporting video:", error);
      throw error;
    }
  }

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
      // Properly transform to Video[] array
      const videos: Video[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.videos) {
            videos.push(item.videos as Video);
          }
        }
      }
      
      return videos;
    } catch (error) {
      console.error("Error in getLikedVideos:", error);
      return [];
    }
  }

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
      // Properly transform to Video[] array
      const videos: Video[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.videos) {
            videos.push(item.videos as Video);
          }
        }
      }
      
      return videos;
    } catch (error) {
      console.error("Error in getSavedVideos:", error);
      return [];
    }
  }

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

// Export a singleton instance
export default new VideoService();
