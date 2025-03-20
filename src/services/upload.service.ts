import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

class UploadService {
  /**
   * Initialize storage buckets
   */
  async initBuckets() {
    try {
      console.log('Initializing storage buckets...');
      
      // Check if buckets exist first
      const { data: buckets, error: checkError } = await supabase.storage.listBuckets();
      
      if (checkError) {
        console.error('Error checking buckets:', checkError);
        // Try to create them anyway
      }
      
      // Create required buckets if they don't exist
      const requiredBuckets = ['videos', 'thumbnails', 'gift-icons', 'gift-sounds'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      for (const bucketName of requiredBuckets) {
        if (!existingBuckets.includes(bucketName)) {
          console.log(`Creating bucket: ${bucketName}`);
          try {
            const { error } = await supabase.storage.createBucket(bucketName, {
              public: true,
              fileSizeLimit: bucketName === 'videos' ? 104857600 : 10485760
            });
            
            if (error) {
              console.error(`Error creating bucket ${bucketName}:`, error);
            } else {
              console.log(`Created bucket: ${bucketName}`);
            }
          } catch (bucketError) {
            console.error(`Exception creating bucket ${bucketName}:`, bucketError);
            // Continue anyway as the buckets might exist but the API call failed
          }
        } else {
          console.log(`Bucket ${bucketName} already exists`);
        }
      }
      
      console.log('Storage buckets initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing storage buckets:', error);
      // Continue anyway as the buckets might exist
      return false;
    }
  }

  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(file: File, bucketName: string = 'videos'): Promise<string> {
    try {
      // Initialize buckets first
      await this.initBuckets();
      
      // Wait a moment to ensure bucket creation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log(`Uploading file (${file.size} bytes) to ${bucketName}/${filePath}`);
      
      // Upload file to Supabase Storage with retry logic
      let uploadAttempt = 0;
      const maxAttempts = 3;
      let uploadSuccess = false;
      let data;
      let error;
      
      while (!uploadSuccess && uploadAttempt < maxAttempts) {
        uploadAttempt++;
        console.log(`Upload attempt ${uploadAttempt} of ${maxAttempts}...`);
        
        const uploadResult = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        data = uploadResult.data;
        error = uploadResult.error;
        
        if (error) {
          console.error(`Error on upload attempt ${uploadAttempt}:`, error);
          
          if (uploadAttempt < maxAttempts) {
            // Wait before retry (exponential backoff)
            const delay = Math.pow(2, uploadAttempt) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } else {
          uploadSuccess = true;
        }
      }
      
      if (!uploadSuccess) {
        throw error || new Error('Max upload attempts reached');
      }
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully:', publicUrl);
      
      return publicUrl;
    } catch (error: any) {
      console.error('Error in uploadFile:', error);
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Upload a video and its thumbnail
   */
  async uploadVideo(videoFile: File, thumbnailFile: File | null): Promise<{ videoUrl: string, thumbnailUrl: string | null }> {
    try {
      console.log('Starting video upload process...');
      
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to upload videos');
      }
      
      // Upload video file
      const videoUrl = await this.uploadFile(videoFile, 'videos');
      console.log('Video uploaded successfully:', videoUrl);
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        console.log('Uploading thumbnail...');
        thumbnailUrl = await this.uploadFile(thumbnailFile, 'thumbnails');
        console.log('Thumbnail uploaded successfully:', thumbnailUrl);
      }
      
      return { videoUrl, thumbnailUrl };
    } catch (error: any) {
      console.error('Error in uploadVideo:', error);
      throw new Error(`Video upload failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Upload a virtual gift icon
   */
  async uploadIcon(file: File): Promise<string> {
    try {
      return await this.uploadFile(file, 'gift-icons');
    } catch (error) {
      console.error('Error uploading icon:', error);
      throw error;
    }
  }

  /**
   * Upload audio file for virtual gifts
   */
  async uploadAudio(file: File): Promise<string> {
    try {
      return await this.uploadFile(file, 'gift-sounds');
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  }
}

export default new UploadService();
