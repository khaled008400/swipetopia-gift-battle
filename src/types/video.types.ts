
export interface Video {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  allowDownloads?: boolean;
  isLive?: boolean;
  hashtags?: string[];
  privacy?: "public" | "private" | "followers";
  createdAt?: string;
  title?: string;
  isPublic?: boolean;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export type VideoActionHandler = () => void;
