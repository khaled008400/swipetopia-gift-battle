
import { LiveStream } from "@/types/livestream.types";

// Re-export LiveStream to maintain backward compatibility
export { LiveStream };

export interface Battle {
  id: string;
  stream_a_id: string;
  stream_b_id: string;
  status: 'pending' | 'active' | 'completed';
  streamer_a_score: number;
  streamer_b_score: number;
  started_at: string;
  ended_at?: string;
}

export interface BattleRequest {
  from_streamer_id: string;
  to_streamer_id: string;
  message?: string;
}

export interface StreamProduct {
  id: string;
  product_id: string;
  stream_id: string;
  featured: boolean;
  discount_percentage?: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    category?: string;
  };
}
