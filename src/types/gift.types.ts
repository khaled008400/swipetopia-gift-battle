
export interface VirtualGift {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  value: number;
  available: boolean;
  category: string; 
  description: string; 
  is_premium: boolean;
  created_at: string;
  
  // Properties can be accessed using both camelCase and snake_case
  imageUrl?: string;
  imageType?: "svg" | "gif";
  hasSound?: boolean;
  soundUrl?: string;
  isPremium?: boolean;
  
  // Database uses snake_case
  image_url?: string;
  image_type?: "svg" | "gif";
  has_sound?: boolean;
  sound_url?: string;
}

export interface GiftTransaction {
  id?: string;
  sender_id: string;
  receiver_id: string;
  video_id: string;
  gift_id: string;
  amount: number;
  created_at?: string;
  sender?: {
    username: string;
    avatar_url?: string;
  };
  gift?: {
    name: string;
    icon: string;
    color: string;
  };
}

export interface Follower {
  id?: string;
  follower_id: string;
  following_id: string;
  created_at?: string;
}
