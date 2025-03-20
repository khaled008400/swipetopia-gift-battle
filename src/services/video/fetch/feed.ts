
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError, mapVideoData } from './base';

export async function getForYouVideos(): Promise<Video[]> {
  console.log("Fetching For You videos...");
  try {
    // Add a timeout to make sure the request doesn't hang
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const fetchPromise = supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .order('created_at', { ascending: false })
      .limit(20);
      
    // Use Promise.race to implement timeout
    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    if (error) {
      console.error("Error fetching videos:", error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} videos for For You feed`);
    console.log("First video data:", data && data.length > 0 ? data[0] : "No videos found");
    
    // Transform data to match Video type expected by frontend using the common mapper
    const mappedVideos = (data || []).map(mapVideoData);
    console.log("Mapped videos:", mappedVideos.length);
    return mappedVideos;
  } catch (error) {
    console.error("Critical error in getForYouVideos:", error);
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

    if (error) {
      console.error("Error fetching trending videos:", error);
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} trending videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getTrendingVideos:", error);
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

    if (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getVideos:", error);
    return [];
  }
}
