
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
  imageUrl?: string;
  imageType?: string;
  hasSound?: boolean;
  description?: string;
  isPremium?: boolean;
}

export interface GiftTransaction {
  id?: string;
  sender_id: string;
  receiver_id: string;
  video_id: string;
  gift_id: string;
  amount: number;
  created_at?: string;
}

export interface Follower {
  id?: string;
  follower_id: string;
  following_id: string;
  created_at?: string;
}
