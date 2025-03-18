
export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_live: boolean;
  is_private: boolean;
  duration: number;
  category: string;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  url?: string; // Add URL property for compatibility
  isPublic?: boolean; // Add isPublic property
  isLive?: boolean; // Add isLive property for compatibility
  user: {
    username: string;
    avatar: string;
    avatar_url?: string;
    isFollowing?: boolean;
    id?: string; // Add ID for user reference
  };
  profiles?: any; // Add profiles property for VideoPlayerPage
  creator?: any; // Add creator property
}

export interface BattleVideo extends Video {
  battle_id: string;
  score: number;
  position: 'left' | 'right';
}

export interface Comment {
  id: string;
  user_id: string;
  video_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  user: {
    username: string;
    avatar_url: string;
  };
}

export interface LiveStream {
  id: string;
  title: string;
  user_id: string;
  started_at: string;
  viewer_count: number;
  currentViewers?: number;
  endedAt?: string;
  scheduledFor?: string;
  durationMinutes?: number;
  peakViewers?: number;
  giftsReceived?: number;
  topGiftName?: string;
  revenue?: number;
  plannedDurationMinutes?: number;
  username?: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'live' | 'scheduled';
  user?: {
    username: string;
    avatar_url: string;
  };
  description?: string;
  thumbnail_url?: string;
  is_live?: boolean;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

export interface LiveStreamIndicatorProps {
  viewerCount: number;
}
