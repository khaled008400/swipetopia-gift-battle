
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
