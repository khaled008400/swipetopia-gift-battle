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
    
    try {
      // Start a transaction
      // 1. Create a gift record
      const { error: giftError } = await supabase
        .from('stream_gifts')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          gift_type: giftType,
          coins_amount: amount,
          stream_id: battleId || receiverId // Use battle ID if provided, otherwise use receiver ID as stream ID
        });
      
      if (giftError) throw giftError;
      
      // 2. Update sender's coins (deduct)
      const { data: senderData, error: senderError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
        
      if (senderError) throw senderError;
      
      const newSenderCoins = Math.max(0, (senderData.coins || 0) - amount);
      
      const { error: updateSenderCoinsError } = await supabase
        .from('profiles')
        .update({ coins: newSenderCoins })
        .eq('id', user.id);
      
      if (updateSenderCoinsError) throw updateSenderCoinsError;
      
      // 3. Update receiver's coins (add)
      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', receiverId)
        .single();
        
      if (receiverError) throw receiverError;
      
      const newReceiverCoins = (receiverData.coins || 0) + amount;
      
      const { error: updateReceiverCoinsError } = await supabase
        .from('profiles')
        .update({ coins: newReceiverCoins })
        .eq('id', receiverId);
      
      if (updateReceiverCoinsError) throw updateReceiverCoinsError;
      
    } catch (err) {
      console.error('Error sending gift:', err);
      throw err;
    }
  },
};

export default GiftService;
