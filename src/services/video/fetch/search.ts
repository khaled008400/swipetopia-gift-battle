
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
    
    // Map profiles to user for backward compatibility
    return (data || []).map(video => ({
      ...video,
      user: {
        id: video.profiles?.id,
        username: video.profiles?.username || 'Unknown User',
        avatar: video.profiles?.avatar_url, // Map avatar_url to avatar for compatibility
        avatar_url: video.profiles?.avatar_url
      }
    }));
  } catch (error) {
    handleFetchError("searchVideos", error);
    return [];
  }
}
