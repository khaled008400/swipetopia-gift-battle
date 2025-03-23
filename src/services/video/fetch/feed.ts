
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, mapVideoData } from './base';
import { toast } from 'sonner';

// Reduce timeout values to prevent long waiting periods
const DEFAULT_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 5000; // Reduced to 5s to fail faster
const MAX_RETRY_ATTEMPTS = 2;

// Flag to help detect offline/network issues
let consecutiveTimeouts = 0;

export async function getForYouVideos(limit = DEFAULT_LIMIT): Promise<Video[]> {
  console.log("Fetching For You videos...");
  
  try {
    // Create a timeout promise that rejects after the specified time
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT_MS)
    );
    
    // Simpler query to ensure it completes - only select necessary fields
    const fetchPromise = supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false)
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
      consecutiveTimeouts = 0; // Reset on different error type
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} videos for For You feed`);
    consecutiveTimeouts = 0; // Reset on success
    
    // Map the data to the expected format
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getForYouVideos:", error);
    
    // Check if it's a timeout error
    if (error instanceof Error && error.message === 'Request timeout') {
      consecutiveTimeouts++;
      console.log(`Timeout occurred (${consecutiveTimeouts}), trying regular videos instead`);
      
      // After multiple timeouts, show toast notification about connection issues
      if (consecutiveTimeouts >= 2) {
        toast.error("Network connection seems slow. Try again later.");
      }
      
      // Try a simpler query
      return await getVideos(limit);
    }
    
    // Return empty array to prevent UI crashes
    return [];
  }
}

export async function getVideos(limit = DEFAULT_LIMIT): Promise<Video[]> {
  try {
    console.log(`Fetching videos with limit: ${limit}`);
    
    // Set a timeout for this request too but shorter
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT_MS)
    );
    
    // Simpler query with fewer fields to ensure it completes
    const fetchPromise = supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('is_private', false)
      .limit(limit);
    
    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as any;
    
    const { data, error } = result || {};

    if (error) {
      console.error("Error fetching videos:", error);
      return []; // Return empty array instead of throwing
    }
    
    console.log(`Successfully fetched ${data?.length || 0} videos`);
    consecutiveTimeouts = 0; // Reset on success
    
    // Transform data using the common mapper
    return (data || []).map(mapVideoData);
  } catch (error) {
    console.error("Critical error in getVideos:", error);
    
    if (error instanceof Error && error.message === 'Request timeout') {
      consecutiveTimeouts++;
      if (consecutiveTimeouts >= MAX_RETRY_ATTEMPTS) {
        toast.error("Network issues detected. Check your connection.");
      }
    }
    
    return []; // Return empty array instead of throwing
  }
}
