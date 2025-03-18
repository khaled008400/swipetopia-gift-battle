
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
  description?: string;
  thumbnail_url?: string;
  is_live?: boolean;
  user?: {
    username: string;
    avatar_url: string;
  };
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}
