
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types/video.types';

// Get the authenticated user with proper error handling
const getAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    console.error('Error getting authenticated user:', error);
    throw new Error('You must be logged in to perform this action');
  }
  
  return data.user;
};

class VideoUploadService {
  // Ensure buckets exist before upload
  private async ensureBucketsExist() {
    try {
      console.log('Checking for storage buckets...');
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return false;
      }
      
      const videosBucketExists = buckets?.some(bucket => bucket.name === 'videos');
      
      if (!videosBucketExists) {
        console.log('Creating videos bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('videos', {
          public: true,
          fileSizeLimit: 104857600 // 100 MB
        });
        
        if (bucketError) {
          console.error("Error creating videos bucket:", bucketError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring buckets exist:', error);
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
  ): Promise<Video> {
    try {
      console.log('Starting video upload process...');
      
      // First, get the authenticated user
      const user = await getAuthenticatedUser();
      console.log('User authenticated:', user.id);
      
      // Ensure buckets exist
      await this.ensureBucketsExist();
      
      // Create a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload with retry logic
      let uploadError: any = null;
      let uploadResult: any = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Upload attempt ${attempt} of ${maxRetries}...`);
        
        const { error, data } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (!error) {
          uploadResult = data;
          uploadError = null;
          console.log('Upload successful on attempt', attempt);
          break;
        } else {
          console.error(`Error on upload attempt ${attempt}:`, error);
          uploadError = error;
          
          if (attempt < maxRetries) {
            // Wait before retry with exponential backoff
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (uploadError) {
        throw new Error(`Upload failed after ${maxRetries} attempts: ${uploadError.message}`);
      }
      
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
      
      console.log("Inserting video record into database...");
      
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
      
      const { data, error } = await supabase
        .from('videos')
        .select('id')
        .eq('id', videoId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking if video exists:", error);
        return false;
      }
      
      const exists = !!data;
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
