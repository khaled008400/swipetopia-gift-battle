
import { UserProfile, UserRole } from '@/types/auth.types';
import { Video } from '@/types/video.types';
import { Product } from '@/types/product.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifeuccpukdosoxtufxzi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZXVjY3B1a2Rvc294dHVmeHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM2MjAsImV4cCI6MjA1NzMxOTYyMH0.I4wy6OFJY_zYNrhYWjw7xphFTBc5vT9sgNM3i2iPUqI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    id?: string; // For compatibility
    name?: string; // For compatibility
  }[];
  user: {
    username: string;
    email: string;
  };
  total?: number; // For compatibility
  createdAt?: string; // For compatibility
  products?: any[]; // For compatibility with AdminOrders
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
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
  description?: string;
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

// Define AdminProduct type
export interface AdminProduct extends Product {
  // Any additional properties for admin view
}

class AdminService {
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

  // For AdminCoupons.tsx
  async getCoupons() {
    try {
      // Mock implementation for now, returning the proper structure
      return [
        {
          id: '1',
          code: 'SUMMER25',
          type: 'percentage' as const,
          value: 25,
          discount_type: 'percentage' as const, 
          discount_value: 25,
          minimum_purchase: 100,
          usage_count: 5,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  }

  // For AdminCoupons.tsx
  async getCouponAnalytics() {
    try {
      return {
        usage_over_time: [
          { date: '2023-01', count: 45 },
          { date: '2023-02', count: 67 },
          { date: '2023-03', count: 89 }
        ],
        most_used_coupons: [
          { code: 'SUMMER25', usage_count: 156 },
          { code: 'WELCOME10', usage_count: 124 },
          { code: 'FLASH50', usage_count: 98 }
        ]
      };
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      throw error;
    }
  }

  // For AdminCoupons.tsx
  async createCoupon(couponData: Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>) {
    try {
      // Convert between type and discount_type if needed
      const completeData = {
        ...couponData,
        discount_type: couponData.type || 'percentage',
        discount_value: couponData.value || 0,
        usage_count: 0
      };
      
      // Mock implementation
      return { success: true, id: 'new-coupon-id' };
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  // For AdminCoupons.tsx
  async updateCoupon(id: string, data: Partial<Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  // For AdminCoupons.tsx
  async deleteCoupon(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  // For AdminOffers
  async getOffers() {
    try {
      // Mock implementation that returns the array directly instead of wrapping it in a data property
      return [
        {
          id: '1',
          name: 'Summer Sale',
          description: 'Get discounts on summer items',
          discount_type: 'percentage' as const,
          discount_value: 20,
          status: 'active',
          products: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  }

  // For AdminOffers
  async getOfferAnalytics() {
    try {
      return {
        usage_over_time: [
          { date: '2023-01', count: 45 },
          { date: '2023-02', count: 67 },
          { date: '2023-03', count: 89 }
        ],
        most_used_offers: [
          { name: 'Summer Sale', usage_count: 156 },
          { name: 'Black Friday', usage_count: 124 },
          { name: 'Holiday Special', usage_count: 98 }
        ],
        revenue_impact: [
          { name: 'Summer Sale', revenue: 12500 },
          { name: 'Black Friday', revenue: 22400 },
          { name: 'Holiday Special', revenue: 15600 }
        ]
      };
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      throw error;
    }
  }

  // For AdminOffers
  async createOffer(offerData: Partial<AdminOffer>) {
    try {
      // Add missing required properties
      const completeOfferData = {
        ...offerData,
        status: 'active',
        products: [],
        discount_type: offerData.discount_type || 'percentage',
        discount_value: offerData.discount_value || 0,
      };
      
      // Mock implementation
      return { success: true, id: 'new-offer-id' };
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  // For AdminOffers
  async updateOffer(id: string, data: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }

  // For AdminOffers
  async deleteOffer(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }

  // For AdminShipping
  async getShippingMethods() {
    try {
      // Mock implementation returning array directly
      return [
        {
          id: '1',
          name: 'Standard Shipping',
          description: '3-5 business days',
          price: 5.99,
          estimated_days: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      throw error;
    }
  }

  // For AdminShipping
  async createShippingMethod(methodData: Omit<AdminShippingMethod, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Mock implementation
      return { success: true, id: 'new-shipping-method-id' };
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw error;
    }
  }

  // For AdminShipping
  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating shipping method:', error);
      throw error;
    }
  }

  // For AdminShipping
  async deleteShippingMethod(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      throw error;
    }
  }

  // For AdminOrders
  async getOrders(page: number = 1, perPage: number = 10, status = '', search = '') {
    try {
      // Mock implementation returning structured array with pagination data
      const orders = [
        {
          id: '1',
          user_id: 'user-1',
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
          user: { username: 'user1', email: 'user1@example.com' },
          total: 100,
          createdAt: new Date().toISOString(),
          products: []
        }
      ];

      return {
        data: orders,
        pagination: {
          total: 100,
          last_page: 10,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // For AdminOrders
  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async getVirtualGifts() {
    try {
      // Mock implementation returning structured array
      return {
        data: [
          {
            id: '1',
            name: 'Diamond',
            description: 'A shiny diamond gift',
            price: 100,
            image_url: '/images/diamond.svg',
            image_type: 'svg' as const,
            has_sound: false,
            category: 'premium',
            available: true,
            value: 100,
            color: '#3498db',
            icon: '💎',
            created_at: new Date().toISOString(),
            // Compatibility properties
            imageUrl: '/images/diamond.svg',
            imageType: 'svg' as const,
            hasSound: false
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching virtual gifts:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
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
        icon: giftData.icon || '🎁',
        created_at: new Date().toISOString()
      };
      
      // Mock implementation
      return { success: true, id: 'new-gift-id' };
    } catch (error) {
      console.error('Error creating virtual gift:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async updateVirtualGift(id: string, data: Partial<Omit<VirtualGift, 'id' | 'created_at'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating virtual gift:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async deleteVirtualGift(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting virtual gift:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async toggleGiftAvailability(id: string, available: boolean) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error toggling gift availability:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async getGiftUsageStats() {
    return {
      topGifts: [],
      giftsByDay: [],
      totalRevenue: 1200,
      totalGifts: 150,
      totalSent: 450,
      mostPopular: { name: 'Diamond', count: 125 },
      topStreamers: [
        { username: 'streamer1', giftsReceived: 78 },
        { username: 'streamer2', giftsReceived: 56 }
      ]
    };
  }

  // For AdminVideos
  async getVideosList(page: number = 1, filter: string = '', status: string = '') {
    try {
      // Mock implementation returning structured array with pagination
      const videos = [
        {
          id: '1',
          title: 'Sample Video',
          description: 'This is a sample video',
          video_url: '/videos/sample.mp4',
          thumbnail_url: '/thumbnails/sample.jpg',
          status: 'active' as const,
          user_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes_count: 10,
          comments_count: 5,
          shares_count: 3,
          view_count: 100,
          user: {
            username: 'user1',
            avatar_url: '/avatars/user1.jpg',
            id: 'user-1'
          }
        }
      ];

      return {
        data: videos,
        pagination: {
          total: 100,
          last_page: 10,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching videos list:', error);
      throw error;
    }
  }

  // For AdminVideos
  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed') {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }

  // For AdminVideos
  async sendUserWarning(userId: string, message: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error sending user warning:', error);
      throw error;
    }
  }

  // For AdminVideos
  async restrictUser(userId: string, reason: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error restricting user:', error);
      throw error;
    }
  }

  // For AdminVideos
  async deleteVideo(videoId: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  // For AdminUsers
  async getUsersList(page = 1, perPage = 10, role = '', search = '') {
    try {
      // Mock implementation returning structured array with pagination
      const users = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          status: 'active' as const,
          role: 'user',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          total_videos: 0,
          total_followers: 0,
          verified: false,
          avatar_url: '/avatars/default.png',
          roles: ['user'] as UserRole[],
          // For compatibility
          createdAt: new Date().toISOString(),
          videosCount: 0,
          ordersCount: 0
        }
      ];

      return {
        data: users,
        pagination: {
          total: 100,
          last_page: 10,
          current_page: page
        }
      };
    } catch (error) {
      console.error('Error fetching users list:', error);
      throw error;
    }
  }

  // For AdminUser
  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned') {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // For AdminUser
  async getUser(userId: string) {
    try {
      // Mock implementation
      return {
        id: userId,
        username: 'user',
        email: 'user@example.com',
        avatar_url: '/avatars/default.png',
        roles: ['user'] as UserRole[],
        role: 'user',
        status: 'active' as const,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        total_videos: 0,
        total_followers: 0,
        verified: false,
        // For compatibility
        createdAt: new Date().toISOString(),
        videosCount: 0,
        ordersCount: 0
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // For ProductAttributes
  async getProductAttributes(page = '1') {
    try {
      // Mock implementation returning structured array with pagination
      const attributes = [
        {
          id: '1',
          name: 'Color',
          value_options: ['Red', 'Blue', 'Green'],
          values: ['Red', 'Blue', 'Green'],
          color: '#ff0000',
          status: 'active' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      return {
        data: attributes,
        pagination: {
          total: 100,
          last_page: 10,
          current_page: parseInt(page)
        }
      };
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      throw error;
    }
  }

  async createProductAttribute(attributeData: Partial<ProductAttribute>) {
    try {
      // Add missing required properties
      const completeData = {
        name: attributeData.name || '',
        value_options: attributeData.values || [],
        values: attributeData.values || [],
        color: attributeData.color || '#000000',
        status: attributeData.status || 'active',
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

  // For ProductAttributes
  async updateProductAttribute(id: string, data: Partial<Omit<ProductAttribute, 'id'>>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating product attribute:', error);
      throw error;
    }
  }

  // For ProductAttributes
  async deleteProductAttribute(id: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error deleting product attribute:', error);
      throw error;
    }
  }

  // For AdminProductAnalytics
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

  // For AdminLiveStreams
  async getLiveStreams(status: string = 'current', search: string = '') {
    try {
      // Mock implementation returning structured array with stats
      const streams = [
        {
          id: '1',
          user_id: 'user-1',
          title: 'Live Stream',
          description: 'Live stream description',
          status: 'active' as const,
          start_time: new Date().toISOString(),
          viewer_count: 100,
          max_viewers: 150,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          channel_name: 'channel-1',
          stream_key: 'stream-key-1',
          durationMinutes: 30,
          currentViewers: 80,
          giftsReceived: 25,
          topGiftName: 'Diamond',
          revenue: 250.50,
          peakViewers: 120,
          endedAt: new Date().toISOString(),
          user: {
            username: 'user1',
            avatar_url: '/avatars/user1.jpg',
            id: 'user-1'
          }
        }
      ];

      return {
        data: streams,
        stats: {
          activeCount: 10,
          totalViewers: 850,
          totalGiftRevenue: 1250.75
        }
      };
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  }

  // For AdminLiveStreams
  async shutdownStream(streamId: string, reason: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error shutting down stream:', error);
      throw error;
    }
  }

  // For AdminLiveStreams
  async sendStreamMessage(streamId: string, message: string) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error sending stream message:', error);
      throw error;
    }
  }

  // For AdminDashboardPage
  async getDashboardStats() {
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
  }
}

export default new AdminService();
