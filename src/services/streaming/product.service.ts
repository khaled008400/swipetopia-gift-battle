
import { supabase } from "@/integrations/supabase/client";
import { StreamProduct, LiveStream } from "@/models/streaming";

/**
 * Service for managing products during live streams
 */
const StreamProductService = {
  // Tag a product in a live stream
  tagProduct: async (productId: string, streamId: string, featured: boolean = false, discountPercentage?: number): Promise<StreamProduct | null> => {
    const { data, error } = await supabase
      .from('live_stream_products')
      .insert([{ 
        product_id: productId, 
        stream_id: streamId, 
        featured,
        discount_percentage: discountPercentage
      }])
      .select('*, product:products(*)')
      .single();
      
    if (error) {
      console.error('Error tagging product:', error);
      throw error;
    }
    
    return data;
  },
  
  // Remove a product tag from a live stream
  removeProductTag: async (streamProductId: string): Promise<void> => {
    const { error } = await supabase
      .from('live_stream_products')
      .delete()
      .eq('id', streamProductId);
      
    if (error) {
      console.error('Error removing product tag:', error);
      throw error;
    }
  },
  
  // Get all products tagged in a stream
  getStreamProducts: async (streamId: string): Promise<StreamProduct[]> => {
    const { data, error } = await supabase
      .from('live_stream_products')
      .select('*, product:products(*)')
      .eq('stream_id', streamId);
      
    if (error) {
      console.error('Error fetching stream products:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Update a tagged product's details (featured status or discount)
  updateStreamProduct: async (streamProductId: string, updates: { featured?: boolean, discount_percentage?: number }): Promise<void> => {
    const { error } = await supabase
      .from('live_stream_products')
      .update(updates)
      .eq('id', streamProductId);
      
    if (error) {
      console.error('Error updating stream product:', error);
      throw error;
    }
  },
  
  // Get all streams that have a specific product tagged
  getStreamsByProduct: async (productId: string): Promise<LiveStream[]> => {
    const { data, error } = await supabase
      .from('live_stream_products')
      .select('stream:streams(*)')
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error fetching streams by product:', error);
      throw error;
    }
    
    // Extract and deduplicate the streams
    const streamsMap = new Map();
    data?.forEach(item => {
      if (item.stream) {
        streamsMap.set(item.stream.id, {
          id: item.stream.id,
          streamer_id: item.stream.user_id,
          title: item.stream.title,
          description: item.stream.description,
          is_live: item.stream.status === 'live',
          viewer_count: item.stream.viewer_count || 0,
          started_at: item.stream.started_at,
          ended_at: item.stream.ended_at
        });
      }
    });
    
    return Array.from(streamsMap.values());
  },
};

export default StreamProductService;
