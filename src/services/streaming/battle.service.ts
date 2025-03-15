
import { supabase } from "@/integrations/supabase/client";
import { Battle } from "@/models/streaming";

/**
 * Service for managing battle operations between streamers
 */
const BattleService = {
  // Request a PK battle
  requestBattle: async (toStreamerId: string, message?: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to request a battle');
    }
    
    // First, get the current stream of the requesting user
    const { data: currentStream, error: streamError } = await supabase
      .from('streams')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'live')
      .single();
      
    if (streamError) {
      console.error('Error finding current stream:', streamError);
      throw new Error('You must be streaming to request a battle');
    }
    
    // Then, get the current stream of the target streamer
    const { data: targetStream, error: targetStreamError } = await supabase
      .from('streams')
      .select('id')
      .eq('user_id', toStreamerId)
      .eq('status', 'live')
      .single();
      
    if (targetStreamError) {
      console.error('Error finding target stream:', targetStreamError);
      throw new Error('Target streamer must be live to request a battle');
    }
    
    // Create the battle request
    const { error } = await supabase
      .from('battles')
      .insert([{ 
        stream_a_id: currentStream.id,
        stream_b_id: targetStream.id,
        status: 'pending',
        started_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.error('Error creating battle request:', error);
      throw error;
    }
  },
  
  // Accept a battle request
  acceptBattle: async (battleId: string): Promise<void> => {
    const { error } = await supabase
      .from('battles')
      .update({ status: 'active' })
      .eq('id', battleId);
      
    if (error) {
      console.error('Error accepting battle:', error);
      throw error;
    }
  },
  
  // End a battle
  endBattle: async (battleId: string, winnerId?: string): Promise<void> => {
    const { error } = await supabase
      .from('battles')
      .update({ 
        status: 'completed',
        ended_at: new Date().toISOString(),
        winner_id: winnerId
      })
      .eq('id', battleId);
      
    if (error) {
      console.error('Error ending battle:', error);
      throw error;
    }
  },
};

export default BattleService;
