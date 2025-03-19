
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { createStorageBucket } from '@/pages/api/create-storage-bucket';

class UploadService {
  /**
   * Initialize storage buckets
   */
  async initBuckets() {
    try {
      console.log('Initializing storage buckets...');
      await createStorageBucket();
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
      
      // Create a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log(`Uploading file to ${bucketName}/${filePath}`);
      
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Bucket ${bucketName} not found in list, trying to create it directly...`);
        try {
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: bucketName === 'videos' ? 104857600 : 10485760
          });
          
          if (error) {
            console.error('Error creating bucket directly:', error);
          } else {
            console.log(`Created bucket: ${bucketName} directly`);
          }
        } catch (bucketError) {
          console.error('Exception creating bucket directly:', bucketError);
          // Continue anyway as the bucket might exist but the API call failed
        }
      }
      
      // Upload file to Supabase Storage
      console.log('Starting file upload...', file.size, 'bytes');
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Changed to true to prevent upload errors on filename conflicts
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }
  
  /**
   * Upload a video and its thumbnail
   */
  async uploadVideo(videoFile: File, thumbnailFile: File | null): Promise<{ videoUrl: string, thumbnailUrl: string | null }> {
    try {
      console.log('Starting video upload process...');
      
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
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
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
