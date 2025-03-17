
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  rating?: number;
  reviews_count?: number;
  in_stock?: boolean;
  seller_id: string;
  created_at: string;
  updated_at: string;
  original_price?: number;
  stock_quantity?: number;
  status?: "active" | "draft" | "unavailable";
  is_featured?: boolean;
  suction_score?: number;
}

export interface AdminProduct extends Product {
  stock_quantity: number;
  status: "active" | "draft" | "unavailable";
  is_featured: boolean;
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

export interface RefundRequest {
  id: string;
  order_id: string;
  user_id: string;
  seller_id: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
  amount: number;
  product_id: string;
  product_name: string;
  username: string;
}

// Adding missing types for PaymentMethod, ShopProfile, and SellerWallet
export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  is_default: boolean;
  name?: string;
}

export interface ShopProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  categories: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  policies: {
    returns: string;
    shipping: string;
    privacy: string;
  };
}

export interface SellerWallet {
  id: string;
  balance: number;
  pendingAmount: number;
  currency: string;
  transactions: {
    id: string;
    amount: number;
    type: string;
    status: string;
    date: string;
    description: string;
  }[];
}
