
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
      console.log('Starting video upload process...');
      const user = await getAuthenticatedUser();

      // First check if storage buckets exist
      console.log('Checking for storage buckets...');
      const { data: buckets } = await supabase.storage.listBuckets();
      const videosBucketExists = buckets?.some(bucket => bucket.name === 'videos');

      if (!videosBucketExists) {
        console.log('Creating videos bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('videos', {
          public: true,
          fileSizeLimit: 104857600 // 100 MB
        });
        
        if (bucketError) {
          console.error("Error creating videos bucket:", bucketError);
          // Continue anyway, bucket might exist despite error
        }
      }

      // Create a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload video to storage
      console.log(`Uploading video file ${filePath}, size: ${videoFile.size} bytes`);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: true // Change to true to avoid conflicts
        });

      if (uploadError) {
        console.error("Error uploading video:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log("Video file uploaded successfully, getting public URL");

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // For thumbnail, either use provided URL or just append preview parameter
      const thumbnail = thumbnailUrl || `${publicUrl}?preview`;
      
      console.log("Public URL obtained:", publicUrl);
      console.log("Thumbnail URL:", thumbnail);

      // Insert video record in database
      const videoData = {
        title,
        description,
        video_url: publicUrl,
        thumbnail_url: thumbnail,
        is_private: isPrivate,
        user_id: user.id,
        hashtags,
        view_count: 0,
        likes_count: 0
      };

      console.log("Inserting video record into database:", { 
        title, 
        description: description?.substring(0, 20) + '...',
        userId: user.id,
        isPrivate,
        hashtags
      });

      const { data, error } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single();

      if (error) {
        console.error("Error inserting video data:", error);
        throw new Error(`Database insertion failed: ${error.message}`);
      }

      console.log("Video record created successfully with ID:", data.id);
      return data;
    } catch (error: any) {
      console.error("Error in uploadVideo:", error);
      throw new Error(error.message || "Failed to upload video");
    }
  }

  // Method to check if a video exists in the database by its ID
  async checkVideoExists(videoId: string): Promise<boolean> {
    try {
      console.log(`Checking if video with ID ${videoId} exists...`);
      
      const { data, error, count } = await supabase
        .from('videos')
        .select('id', { count: 'exact' })
        .eq('id', videoId)
        .limit(1);

      if (error) {
        console.error("Error checking if video exists:", error);
        return false;
      }

      const exists = Array.isArray(data) && data.length > 0;
      console.log(`Video existence check result: ${exists ? 'Found' : 'Not found'}`);
      
      return exists;
    } catch (error) {
      console.error("Error in checkVideoExists:", error);
      return false;
    }
  }
}

// Export a singleton instance
export default new VideoUploadService();
