
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  seller_id: string;
  categories?: string[];
  specifications?: Record<string, string>;
  status: string;
  created_at: string;
  updated_at: string;
}

const ShopService = {
  // Get all products with optional category filter
  getProducts: async (category?: string) => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  // Get a specific product by ID
  getProductById: async (productId: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  
  // Get products by seller
  getSellerProducts: async (sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
  },
  
  // Add a new product
  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update an existing product
  updateProduct: async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  // Create an order
  createOrder: async (orderData: { user_id: string; items: { product_id: string; quantity: number; unit_price: number }[]; total_amount: number }) => {
    try {
      // First, create the order
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
      
      // Then, insert the order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
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
