
import { adminApi } from './api';

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalOrders: number;
  revenueTotal: number;
  newUsersToday: number;
  videoUploadsToday: number;
  ordersToday: number;
  revenueToday: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
  videosCount: number;
  ordersCount: number;
}

export interface AdminVideo {
  id: string;
  user: {
    id: string;
    username: string;
  };
  url: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  status: 'active' | 'flagged' | 'removed';
}

export interface AdminOrder {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  inventory: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const AdminService = {
  // Dashboard
  async getDashboardStats(): Promise<AdminStats> {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  },

  // Users management
  async getUsers(page = 1, search = ''): Promise<{ data: AdminUser[], pagination: Pagination }> {
    const response = await adminApi.get('/users', { params: { page, search } });
    return response.data;
  },

  async getUserDetails(userId: string): Promise<AdminUser> {
    const response = await adminApi.get(`/users/${userId}`);
    return response.data;
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<AdminUser> {
    const response = await adminApi.patch(`/users/${userId}/status`, { status });
    return response.data;
  },

  // Videos management
  async getVideos(page = 1, status = '', userId = ''): Promise<{ data: AdminVideo[], pagination: Pagination }> {
    const response = await adminApi.get('/videos', { 
      params: { page, status, user_id: userId } 
    });
    return response.data;
  },

  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed'): Promise<AdminVideo> {
    const response = await adminApi.patch(`/videos/${videoId}/status`, { status });
    return response.data;
  },

  async deleteVideo(videoId: string): Promise<void> {
    await adminApi.delete(`/videos/${videoId}`);
  },

  // Orders management
  async getOrders(page = 1, status = '', userId = ''): Promise<{ data: AdminOrder[], pagination: Pagination }> {
    const response = await adminApi.get('/orders', { 
      params: { page, status, user_id: userId } 
    });
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<AdminOrder> {
    const response = await adminApi.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Products management
  async getProducts(page = 1, category = '', status = ''): Promise<{ data: AdminProduct[], pagination: Pagination }> {
    const response = await adminApi.get('/products', { 
      params: { page, category, status } 
    });
    return response.data;
  },

  async createProduct(productData: Omit<AdminProduct, 'id'>): Promise<AdminProduct> {
    const response = await adminApi.post('/products', productData);
    return response.data;
  },

  async updateProduct(productId: string, productData: Partial<AdminProduct>): Promise<AdminProduct> {
    const response = await adminApi.put(`/products/${productId}`, productData);
    return response.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    await adminApi.delete(`/products/${productId}`);
  },

  // Reports and Analytics
  async getUserGrowthData(period: 'week' | 'month' | 'year'): Promise<any> {
    const response = await adminApi.get('/analytics/user-growth', { params: { period } });
    return response.data;
  },

  async getVideoEngagementData(period: 'week' | 'month' | 'year'): Promise<any> {
    const response = await adminApi.get('/analytics/video-engagement', { params: { period } });
    return response.data;
  },

  async getRevenueData(period: 'week' | 'month' | 'year'): Promise<any> {
    const response = await adminApi.get('/analytics/revenue', { params: { period } });
    return response.data;
  }
};

export default AdminService;
