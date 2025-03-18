
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling file uploads to Supabase storage
 */
class UploadService {
  /**
   * Upload a file to the specified bucket
   * @param file The file to upload
   * @param bucket The storage bucket to upload to
   * @param folder Optional folder path within the bucket
   * @returns URL of the uploaded file
   */
  async uploadFile(file: File, bucket: 'videos' | 'thumbnails' | 'sounds' | 'icons', folder: string = ''): Promise<string> {
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      console.log(`Uploading file to ${bucket}/${filePath}`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Upload service error:', error);
      throw error;
    }
  }
  
  /**
   * Upload a video file and generate thumbnail
   * @param videoFile The video file to upload
   * @param thumbnailFile Optional thumbnail file (if not provided, one will be generated)
   * @returns Object containing URLs for video and thumbnail
   */
  async uploadVideo(videoFile: File, thumbnailFile?: File | null): Promise<{videoUrl: string, thumbnailUrl: string | null}> {
    const videoUrl = await this.uploadFile(videoFile, 'videos');
    
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await this.uploadFile(thumbnailFile, 'thumbnails');
    }
    
    return { videoUrl, thumbnailUrl };
  }
  
  /**
   * Upload an audio file for a gift
   * @param audioFile The audio file to upload
   * @returns URL of the uploaded audio file
   */
  async uploadAudio(audioFile: File): Promise<string> {
    return this.uploadFile(audioFile, 'sounds');
  }
  
  /**
   * Upload an icon image
   * @param iconFile The icon file to upload
   * @returns URL of the uploaded icon
   */
  async uploadIcon(iconFile: File): Promise<string> {
    return this.uploadFile(iconFile, 'icons');
  }
}

export default new UploadService();
