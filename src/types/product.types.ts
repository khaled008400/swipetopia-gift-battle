
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock_quantity: number;
  category: string;
  status: "active" | "draft" | "unavailable";
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  suction_score?: number;
}

export interface LimitedOffer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product?: Product;
}

export interface LiveSeller {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string;
  viewers: number;
  started_at: string;
  is_live: boolean;
  username?: string;
  avatar_url?: string;
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
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export interface ShopProfile {
  id: string;
  user_id: string;
  name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  created_at: string;
  updated_at: string;
  rating?: number;
  total_sales?: number;
  policies?: {
    returns?: string;
    shipping?: string;
    terms?: string;
  };
}

export interface CustomerMessage {
  id: string;
  seller_id: string;
  customer_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  conversation_id: string;
  sender_type: "seller" | "customer";
  customer_name?: string;
  customer_avatar?: string;
}

export interface RefundRequest {
  id: string;
  order_id: string;
  user_id: string;
  seller_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  amount: number;
  product_id: string;
  product_name?: string;
  username?: string;
}

export interface SellerWallet {
  id: string;
  seller_id: string;
  balance: number;
  currency: string;
  last_payout_date?: string;
  pending_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SellerReport {
  id: string;
  seller_id: string;
  period: "daily" | "weekly" | "monthly";
  sales_total: number;
  orders_count: number;
  date: string;
  views_count: number;
  refunds_count: number;
  top_products: {
    id: string;
    name: string;
    sales: number;
  }[];
}
