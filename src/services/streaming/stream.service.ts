
import { supabase } from "@/integrations/supabase/client";
import { LiveStream } from "@/models/streaming";

/**
 * Service for managing live stream operations
 */
const StreamService = {
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
};

export default StreamService;
