
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
          status: 'live' as const,
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
          status: 'ended' as const,
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
          user_id,
          title,
          description,
          status,
          viewer_count,
          started_at,
          ended_at,
          profiles (username, avatar_url)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the LiveStream interface
      const streams: LiveStream[] = data.map(stream => ({
        id: stream.id,
        streamer_id: stream.user_id,
        title: stream.title,
        description: stream.description,
        status: stream.status as 'live' | 'offline' | 'ended',
        viewer_count: stream.viewer_count,
        started_at: stream.started_at,
        ended_at: stream.ended_at,
        profiles: stream.profiles,
        is_live: stream.status === 'live'
      }));
      
      return streams;
    } catch (err) {
      console.error('Error fetching active streams:', err);
      return [];
    }
  },

  // Get a specific stream
  getStream: async (streamId: string): Promise<LiveStream | null> => {
    try {
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
          ended_at,
          profiles (username, avatar_url)
        `)
        .eq('id', streamId)
        .single();

      if (error) throw error;
      
      // Transform the data to match the LiveStream interface
      const stream: LiveStream = {
        id: data.id,
        streamer_id: data.user_id,
        title: data.title,
        description: data.description,
        status: data.status as 'live' | 'offline' | 'ended',
        viewer_count: data.viewer_count,
        started_at: data.started_at,
        ended_at: data.ended_at,
        profiles: data.profiles,
        is_live: data.status === 'live'
      };
      
      return stream;
    } catch (err) {
      console.error('Error fetching stream:', err);
      return null;
    }
  }
};

export default StreamService;
