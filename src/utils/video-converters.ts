
import { Video, BattleVideo } from "@/types/video.types";

/**
 * Converts a BattleVideo to a Video type
 */
export const convertBattleVideoToVideo = (battleVideo: BattleVideo): Video => {
  return {
    id: battleVideo.id,
    title: battleVideo.title || "Battle Video",
    description: battleVideo.description || "",
    video_url: battleVideo.video_url,
    thumbnail_url: battleVideo.thumbnail_url,
    user_id: battleVideo.user_id,
    created_at: battleVideo.created_at,
    updated_at: battleVideo.updated_at,
    view_count: battleVideo.view_count,
    likes_count: battleVideo.likes_count,
    comments_count: battleVideo.comments_count,
    shares_count: battleVideo.shares_count,
    is_live: battleVideo.is_live || false,
    is_private: battleVideo.is_private || false,
    duration: battleVideo.duration || 0,
    category: battleVideo.category || "",
    likes: battleVideo.likes || 0,
    comments: battleVideo.comments || 0,
    shares: battleVideo.shares || 0,
    is_liked: battleVideo.is_liked || false,
    is_saved: battleVideo.is_saved || false,
    user: battleVideo.user,
    hashtags: battleVideo.hashtags || []
  };
};

/**
 * Converts an array of BattleVideos to Video type
 */
export const convertBattleVideosToVideos = (battleVideos: BattleVideo[]): Video[] => {
  return battleVideos.map(convertBattleVideoToVideo);
};
