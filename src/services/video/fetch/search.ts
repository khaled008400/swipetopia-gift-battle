
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function searchVideos(query: string): Promise<Video[]> {
  if (!query.trim()) return [];
  
  try {
    console.log(`Searching videos with query: ${query}`);
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    
    console.log(`Search found ${data?.length || 0} videos`);
    
    // Transform data to match Video type expected by frontend
    return (data || []).map(video => ({
      ...video,
      user: {
        id: video.profiles?.id,
        username: video.profiles?.username || 'Unknown User',
        avatar: video.profiles?.avatar_url,
        avatar_url: video.profiles?.avatar_url
      }
    }));
  } catch (error) {
    handleFetchError("searchVideos", error);
    return [];
  }
}
