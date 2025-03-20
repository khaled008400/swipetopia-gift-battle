
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError, mapVideoData } from './base';

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    console.log(`Fetching video with ID: ${id}`);
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Process video data using common mapper
    if (data) {
      console.log(`Successfully fetched video: ${id}`);
      return mapVideoData(data);
    }
    
    console.log(`No video found with ID: ${id}`);
    return null;
  } catch (error) {
    handleFetchError("getVideoById", error);
    return null;
  }
}
