
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

/**
 * Creates a BattleVideo object with default values for missing properties
 */
export const createCompleteBattleVideo = (videoData: any, position: "left" | "right"): BattleVideo => {
  // Ensure position is the correct type
  const videoPosition = position as "left" | "right";
  
  return {
    id: videoData.id || "",
    battle_id: videoData.battle_id || "",
    score: videoData.score || 0,
    position: videoPosition,
    title: videoData.title || "Battle Video",
    description: videoData.description || "",
    video_url: videoData.video_url || videoData.url || "",
    thumbnail_url: videoData.thumbnail_url || "",
    user_id: videoData.user_id || "",
    created_at: videoData.created_at || new Date().toISOString(),
    updated_at: videoData.updated_at || new Date().toISOString(),
    view_count: videoData.view_count || 0,
    likes_count: videoData.likes_count || 0,
    comments_count: videoData.comments_count || 0,
    shares_count: videoData.shares_count || 0,
    is_live: videoData.is_live || false,
    is_private: videoData.is_private || false,
    duration: videoData.duration || 0,
    category: videoData.category || "General",
    user: videoData.user || { username: "Anonymous", avatar: "/placeholder-avatar.jpg" },
    url: videoData.url || videoData.video_url || "",
    profiles: videoData.profiles,
    creator: videoData.creator,
    isPublic: videoData.isPublic || true,
    isLive: videoData.isLive || videoData.is_live || false,
    hashtags: videoData.hashtags || []
  };
};
