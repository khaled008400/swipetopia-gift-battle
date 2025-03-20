
import { Video } from '@/types/video.types';
import { supabase } from '../base.service';
import { videoWithUserSelect, handleFetchError } from './base';

export async function getUserVideos(userId: string): Promise<Video[]> {
  console.log(`Fetching videos for user: ${userId}`);
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(videoWithUserSelect)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching user videos:", error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} videos for user ${userId}`);
    
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
    handleFetchError(`getUserVideos for ${userId}`, error);
    return [];
  }
}

export async function getLikedVideos(userId?: string): Promise<Video[]> {
  try {
    console.log("Fetching liked videos...");
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) return [];

    const { data, error } = await supabase
      .from('likes')
      .select(`
        video_id,
        videos:video_id (
          ${videoWithUserSelect}
        )
      `)
      .eq('user_id', currentUserId);

    if (error) throw error;

    console.log(`Found ${data?.length || 0} liked videos`);
    
    // Extract the videos from the joined data and filter out any nulls
    const videos: Video[] = [];
    
    if (data) {
      for (const item of data) {
        if (item.videos) {
          // Cast to any first to work with the data
          const videoWithProfiles = item.videos as any;
          // Create a properly structured video object
          const videoData = {
            ...videoWithProfiles,
            user: {
              id: videoWithProfiles.profiles?.id,
              username: videoWithProfiles.profiles?.username || 'Unknown User',
              avatar: videoWithProfiles.profiles?.avatar_url,
              avatar_url: videoWithProfiles.profiles?.avatar_url
            }
          };
          videos.push(videoData as Video);
        }
      }
    }
    
    return videos;
  } catch (error) {
    handleFetchError("getLikedVideos", error);
    return [];
  }
}

export async function getSavedVideos(userId?: string): Promise<Video[]> {
  try {
    console.log("Fetching saved videos...");
    const currentUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!currentUserId) return [];

    const { data, error } = await supabase
      .from('saved_videos')
      .select(`
        video_id,
        videos:video_id (
          ${videoWithUserSelect}
        )
      `)
      .eq('user_id', currentUserId);

    if (error) throw error;

    console.log(`Found ${data?.length || 0} saved videos`);
    
    // Extract the videos from the joined data and filter out any nulls
    const videos: Video[] = [];
    
    if (data) {
      for (const item of data) {
        if (item.videos) {
          // Cast to any first to work with the data
          const videoWithProfiles = item.videos as any;
          // Create a properly structured video object
          const videoData = {
            ...videoWithProfiles,
            user: {
              id: videoWithProfiles.profiles?.id,
              username: videoWithProfiles.profiles?.username || 'Unknown User',
              avatar: videoWithProfiles.profiles?.avatar_url,
              avatar_url: videoWithProfiles.profiles?.avatar_url
            }
          };
          videos.push(videoData as Video);
        }
      }
    }
    
    return videos;
  } catch (error) {
    handleFetchError("getSavedVideos", error);
    return [];
  }
}
