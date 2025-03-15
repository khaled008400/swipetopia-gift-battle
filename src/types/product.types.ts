
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock_quantity?: number;
  category?: string;
  status: 'active' | 'draft' | 'unavailable';
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExtendedProduct extends Product {
  rating?: number;
  isLive?: boolean;
}

export interface AdminProduct extends Product {
  inventory: number;
  status: 'active' | 'draft' | 'unavailable';
}

// For product filtering and search
export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: 'active' | 'draft' | 'unavailable';
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  count?: number;
}
