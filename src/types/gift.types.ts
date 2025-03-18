
export interface VirtualGift {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  value: number;
  created_at?: string;
  available?: boolean;
  category?: string;
  imageUrl: string; // Required to match AdminService.VirtualGift
  imageType: "svg" | "gif"; // Required and limited to these two values
  hasSound: boolean; // Required
  description: string; // Required to match AdminService.VirtualGift
  isPremium?: boolean;
  soundUrl: string; // Make it required
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
  // Add the missing properties that are used in RecentGifts.tsx
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
