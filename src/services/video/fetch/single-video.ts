
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Remap data to match the Video type expected by the frontend
    if (data) {
      // Map profiles to user for backward compatibility
      const video: Video = {
        ...data,
        user: data.profiles || {}
      };
      return video;
    }
    
    return null;
  } catch (error) {
    handleFetchError("getVideoById", error);
    throw error;
  }
}
