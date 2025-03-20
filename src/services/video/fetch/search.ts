
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError, mapVideoData } from './base';

export async function searchVideos(query: string): Promise<Video[]> {
  if (!query.trim()) return [];
  
  try {
    console.log(`Searching videos with query: ${query}`);
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    
    console.log(`Search found ${data?.length || 0} videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    handleFetchError("searchVideos", error);
    return [];
  }
}
