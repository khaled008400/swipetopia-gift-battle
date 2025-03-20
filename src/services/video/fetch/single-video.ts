
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    console.log(`Fetching video with ID: ${id}`);
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Remap data to match the Video type expected by the frontend
    if (data) {
      console.log(`Successfully fetched video: ${id}`);
      const video: Video = {
        ...data,
        user: {
          id: data.profiles?.id,
          username: data.profiles?.username || 'Unknown User',
          avatar: data.profiles?.avatar_url,
          avatar_url: data.profiles?.avatar_url
        }
      };
      return video;
    }
    
    console.log(`No video found with ID: ${id}`);
    return null;
  } catch (error) {
    handleFetchError("getVideoById", error);
    return null;
  }
}
