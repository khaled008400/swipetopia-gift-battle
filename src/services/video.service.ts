
import { supabase } from '@/lib/supabase';
import UploadService from './upload.service';
import { v4 as uuidv4 } from 'uuid';

class VideoService {
  /**
   * Upload a video with metadata to the database
   */
  async uploadVideo(
    videoFile: File,
    title: string,
    description: string = '',
    thumbnailUrl: string | null = null,
    isPrivate: boolean = false,
    hashtags: string[] = []
  ) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to upload videos');
      }
      
      // Upload video if it's a file
      let videoUrl = '';
      if (videoFile instanceof File) {
        const uploadResult = await UploadService.uploadFile(videoFile, 'videos');
        videoUrl = uploadResult;
      }
      
      if (!videoUrl) {
        throw new Error('Failed to upload video file');
      }
      
      // Insert into videos table
      const { data, error } = await supabase
        .from('videos')
        .insert({
          title,
          description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: user.id,
          is_private: isPrivate,
          hashtags
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting video metadata:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }
  
  /**
   * Get videos for the feed
   */
  async getVideos(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get a single video by ID
   */
  async getVideo(videoId: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', videoId)
        .single();
      
      if (error) {
        console.error('Error fetching video:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getVideo:', error);
      throw error;
    }
  }
  
  /**
   * Increment a video's view count
   */
  async incrementViews(videoId: string) {
    try {
      await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: 'view_count'
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }
}

export default new VideoService();
