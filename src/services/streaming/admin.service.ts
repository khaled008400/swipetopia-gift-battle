
import { supabase } from "@/integrations/supabase/client";
import { LiveStream } from "@/models/streaming";
import { adminApi } from "../api";
import axios from "axios";

/**
 * Service for administering streaming features
 */
const StreamingAdminService = {
  // Get streaming configuration
  getStreamingConfig: async () => {
    try {
      const { data, error } = await supabase
        .from('streaming_config')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching streaming config:', err);
      return null;
    }
  },

  // Update Agora API settings
  updateAgoraSettings: async (appId: string, appCertificate: string, enabled: boolean) => {
    try {
      // Using regular supabase query since we already have the streaming_config table
      const { error } = await supabase
        .from('streaming_config')
        .update({
          agora_app_id: appId,
          agora_app_certificate: appCertificate,
          agora_enabled: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);  // Assuming there's only one config row
      
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

      // Log the action in admin_actions
      const { error: logError } = await supabase
        .from('admin_actions')
        .insert({
          action_type: 'shutdown_stream',
          target_id: streamId,
          reason: reason,
          admin_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (logError) console.error('Error logging admin action:', logError);

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
    } catch (err) {
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
    } catch (err) {
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
