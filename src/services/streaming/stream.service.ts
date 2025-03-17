
import { supabase } from '@/integrations/supabase/client';
import { LiveStream } from './stream.types';

/**
 * Service for handling live stream operations
 */
class StreamService {
  /**
   * Start a new live stream
   */
  async startStream(userId: string, title: string, description?: string): Promise<string> {
    try {
      console.log('Starting stream for user:', userId);
      
      // Create a new stream record
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: userId,
          title: title,
          description: description || '',
          status: 'online',
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error starting stream:', error);
        throw error;
      }
      
      console.log('Stream started successfully:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error in startStream:', error);
      throw error;
    }
  }

  /**
   * End a live stream
   */
  async endStream(streamId: string): Promise<void> {
    try {
      console.log('Ending stream:', streamId);
      
      // Update the stream record
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'offline',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);
      
      if (error) {
        console.error('Error ending stream:', error);
        throw error;
      }
      
      console.log('Stream ended successfully');
    } catch (error) {
      console.error('Error in endStream:', error);
      throw error;
    }
  }

  /**
   * Get all active streams
   */
  async getActiveStreams(): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('status', 'online')
        .order('started_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active streams:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getActiveStreams:', error);
      return [];
    }
  }

  /**
   * Get stream by ID
   */
  async getStreamById(streamId: string): Promise<LiveStream | null> {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', streamId)
        .single();
      
      if (error) {
        console.error('Error fetching stream:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getStreamById:', error);
      return null;
    }
  }

  /**
   * Update viewer count
   */
  async updateViewerCount(streamId: string, viewerCount: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('streams')
        .update({ viewer_count: viewerCount })
        .eq('id', streamId);
      
      if (error) {
        console.error('Error updating viewer count:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateViewerCount:', error);
    }
  }
}

export default new StreamService();
