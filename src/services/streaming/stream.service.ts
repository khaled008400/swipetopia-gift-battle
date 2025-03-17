
import { supabase } from "@/integrations/supabase/client";
import { LiveStream } from './stream.types';

/**
 * Service for managing live streams
 */
const StreamService = {
  // Fetch active live streams
  getLiveStreams: async (): Promise<LiveStream[]> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'online')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }
  },
  
  // Get a single stream by ID
  getStream: async (streamId: string): Promise<LiveStream | null> => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
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
  
  // Start a new stream
  startStream: async (title: string, description?: string): Promise<LiveStream | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to start a stream');
      }
      
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: user.id,
          title,
          description,
          status: 'online',
          viewer_count: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error starting stream:', error);
      return null;
    }
  },
  
  // End a stream
  endStream: async (streamId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to end a stream');
      }
      
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'offline',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error ending stream:', error);
      return false;
    }
  },
  
  // Update viewer count
  updateViewerCount: async (streamId: string, count: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('streams')
        .update({
          viewer_count: count
        })
        .eq('id', streamId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating viewer count:', error);
      return false;
    }
  },
  
  // Send a message to a stream's chat
  sendStreamMessage: async (streamId: string, message: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to send a message');
      }
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          stream_id: streamId,
          sender_id: user.id,
          message
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  },
  
  // Get chat messages for a stream
  getStreamMessages: async (streamId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:sender_id (
            username,
            avatar_url
          )
        `)
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching stream messages:', error);
      return [];
    }
  },
  
  // Admin function to shut down a stream
  shutdownStream: async (streamId: string, reason: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to shut down a stream');
      }
      
      // Get user profile to check if admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, roles')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const isAdmin = profile.role === 'admin' || 
                      (profile.roles && profile.roles.includes('admin'));
      
      if (!isAdmin) {
        throw new Error('Only admins can shut down streams');
      }
      
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'offline',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'shutdown_stream',
        p_target_id: streamId,
        p_reason: reason
      });
      
      return true;
    } catch (error) {
      console.error('Error shutting down stream:', error);
      return false;
    }
  }
};

export default StreamService;
