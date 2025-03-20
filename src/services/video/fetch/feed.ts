
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError, mapVideoData } from './base';

export async function getForYouVideos(): Promise<Video[]> {
  console.log("Fetching For You videos...");
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} videos for For You feed`);
    
    // Transform data to match Video type expected by frontend using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    handleFetchError("getForYouVideos", error);
    return [];
  }
}

export async function getTrendingVideos(): Promise<Video[]> {
  try {
    console.log("Fetching Trending videos...");
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    
    console.log(`Successfully fetched ${data?.length || 0} trending videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    handleFetchError("getTrendingVideos", error);
    return [];
  }
}

export async function getVideos(limit: number = 50): Promise<Video[]> {
  try {
    console.log(`Fetching videos with limit: ${limit}`);
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    console.log(`Successfully fetched ${data?.length || 0} videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    handleFetchError("getVideos", error);
    return [];
  }
}
