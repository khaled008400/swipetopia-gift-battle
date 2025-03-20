
import { v4 as uuidv4 } from 'uuid';
import { supabase, getAuthenticatedUser } from './base.service';
import { Video } from '@/types/video.types';

class VideoUploadService {
  async uploadVideo(
    videoFile: File, 
    title: string, 
    description: string, 
    thumbnailUrl: string | null, 
    isPrivate: boolean = false, 
    hashtags: string[] = []
  ): Promise<Video> {
    try {
      const user = await getAuthenticatedUser();

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

  // Method to check if a video exists in the database by its ID
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
}

// Export a singleton instance
export default new VideoUploadService();
