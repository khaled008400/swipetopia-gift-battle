
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
  image?: string; // For compatibility with existing code
  inventory?: number; // For compatibility with existing code
}
