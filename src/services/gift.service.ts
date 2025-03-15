
import { supabase } from "@/integrations/supabase/client";
import { VirtualGift, GiftTransaction } from "@/types/gift.types";

/**
 * Service for handling gift-related operations
 */
const GiftService = {
  /**
   * Get all available virtual gifts
   * @returns A promise that resolves to an array of virtual gifts
   */
  getVirtualGifts: async (): Promise<VirtualGift[]> => {
    const { data, error } = await supabase
      .from('virtual_gifts')
      .select('*')
      .eq('available', true);
      
    if (error) {
      console.error('Error fetching virtual gifts:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Send a gift to a video creator
   * @param receiverId The ID of the user to receive the gift
   * @param giftId The ID of the gift to send
   * @param videoId The ID of the video the gift is for
   * @param amount The amount of the gift (default: 1)
   * @returns A promise that resolves when the gift is sent
   */
  sendGift: async (receiverId: string, giftId: string, videoId: string, amount: number = 1): Promise<void> => {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required to send gifts');
    }
    
    // Start a transaction
    try {
      // 1. First check that the user has enough coins
      const { data: senderData, error: senderError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
        
      if (senderError) throw senderError;
      
      // 2. Get the gift price
      const { data: giftData, error: giftError } = await supabase
        .from('virtual_gifts')
        .select('price, value')
        .eq('id', giftId)
        .single();
        
      if (giftError) throw giftError;
      
      const totalCost = giftData.price * amount;
      
      // 3. Check if user has enough coins
      if ((senderData.coins || 0) < totalCost) {
        throw new Error('Not enough coins to send this gift');
      }
      
      // 4. Create a gift transaction record
      const { error: transactionError } = await supabase
        .from('gift_transactions')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          video_id: videoId,
          gift_id: giftId,
          amount: amount
        });
      
      if (transactionError) throw transactionError;
      
      // 5. Deduct coins from sender
      const { error: deductError } = await supabase
        .rpc('deduct_coins', {
          user_id: user.id,
          coin_amount: totalCost
        });
      
      if (deductError) throw deductError;
      
      // 6. Add coins to receiver
      const coinValue = giftData.value * amount;
      const { error: addError } = await supabase
        .rpc('add_coins', {
          user_id: receiverId,
          coin_amount: coinValue
        });
      
      if (addError) throw addError;
      
    } catch (error) {
      console.error('Error sending gift:', error);
      throw error;
    }
  },
  
  /**
   * Get gift transactions for a video
   * @param videoId The ID of the video to get gifts for
   * @returns A promise that resolves to an array of gift transactions
   */
  getGiftsForVideo: async (videoId: string): Promise<GiftTransaction[]> => {
    const { data, error } = await supabase
      .from('gift_transactions')
      .select(`
        *,
        sender:sender_id (username, avatar_url),
        gift:gift_id (*)
      `)
      .eq('video_id', videoId);
      
    if (error) {
      console.error('Error fetching gifts for video:', error);
      return [];
    }
    
    return data || [];
  }
};

export default GiftService;
