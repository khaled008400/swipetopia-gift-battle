import { supabase } from "@/lib/supabase";
import { Product, LimitedOffer, LiveSeller, ProductReview } from "@/types/product.types";

// Re-export the types for convenience
export type { Product, LimitedOffer, LiveSeller, ProductReview };

class ShopService {
  async getProducts(category?: string, page = 1, filter?: string): Promise<any> {
    try {
      const pageSize = 9;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(start, end);
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      if (filter === 'featured') {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getLimitedOffers(): Promise<any> {
    try {
      // Get current date for comparison
      const currentDate = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('limited_offers')
        .select(`
          *,
          product:product_id (
            id,
            name,
            price,
            description,
            image_url,
            category,
            stock_quantity,
            is_featured
          )
        `)
        .lte('start_date', currentDate)
        .gte('end_date', currentDate);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching limited offers:', error);
      throw error;
    }
  }
  
  async getLiveSellers(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('live_sellers')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_live', true)
        .order('viewers', { ascending: false });
      
      if (error) throw error;
      
      return data.map((seller: any) => ({
        ...seller,
        username: seller.profiles?.username,
        avatar_url: seller.profiles?.avatar_url
      }));
    } catch (error) {
      console.error('Error fetching live sellers:', error);
      throw error;
    }
  }
  
  async getProductById(id: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
  
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((review: any) => ({
        ...review,
        username: review.profiles?.username,
        avatar_url: review.profiles?.avatar_url
      }));
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  }
  
  async addProductReview(productId: string, rating: number, comment: string): Promise<ProductReview | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to add a review');
      }
      
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding product review:', error);
      return null;
    }
  }
  
  async getRelatedProducts(productId: string, category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', productId)
        .eq('status', 'active')
        .limit(4);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
  
  async getUserLikedProductIds(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map(like => like.product_id);
    } catch (error) {
      console.error('Error fetching user liked products:', error);
      return [];
    }
  }
  
  async toggleProductLike(productId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to like a product');
      }
      
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('product_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('product_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (unlikeError) throw unlikeError;
        
        return false; // Not liked anymore
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('product_likes')
          .insert({
            user_id: user.id,
            product_id: productId
          });
        
        if (likeError) throw likeError;
        
        return true; // Now liked
      }
    } catch (error) {
      console.error('Error toggling product like:', error);
      throw error;
    }
  }
  
  async addToCart(productId: string, quantity: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to add to cart');
      }
      
      // Check if product exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);
        
        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }
  
  async getCartItems(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:product_id (
            id,
            name,
            price,
            image_url,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }
  
  async updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to update cart');
      }
      
      if (quantity <= 0) {
        // Remove item
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  }
  
  async removeCartItem(itemId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to remove from cart');
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
  }
  
  async clearCart(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to clear cart');
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
  
  async checkout(shippingAddress: any, paymentMethod: any): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to checkout');
      }
      
      // Get cart items
      const cartItems = await this.getCartItems();
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.product.price
          });
        
        if (itemError) throw itemError;
      }
      
      // Clear cart
      await this.clearCart();
      
      return order;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
  
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('status', 'active')
        .order('category', { ascending: true });
      
      if (error) throw error;
      
      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }
}

export default new ShopService();
