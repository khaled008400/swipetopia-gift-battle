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

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_purchase?: number;
  expiry_date: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  applicable_products?: string[]; // Product IDs the coupon applies to
  applicable_categories?: string[]; // Category IDs the coupon applies to
  created_at: string;
  updated_at: string;
}

export interface AdminOffer {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'bundle';
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_products?: string[]; // Product IDs the offer applies to
  applicable_categories?: string[]; // Category IDs the offer applies to
  rules?: {
    buy_quantity?: number;
    get_quantity?: number;
    bundle_products?: string[];
    bundle_price?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string; // e.g., "3-5 days"
  is_active: boolean;
  conditions?: {
    min_order_value?: number;
    max_order_value?: number;
    applicable_regions?: string[];
  };
  created_at: string;
  updated_at: string;
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
  },

  // Coupons management
  async getCoupons(page = 1, search = ''): Promise<{ data: AdminCoupon[], pagination: Pagination }> {
    const response = await adminApi.get('/coupons', { params: { page, search } });
    return response.data;
  },

  async createCoupon(couponData: Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>): Promise<AdminCoupon> {
    const response = await adminApi.post('/coupons', couponData);
    return response.data;
  },

  async updateCoupon(couponId: string, couponData: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const response = await adminApi.put(`/coupons/${couponId}`, couponData);
    return response.data;
  },

  async deleteCoupon(couponId: string): Promise<void> {
    await adminApi.delete(`/coupons/${couponId}`);
  },

  // Offers management
  async getOffers(page = 1, search = '', active_only = false): Promise<{ data: AdminOffer[], pagination: Pagination }> {
    const response = await adminApi.get('/offers', { 
      params: { page, search, active_only } 
    });
    return response.data;
  },

  async createOffer(offerData: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>): Promise<AdminOffer> {
    const response = await adminApi.post('/offers', offerData);
    return response.data;
  },

  async updateOffer(offerId: string, offerData: Partial<AdminOffer>): Promise<AdminOffer> {
    const response = await adminApi.put(`/offers/${offerId}`, offerData);
    return response.data;
  },

  async deleteOffer(offerId: string): Promise<void> {
    await adminApi.delete(`/offers/${offerId}`);
  },

  // Shipping methods management
  async getShippingMethods(page = 1): Promise<{ data: AdminShippingMethod[], pagination: Pagination }> {
    const response = await adminApi.get('/shipping/methods', { params: { page } });
    return response.data;
  },

  async createShippingMethod(methodData: Omit<AdminShippingMethod, 'id' | 'created_at' | 'updated_at'>): Promise<AdminShippingMethod> {
    const response = await adminApi.post('/shipping/methods', methodData);
    return response.data;
  },

  async updateShippingMethod(methodId: string, methodData: Partial<AdminShippingMethod>): Promise<AdminShippingMethod> {
    const response = await adminApi.put(`/shipping/methods/${methodId}`, methodData);
    return response.data;
  },

  async deleteShippingMethod(methodId: string): Promise<void> {
    await adminApi.delete(`/shipping/methods/${methodId}`);
  },

  // Analytics for pricing, coupons and offers
  async getCouponUsageStats(period: 'week' | 'month' | 'year'): Promise<any> {
    const response = await adminApi.get('/analytics/coupon-usage', { params: { period } });
    return response.data;
  },

  async getOfferConversionStats(period: 'week' | 'month' | 'year'): Promise<any> {
    const response = await adminApi.get('/analytics/offer-conversion', { params: { period } });
    return response.data;
  },

  async getShippingMethodUsageStats(): Promise<any> {
    const response = await adminApi.get('/analytics/shipping-usage');
    return response.data;
  }
};

export default AdminService;
