
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
    
    // Start a transaction (using RPC for atomicity)
    const { error: rpcError } = await supabase.rpc('send_gift', {
      p_sender_id: user.id,
      p_receiver_id: receiverId,
      p_gift_type: giftType,
      p_amount: amount,
      p_battle_id: battleId
    });
    
    if (rpcError) {
      console.error('Error sending gift:', rpcError);
      throw rpcError;
    }
  },
};

export default GiftService;
