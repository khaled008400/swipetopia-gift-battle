import { supabase } from '@/integrations/supabase/client';
import { StreamProduct } from './stream.types';

/**
 * Service for handling product operations in streams
 */
class ProductService {
  /**
   * Tag a product to a stream
   */
  async tagProduct(
    productId: string, 
    streamId: string, 
    featured: boolean = false, 
    discountPercentage?: number
  ): Promise<string> {
    try {
      // Check if product is already tagged
      const { data: existing, error: checkError } = await supabase
        .from('live_stream_products')
        .select('id')
        .eq('product_id', productId)
        .eq('stream_id', streamId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing tagged product:', checkError);
        throw checkError;
      }
      
      // If product is already tagged, update it
      if (existing) {
        const { error: updateError } = await supabase
          .from('live_stream_products')
          .update({
            featured,
            discount_percentage: discountPercentage
          })
          .eq('id', existing.id);
        
        if (updateError) {
          console.error('Error updating tagged product:', updateError);
          throw updateError;
        }
        
        return existing.id;
      }
      
      // Otherwise, create a new tagged product
      const { data, error } = await supabase
        .from('live_stream_products')
        .insert({
          product_id: productId,
          stream_id: streamId,
          featured,
          discount_percentage: discountPercentage
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error tagging product:', error);
        throw error;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error in tagProduct:', error);
      throw error;
    }
  }

  /**
   * Remove a product from a stream
   */
  async untagProduct(productId: string, streamId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('live_stream_products')
        .delete()
        .eq('product_id', productId)
        .eq('stream_id', streamId);
      
      if (error) {
        console.error('Error untagging product:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in untagProduct:', error);
      throw error;
    }
  }

  /**
   * Get products for a stream
   */
  async getStreamProducts(streamId: string): Promise<StreamProduct[]> {
    try {
      const { data, error } = await supabase
        .from('live_stream_products')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('stream_id', streamId);
      
      if (error) {
        console.error('Error fetching stream products:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getStreamProducts:', error);
      return [];
    }
  }
}

export default new ProductService();
