
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
  // Additional properties needed for compatibility
  url?: string;
  original_price?: number;
  specifications?: Record<string, string>[];
  seller?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  liked?: boolean;
}

export interface ProductProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  isLiked?: boolean;
}

export interface AdminProduct {
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
  // For compatibility with existing code
  image?: string;
  inventory?: number;
}

export interface LimitedOffer {
  id: string;
  start_date: string;
  end_date: string;
  updated_at: string;
  created_at: string;
  product_id: string;
  discount_percentage: number;
  product?: Product;
}

export interface LiveSeller {
  id: string;
  title: string;
  stream_key: string;
  thumbnail_url: string;
  updated_at: string;
  started_at: string;
  viewers: number;
  is_live: boolean;
  user_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}
