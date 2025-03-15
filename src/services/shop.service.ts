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
  image: string;
  inventory: number;
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
      .select('*')
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
  }
};

export default ShopService;
