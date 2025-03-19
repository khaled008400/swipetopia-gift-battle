
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
      console.log('Starting video upload process in VideoUploadService...', {
        fileName: videoFile.name,
        fileSize: videoFile.size,
        title,
        isPrivate,
        hashtagCount: hashtags.length
      });
      
      // 1. Generate a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // 2. Upload the video file to storage
      console.log(`Uploading video file to storage: ${filePath}`);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        throw uploadError;
      }

      console.log('Video file upload successful, getting public URL...', uploadData);
      
      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('Failed to get public URL for uploaded video');
        throw new Error('Failed to get public URL for uploaded video');
      }

      const videoUrl = publicUrlData.publicUrl;
      console.log('Video URL generated successfully:', videoUrl);

      // 4. Insert the video metadata into the videos table
      console.log('Inserting video metadata into database...');
      
      // Get current user
      const user = await getAuthenticatedUser();
      
      console.log('Inserting with user ID:', user.id);

      // Create video data with all required fields
      const videoData = {
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || `${videoUrl}?preview`,
        is_private: isPrivate, 
        user_id: user.id,
        hashtags,
        view_count: 0,
        likes_count: 0,
        shares_count: 0,
        comments_count: 0
      };
      
      console.log('Inserting video with data:', JSON.stringify(videoData, null, 2));
      
      // Insert the video data and return the inserted record
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

  // Method to check if a video exists in the database by its ID
  async checkVideoExists(videoId: string): Promise<boolean> {
    if (!videoId) {
      console.error('Invalid video ID provided to checkVideoExists:', videoId);
      return false;
    }
    
    try {
      console.log(`Checking if video with ID ${videoId} exists in database...`);
      
      const { data, error, status } = await supabase
        .from('videos')
        .select('id, title')
        .eq('id', videoId)
        .single();
      
      if (error) {
        if (status === 406) {
          // No rows returned
          console.log(`Video with ID ${videoId} does not exist in database (no rows)`);
          return false;
        }
        
        console.error('Error checking if video exists:', error);
        return false;
      }
      
      const exists = !!data;
      console.log(`Video existence check result for ID ${videoId}: ${exists ? 'Found' : 'Not found'}, Status: ${status}`);
      
      if (exists) {
        console.log('Video data found:', data);
      }
      
      return exists;
    } catch (error) {
      console.error('Error in checkVideoExists:', error);
      return false;
    }
  }
}

export default new VideoUploadService();
