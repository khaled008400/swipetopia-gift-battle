export interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'online' | 'offline' | 'live' | 'scheduled';
  started_at: string;
  ended_at?: string;
  viewer_count?: number;
  thumbnail_url?: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
  user?: {
    username: string;
    avatar_url: string;
  };
  username?: string;
  avatar_url?: string;
  durationMinutes?: number;
  currentViewers?: number;
  giftsReceived?: number;
  topGiftName?: string;
  revenue?: number;
  peakViewers?: number;
  endedAt?: string;
  scheduledFor?: string;
  plannedDurationMinutes?: number;
  is_live?: boolean;
}

export interface Battle {
  id: string;
  stream_a_id: string;
  stream_b_id: string;
  status: 'pending' | 'active' | 'completed';
  started_at: string;
  ended_at?: string;
  winner_id?: string;
}

export interface BattleRequest {
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface StreamProduct {
  id: string;
  product_id: string;
  stream_id: string;
  featured: boolean;
  discount_percentage?: number;
}
