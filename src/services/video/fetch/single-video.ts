
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
    return data;
  } catch (error) {
    handleFetchError("getVideoById", error);
    throw error;
  }
}
