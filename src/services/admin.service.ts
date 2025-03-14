import api from './api';
import { Coupon, Offer, ShippingMethod, PricingRules } from './pricing.service';

// Added UserRole type for better type safety
export type UserRole = 'viewer' | 'seller' | 'streamer' | 'admin';

// Interfaces for admin models
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  role: UserRole; // Added role property
  createdAt: string;
  videosCount: number;
  ordersCount: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inventory: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
}

export interface AdminVideo {
  id: string;
  user: {
    id: string;
    username: string;
  };
  description: string;
  url: string;
  createdAt: string;
  status: 'active' | 'flagged' | 'removed';
  likes: number;
  comments: number;
  shares: number;
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

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  color?: string;
  status: 'active' | 'inactive';
}

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

export interface AdminCoupon extends Coupon {
  id: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOffer {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'special';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  min_purchase_amount?: number;
  product_category?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminShippingMethod extends Omit<ShippingMethod, 'is_active'> {
  id: string;
  is_active?: boolean;
}

export interface LiveStream {
  id: string;
  user: {
    id: string;
    username: string;
  };
  title: string;
  durationMinutes: number;
  plannedDurationMinutes?: number;
  currentViewers: number;
  peakViewers: number;
  giftsReceived: number;
  topGiftName: string;
  revenue: number;
  startedAt: string;
  endedAt?: string;
  scheduledFor?: string;
  status: 'live' | 'ended' | 'scheduled';
}

export interface LiveStreamStats {
  activeCount: number;
  totalViewers: number;
  totalGiftRevenue: number;
}

const AdminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getUsersList(page = 1, limit = 10, search = '') {
    const response = await api.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  async getUsers(page = 1, limit = 10, search = '') {
    return this.getUsersList(page, limit, search);
  },

  async getUser(userId: string) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, userData: any) {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUserRole(userId: string, role: UserRole) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async getProductsList(page = 1, limit = 10, category = '', search = '') {
    const response = await api.get('/admin/products', {
      params: { page, limit, category, search }
    });
    return response.data;
  },

  async getProducts(page = 1, category = '') {
    const response = await api.get('/admin/products', {
      params: { page, category }
    });
    return response.data;
  },

  async getProduct(productId: string) {
    const response = await api.get(`/admin/products/${productId}`);
    return response.data;
  },

  async createProduct(productData: any) {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  async updateProduct(productId: string, productData: any) {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  },

  async deleteProduct(productId: string) {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  async getProductSalesData(productId: string, period = 'month') {
    const response = await api.get(`/admin/products/${productId}/sales`, {
      params: { period }
    });
    return response.data;
  },

  async getOrdersList(page = 1, limit = 10, status = '', search = '') {
    const response = await api.get('/admin/orders', {
      params: { page, limit, status, search }
    });
    return response.data;
  },

  async getOrders(page = 1, status = '') {
    const response = await api.get('/admin/orders', {
      params: { page, status }
    });
    return response.data;
  },

  async getOrder(orderId: string) {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getVideosList(page = 1, limit = 10, status = '', search = '', username = '', date = '') {
    const response = await api.get('/admin/videos', {
      params: { page, limit, status, search, username, date }
    });
    return response.data;
  },

  async getVideos(page = 1, status = '') {
    const response = await api.get('/admin/videos', {
      params: { page, status }
    });
    return response.data;
  },

  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed') {
    const response = await api.patch(`/admin/videos/${videoId}/status`, { status });
    return response.data;
  },

  async approveVideo(videoId: string) {
    const response = await api.post(`/admin/videos/${videoId}/approve`);
    return response.data;
  },

  async rejectVideo(videoId: string, reason?: string) {
    const response = await api.post(`/admin/videos/${videoId}/reject`, { reason });
    return response.data;
  },

  async deleteVideo(videoId: string) {
    const response = await api.delete(`/admin/videos/${videoId}`);
    return response.data;
  },

  async getReportsList(type = 'sales', period = 'month') {
    const response = await api.get('/admin/reports', {
      params: { type, period }
    });
    return response.data;
  },

  async getUserGrowthData(period = 'week') {
    const response = await api.get('/admin/reports/user-growth', {
      params: { period }
    });
    return response.data;
  },

  async getVideoEngagementData(period = 'week') {
    const response = await api.get('/admin/reports/video-engagement', {
      params: { period }
    });
    return response.data;
  },

  async getRevenueData(period = 'week') {
    const response = await api.get('/admin/reports/revenue', {
      params: { period }
    });
    return response.data;
  },

  async getAttributes() {
    const response = await api.get('/admin/product-attributes');
    return response.data;
  },

  async getProductAttributes(page = 1) {
    const response = await api.get('/admin/product-attributes', {
      params: { page }
    });
    return response.data;
  },

  async getAttribute(attributeId: string) {
    const response = await api.get(`/admin/product-attributes/${attributeId}`);
    return response.data;
  },

  async createAttribute(attributeData: any) {
    const response = await api.post('/admin/product-attributes', attributeData);
    return response.data;
  },

  async createProductAttribute(attributeData: Omit<ProductAttribute, 'id'>) {
    const response = await api.post('/admin/product-attributes', attributeData);
    return response.data;
  },

  async updateAttribute(attributeId: string, attributeData: any) {
    const response = await api.put(`/admin/product-attributes/${attributeId}`, attributeData);
    return response.data;
  },

  async updateProductAttribute(attributeId: string, attributeData: Partial<Omit<ProductAttribute, 'id'>>) {
    const response = await api.put(`/admin/product-attributes/${attributeId}`, attributeData);
    return response.data;
  },

  async deleteAttribute(attributeId: string) {
    const response = await api.delete(`/admin/product-attributes/${attributeId}`);
    return response.data;
  },

  async deleteProductAttribute(attributeId: string) {
    const response = await api.delete(`/admin/product-attributes/${attributeId}`);
    return response.data;
  },

  async getCoupons() {
    const response = await api.get('/admin/coupons');
    return response.data;
  },

  async getCouponAnalytics() {
    const response = await api.get('/admin/coupons/analytics');
    return response.data;
  },

  async createCoupon(couponData: Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>) {
    const response = await api.post('/admin/coupons', couponData);
    return response.data;
  },

  async updateCoupon(couponId: string, couponData: Partial<Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>>) {
    const response = await api.put(`/admin/coupons/${couponId}`, couponData);
    return response.data;
  },

  async deleteCoupon(couponId: string) {
    const response = await api.delete(`/admin/coupons/${couponId}`);
    return response.data;
  },

  async getOffers() {
    const response = await api.get('/admin/offers');
    return response.data;
  },

  async getOfferAnalytics() {
    const response = await api.get('/admin/offers/analytics');
    return response.data;
  },

  async createOffer(offerData: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>) {
    const response = await api.post('/admin/offers', offerData);
    return response.data;
  },

  async updateOffer(offerId: string, offerData: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>>) {
    const response = await api.put(`/admin/offers/${offerId}`, offerData);
    return response.data;
  },

  async deleteOffer(offerId: string) {
    const response = await api.delete(`/admin/offers/${offerId}`);
    return response.data;
  },

  async getShippingMethods() {
    const response = await api.get('/admin/shipping');
    return response.data;
  },

  async createShippingMethod(methodData: Omit<AdminShippingMethod, 'id'>) {
    const response = await api.post('/admin/shipping', methodData);
    return response.data;
  },

  async updateShippingMethod(methodId: string, methodData: Partial<Omit<AdminShippingMethod, 'id'>>) {
    const response = await api.put(`/admin/shipping/${methodId}`, methodData);
    return response.data;
  },

  async deleteShippingMethod(methodId: string) {
    const response = await api.delete(`/admin/shipping/${methodId}`);
    return response.data;
  },

  async getPricingRules() {
    const response = await api.get('/admin/pricing-rules');
    return response.data;
  },

  async createPricingRule(ruleData: Omit<PricingRules, 'id'>) {
    const response = await api.post('/admin/pricing-rules', ruleData);
    return response.data;
  },

  async updatePricingRule(ruleId: string, ruleData: Partial<Omit<PricingRules, 'id'>>) {
    const response = await api.put(`/admin/pricing-rules/${ruleId}`, ruleData);
    return response.data;
  },

  async deletePricingRule(ruleId: string) {
    const response = await api.delete(`/admin/pricing-rules/${ruleId}`);
    return response.data;
  },

  async getLiveStreams(type = 'current', search = '') {
    const response = await api.get('/admin/live-streams', {
      params: { type, search }
    });
    return response.data;
  },

  async getStreamDetails(streamId: string) {
    const response = await api.get(`/admin/live-streams/${streamId}`);
    return response.data;
  },

  async shutdownStream(streamId: string, reason: string) {
    const response = await api.post(`/admin/live-streams/${streamId}/shutdown`, { reason });
    return response.data;
  },

  async sendStreamMessage(streamId: string, message: string) {
    const response = await api.post(`/admin/live-streams/${streamId}/message`, { message });
    return response.data;
  },

  async getStreamGifts(streamId: string) {
    const response = await api.get(`/admin/live-streams/${streamId}/gifts`);
    return response.data;
  },

  async getStreamAnalytics(streamId: string) {
    const response = await api.get(`/admin/live-streams/${streamId}/analytics`);
    return response.data;
  },

  // Add user warning functionality
  async sendUserWarning(userId: string, message: string, relatedContentId?: string) {
    const response = await api.post(`/admin/users/${userId}/warnings`, { 
      message, 
      related_content_id: relatedContentId 
    });
    return response.data;
  },

  // Restrict user functionality
  async restrictUser(userId: string, reason: string) {
    const response = await api.post(`/admin/users/${userId}/restrict`, { reason });
    return response.data;
  },

  // Batch update video statuses
  async batchUpdateVideoStatus(videoIds: string[], status: 'active' | 'flagged' | 'removed') {
    const response = await api.post('/admin/videos/batch-update', { video_ids: videoIds, status });
    return response.data;
  },

  // Batch delete videos
  async batchDeleteVideos(videoIds: string[]) {
    const response = await api.post('/admin/videos/batch-delete', { video_ids: videoIds });
    return response.data;
  },

  // Get user warning history
  async getUserWarnings(userId: string) {
    const response = await api.get(`/admin/users/${userId}/warnings`);
    return response.data;
  },

  // Get user activity log
  async getUserActivityLog(userId: string) {
    const response = await api.get(`/admin/users/${userId}/activity-log`);
    return response.data;
  },

  // Get video reports
  async getVideoReports(videoId: string) {
    const response = await api.get(`/admin/videos/${videoId}/reports`);
    return response.data;
  },
};

export default AdminService;
