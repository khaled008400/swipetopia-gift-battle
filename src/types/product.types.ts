
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  inventory_count?: number;
  status?: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  original_price?: number;
  rating?: number;
  reviews_count?: number;
  stock_quantity?: number;
  suction_score?: number;
  shop?: {
    name: string;
    id: string;
  };
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  inventory_count: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

// Additional types needed by seller components
export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface RefundRequest {
  id: string;
  order_id: string;
  product_id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  amount: number;
  product: {
    name: string;
    image_url: string;
  };
  user: {
    username: string;
    email: string;
  };
}

export interface CustomerMessage {
  id: string;
  user_id: string;
  seller_id: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface SellerWallet {
  id: string;
  seller_id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'sale';
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  description: string;
}

export interface ShopProfile {
  id: string;
  seller_id: string;
  shop_name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LimitedOffer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface LiveSeller {
  id: string;
  user_id: string;
  title?: string;
  thumbnail_url?: string;
  is_live: boolean;
  viewers: number;
  started_at: string;
  updated_at: string;
  stream_key?: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
}
