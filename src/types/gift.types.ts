
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
