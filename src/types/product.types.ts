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
