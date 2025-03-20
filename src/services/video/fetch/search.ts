
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function searchVideos(query: string): Promise<Video[]> {
  if (!query.trim()) return [];
  
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleFetchError("searchVideos", error);
    return [];
  }
}
