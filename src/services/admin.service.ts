
import { UserProfile, UserRole } from '@/types/auth.types';
import { Video } from '@/types/video.types';
import { supabase } from '@/lib/supabase';

export interface AdminStats {
  users: number;
  videos: number;
  orders: number;
  streamers: number;
  totalUsers?: number;
  newUsersToday?: number;
  totalVideos?: number;
  videoUploadsToday?: number;
  totalOrders?: number;
  ordersToday?: number;
  revenueTotal?: number;
  revenueToday?: number;
}

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  status: 'active' | 'flagged' | 'removed';
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  view_count: number;
  url?: string;
  user: {
    username: string;
    avatar_url: string;
    id: string;
  };
  createdAt?: string; // For compatibility
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  role: string;
  roles: UserRole[];
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  last_login: string;
  total_videos: number;
  total_followers: number;
  verified: boolean;
  // For compatibility
  createdAt?: string;
  videosCount?: number;
  ordersCount?: number;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
    id?: string; // Add for compatibility
    name?: string; // Add for compatibility
  }[];
  user: {
    username: string;
    email: string;
  };
  total?: number; // Add for compatibility
  createdAt?: string; // Add for compatibility
  products?: any[]; // Add for compatibility with AdminOrders
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  minimum_purchase?: number;
  expiry_date?: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  created_at: string;
  updated_at: string;
  // For compatibility
  type?: 'fixed' | 'percentage';
  value?: number;
}

export interface AdminOffer {
  id: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  status: string;
  products: string[];
  created_at: string;
  updated_at: string;
  min_purchase_amount?: number;
  product_category?: string;
  active?: boolean;
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'ended' | 'scheduled';
  start_time: string;
  viewer_count: number;
  max_viewers: number;
  created_at: string;
  updated_at: string;
  channel_name: string;
  stream_key: string;
  ended_at?: string;
  endedAt?: string; // For compatibility
  durationMinutes?: number;
  currentViewers?: number;
  giftsReceived?: number;
  topGiftName?: string;
  revenue?: number;
  peakViewers?: number;
  scheduledFor?: string;
  plannedDurationMinutes?: number;
  user: {
    username: string;
    avatar_url: string;
    id: string;
  };
}

export interface ProductAttribute {
  id: string;
  name: string;
  value_options: string[];
  values: string[];
  color: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_type: 'svg' | 'gif';
  has_sound: boolean;
  sound_url?: string;
  category: string;
  available: boolean;
  value: number;
  color: string;
  icon: string;
  created_at: string;
  updated_at?: string;
  is_premium?: boolean;
  // For compatibility
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  imageType?: 'svg' | 'gif';
  hasSound?: boolean;
  soundUrl?: string;
}

class AdminService {
  // Dashboard
  async getStats(): Promise<AdminStats> {
    try {
      // Mock data for now
      return {
        users: 1250,
        videos: 3750,
        orders: 875,
        streamers: 156,
        totalUsers: 1250,
        newUsersToday: 25,
        totalVideos: 3750,
        videoUploadsToday: 87,
        totalOrders: 875,
        ordersToday: 32,
        revenueTotal: 12485.50,
        revenueToday: 457.25
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // For dashboard stats
  async getDashboardStats(): Promise<AdminStats> {
    return this.getStats();
  }

  // Videos
  async getVideosList(page = 1, perPage = 10, status = '', search = '', userId = '', date = '') {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching videos list:', error);
      throw error;
    }
  }

  async updateVideoStatus(videoId: string, status: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }

  async deleteVideo(videoId: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  async sendUserWarning(userId: string, reason: string, videoId?: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error sending user warning:', error);
      throw error;
    }
  }

  async restrictUser(userId: string, restrictions: string[] | string) {
    try {
      // Handle both string and string[] formats
      const restrictionsArr = typeof restrictions === 'string' ? [restrictions] : restrictions;
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error restricting user:', error);
      throw error;
    }
  }

  // Users
  async getUsersList(page = 1, perPage = 10, role = '', search = '') {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching users list:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async updateUserRoles(userId: string, roles: UserRole[]) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating user roles:', error);
      throw error;
    }
  }

  async getUser(userId: string) {
    try {
      // Mock implementation
      return {
        id: userId,
        username: 'user',
        email: 'user@example.com',
        avatar_url: '/avatars/default.png',
        roles: ['user'],
        role: 'user',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        total_videos: 0,
        total_followers: 0,
        verified: false
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Orders
  async getOrders(page: number = 1, perPage: number = 10, status = '', search = '') {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Report data methods
  async getUserGrowthData(period: string = 'month') {
    return {
      userGrowth: [],
      demographics: [],
      retention: 65.8,
      newUsers: [],
      activeUsers: []
    };
  }

  async getVideoEngagementData(period: string = 'month') {
    return {
      viewsByDay: [],
      commentsByDay: [],
      likesByDay: [],
      views: [],
      interactions: [],
      uploads: []
    };
  }

  async getRevenueData(period: string = 'month') {
    return {
      revenueByMonth: [],
      revenueByCategory: [],
      projections: [],
      total: [],
      byCategory: [],
      orders: [],
      aov: []
    };
  }

  // Product Analytics
  async getProductSalesData(period: string = 'month', category: string = '') {
    return {
      salesByCategory: [],
      topProducts: [],
      salesTrend: [],
      salesData: [],
      conversionData: [],
      revenueData: [],
      channelData: [],
      customerData: []
    };
  }

  // Coupons
  async getCoupons() {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1
        }
      };
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  }

  async createCoupon(couponData: Omit<AdminCoupon, 'id'>) {
    try {
      // Mock implementation
      return { success: true, id: 'new-coupon-id' };
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  async updateCoupon(id: string, data: Partial<Omit<AdminCoupon, 'id'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  async deleteCoupon(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  async getCouponAnalytics() {
    try {
      // Mock implementation
      return {
        usageByDay: [],
        topCoupons: [],
        conversionRate: 15.8,
        usage_over_time: [],
        most_used_coupons: []
      };
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      throw error;
    }
  }

  // Offers
  async getOffers() {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1
        }
      };
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  }

  async createOffer(offerData: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      // Add missing required properties
      const completeOfferData = {
        ...offerData,
        status: 'active',
        products: [],
        discount_type: offerData.discount_type || 'percentage',
      };
      // Mock implementation
      return { success: true, id: 'new-offer-id' };
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async updateOffer(id: string, data: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }

  async deleteOffer(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }

  async getOfferAnalytics() {
    try {
      // Mock implementation
      return {
        salesByOffer: [],
        conversionRate: 12.3,
        totalRevenue: 1543.75,
        averageOrderValue: 85.50,
        topOffers: []
      };
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      throw error;
    }
  }

  // Live streams
  async getLiveStreams(status = 'current', search = '') {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1
        },
        stats: {
          activeCount: 0,
          totalViewers: 0,
          totalGiftRevenue: 0
        }
      };
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  }

  async shutdownStream(streamId: string, reason: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error shutting down stream:', error);
      throw error;
    }
  }

  async sendStreamMessage(streamId: string, message: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error sending stream message:', error);
      throw error;
    }
  }

  // Shipping methods
  async getShippingMethods() {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1
        }
      };
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      throw error;
    }
  }

  async createShippingMethod(methodData: Omit<AdminShippingMethod, 'id'>) {
    try {
      // Convert string to number if needed
      const convertedData = {
        ...methodData,
        estimated_days: typeof methodData.estimated_days === 'string' 
          ? parseInt(methodData.estimated_days, 10) 
          : methodData.estimated_days
      };
      
      // Mock implementation
      return { success: true, id: 'new-shipping-method-id' };
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw error;
    }
  }

  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, 'id'>>) {
    try {
      // Convert string to number if needed
      const convertedData = {
        ...data,
        estimated_days: typeof data.estimated_days === 'string' 
          ? parseInt(data.estimated_days, 10) 
          : data.estimated_days
      };
      
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating shipping method:', error);
      throw error;
    }
  }

  async deleteShippingMethod(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      throw error;
    }
  }

  // Product Attributes
  async getProductAttributes(page = '1') {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1,
          per_page: 10
        }
      };
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      throw error;
    }
  }

  async createProductAttribute(attributeData: Partial<Omit<ProductAttribute, 'id'>>) {
    try {
      // Add missing required properties
      const completeData = {
        ...attributeData,
        value_options: attributeData.values || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Mock implementation
      return { success: true, id: 'new-attribute-id' };
    } catch (error) {
      console.error('Error creating product attribute:', error);
      throw error;
    }
  }

  async updateProductAttribute(id: string, data: Partial<ProductAttribute>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating product attribute:', error);
      throw error;
    }
  }

  async deleteProductAttribute(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting product attribute:', error);
      throw error;
    }
  }

  // Virtual Gifts
  async getVirtualGifts() {
    try {
      // Mock implementation
      return {
        data: [],
        pagination: {
          total: 0,
          last_page: 1,
          current_page: 1
        }
      };
    } catch (error) {
      console.error('Error fetching virtual gifts:', error);
      throw error;
    }
  }

  async createVirtualGift(giftData: Partial<VirtualGift>) {
    try {
      // Map compatibility properties
      const fixedGiftData = {
        name: giftData.name || '',
        description: giftData.description || '',
        price: giftData.price || 0,
        image_url: giftData.imageUrl || giftData.image_url || '',
        image_type: (giftData.imageType || giftData.image_type || 'svg') as 'svg' | 'gif',
        has_sound: giftData.hasSound || giftData.has_sound || false,
        sound_url: giftData.soundUrl || giftData.sound_url || '',
        category: giftData.category || 'basic',
        available: giftData.available !== undefined ? giftData.available : true,
        value: giftData.value || 0,
        color: giftData.color || '#000000',
        icon: giftData.icon || 'gift',
        created_at: new Date().toISOString()
      };
      
      // Mock implementation
      return { success: true, id: 'new-gift-id' };
    } catch (error) {
      console.error('Error creating virtual gift:', error);
      throw error;
    }
  }

  async updateVirtualGift(id: string, data: Partial<VirtualGift>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating virtual gift:', error);
      throw error;
    }
  }

  async deleteVirtualGift(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting virtual gift:', error);
      throw error;
    }
  }

  async toggleGiftAvailability(id: string, available: boolean) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error toggling gift availability:', error);
      throw error;
    }
  }
}

export default new AdminService();
