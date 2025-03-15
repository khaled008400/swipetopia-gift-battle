
import { supabase } from "@/integrations/supabase/client";

const ShopService = {
  // Get all products with optional category filter
  getProducts: async (category?: string) => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .limit(8);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
  
  // Get new arrivals (most recently added products)
  getNewArrivals: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },
  
  // Get product details by ID
  getProductDetails: async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:seller_id (username, avatar_url)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  },
  
  // Search products by query
  searchProducts: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
  
  // Create a new order
  createOrder: async (orderData: { user_id: string, total_amount: number, items: any[] }) => {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: orderData.total_amount,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

export default ShopService;
