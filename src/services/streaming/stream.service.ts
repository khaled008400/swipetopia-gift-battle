
import { supabase } from "@/integrations/supabase/client";
import { LiveStream } from "@/models/streaming";

/**
 * Service for handling live streams
 */
const StreamService = {
  // Start a new stream
  startStream: async (streamerId: string, title: string, description?: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: streamerId,
          title,
          description,
          status: 'live',
          started_at: new Date().toISOString(),
          viewer_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      return data.id;
    } catch (err) {
      console.error('Error starting stream:', err);
      throw err;
    }
  },

  // End a stream
  endStream: async (streamId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);

      if (error) throw error;
    } catch (err) {
      console.error('Error ending stream:', err);
      throw err;
    }
  },

  // Get active streams
  getActiveStreams: async (): Promise<LiveStream[]> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          id,
          title,
          description,
          user_id as streamer_id,
          status,
          viewer_count,
          started_at,
          ended_at,
          profiles (username, avatar_url)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching active streams:', err);
      throw err;
    }
  },

  // Get a specific stream
  getStream: async (streamId: string): Promise<LiveStream | null> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          id,
          title,
          description,
          user_id as streamer_id,
          status,
          viewer_count,
          started_at,
          ended_at,
          profiles (username, avatar_url)
        `)
        .eq('id', streamId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching stream:', err);
      return null;
    }
  }
};

export default StreamService;
