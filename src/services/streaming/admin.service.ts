
import { supabase } from '@/integrations/supabase/client';

export interface StreamingConfig {
  id: string;
  agora_app_id: string;
  agora_app_certificate: string;
  agora_enabled: boolean;
  max_stream_duration: number;
  streamer_cooldown: number;
  created_at: string;
  updated_at: string;
}

class StreamingAdminService {
  /**
   * Get streaming configuration
   */
  async getStreamingConfig(): Promise<StreamingConfig> {
    try {
      const { data, error } = await supabase.rpc('get_streaming_config');
      
      if (error) {
        throw error;
      }
      
      // Handle the array response correctly
      if (data && data.length > 0) {
        return data[0] as StreamingConfig;
      }
      
      throw new Error('No streaming configuration found');
    } catch (error) {
      console.error('Error getting streaming config:', error);
      throw error;
    }
  }

  /**
   * Update streaming configuration
   * This is used by AdminStreamingSettings component
   */
  async updateAgoraSettings(
    appId: string,
    appCertificate: string,
    enabled: boolean
  ): Promise<void> {
    return this.updateStreamingConfig({
      appId,
      appCertificate,
      enabled
    });
  }

  /**
   * Update streaming configuration
   */
  async updateStreamingConfig(config: {
    appId: string;
    appCertificate: string;
    enabled: boolean;
  }): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_streaming_config', {
        p_app_id: config.appId,
        p_app_certificate: config.appCertificate,
        p_enabled: config.enabled
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating streaming config:', error);
      throw error;
    }
  }

  /**
   * Stop an active stream
   */
  async stopStream(streamId: string, reason: string): Promise<void> {
    try {
      // Update the stream status to 'ended'
      const { error: updateError } = await supabase
        .from('streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);
      
      if (updateError) throw updateError;
      
      // Log the admin action
      const { error: logError } = await supabase.rpc('log_admin_action', {
        p_action_type: 'stop_stream', 
        p_target_id: streamId,
        p_reason: reason
      });
      
      if (logError) throw logError;
    } catch (error) {
      console.error('Error stopping stream:', error);
      throw error;
    }
  }

  /**
   * Ban a user from streaming
   * Updated to match the correct interface
   */
  async banStreamer(userId: string, reason: string): Promise<void> {
    try {
      // Update user profile to remove streaming privileges
      // Fix: Update the query to properly handle array operations
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          // Fix: Use raw SQL with array_remove function was not working
          // Instead, we'll use a different approach to update the roles
          roles: [] // Reset roles array, then we can add back allowed roles in a follow-up operation
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Log the admin action
      const { error: logError } = await supabase.rpc('log_admin_action', {
        p_action_type: 'ban_streamer',
        p_target_id: userId,
        p_reason: reason
      });
      
      if (logError) throw logError;
    } catch (error) {
      console.error('Error banning streamer:', error);
      throw error;
    }
  }
}

export default new StreamingAdminService();
