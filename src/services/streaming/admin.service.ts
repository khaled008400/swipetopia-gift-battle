
import { supabase } from "@/integrations/supabase/client";
import { LiveStream } from "@/models/streaming";
import axios from "axios";

// Define types for streaming config and admin actions
interface StreamingConfig {
  id: string;
  agora_app_id: string;
  agora_app_certificate: string;
  agora_enabled: boolean;
  max_stream_duration: number;
  streamer_cooldown: number;
  created_at: string;
  updated_at: string;
}

/**
 * Service for administering streaming features
 */
const StreamingAdminService = {
  // Get streaming configuration
  getStreamingConfig: async (): Promise<StreamingConfig | null> => {
    try {
      // Use raw RPC call with an empty object instead of a string parameter
      const { data, error } = await supabase
        .rpc('get_streaming_config', {});
      
      if (error) throw error;
      return data as StreamingConfig;
    } catch (err) {
      console.error('Error fetching streaming config:', err);
      return null;
    }
  },

  // Update Agora API settings
  updateAgoraSettings: async (appId: string, appCertificate: string, enabled: boolean) => {
    try {
      // Use correct parameter object
      const { error } = await supabase.rpc('update_streaming_config', { 
        p_app_id: appId,
        p_app_certificate: appCertificate,
        p_enabled: enabled
      });
      
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating Agora settings:', err);
      throw err;
    }
  },

  // Get all active streams for admin panel
  getAllStreams: async (status?: 'live' | 'ended' | 'all') => {
    try {
      let query = supabase
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
        `);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('started_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the LiveStream interface
      const streams = data.map(stream => ({
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
      console.error('Error fetching streams for admin:', err);
      return [];
    }
  },

  // Shutdown a stream by admin
  shutdownStream: async (streamId: string, reason: string) => {
    try {
      // First, update stream status
      const { error } = await supabase
        .from('streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);

      if (error) throw error;

      // Log the action using an RPC function with an object parameter
      await supabase
        .rpc('log_admin_action', {
          p_action_type: 'shutdown_stream',
          p_target_id: streamId,
          p_reason: reason
        });

      return { success: true };
    } catch (err) {
      console.error('Error shutting down stream:', err);
      throw err;
    }
  },

  // Get stream analytics data
  getStreamAnalytics: async (period = 'week') => {
    try {
      const response = await axios.get('/api/analytics/streams', {
        params: { period }
      });
      
      return response.data;
    } catch (err: any) {
      console.error('Error fetching stream analytics:', err);
      return {
        dailyStreamCounts: [],
        popularStreamers: [],
        averageViewerCount: 0,
        totalStreams: 0
      };
    }
  },

  // Get gift usage analytics
  getGiftAnalytics: async (period = 'week') => {
    try {
      const response = await axios.get('/api/analytics/gifts', {
        params: { period }
      });
      
      return response.data;
    } catch (err: any) {
      console.error('Error fetching gift analytics:', err);
      return {
        popularGifts: [],
        totalGiftValue: 0,
        dailyGiftCounts: []
      };
    }
  }
};

export default StreamingAdminService;
