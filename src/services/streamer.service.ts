import { supabase } from "@/integrations/supabase/client";

export interface GiftTransaction {
  receiverId: string;
  giftType: string;
  amount: number;
  streamId?: string | null;
}

export interface StreamerProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  followers: number;
  following: number;
}

// Service to handle streamer-related operations
const StreamerService = {
  // Send a gift to a streamer
  sendGift: async (transaction: GiftTransaction) => {
    const { receiverId, giftType, amount, streamId } = transaction;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required to send gifts');
    }
    
    // Start a transaction (using manual control since Supabase doesn't have builtin transactions in the JS client)
    try {
      // 1. Create a gift record
      const { error: giftError } = await supabase
        .from('stream_gifts')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          gift_type: giftType,
          coins_amount: amount,
          stream_id: streamId
        });
        
      if (giftError) throw giftError;
      
      // 2. Update or create top supporter entry
      const { data: existingSupporter, error: fetchError } = await supabase
        .from('top_supporters')
        .select('*')
        .eq('supporter_id', user.id)
        .eq('streamer_id', receiverId)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      // Get sender profile data (needed for username)
      const { data: senderProfile, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (existingSupporter) {
        // Update existing supporter record
        const { error: updateError } = await supabase
          .from('top_supporters')
          .update({
            gift_amount: existingSupporter.gift_amount + amount
          })
          .eq('id', existingSupporter.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new supporter record
        const { error: insertError } = await supabase
          .from('top_supporters')
          .insert({
            supporter_id: user.id,
            supporter_username: senderProfile.username,
            supporter_avatar: senderProfile.avatar_url,
            streamer_id: receiverId,
            gift_amount: amount
          });
          
        if (insertError) throw insertError;
      }
      
      // 3. If this is part of a stream, update the stream history record
      if (streamId) {
        // This would be implemented in a real app to update the stream's gift count
        // For simplicity, we're skipping this part
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error processing gift transaction:", error);
      throw error;
    }
  },
  
  // Get a streamer's profile
  getStreamerProfile: async (streamerId: string): Promise<StreamerProfile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, followers, following')
      .eq('id', streamerId)
      .single();
      
    if (error) throw error;
    
    return data;
  },
  
  // Follow a streamer
  followStreamer: async (streamerId: string): Promise<boolean> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required to follow streamers');
    }
    
    // Call the edge function to increment the follower count
    const { data, error } = await supabase.functions.invoke('increment-followers', {
      body: { streamerId }
    });
    
    if (error) throw error;
    
    return true;
  }
};

export default StreamerService;
