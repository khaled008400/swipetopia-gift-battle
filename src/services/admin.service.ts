
import { adminApi } from './api';

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  videoUploadsToday: number;
  totalOrders: number;
  ordersToday: number;
  revenueTotal: number;
  revenueToday: number;
}

export interface LiveStream {
  id: string;
  title: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  durationMinutes: number;
  currentViewers: number;
  giftsReceived: number;
  topGiftName: string;
  revenue: number;
  peakViewers: number;
  endedAt: string;
  scheduledFor: string;
  plannedDurationMinutes: number;
}

export interface StreamAPISettings {
  appID: string;
  serverSecret: string;
}

class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await adminApi.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      
      // Return mock data for development/demo
      return {
        totalUsers: 1250,
        newUsersToday: 25,
        totalVideos: 3500,
        videoUploadsToday: 120,
        totalOrders: 850,
        ordersToday: 32,
        revenueTotal: 24500,
        revenueToday: 1250
      };
    }
  }

  async getLiveStreams(type: string = 'current', query: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/live-streams?type=${type}&query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      
      // Return mock data for development/demo
      return {
        data: Array(5).fill(null).map((_, i) => ({
          id: `stream-${i + 1}`,
          title: `Live Stream ${i + 1}`,
          user: {
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`
          },
          durationMinutes: Math.floor(Math.random() * 120) + 10,
          currentViewers: Math.floor(Math.random() * 500) + 50,
          giftsReceived: Math.floor(Math.random() * 200),
          topGiftName: ['Diamond', 'Crown', 'Heart', 'Star', 'Rocket'][Math.floor(Math.random() * 5)],
          revenue: Math.random() * 500 + 50,
          peakViewers: Math.floor(Math.random() * 1000) + 100,
          endedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          scheduledFor: new Date(Date.now() + Math.random() * 86400000 * 7).toISOString(),
          plannedDurationMinutes: Math.floor(Math.random() * 120) + 30
        })),
        stats: {
          activeCount: 5,
          totalViewers: 1250,
          totalGiftRevenue: 850.75
        }
      };
    }
  }
  
  async shutdownStream(streamId: string, reason: string): Promise<void> {
    try {
      await adminApi.post(`/live-streams/${streamId}/shutdown`, { reason });
    } catch (error) {
      console.error('Error shutting down stream:', error);
      throw error;
    }
  }
  
  async sendStreamMessage(streamId: string, message: string): Promise<void> {
    try {
      await adminApi.post(`/live-streams/${streamId}/message`, { message });
    } catch (error) {
      console.error('Error sending stream message:', error);
      throw error;
    }
  }

  async getStreamAPISettings(): Promise<StreamAPISettings> {
    try {
      const response = await adminApi.get('/stream-api/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching stream API settings:', error);
      // Return empty settings if not found
      return { appID: '', serverSecret: '' };
    }
  }

  async saveStreamAPISettings(appID: string, serverSecret: string): Promise<void> {
    try {
      await adminApi.post('/stream-api/settings', { appID, serverSecret });
    } catch (error) {
      console.error('Error saving stream API settings:', error);
      throw error;
    }
  }

  async testStreamAPIConnection(appID: string, serverSecret: string): Promise<boolean> {
    try {
      const response = await adminApi.post('/stream-api/test-connection', { appID, serverSecret });
      return response.data.success;
    } catch (error) {
      console.error('Error testing stream API connection:', error);
      throw error;
    }
  }
}

export default new AdminService();
