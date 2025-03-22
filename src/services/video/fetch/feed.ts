
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError, mapVideoData } from './base';
import { toast } from 'sonner';

// Default values for better control
const DEFAULT_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 15000; // Increased from 10s to 15s

export async function getForYouVideos(limit = DEFAULT_LIMIT): Promise<Video[]> {
  console.log("Fetching For You videos...");
  try {
    // Create a timeout promise that rejects after the specified time
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT_MS)
    );
    
    // Main fetch promise
    const fetchPromise = supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false) // Only fetch public videos
      .order('created_at', { ascending: false })
      .limit(limit);
      
    // Use Promise.race to implement timeout
    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;

    // Handle response
    const { data, error } = result || {};
    
    if (error) {
      console.error("Error fetching For You videos:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} videos for For You feed`);
    
    // Map the data to the expected format
    const mappedVideos = (data || []).map(mapVideoData);
    console.log("Mapped For You videos:", mappedVideos.length);
    return mappedVideos;
  } catch (error) {
    console.error("Critical error in getForYouVideos:", error);
    
    // Fall back to trending videos on timeout
    if (error instanceof Error && error.message === 'Request timeout') {
      console.log("Timeout occurred, trying to fetch trending videos instead");
      try {
        return await getTrendingVideos(limit);
      } catch (fallbackError) {
        console.error("Even fallback to trending failed:", fallbackError);
      }
    }
    
    // Return empty array to prevent UI crashes
    return [];
  }
}

export async function getTrendingVideos(limit = DEFAULT_LIMIT): Promise<Video[]> {
  try {
    console.log("Fetching Trending videos...");
    
    // Set a timeout for this request too
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT_MS)
    );
    
    const fetchPromise = supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false)
      .order('view_count', { ascending: false })
      .limit(limit);
    
    // Use Promise.race to implement timeout here too
    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;
    
    const { data, error } = result || {};

    if (error) {
      console.error("Error fetching trending videos:", error);
      // Try regular videos as fallback
      return await getVideos(limit);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} trending videos`);
    
    if (!data || data.length === 0) {
      console.log("No trending videos found, falling back to regular videos");
      return await getVideos(limit);
    }
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getTrendingVideos:", error);
    
    // Try one more fallback to regular videos
    try {
      console.log("Error in trending, trying regular videos as last resort");
      return await getVideos(limit);
    } catch (fallbackError) {
      console.error("All video fetch attempts failed:", fallbackError);
      return []; // Return empty array instead of throwing
    }
  }
}

export async function getVideos(limit = DEFAULT_LIMIT): Promise<Video[]> {
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
      return []; // Return empty array instead of throwing
    }
    
    console.log(`Successfully fetched ${data?.length || 0} videos`);
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getVideos:", error);
    return []; // Return empty array instead of throwing
  }
}
