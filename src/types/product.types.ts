
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  seller_id: string;
  status: 'active' | 'draft' | 'unavailable';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  seller?: {
    username: string;
    avatar_url: string;
  };
}

export interface LimitedOffer {
  id: string;
  product_id: string;
  discount_percentage: number;
  original_price: number;
  discounted_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product: Product;
}
