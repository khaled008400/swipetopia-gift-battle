import { UserProfile, UserRole } from '@/types/auth.types';
import { Video } from '@/types/video.types';
import { Product, AdminProduct } from '@/types/product.types';
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

class AdminService {
  // For AdminReports.tsx
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
  async createCoupon(couponData: Omit<AdminCoupon, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) {
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
  async updateOffer(id: string, data: Partial<AdminOffer>) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error updating offer:', error);
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

  // For AdminOrders
  async getOrders(page: number = 1, perPage: number = 10, status = '', search = '') {
    try {
      // Mock implementation returning array directly
      return [
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
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // For AdminVirtualGifts
  async getVirtualGifts() {
    try {
      // Mock implementation returning array directly
      return [
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
      ];
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
  async getGiftUsageStats() {
    return {
      topGifts: [],
      giftsByDay: [],
      totalRevenue: 1200,
      totalGifts: 150
    };
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

  // For AdminVideos
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
        status: 'active',
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

  // For ProductAttributes
  async getProductAttributes(page = '1') {
    try {
      // Mock implementation returning array directly
      return [
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
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      throw error;
    }
  }

  async createProductAttribute(attributeData: Partial<ProductAttribute>) {
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

  // For AdminUser
  async getUsersList(page = 1, perPage = 10, role = '', search = '') {
    try {
      // Mock implementation returning array directly
      return [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          status: 'active',
          role: 'user',
          createdAt: new Date().toISOString(),
          videosCount: 0,
          ordersCount: 0,
          // Full AdminUser properties
          avatar_url: '/avatars/default.png',
          roles: ['user'] as UserRole[],
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          total_videos: 0,
          total_followers: 0,
          verified: false
        }
      ];
    } catch (error) {
      console.error('Error fetching users list:', error);
      throw error;
    }
  }
}

export default new AdminService();
