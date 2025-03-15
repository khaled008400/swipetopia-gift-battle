
import { supabase } from "@/integrations/supabase/client";

export interface LiveStream {
  id: string;
  streamer_id: string;
  title: string;
  description?: string;
  is_live: boolean;
  viewer_count: number;
  started_at: string;
  ended_at?: string;
}

export interface Battle {
  id: string;
  stream_a_id: string;
  stream_b_id: string;
  status: 'pending' | 'active' | 'completed';
  streamer_a_score: number;
  streamer_b_score: number;
  started_at: string;
  ended_at?: string;
}

export interface BattleRequest {
  from_streamer_id: string;
  to_streamer_id: string;
  message?: string;
}

const LiveStreamService = {
  // Start a new live stream
  startStream: async (title: string, description?: string): Promise<LiveStream | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to start a stream');
    }
    
    const { data, error } = await supabase
      .from('streams')
      .insert([{ 
        user_id: user.id, 
        title, 
        description,
        status: 'live',
        viewer_count: 0,
        started_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error starting stream:', error);
      throw error;
    }
    
    // Map the returned data to match the LiveStream interface
    return {
      id: data.id,
      streamer_id: data.user_id,
      title: data.title,
      description: data.description,
      is_live: data.status === 'live',
      viewer_count: data.viewer_count,
      started_at: data.started_at,
      ended_at: data.ended_at
    };
  },
  
  // End a live stream
  endStream: async (streamId: string): Promise<void> => {
    const { error } = await supabase
      .from('streams')
      .update({ 
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', streamId);
      
    if (error) {
      console.error('Error ending stream:', error);
      throw error;
    }
  },
  
  // Get active streams
  getActiveStreams: async (): Promise<LiveStream[]> => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        id,
        user_id,
        title,
        description,
        status,
        viewer_count,
        started_at,
        ended_at
      `)
      .eq('status', 'live');
      
    if (error) {
      console.error('Error fetching active streams:', error);
      throw error;
    }
    
    // Map the returned data to match the LiveStream interface
    return data.map(stream => ({
      id: stream.id,
      streamer_id: stream.user_id,
      title: stream.title,
      description: stream.description,
      is_live: stream.status === 'live',
      viewer_count: stream.viewer_count,
      started_at: stream.started_at,
      ended_at: stream.ended_at
    }));
  },
  
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
  
  // Send a gift during a stream/battle
  sendGift: async (receiverId: string, giftType: string, amount: number, battleId?: string): Promise<void> => {
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
      p_battle_id: battleId || null
    });
    
    if (rpcError) {
      console.error('Error sending gift:', rpcError);
      throw rpcError;
    }
  }
};

export default LiveStreamService;
