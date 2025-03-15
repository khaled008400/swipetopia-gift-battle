
import { supabase } from '@/integrations/supabase/client';

const StreamService = {
  // Start a new stream
  startStream: async (streamerId: string, title: string, description?: string) => {
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
    } catch (error) {
      console.error('Error starting stream:', error);
      throw error;
    }
  },
  
  // End a stream
  endStream: async (streamId: string) => {
    try {
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error ending stream:', error);
      throw error;
    }
  },
  
  // Get all active streams
  getActiveStreams: async () => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active streams:', error);
      return [];
    }
  },
  
  // Get a specific stream by ID
  getStream: async (streamId: string) => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', streamId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stream:', error);
      return null;
    }
  },
  
  // These are placeholder methods, implement actual functionality as needed
  joinStream: async (streamId: string) => {
    console.log(`Joining stream: ${streamId}`);
    // Implementation would depend on your actual real-time presence requirements
  },
  
  leaveStream: async (streamId: string) => {
    console.log(`Leaving stream: ${streamId}`);
    // Implementation would depend on your actual real-time presence requirements
  }
};

export default StreamService;
