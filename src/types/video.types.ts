
export interface Video {
  id: string;
  title?: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id?: string;
  view_count?: number;
  profiles?: {
    username?: string;
    avatar_url?: string;
    id?: string;
  };
  creator?: {
    username?: string;
    avatar_url?: string;
    id?: string;
  };
}

export interface BattleVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  votes: number;
  isLive: boolean;
  viewerCount: number;
}
