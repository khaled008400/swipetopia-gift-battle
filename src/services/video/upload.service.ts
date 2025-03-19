
import { v4 as uuidv4 } from 'uuid';
import { supabase, getAuthenticatedUser } from './base.service';

class VideoUploadService {
  async uploadVideo(
    videoFile: File,
    title: string,
    description: string,
    thumbnailUrl: string | null,
    isPrivate: boolean = false,
    hashtags: string[] = []
  ) {
    try {
      console.log('Starting video upload process in VideoUploadService...');
      
      // 1. Generate a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // 2. Upload the video file to storage
      console.log('Uploading video file to storage...');
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        throw uploadError;
      }

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      const videoUrl = publicUrlData.publicUrl;
      console.log('Video uploaded, public URL:', videoUrl);

      // 4. Insert the video metadata into the videos table
      console.log('Inserting video metadata into database...');
      
      // Get current user
      const user = await getAuthenticatedUser();
      
      console.log('Inserting with user ID:', user.id);

      // Create a basic insert object with required fields
      const videoData = {
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || `${videoUrl}?preview`,
        is_private: isPrivate, // Now using the is_private column correctly
        user_id: user.id,
        hashtags,
        view_count: 0,
        likes_count: 0,
        shares_count: 0,
        comments_count: 0 // Explicitly including comments_count
      };
      
      console.log('Inserting video with data:', videoData);
      
      const { data: insertedVideo, error: insertError } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting video metadata:', insertError);
        throw insertError;
      }

      console.log('Video metadata inserted successfully:', insertedVideo);
      return insertedVideo;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }
}

export default new VideoUploadService();
