
export interface VirtualGift {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  value: number;
  created_at?: string;
  available: boolean;
  category: string; 
  imageUrl: string; 
  imageType: "svg" | "gif"; 
  hasSound: boolean; 
  description: string; 
  isPremium?: boolean;
  soundUrl: string; 
  is_premium?: boolean;
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
