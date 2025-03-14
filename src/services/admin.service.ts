import api from './api';
import { Coupon, Offer, ShippingMethod, PricingRules } from './pricing.service';

export interface AdminCoupon extends Coupon {
  id: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOffer extends Offer {
  id: string;
  created_at: string;
  updated_at: string;
}

// Other admin related interfaces can be added here

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

  async getUser(userId: string) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, userData: any) {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async getProductsList(page = 1, limit = 10, category = '', search = '') {
    const response = await api.get('/admin/products', {
      params: { page, limit, category, search }
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

  async getOrdersList(page = 1, limit = 10, status = '', search = '') {
    const response = await api.get('/admin/orders', {
      params: { page, limit, status, search }
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

  async getVideosList(page = 1, limit = 10, status = '', search = '') {
    const response = await api.get('/admin/videos', {
      params: { page, limit, status, search }
    });
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

  async getReportsList(type = 'sales', period = 'month') {
    const response = await api.get('/admin/reports', {
      params: { type, period }
    });
    return response.data;
  },

  // Product attributes 
  async getAttributes() {
    const response = await api.get('/admin/product-attributes');
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

  async updateAttribute(attributeId: string, attributeData: any) {
    const response = await api.put(`/admin/product-attributes/${attributeId}`, attributeData);
    return response.data;
  },

  async deleteAttribute(attributeId: string) {
    const response = await api.delete(`/admin/product-attributes/${attributeId}`);
    return response.data;
  },

  // Coupon methods
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

  // Offer methods
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

  // Shipping methods
  async getShippingMethods() {
    const response = await api.get('/admin/shipping');
    return response.data;
  },

  async createShippingMethod(methodData: Omit<ShippingMethod, 'id'>) {
    const response = await api.post('/admin/shipping', methodData);
    return response.data;
  },

  async updateShippingMethod(methodId: string, methodData: Partial<Omit<ShippingMethod, 'id'>>) {
    const response = await api.put(`/admin/shipping/${methodId}`, methodData);
    return response.data;
  },

  async deleteShippingMethod(methodId: string) {
    const response = await api.delete(`/admin/shipping/${methodId}`);
    return response.data;
  },

  // Pricing rules
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
  }
};

export default AdminService;
