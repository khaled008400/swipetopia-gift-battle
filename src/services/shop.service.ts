
import { Product, LimitedOffer, LiveSeller } from '@/types/product.types';
import { supabase } from '@/lib/supabase';

class ShopService {
  // Fetch all products
  async getProducts(category?: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:seller_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'active');

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      const products = data.map(product => ({
        ...product,
        seller: product.seller ? {
          id: product.seller_id,
          name: product.seller.username,
          avatar_url: product.seller.avatar_url
        } : undefined
      }));

      return products as Product[];
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:seller_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(6);

      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }

      return data.map(product => ({
        ...product,
        seller: {
          id: product.seller_id,
          name: product.seller?.username,
          avatar_url: product.seller?.avatar_url
        }
      })) as Product[];
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:seller_id (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return {
        ...data,
        original_price: data.price * 1.2, // Example of a derived field
        seller: {
          id: data.seller_id,
          name: data.seller?.username,
          avatar_url: data.seller?.avatar_url
        },
        specifications: [
          { name: 'Material', value: 'Premium Quality' },
          { name: 'Dimensions', value: '10 x 8 x 2 inches' },
          { name: 'Weight', value: '1.5 lbs' }
        ]
      } as Product;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  }

  // Get seller products
  async getSellerProducts(sellerId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);

      if (error) {
        console.error('Error fetching seller products:', error);
        return [];
      }

      return data as Product[];
    } catch (error) {
      console.error('Error in getSellerProducts:', error);
      return [];
    }
  }

  // Get limited-time offers
  async getLimitedOffers(): Promise<LimitedOffer[]> {
    try {
      const { data, error } = await supabase
        .from('limited_offers')
        .select(`
          *,
          product:product_id (*)
        `);

      if (error) {
        console.error('Error fetching limited offers:', error);
        return [];
      }

      return data as LimitedOffer[];
    } catch (error) {
      console.error('Error in getLimitedOffers:', error);
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
          user:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_live', true);

      if (error) {
        console.error('Error fetching live sellers:', error);
        return [];
      }

      return data.map(seller => ({
        ...seller,
        user: {
          username: seller.user?.username,
          avatar_url: seller.user?.avatar_url
        }
      })) as LiveSeller[];
    } catch (error) {
      console.error('Error in getLiveSellers:', error);
      return [];
    }
  }

  // Search products by keyword
  async searchProducts(keyword: string): Promise<Product[]> {
    try {
      // Search by name or description
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:seller_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data.map(product => ({
        ...product,
        seller: {
          id: product.seller_id,
          name: product.seller?.username,
          avatar_url: product.seller?.avatar_url
        }
      })) as Product[];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return [];
    }
  }

  // Add a product to cart
  async addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      // In a real app, we would update a shopping_cart table
      console.log(`Added product ${productId} to cart with quantity ${quantity}`);
      return true;
    } catch (error) {
      console.error('Error in addToCart:', error);
      return false;
    }
  }

  // Toggle product liked status
  async toggleProductLike(productId: string): Promise<boolean> {
    try {
      // In a real app, we would toggle a product_likes record
      console.log(`Toggled like for product ${productId}`);
      return true;
    } catch (error) {
      console.error('Error in toggleProductLike:', error);
      return false;
    }
  }

  // Get user's liked products
  async getUserLikedProducts(userId: string): Promise<Product[]> {
    // Implementation would vary based on your database structure
    return [];
  }

  // Get IDs of products liked by user
  async getUserLikedProductIds(userId: string): Promise<string[]> {
    // Implementation would vary based on your database structure
    return [];
  }

  // Get products by category
  async getCategoryProducts(category: string): Promise<Product[]> {
    return this.getProducts(category);
  }
}

const shopService = new ShopService();
export default shopService;

// Export types for external use
export { Product, LimitedOffer, LiveSeller };
