
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
