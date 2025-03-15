
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  status: string;
  stock_quantity: number;
  seller_id: string;
  created_at: string;
  updated_at: string;
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
    
    return data as Product[];
  },
  
  getProductById: async (id: string) => {
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
  },
  
  getSellerProducts: async (sellerId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId);
    
    if (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
    
    return data as Product[];
  },
  
  addToCart: async (productId: string, quantity: number, userId: string) => {
    // In a real app, this would add to a cart table
    console.log(`Added product ${productId} to cart with quantity ${quantity} for user ${userId}`);
    return true;
  },
  
  createOrder: async (orderData: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
  }) => {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        total_amount: orderData.totalAmount,
        status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }
    
    // Add order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error adding order items:', itemsError);
      throw itemsError;
    }
    
    return order.id;
  },
  
  searchProducts: async (query: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data as Product[];
  }
};

export default ShopService;
