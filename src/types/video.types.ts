
export interface Video {
  id: string;
  url?: string;
  video_url?: string;
  user?: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  description: string;
  likes?: number;
  comments?: number;
  comments_count?: number;
  shares?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  allowDownloads?: boolean;
  isLive?: boolean;
  hashtags?: string[];
  privacy?: "public" | "private" | "followers";
  createdAt?: string;
  created_at?: string;
  title?: string;
  isPublic?: boolean;
  profiles?: {
    username: string;
    avatar_url: string;
  };
  creator?: {
    username: string;
    avatar_url: string;
  };
  views?: number;
  view_count?: number;
  thumbnail_url?: string;
  user_id?: string;
}

export type VideoActionHandler = () => void;
