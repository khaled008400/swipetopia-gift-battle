
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function getForYouVideos(): Promise<Video[]> {
  console.log("Fetching For You videos...");
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }

    // Map profiles to user for backward compatibility
    return (data || []).map(video => ({
      ...video,
      user: video.profiles || {}
    }));
  } catch (error) {
    handleFetchError("getForYouVideos", error);
    throw error;
  }
}

export async function getTrendingVideos(): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .order('view_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    
    // Map profiles to user for backward compatibility
    return (data || []).map(video => ({
      ...video,
      user: video.profiles || {}
    }));
  } catch (error) {
    handleFetchError("getTrendingVideos", error);
    throw error;
  }
}

export async function getVideos(limit: number = 50): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Map profiles to user for backward compatibility
    return (data || []).map(video => ({
      ...video,
      user: video.profiles || {}
    }));
  } catch (error) {
    handleFetchError("getVideos", error);
    return [];
  }
}
