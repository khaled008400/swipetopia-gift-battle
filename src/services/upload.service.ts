
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

class UploadService {
  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(file: File, bucketName: string = 'videos'): Promise<string> {
    try {
      // Create a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log(`Uploading file to ${bucketName}/${filePath}`);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
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
      // Upload video file
      const videoUrl = await this.uploadFile(videoFile, 'videos');
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await this.uploadFile(thumbnailFile, 'thumbnails');
      }
      
      return { videoUrl, thumbnailUrl };
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }
}

export default new UploadService();
