
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling gifts during live streams
 */
const GiftService = {
  // Send a gift during a stream/battle
  sendGift: async (receiverId: string, giftType: string, amount: number, battleId: string | null = null): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to send gifts');
    }
    
    // Direct database operation - without RPC call that might not exist yet
    try {
      // Start a transaction manually since we can't use RPC
      
      // 1. Create a gift record
      const { error: giftError } = await supabase
        .from('stream_gifts')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          gift_type: giftType,
          coins_amount: amount,
          stream_id: receiverId // Use receiver ID as stream ID if not in a battle
        });
      
      if (giftError) throw giftError;
      
      // 2. Update sender's coins (deduct)
      const { error: updateSenderCoinsError } = await supabase
        .from('profiles')
        .update({ 
          coins: supabase.rpc('decrement_coins', { amount: amount })
        })
        .eq('id', user.id);
      
      if (updateSenderCoinsError) throw updateSenderCoinsError;
      
      // 3. Update receiver's coins (add)
      const { error: updateReceiverCoinsError } = await supabase
        .from('profiles')
        .update({ 
          coins: supabase.rpc('increment_coins', { amount: amount })
        })
        .eq('id', receiverId);
      
      if (updateReceiverCoinsError) throw updateReceiverCoinsError;
      
    } catch (err) {
      console.error('Error sending gift:', err);
      throw err;
    }
  },
};

export default GiftService;
