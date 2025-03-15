import axios from './api';
import { supabase } from '@/lib/supabase';

// Define admin statistics interface
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

// Fallback mock data for development or when API is not available
const mockStats: AdminStats = {
  totalUsers: 12543,
  newUsersToday: 72,
  totalVideos: 45280,
  videoUploadsToday: 142,
  totalOrders: 8753,
  ordersToday: 53,
  revenueTotal: 392150,
  revenueToday: 2750
};

// Admin service for managing dashboard data
const AdminService = {
  // Get stats for dashboard overview
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await axios.get('/admin/dashboard-stats');
      return response.data;
    } catch (error) {
      console.log('Using mock stats due to API error:', error);
      // Return mock data if API fails
      return mockStats;
    }
  },

  // Get users list with pagination
  async getUsers(page = 1, per_page = 10, filters = {}) {
    try {
      const response = await axios.get('/admin/users', {
        params: { page, per_page, ...filters },
      });
      return response.data;
    } catch (error) {
      console.log('Using mock users due to API error:', error);
      // Return mock data
      return {
        data: Array(per_page).fill(null).map((_, i) => ({
          id: `user-${i + (page - 1) * per_page}`,
          username: `user${i + (page - 1) * per_page}`,
          email: `user${i + (page - 1) * per_page}@example.com`,
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          status: ['active', 'suspended', 'pending'][Math.floor(Math.random() * 3)],
          role: ['user', 'creator', 'admin'][Math.floor(Math.random() * 3)],
          verified: Math.random() > 0.7,
          last_login: new Date(Date.now() - i * 3600000).toISOString(),
          followers_count: Math.floor(Math.random() * 1000),
          videos_count: Math.floor(Math.random() * 50),
          orders_count: Math.floor(Math.random() * 20),
        })),
        pagination: {
          total: 100,
          per_page,
          current_page: page,
          last_page: 10,
        },
      };
    }
  },

  // More admin methods...
};

export default AdminService;
