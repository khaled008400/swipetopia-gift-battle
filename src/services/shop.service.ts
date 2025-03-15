
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock_quantity: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
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
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface LiveSeller {
  id: string;
  user_id: string;
  title: string;
  stream_key: string;
  thumbnail_url: string;
  viewers: number;
  is_live: boolean;
  started_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
}

class ShopService {
  // Get products
  async getProducts(category?: string, limit: number = 10): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }

      return data as Product[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Get products by seller
  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching seller products:', error);
        return [];
      }

      return data as Product[];
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
  }

  // Create product
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: string } | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select('id')
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return null;
      }

      return { id: data.id };
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  // Update product
  async updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Get limited offers
  async getLimitedOffers(): Promise<LimitedOffer[]> {
    try {
      const { data, error } = await supabase
        .from('limited_offers')
        .select(`
          *,
          product:product_id (*)
        `)
        .lt('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching limited offers:', error);
        return [];
      }

      return data as LimitedOffer[];
    } catch (error) {
      console.error('Error fetching limited offers:', error);
      return [];
    }
  }

  // Get live sellers
  async getLiveSellers(): Promise<LiveSeller[]> {
    try {
      const { data, error } = await supabase
        .from('live_sellers')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('is_live', true)
        .order('viewers', { ascending: false });

      if (error) {
        console.error('Error fetching live sellers:', error);
        return [];
      }

      // Transform the data to include username and avatar_url at the top level
      return data.map(seller => ({
        ...seller,
        username: seller.profiles?.username,
        avatar_url: seller.profiles?.avatar_url
      })) as LiveSeller[];
    } catch (error) {
      console.error('Error fetching live sellers:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data as Product[];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Extract unique categories
      const categories = [...new Set(data.map(product => product.category))];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

const shopService = new ShopService();
export default shopService;

// Re-export types correctly
export type { Product };
export type { LimitedOffer };
export type { LiveSeller };
