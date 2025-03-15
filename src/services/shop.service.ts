
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product.types';

class ShopService {
  async getProducts(category?: string): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        status: product.status as "active" | "draft" | "unavailable"
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as "active" | "draft" | "unavailable"
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'active');
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        status: product.status as "active" | "draft" | "unavailable"
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('name');
      
      if (error) throw error;
      
      return data.map(category => category.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getSellerProducts(sellerId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        status: product.status as "active" | "draft" | "unavailable"
      }));
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
  }

  async getBestSellers(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sales_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        status: product.status as "active" | "draft" | "unavailable"
      }));
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
  }

  async getNewArrivals(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        status: product.status as "active" | "draft" | "unavailable"
      }));
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  }

  async getProductReviews(productId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*, profiles:user_id(*)')
        .eq('product_id', productId);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  }

  async getLiveSellers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('live_sellers')
        .select('*, profiles:user_id(*)');
      
      if (error) throw error;
      
      return data.map(seller => ({
        ...seller,
        user: {
          username: seller.profiles.username,
          avatar_url: seller.profiles.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching live sellers:', error);
      return [];
    }
  }

  async toggleProductLike(productId: string): Promise<boolean> {
    try {
      // We need to cast the RPC call result as it's not included in the allowed RPCs list
      const { data, error } = await supabase.rpc('toggle_product_like' as any, { product_id: productId });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling product like:', error);
      return false;
    }
  }

  async getUserLikedProducts(userId: string): Promise<Product[]> {
    try {
      // We need to cast the RPC call result as it's not included in the allowed RPCs list
      const { data, error } = await supabase.rpc('get_user_liked_products' as any, { user_id: userId });
      if (error) throw error;
      
      // Type assertion since we know the structure of the returned data
      if (Array.isArray(data)) {
        return data.map(product => ({
          ...product,
          status: product.status as "active" | "draft" | "unavailable"
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting liked products:', error);
      return [];
    }
  }

  async getUserLikedProductIds(userId: string): Promise<string[]> {
    try {
      // We need to cast the RPC call result as it's not included in the allowed RPCs list
      const { data, error } = await supabase.rpc('get_user_liked_product_ids' as any, { user_id: userId });
      if (error) throw error;
      
      // Type assertion since we know the structure of the returned data
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error getting liked product IDs:', error);
      return [];
    }
  }
}

const shopService = new ShopService();
export default shopService;
