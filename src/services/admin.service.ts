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

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  color?: string;
  status: 'active' | 'inactive';
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const AdminService = {
  async getDashboardStats(): Promise<AdminStats> {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  },

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

  async getProducts(page = 1, category = '', search = ''): Promise<{ data: AdminProduct[], pagination: Pagination }> {
    const response = await adminApi.get('/products', { 
      params: { page, category, search } 
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

  async getProductAttributes(page = 1): Promise<{ data: ProductAttribute[], pagination: Pagination }> {
    const response = await adminApi.get('/product-attributes', { params: { page } });
    return response.data;
  },

  async createProductAttribute(attributeData: Omit<ProductAttribute, 'id'>): Promise<ProductAttribute> {
    const response = await adminApi.post('/product-attributes', attributeData);
    return response.data;
  },

  async updateProductAttribute(attributeId: string, attributeData: Partial<ProductAttribute>): Promise<ProductAttribute> {
    const response = await adminApi.put(`/product-attributes/${attributeId}`, attributeData);
    return response.data;
  },

  async deleteProductAttribute(attributeId: string): Promise<void> {
    await adminApi.delete(`/product-attributes/${attributeId}`);
  },

  async getProductSalesData(period: 'week' | 'month' | 'year', productId?: string): Promise<any> {
    const response = await adminApi.get('/analytics/product-sales', { 
      params: { period, product_id: productId } 
    });
    return response.data;
  },

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
