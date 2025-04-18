
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
        .from('profiles')
        .update({ coins: (senderData.coins || 0) - totalCost })
        .eq('id', user.id);
      
      if (deductError) throw deductError;
      
      // 6. Add coins to receiver
      const coinValue = giftData.value * amount;
      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', receiverId)
        .single();
        
      if (receiverError) throw receiverError;
      
      const { error: addError } = await supabase
        .from('profiles')
        .update({ coins: (receiverData.coins || 0) + coinValue })
        .eq('id', receiverId);
      
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
    // Get gift transactions with a separate query for sender and gift information
    const { data, error } = await supabase
      .from('gift_transactions')
      .select(`
        id,
        sender_id,
        receiver_id,
        video_id,
        gift_id,
        amount,
        created_at
      `)
      .eq('video_id', videoId);
      
    if (error) {
      console.error('Error fetching gifts for video:', error);
      return [];
    }
    
    // If no transactions found, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map through transactions and enrich with sender and gift data
    const enrichedGifts = await Promise.all(data.map(async (transaction) => {
      // Get sender information
      const { data: senderData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', transaction.sender_id)
        .single();
      
      // Get gift information
      const { data: giftData } = await supabase
        .from('virtual_gifts')
        .select('name, icon, color')
        .eq('id', transaction.gift_id)
        .single();
      
      return {
        ...transaction,
        sender: {
          username: senderData?.username || 'Anonymous',
          avatar_url: senderData?.avatar_url
        },
        gift: {
          name: giftData?.name || 'Gift',
          icon: giftData?.icon || '🎁',
          color: giftData?.color || '#6366f1'
        }
      } as GiftTransaction;
    }));
    
    return enrichedGifts;
  }
};

export default GiftService;
