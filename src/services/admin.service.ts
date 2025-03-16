// Extend this file with additional admin service functions
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth.types';

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
  discount_type?: string;
  discount_value?: number;
  start_date: string;
  end_date: string;
  product_id: string;
  created_at: string;
  updated_at: string;
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
        ordersCount: 0
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

  // Mock methods to satisfy type definitions and prevent TypeScript errors
  async getVideos() { return []; }
  async getCoupons() { return []; }
  async createCoupon() { return {}; }
  async updateVideo() { return {}; }
  async getVideoById() { return {}; }
  async deleteVideo() { return {}; }
  async getReportedVideos() { return []; }
  async getShippingMethods() { return []; }
  async createShipping() { return {}; }
  async getVirtualGifts() { return []; }
  async createVirtualGift() { return {}; }
  async updateVirtualGift() { return {}; }
  async deleteVirtualGift() { return {}; }
  async getOffers() { return []; }
  async createOffer() { return {}; }
  async updateOffer() { return {}; }
  async deleteOffer() { return {}; }
  async getAttributes() { return []; }
  async createAttribute() { return {}; }
  async updateAttribute() { return {}; }
  async deleteAttribute() { return {}; }
  async getProductStats() { return {}; }
}

export default new AdminService();
