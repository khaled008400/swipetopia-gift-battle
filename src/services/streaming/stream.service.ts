
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

class StreamService {
  /**
   * Create a new live stream
   */
  async createStream(userId: string, title: string, description?: string) {
    try {
      // Check if user already has an active stream
      const { data: existingStream, error: checkError } = await supabase
        .from('streams')
        .select('id, status')
        .eq('user_id', userId)
        .eq('status', 'online')
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing streams:', checkError);
        throw checkError;
      }
      
      // If stream exists and is active, return it
      if (existingStream) {
        return existingStream;
      }
      
      // Create a new stream
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: userId,
          title,
          description,
          status: 'online',
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating stream:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createStream:', error);
      throw error;
    }
  }
  
  /**
   * End a live stream
   */
  async endStream(streamId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('streams')
        .update({
          status: 'offline',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error ending stream:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in endStream:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific stream by ID
   */
  async getStream(streamId: string) {
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
      console.error('Error in getStream:', error);
      throw error;
    }
  }
  
  /**
   * Get active streams
   */
  async getActiveStreams(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('status', 'online')
        .order('viewer_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching active streams:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getActiveStreams:', error);
      throw error;
    }
  }
  
  /**
   * Update viewer count for a stream
   */
  async updateViewerCount(streamId: string, count: number) {
    try {
      const { error } = await supabase
        .from('streams')
        .update({ viewer_count: count })
        .eq('id', streamId);
      
      if (error) {
        console.error('Error updating viewer count:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateViewerCount:', error);
      throw error;
    }
  }
}

export default new StreamService();
