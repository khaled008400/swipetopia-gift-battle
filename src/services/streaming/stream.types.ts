export interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'online' | 'offline';
  started_at: string;
  ended_at?: string;
  viewer_count?: number;
  thumbnail_url?: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
  user?: {
    id: string;
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

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  videoUploadsToday: number;
  totalOrders: number;
  ordersToday: number;
  revenueTotal: number;
  revenueToday: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  minimum_purchase?: number;
  expiry_date?: string;
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  status: string;
  current_uses: number;
  discount_percentage: number;
  max_uses: number;
}

export interface AdminOrder {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  total: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdminOffer {
  id: string;
  title: string;
  product_id: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage' | 'special';
  discount_value: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  min_purchase_amount: number;
  product_category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
  created_at: string;
  delivery_time: string;
  is_default: boolean;
}

export interface AdminVideo {
  id: string;
  title: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  user_id?: string;
  status: string;
  created_at: string;
  description: string;
  view_count: number;
  likes_count: number;
  comments_count: number;
  video_url: string;
  thumbnail_url?: string;
  url: string;
  data?: any[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  videosCount: number;
  ordersCount: number;
}

export interface VirtualGift {
  id: string;
  name: string;
  description: string;
  price: number;
  value: number;
  imageUrl: string;
  imageType: "svg" | "gif";
  hasSound: boolean;
  soundUrl?: string;
  category: string;
  available: boolean;
  created_at: string;
  color: string;
  icon: string;
  is_premium: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  color?: string;
  status: 'active' | 'inactive';
  created_at: string;
}
