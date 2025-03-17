
// Extend this file with additional admin service functions
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth.types';
import { LiveStream } from '@/services/streaming/stream.types';

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

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  videosCount: number;
  ordersCount: number;
  coins?: number;
  created_at?: string;
}

export interface AdminVideo {
  id: string;
  title: string;
  user_id: string;
  views: number;
  likes: number;
  comments: number;
  status: 'active' | 'flagged' | 'removed';
  reported: boolean;
  created_at: string;
  username?: string;
  thumbnail_url?: string;
  user?: {
    username: string;
    avatar_url: string;
  };
  url?: string;
  video_url?: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  description?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount_percentage: number;
  type: 'fixed' | 'percentage';
  value: number;
  status: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  minimum_purchase: number;
  usage_limit: number;
  usage_count: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  applicable_products: string[];
  applicable_categories: string[];
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    email: string;
    avatar_url?: string;
  };
  items?: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    image_url?: string;
  };
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
  created_at: string;
  delivery_time: string;
  is_default: boolean;
}

export interface AdminOffer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  discount_type?: 'fixed' | 'percentage' | 'special';
  discount_value?: number;
  start_date: string;
  end_date: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  name?: string;
  min_purchase_amount?: number;
  product_category?: string;
  active?: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  color: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  description: string;
  price: number;
  value: number;
  imageUrl?: string;
  image_url?: string;
  imageType?: string;
  hasSound?: boolean;
  soundUrl?: string;
  category?: string;
  available?: boolean;
  created_at: string;
  color: string;
  icon: string;
  is_premium: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  image?: string;
  image_url?: string;
  inventory?: number;
}

// Admin Service class
class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    try {
      // In a real app, we would fetch these stats from the backend
      // For demo purposes, we'll return mock data
      return {
        totalUsers: 12543,
        newUsersToday: 72,
        totalVideos: 45280,
        videoUploadsToday: 142,
        totalOrders: 8753,
        ordersToday: 53,
        revenueTotal: 392150,
        revenueToday: 2750
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  async getUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email || '',
        status: 'active', // Default status
        role: user.role || 'viewer',
        createdAt: user.created_at,
        videosCount: 0,
        ordersCount: 0,
        coins: user.coins
      }));
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    try {
      // In a real application, we would update the status in the database
      console.log(`Updating user ${userId} status to ${status}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: role,
          roles: [role]
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    username: string;
    role: UserRole;
  }): Promise<any> {
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          username: userData.username,
          role: userData.role
        }
      });
      
      if (error) throw error;
      
      // Create profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          roles: [userData.role]
        });
      
      if (profileError) throw profileError;
      
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Video management functions
  async getVideos(): Promise<AdminVideo[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(video => ({
        id: video.id,
        title: video.title,
        user_id: video.user_id,
        views: video.view_count || 0,
        likes: video.likes_count || 0,
        comments: video.comments_count || 0,
        status: 'active',
        reported: false,
        created_at: video.created_at,
        thumbnail_url: video.thumbnail_url,
        user: video.profiles,
        url: video.video_url,
        video_url: video.video_url,
        view_count: video.view_count,
        likes_count: video.likes_count,
        comments_count: video.comments_count,
        description: video.description
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
  
  // Alias for getVideos for compatibility
  async getVideosList(): Promise<AdminVideo[]> {
    return this.getVideos();
  }
  
  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .update({
          // In a real app, we would have a status field
          // For now, we'll just console log
        })
        .eq('id', videoId);
      
      if (error) throw error;
      
      console.log(`Video ${videoId} status updated to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating video status:', error);
      return false;
    }
  }
  
  async getVideoById(videoId: string): Promise<AdminVideo | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('id', videoId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        user_id: data.user_id,
        views: data.view_count || 0,
        likes: data.likes_count || 0,
        comments: data.comments_count || 0,
        status: 'active',
        reported: false,
        created_at: data.created_at,
        thumbnail_url: data.thumbnail_url,
        user: data.profiles,
        url: data.video_url,
        video_url: data.video_url,
        view_count: data.view_count,
        likes_count: data.likes_count,
        comments_count: data.comments_count,
        description: data.description
      };
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      return null;
    }
  }
  
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }
  
  async getReportedVideos(): Promise<AdminVideo[]> {
    // In a real app, we would fetch reported videos
    return [];
  }
  
  async sendUserWarning(userId: string, reason: string): Promise<boolean> {
    try {
      // In a real app, we would send a warning to the user
      console.log(`Warning sent to user ${userId}: ${reason}`);
      return true;
    } catch (error) {
      console.error('Error sending user warning:', error);
      return false;
    }
  }
  
  async restrictUser(userId: string, reason: string): Promise<boolean> {
    try {
      // In a real app, we would restrict the user
      console.log(`User ${userId} restricted: ${reason}`);
      return true;
    } catch (error) {
      console.error('Error restricting user:', error);
      return false;
    }
  }

  // User functions
  async getUser(userId: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        username: data.username,
        email: data.email || '',
        status: 'active',
        role: data.role || 'viewer',
        createdAt: data.created_at,
        videosCount: 0,
        ordersCount: 0,
        coins: data.coins
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  // Coupon management functions
  async getCoupons(): Promise<AdminCoupon[]> {
    try {
      // Mock data - in a real app, we would fetch from the database
      return [
        {
          id: '1',
          code: 'SUMMER25',
          discount_percentage: 25,
          type: 'percentage',
          value: 25,
          status: 'active',
          expiry_date: '2023-12-31',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          minimum_purchase: 50,
          usage_limit: 100,
          usage_count: 45,
          max_uses: 100,
          current_uses: 45,
          is_active: true,
          applicable_products: [],
          applicable_categories: ['clothing']
        },
        {
          id: '2',
          code: 'WELCOME10',
          discount_percentage: 0,
          type: 'fixed',
          value: 10,
          status: 'active',
          expiry_date: '2023-12-31',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          minimum_purchase: 0,
          usage_limit: 1,
          usage_count: 350,
          max_uses: 500,
          current_uses: 350,
          is_active: true,
          applicable_products: [],
          applicable_categories: []
        }
      ];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }
  
  async getCouponAnalytics(): Promise<any> {
    try {
      // Mock data
      return {
        usage_over_time: [
          { date: '2023-01', count: 45 },
          { date: '2023-02', count: 56 },
          { date: '2023-03', count: 78 },
          { date: '2023-04', count: 92 },
          { date: '2023-05', count: 110 },
          { date: '2023-06', count: 145 }
        ],
        most_used_coupons: [
          { code: 'WELCOME10', usage_count: 350 },
          { code: 'SUMMER25', usage_count: 245 },
          { code: 'FLASH20', usage_count: 180 },
          { code: 'HOLIDAY15', usage_count: 120 },
          { code: 'APP5', usage_count: 95 }
        ]
      };
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      return { usage_over_time: [], most_used_coupons: [] };
    }
  }
  
  async createCoupon(couponData: Partial<AdminCoupon>): Promise<AdminCoupon> {
    try {
      // In a real app, we would create the coupon in the database
      console.log('Creating coupon:', couponData);
      return {
        id: Date.now().toString(),
        code: couponData.code || '',
        discount_percentage: couponData.discount_percentage || 0,
        type: couponData.type || 'percentage',
        value: couponData.value || 0,
        status: 'active',
        expiry_date: couponData.expiry_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        minimum_purchase: couponData.minimum_purchase || 0,
        usage_limit: couponData.usage_limit || 0,
        usage_count: 0,
        max_uses: couponData.usage_limit || 0,
        current_uses: 0,
        is_active: couponData.is_active ?? true,
        applicable_products: couponData.applicable_products || [],
        applicable_categories: couponData.applicable_categories || []
      };
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }
  
  async updateCoupon(couponId: string, couponData: Partial<AdminCoupon>): Promise<AdminCoupon> {
    try {
      // In a real app, we would update the coupon in the database
      console.log(`Updating coupon ${couponId}:`, couponData);
      return {
        id: couponId,
        code: couponData.code || 'UPDATED',
        discount_percentage: couponData.discount_percentage || 0,
        type: couponData.type || 'percentage',
        value: couponData.value || 0,
        status: 'active',
        expiry_date: couponData.expiry_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        minimum_purchase: couponData.minimum_purchase || 0,
        usage_limit: couponData.usage_limit || 0,
        usage_count: 0,
        max_uses: couponData.usage_limit || 0,
        current_uses: 0,
        is_active: couponData.is_active ?? true,
        applicable_products: couponData.applicable_products || [],
        applicable_categories: couponData.applicable_categories || []
      };
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }
  
  async deleteCoupon(couponId: string): Promise<boolean> {
    try {
      // In a real app, we would delete the coupon from the database
      console.log(`Deleting coupon ${couponId}`);
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return false;
    }
  }

  // Shipping methods functions
  async getShippingMethods(): Promise<AdminShippingMethod[]> {
    try {
      // Mock data - in a real app, we would fetch from the database
      return [
        {
          id: '1',
          name: 'Standard Shipping',
          description: '5-7 business days',
          price: 5.99,
          estimated_days: '5-7',
          is_active: true,
          created_at: new Date().toISOString(),
          delivery_time: '5-7 business days',
          is_default: true
        },
        {
          id: '2',
          name: 'Express Shipping',
          description: '2-3 business days',
          price: 12.99,
          estimated_days: '2-3',
          is_active: true,
          created_at: new Date().toISOString(),
          delivery_time: '2-3 business days',
          is_default: false
        }
      ];
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      return [];
    }
  }
  
  async createShippingMethod(method: Partial<AdminShippingMethod>): Promise<AdminShippingMethod> {
    try {
      // In a real app, we would create the shipping method in the database
      console.log('Creating shipping method:', method);
      return {
        id: Date.now().toString(),
        name: method.name || '',
        description: method.description || '',
        price: method.price || 0,
        estimated_days: method.estimated_days || '',
        is_active: method.is_active ?? true,
        created_at: new Date().toISOString(),
        delivery_time: method.estimated_days || '',
        is_default: false
      };
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw error;
    }
  }
  
  async updateShippingMethod(id: string, method: Partial<AdminShippingMethod>): Promise<AdminShippingMethod> {
    try {
      // In a real app, we would update the shipping method in the database
      console.log(`Updating shipping method ${id}:`, method);
      return {
        id,
        name: method.name || '',
        description: method.description || '',
        price: method.price || 0,
        estimated_days: method.estimated_days || '',
        is_active: method.is_active ?? true,
        created_at: new Date().toISOString(),
        delivery_time: method.estimated_days || '',
        is_default: method.is_default ?? false
      };
    } catch (error) {
      console.error('Error updating shipping method:', error);
      throw error;
    }
  }
  
  async deleteShippingMethod(id: string): Promise<boolean> {
    try {
      // In a real app, we would delete the shipping method from the database
      console.log(`Deleting shipping method ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      return false;
    }
  }

  // Offers functions
  async getOffers(): Promise<AdminOffer[]> {
    try {
      // Mock data - in a real app, we would fetch from the database
      return [
        {
          id: '1',
          title: 'Summer Sale',
          name: 'Summer Sale',
          description: 'Get discounts on summer items',
          discount_percentage: 20,
          discount_type: 'percentage',
          discount_value: 20,
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          product_id: '',
          created_at: '2023-05-15',
          updated_at: '2023-05-15',
          min_purchase_amount: 0,
          product_category: 'clothing',
          active: true
        },
        {
          id: '2',
          title: 'Back to School',
          name: 'Back to School',
          description: 'Discounts on school supplies',
          discount_percentage: 15,
          discount_type: 'percentage',
          discount_value: 15,
          start_date: '2023-08-01',
          end_date: '2023-09-15',
          product_id: '',
          created_at: '2023-07-15',
          updated_at: '2023-07-15',
          min_purchase_amount: 50,
          product_category: 'school',
          active: true
        }
      ];
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  }
  
  async getOfferAnalytics(): Promise<any> {
    try {
      // Mock data
      return {
        totalRevenue: 15250.75,
        conversionRate: 4.8,
        averageOrderValue: 78.25,
        topOffers: [
          { id: '1', name: 'Summer Sale', orders: 324, revenue: 8750.25, conversionRate: 5.2 },
          { id: '2', name: 'Back to School', orders: 187, revenue: 6500.50, conversionRate: 4.5 }
        ]
      };
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      return { totalRevenue: 0, conversionRate: 0, averageOrderValue: 0, topOffers: [] };
    }
  }
  
  async createOffer(offerData: Partial<AdminOffer>): Promise<AdminOffer> {
    try {
      // In a real app, we would create the offer in the database
      console.log('Creating offer:', offerData);
      return {
        id: Date.now().toString(),
        title: offerData.title || offerData.name || '',
        name: offerData.name || offerData.title || '',
        description: offerData.description || '',
        discount_percentage: offerData.discount_percentage || offerData.discount_value || 0,
        discount_type: offerData.discount_type || 'percentage',
        discount_value: offerData.discount_value || 0,
        start_date: offerData.start_date || new Date().toISOString(),
        end_date: offerData.end_date || new Date().toISOString(),
        product_id: offerData.product_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        min_purchase_amount: offerData.min_purchase_amount || 0,
        product_category: offerData.product_category || '',
        active: offerData.active ?? true
      };
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }
  
  async updateOffer(offerId: string, offerData: Partial<AdminOffer>): Promise<AdminOffer> {
    try {
      // In a real app, we would update the offer in the database
      console.log(`Updating offer ${offerId}:`, offerData);
      return {
        id: offerId,
        title: offerData.title || offerData.name || '',
        name: offerData.name || offerData.title || '',
        description: offerData.description || '',
        discount_percentage: offerData.discount_percentage || offerData.discount_value || 0,
        discount_type: offerData.discount_type || 'percentage',
        discount_value: offerData.discount_value || 0,
        start_date: offerData.start_date || new Date().toISOString(),
        end_date: offerData.end_date || new Date().toISOString(),
        product_id: offerData.product_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        min_purchase_amount: offerData.min_purchase_amount || 0,
        product_category: offerData.product_category || '',
        active: offerData.active ?? true
      };
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }
  
  async deleteOffer(offerId: string): Promise<boolean> {
    try {
      // In a real app, we would delete the offer from the database
      console.log(`Deleting offer ${offerId}`);
      return true;
    } catch (error) {
      console.error('Error deleting offer:', error);
      return false;
    }
  }

  // Virtual gifts functions
  async getVirtualGifts(): Promise<VirtualGift[]> {
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching virtual gifts:', error);
      return [];
    }
  }
  
  async getGiftUsageStats(): Promise<any> {
    try {
      // Mock data
      return {
        totalGiftsSent: 12450,
        totalCoinsSpent: 87250,
        popularGifts: [
          { id: '1', name: 'Heart', count: 3450, revenue: 3450 },
          { id: '2', name: 'Fire', count: 2850, revenue: 5700 },
          { id: '3', name: 'Diamond', count: 1200, revenue: 12000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching gift usage stats:', error);
      return { totalGiftsSent: 0, totalCoinsSpent: 0, popularGifts: [] };
    }
  }
  
  async createVirtualGift(giftData: Partial<VirtualGift>): Promise<VirtualGift> {
    try {
      const newGift = {
        name: giftData.name || '',
        description: giftData.description || '',
        price: giftData.price || 0,
        value: giftData.value || giftData.price || 0,
        image_url: giftData.imageUrl || giftData.image_url || '',
        color: giftData.color || '#ff0000',
        icon: giftData.icon || 'heart',
        is_premium: giftData.is_premium ?? false,
        category: giftData.category || 'general',
        available: giftData.available ?? true
      };
      
      const { data, error } = await supabase
        .from('virtual_gifts')
        .insert(newGift)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating virtual gift:', error);
      throw error;
    }
  }
  
  async updateVirtualGift(giftId: string, giftData: Partial<VirtualGift>): Promise<VirtualGift> {
    try {
      const updates = {
        ...(giftData.name && { name: giftData.name }),
        ...(giftData.description && { description: giftData.description }),
        ...(giftData.price && { price: giftData.price }),
        ...(giftData.value && { value: giftData.value }),
        ...(giftData.imageUrl && { image_url: giftData.imageUrl }),
        ...(giftData.image_url && { image_url: giftData.image_url }),
        ...(giftData.color && { color: giftData.color }),
        ...(giftData.icon && { icon: giftData.icon }),
        ...(giftData.category && { category: giftData.category }),
        ...(giftData.available !== undefined && { available: giftData.available }),
        ...(giftData.is_premium !== undefined && { is_premium: giftData.is_premium })
      };
      
      const { data, error } = await supabase
        .from('virtual_gifts')
        .update(updates)
        .eq('id', giftId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating virtual gift:', error);
      throw error;
    }
  }
  
  async deleteVirtualGift(giftId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('virtual_gifts')
        .delete()
        .eq('id', giftId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting virtual gift:', error);
      return false;
    }
  }
  
  async toggleGiftAvailability(giftId: string, available: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('virtual_gifts')
        .update({ available })
        .eq('id', giftId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error toggling gift availability:', error);
      return false;
    }
  }

  // Product attributes functions
  async getAttributes(): Promise<ProductAttribute[]> {
    try {
      // Mock data - in a real app, we would fetch from the database
      return [
        {
          id: '1',
          name: 'Size',
          values: ['S', 'M', 'L', 'XL'],
          color: '#4f46e5',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Color',
          values: ['Red', 'Blue', 'Green', 'Black', 'White'],
          color: '#ef4444',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      return [];
    }
  }
  
  async createAttribute(attributeData: Omit<ProductAttribute, 'id' | 'created_at'>): Promise<ProductAttribute> {
    try {
      // In a real app, we would create the attribute in the database
      console.log('Creating attribute:', attributeData);
      return {
        id: Date.now().toString(),
        name: attributeData.name,
        values: attributeData.values,
        color: attributeData.color,
        status: attributeData.status,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating attribute:', error);
      throw error;
    }
  }
  
  async updateAttribute(attributeId: string, attributeData: Partial<ProductAttribute>): Promise<ProductAttribute> {
    try {
      // In a real app, we would update the attribute in the database
      console.log(`Updating attribute ${attributeId}:`, attributeData);
      return {
        id: attributeId,
        name: attributeData.name || '',
        values: attributeData.values || [],
        color: attributeData.color || '',
        status: attributeData.status || 'active',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating attribute:', error);
      throw error;
    }
  }
  
  async deleteAttribute(attributeId: string): Promise<boolean> {
    try {
      // In a real app, we would delete the attribute from the database
      console.log(`Deleting attribute ${attributeId}`);
      return true;
    } catch (error) {
      console.error('Error deleting attribute:', error);
      return false;
    }
  }

  // Order management
  async getOrders(): Promise<AdminOrder[]> {
    try {
      // Mock data - in a real app, we would fetch from the database
      return [
        {
          id: '1',
          user_id: 'user1',
          status: 'processing',
          total_amount: 125.99,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            username: 'john_doe',
            email: 'john@example.com',
            avatar_url: 'https://i.pravatar.cc/150?u=john_doe'
          },
          items: [
            {
              id: 'item1',
              order_id: '1',
              product_id: 'product1',
              quantity: 2,
              unit_price: 49.99,
              product: {
                name: 'T-shirt',
                image_url: 'https://example.com/tshirt.jpg'
              }
            },
            {
              id: 'item2',
              order_id: '1',
              product_id: 'product2',
              quantity: 1,
              unit_price: 26.01,
              product: {
                name: 'Hat',
                image_url: 'https://example.com/hat.jpg'
              }
            }
          ]
        },
        {
          id: '2',
          user_id: 'user2',
          status: 'shipped',
          total_amount: 99.99,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            username: 'jane_doe',
            email: 'jane@example.com',
            avatar_url: 'https://i.pravatar.cc/150?u=jane_doe'
          },
          items: [
            {
              id: 'item3',
              order_id: '2',
              product_id: 'product3',
              quantity: 1,
              unit_price: 99.99,
              product: {
                name: 'Shoes',
                image_url: 'https://example.com/shoes.jpg'
              }
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }
  
  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<boolean> {
    try {
      // In a real app, we would update the order status in the database
      console.log(`Updating order ${orderId} status to ${status}`);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Analytics functions
  async getUserGrowthData(): Promise<any> {
    try {
      // Mock data
      return {
        dailyUsers: [
          { date: '2023-06-01', count: 45 },
          { date: '2023-06-02', count: 52 },
          { date: '2023-06-03', count: 61 },
          { date: '2023-06-04', count: 58 },
          { date: '2023-06-05', count: 65 },
          { date: '2023-06-06', count: 72 },
          { date: '2023-06-07', count: 79 }
        ],
        weeklyGrowth: [
          { week: 'Week 1', count: 324 },
          { week: 'Week 2', count: 367 },
          { week: 'Week 3', count: 412 },
          { week: 'Week 4', count: 459 }
        ],
        monthlyGrowth: [
          { month: 'Jan', count: 1250 },
          { month: 'Feb', count: 1420 },
          { month: 'Mar', count: 1650 },
          { month: 'Apr', count: 1820 },
          { month: 'May', count: 2100 },
          { month: 'Jun', count: 2400 }
        ]
      };
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      return { dailyUsers: [], weeklyGrowth: [], monthlyGrowth: [] };
    }
  }
  
  async getVideoEngagementData(): Promise<any> {
    try {
      // Mock data
      return {
        viewsOverTime: [
          { date: '2023-06-01', count: 5723 },
          { date: '2023-06-02', count: 6214 },
          { date: '2023-06-03', count: 7532 },
          { date: '2023-06-04', count: 6895 },
          { date: '2023-06-05', count: 7212 },
          { date: '2023-06-06', count: 8145 },
          { date: '2023-06-07', count: 8967 }
        ],
        likesOverTime: [
          { date: '2023-06-01', count: 1234 },
          { date: '2023-06-02', count: 1453 },
          { date: '2023-06-03', count: 1876 },
          { date: '2023-06-04', count: 1654 },
          { date: '2023-06-05', count: 1782 },
          { date: '2023-06-06', count: 2145 },
          { date: '2023-06-07', count: 2354 }
        ],
        commentsOverTime: [
          { date: '2023-06-01', count: 423 },
          { date: '2023-06-02', count: 512 },
          { date: '2023-06-03', count: 678 },
          { date: '2023-06-04', count: 587 },
          { date: '2023-06-05', count: 654 },
          { date: '2023-06-06', count: 789 },
          { date: '2023-06-07', count: 867 }
        ]
      };
    } catch (error) {
      console.error('Error fetching video engagement data:', error);
      return { viewsOverTime: [], likesOverTime: [], commentsOverTime: [] };
    }
  }
  
  async getRevenueData(): Promise<any> {
    try {
      // Mock data
      return {
        dailyRevenue: [
          { date: '2023-06-01', revenue: 1234.56 },
          { date: '2023-06-02', revenue: 1543.21 },
          { date: '2023-06-03', revenue: 1876.45 },
          { date: '2023-06-04', revenue: 1435.67 },
          { date: '2023-06-05', revenue: 1698.23 },
          { date: '2023-06-06', revenue: 1987.12 },
          { date: '2023-06-07', revenue: 2145.78 }
        ],
        revenueByCategory: [
          { category: 'Clothing', revenue: 12345.67 },
          { category: 'Electronics', revenue: 23456.78 },
          { category: 'Home', revenue: 9876.54 },
          { category: 'Beauty', revenue: 7654.32 },
          { category: 'Sports', revenue: 5432.10 }
        ],
        revenueByUserType: [
          { type: 'New Users', revenue: 15678.90 },
          { type: 'Returning Users', revenue: 34567.89 }
        ]
      };
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return { dailyRevenue: [], revenueByCategory: [], revenueByUserType: [] };
    }
  }

  async getProductSalesData(): Promise<any> {
    try {
      // Mock data
      return {
        salesByMonth: [
          { month: 'Jan', sales: 1250 },
          { month: 'Feb', sales: 1420 },
          { month: 'Mar', sales: 1650 },
          { month: 'Apr', sales: 1820 },
          { month: 'May', sales: 2100 },
          { month: 'Jun', sales: 2400 }
        ],
        topProducts: [
          { id: '1', name: 'T-shirt', sales: 450, revenue: 13500 },
          { id: '2', name: 'Jeans', sales: 320, revenue: 19200 },
          { id: '3', name: 'Shoes', sales: 280, revenue: 28000 }
        ],
        salesByCategory: [
          { category: 'Clothing', sales: 2400 },
          { category: 'Electronics', sales: 1800 },
          { category: 'Home', sales: 1200 },
          { category: 'Beauty', sales: 900 }
        ]
      };
    } catch (error) {
      console.error('Error fetching product sales data:', error);
      return { salesByMonth: [], topProducts: [], salesByCategory: [] };
    }
  }
  
  async getProductAttributes(): Promise<ProductAttribute[]> {
    return this.getAttributes();
  }
  
  async createProductAttribute(attribute: Omit<ProductAttribute, 'id'>): Promise<ProductAttribute> {
    return this.createAttribute(attribute);
  }
  
  async updateProductAttribute(id: string, attribute: Partial<ProductAttribute>): Promise<ProductAttribute> {
    return this.updateAttribute(id, attribute);
  }
  
  async deleteProductAttribute(id: string): Promise<boolean> {
    return this.deleteAttribute(id);
  }

  // Live stream management
  async getLiveStreams(): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((stream: any) => ({
        id: stream.id,
        user_id: stream.user_id,
        title: stream.title,
        description: stream.description,
        status: stream.status,
        started_at: stream.started_at,
        ended_at: stream.ended_at,
        viewer_count: stream.viewer_count,
        thumbnail_url: stream.thumbnail_url,
        user: stream.profiles,
        username: stream.profiles?.username,
        avatar_url: stream.profiles?.avatar_url,
        durationMinutes: Math.floor((stream.ended_at ? new Date(stream.ended_at) : new Date()).getTime() - new Date(stream.started_at).getTime()) / 60000,
        currentViewers: stream.viewer_count,
        peakViewers: stream.viewer_count,
        endedAt: stream.ended_at,
        giftsReceived: 0,
        revenue: 0
      }));
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }
  }
}

export default new AdminService();
