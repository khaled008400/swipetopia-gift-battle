export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  original_price?: number;
  discount?: number;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  suction_score?: number;
  shop?: {
    name: string;
    logo?: string;
  };
}

export interface ProductAttribute {
  name: string;
  values: string[];
}

export interface ProductVariation {
  id: string;
  attributes: Record<string, string>;
  price: number;
  stock_quantity: number;
  image_url?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'wallet';
  card_number?: string;
  card_brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default?: boolean;
  display_name?: string;
  last4?: string;
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
  title: string;
  thumbnail_url: string;
  is_live: boolean;
  viewers: number;
  started_at: string;
  stream_key: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
  user?: {
    username: string;
    avatar_url: string;
  };
}

export interface RefundRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  amount: number;
  order?: any;
  user?: {
    username: string;
    avatar_url: string;
    email?: string;
  };
}

export interface CustomerMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
  receiver?: {
    username: string;
    avatar_url: string;
  };
}

export interface SellerWallet {
  id: string;
  user_id: string;
  balance: number;
  pending_balance: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  currency: string;
  can_withdraw: boolean;
  minimum_withdrawal: number;
  transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'refund' | 'sale';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description: string;
  reference_id?: string;
}

export interface ShopProfile {
  id: string;
  user_id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  contact_email: string;
  contact_phone: string;
  social_links: {
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  created_at: string;
  updated_at: string;
  policies: {
    returns: string;
    shipping: string;
    terms: string;
  };
}
