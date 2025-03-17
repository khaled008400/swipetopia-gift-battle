
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
