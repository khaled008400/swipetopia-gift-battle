
import { Video, BattleVideo } from "@/types/video.types";

/**
 * Converts battle videos to regular videos for display in video components
 */
export const convertBattleVideosToVideos = (battleVideos: BattleVideo[]): Video[] => {
  return battleVideos.map(battleVideo => {
    // Extract the necessary properties to create a Video object
    const video: Video = {
      id: battleVideo.id,
      title: battleVideo.title,
      description: battleVideo.description,
      video_url: battleVideo.video_url,
      thumbnail_url: battleVideo.thumbnail_url,
      user_id: battleVideo.user_id,
      created_at: battleVideo.created_at,
      updated_at: battleVideo.updated_at,
      view_count: battleVideo.view_count,
      likes_count: battleVideo.likes_count,
      comments_count: battleVideo.comments_count,
      shares_count: battleVideo.shares_count,
      is_live: battleVideo.is_live,
      is_private: battleVideo.is_private,
      duration: battleVideo.duration,
      category: battleVideo.category,
      user: battleVideo.user,
      profiles: battleVideo.profiles,
      creator: battleVideo.creator,
      url: battleVideo.url,
      isPublic: true,
      isLive: battleVideo.is_live
    };
    
    return video;
  });
};
