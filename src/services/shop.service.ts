
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  stock_quantity?: number;
  category?: string;
  status?: 'active' | 'draft' | 'unavailable';
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
  original_price?: number;
  categories?: string[];
  specifications?: Record<string, string>;
  // For UI interaction
  isLive?: boolean;
  inventory?: number;
  image?: string; // Compatibility with existing code
  rating?: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock_quantity: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
}

const ShopService = {
  getProducts: async (category?: string) => {
    let query = supabase
      .from('products')
      .select('*');
      
    if (category && category !== 'all') {
      query = query.eq('category', category);
    } else {
      // Default to only active products unless specified
      query = query.eq('status', 'active');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  },

  getProductById: async (id: string) => {
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
      console.error('Error fetching product by id:', error);
      return null;
    }
    
    return data as Product;
  },

  getFeaturedProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .limit(8);
      
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  },

  searchProducts: async (query: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data || [];
  },

  createOrder: async (orderData: {
    user_id: string;
    items: { product_id: string; quantity: number; unit_price: number }[];
    total_amount: number;
  }) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        total_amount: orderData.total_amount,
        status: 'pending'
      })
      .select()
      .single();
      
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }
    
    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
    
    return order;
  },

  // Add a product to the user's liked products (favorites)
  toggleProductLike: async (productId: string) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to like products');
    }
    
    // Check if this product is already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('product_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking product like:', checkError);
      throw checkError;
    }
    
    // If already liked, remove the like
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('product_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
        
      if (deleteError) {
        console.error('Error unliking product:', deleteError);
        throw deleteError;
      }
      
      return { liked: false };
    } 
    // If not liked, add the like
    else {
      const { error: insertError } = await supabase
        .from('product_likes')
        .insert({
          user_id: user.id,
          product_id: productId
        });
        
      if (insertError) {
        console.error('Error liking product:', insertError);
        throw insertError;
      }
      
      return { liked: true };
    }
  },

  // Get user's liked products
  getUserLikedProducts: async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('product_likes')
      .select(`
        product_id,
        products:product_id (*)
      `)
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching liked products:', error);
      return [];
    }
    
    // Extract the product data from the joined query
    return data.map(item => item.products) || [];
  },

  // Get only the IDs of products a user has liked
  getUserLikedProductIds: async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('product_likes')
      .select('product_id')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching liked product IDs:', error);
      return [];
    }
    
    return data.map(item => item.product_id) || [];
  }
};

export default ShopService;
