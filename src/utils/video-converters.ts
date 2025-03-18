
import { Video, BattleVideo } from "@/types/video.types";

export const convertBattleVideosToVideos = (battleVideos: BattleVideo[]): Video[] => {
  return battleVideos.map(bv => ({
    id: bv.id,
    title: bv.title,
    description: bv.description,
    video_url: bv.video_url,
    thumbnail_url: bv.thumbnail_url,
    user_id: bv.user_id,
    created_at: bv.created_at,
    updated_at: bv.updated_at,
    view_count: bv.view_count,
    likes_count: bv.likes_count,
    comments_count: bv.comments_count,
    shares_count: bv.shares_count,
    is_live: bv.is_live,
    is_private: bv.is_private,
    duration: bv.duration,
    category: bv.category,
    hashtags: bv.hashtags,
    likes: bv.likes,
    comments: bv.comments,
    shares: bv.shares,
    is_liked: bv.is_liked,
    is_saved: bv.is_saved,
    url: bv.video_url, // Map video_url to url for compatibility
    isPublic: !bv.is_private, // Map is_private to isPublic
    isLive: bv.is_live, // Map is_live to isLive
    user: bv.user,
    profiles: bv.profiles,
    creator: bv.creator
  }));
};

// Add a helper for single battle video conversion
export const convertBattleVideoToVideo = (bv: BattleVideo): Video => {
  return {
    id: bv.id,
    title: bv.title,
    description: bv.description,
    video_url: bv.video_url,
    thumbnail_url: bv.thumbnail_url,
    user_id: bv.user_id,
    created_at: bv.created_at,
    updated_at: bv.updated_at,
    view_count: bv.view_count,
    likes_count: bv.likes_count,
    comments_count: bv.comments_count,
    shares_count: bv.shares_count,
    is_live: bv.is_live,
    is_private: bv.is_private,
    duration: bv.duration,
    category: bv.category,
    hashtags: bv.hashtags,
    likes: bv.likes,
    comments: bv.comments,
    shares: bv.shares,
    is_liked: bv.is_liked,
    is_saved: bv.is_saved,
    url: bv.video_url,
    isPublic: !bv.is_private,
    isLive: bv.is_live,
    user: bv.user,
    profiles: bv.profiles,
    creator: bv.creator
  };
};
