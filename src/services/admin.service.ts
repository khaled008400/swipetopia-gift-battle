
import { adminApi } from './api';

// Types
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

export type UserRole = 'admin' | 'user' | 'seller' | 'streamer' | 'viewer';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  coins: number;
  roles?: string[];
  // Fields used in components but not in the actual API response
  videosCount?: number;
  ordersCount?: number;
  // For backward compatibility
  createdAt?: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  // For compatibility with components
  total?: number;
  createdAt?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
  user?: {
    username: string;
    email: string;
  };
  items?: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    product?: AdminProduct;
  }>;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  suction_score?: number;
  // For compatibility with components
  image?: string;
  inventory?: number;
}

export interface AdminVideo {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  view_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  status?: 'active' | 'under_review' | 'flagged' | 'removed';
  url?: string; // For compatibility
  user: {
    username: string;
    email: string;
    avatar_url?: string;
    id?: string; // Added for compatibility
  };
}

export interface AdminCoupon {
  id: string;
  code: string;
  discount_percentage: number;
  expiry_date: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
  updated_at?: string;
  status: 'active' | 'expired' | 'disabled';
  // For compatibility with components
  type?: 'percentage' | 'fixed' | 'special';
  value?: number;
  minimum_purchase?: number;
  usage_limit?: number;
  is_active?: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  usage_count?: number;
}

export interface AdminOffer {
  id: string;
  title: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product_id: string;
  created_at: string;
  updated_at?: string;
  product?: AdminProduct;
  // For compatibility with components
  name?: string;
  description?: string;
  discount_type?: 'percentage' | 'fixed' | 'special';
  discount_value?: number;
  min_purchase_amount?: number;
  product_category?: string;
  active?: boolean;
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  is_default: boolean;
  created_at: string;
  // For compatibility with components
  description?: string;
  estimated_days?: string;
  is_active?: boolean;
}

export interface LiveStream {
  id: string;
  title: string;
  user_id: string;
  started_at: string;
  viewer_count: number;
  username: string;
  avatar_url?: string;
  // For compatibility with components
  user?: {
    username: string;
    id: string;
    avatar_url?: string;
  };
  durationMinutes?: number;
  currentViewers?: number;
  giftsReceived?: number;
  topGiftName?: string;
  revenue?: number;
  endedAt?: string;
  peakViewers?: number;
  scheduledFor?: string;
  plannedDurationMinutes?: number;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  value: number;
  image_url?: string;
  is_premium: boolean;
  available: boolean;
  created_at: string;
  category?: string;
  has_sound?: boolean;
  // For compatibility with components
  description?: string;
  imageUrl?: string; // Alias for image_url
  imageType?: string;
  hasSound?: boolean; // Alias for has_sound
  soundUrl?: string;
  createdAt?: string; // Alias for created_at
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
  created_at: string;
  // For compatibility with components
  color?: string;
  status?: string;
}

// Mock data for development mode
const mockStats: AdminStats = {
  totalUsers: 12543,
  newUsersToday: 72,
  totalVideos: 45280,
  videoUploadsToday: 142,
  totalOrders: 8753,
  ordersToday: 53,
  revenueTotal: 392150,
  revenueToday: 2750
};

// Admin Service with error handling
const AdminService = {
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await adminApi.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // In development, return mock data
      if (import.meta.env.DEV) {
        console.log('Using mock admin stats for development');
        return mockStats;
      }
      throw error;
    }
  },
  
  async getUsers(page = 1, per_page = 10, filters = {}) {
    try {
      const response = await adminApi.get('/users', {
        params: { page, per_page, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return mock users in development
      if (import.meta.env.DEV) {
        const mockUsers = Array(10).fill(null).map((_, i) => ({
          id: `user-${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          avatar_url: `https://i.pravatar.cc/150?u=user${i + 1}`,
          role: i % 5 === 0 ? 'admin' : 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          coins: Math.floor(Math.random() * 1000),
          videosCount: Math.floor(Math.random() * 50),
          ordersCount: Math.floor(Math.random() * 20)
        }));
        
        return {
          data: mockUsers,
          meta: { total: 120, page, per_page }
        };
      }
      throw error;
    }
  },
  
  async getUser(userId: string) {
    try {
      const response = await adminApi.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      if (import.meta.env.DEV) {
        return {
          id: userId,
          username: 'testuser',
          email: 'testuser@example.com',
          avatar_url: 'https://i.pravatar.cc/150?u=testuser',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          coins: 500,
          videosCount: 25,
          ordersCount: 10
        };
      }
      throw error;
    }
  },
  
  async getOrders(page = 1, statusFilter = '') {
    try {
      const params = { page, status: statusFilter };
      const response = await adminApi.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (import.meta.env.DEV) {
        const mockOrders = Array(10).fill(null).map((_, i) => ({
          id: `order-${i + 1}`,
          user_id: `user-${i + 1}`,
          status: ['pending', 'completed', 'cancelled'][i % 3],
          total_amount: Math.floor(Math.random() * 300) + 20,
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          updated_at: new Date(Date.now() - i * 86400000).toISOString(),
          // Alias for components
          total: Math.floor(Math.random() * 300) + 20,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          user: { username: `user${i + 1}`, email: `user${i + 1}@example.com` },
          products: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, j) => ({
            id: `product-${j + 1}`,
            name: `Test Product ${j + 1}`,
            price: Math.floor(Math.random() * 100) + 10,
            quantity: Math.floor(Math.random() * 3) + 1,
            image_url: 'https://example.com/product.jpg'
          }))
        }));
        
        return {
          data: mockOrders,
          pagination: { total: 200, page, last_page: 20, current_page: page }
        };
      }
      throw error;
    }
  },
  
  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled') {
    try {
      const response = await adminApi.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'pending') {
    try {
      const response = await adminApi.patch(`/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} status:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async updateUserRole(userId: string, role: UserRole) {
    try {
      const response = await adminApi.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} role:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async getVideosList(page = 1, filters = {}) {
    try {
      const response = await adminApi.get('/videos', { 
        params: { page, ...filters } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      if (import.meta.env.DEV) {
        const mockVideos = Array(10).fill(null).map((_, i) => ({
          id: `video-${i + 1}`,
          title: `Test Video ${i + 1}`,
          description: `Description for test video ${i + 1}`,
          user_id: `user-${i % 5 + 1}`,
          video_url: 'https://example.com/video.mp4',
          thumbnail_url: 'https://example.com/thumbnail.jpg',
          view_count: Math.floor(Math.random() * 10000),
          likes_count: Math.floor(Math.random() * 1000),
          comments_count: Math.floor(Math.random() * 100),
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          status: 'active',
          url: 'https://example.com/video.mp4', // Alias for components
          user: {
            id: `user-${i % 5 + 1}`,
            username: `user${i % 5 + 1}`,
            email: `user${i % 5 + 1}@example.com`,
            avatar_url: `https://i.pravatar.cc/150?u=user${i % 5 + 1}`
          }
        }));
        
        return {
          data: mockVideos,
          meta: { total: 150, page }
        };
      }
      throw error;
    }
  },
  
  async updateVideoStatus(videoId: string, status: 'active' | 'under_review' | 'flagged' | 'removed') {
    try {
      const response = await adminApi.patch(`/videos/${videoId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating video ${videoId} status:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async deleteVideo(videoId: string) {
    try {
      const response = await adminApi.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting video ${videoId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async sendUserWarning(userId: string, reason: string) {
    try {
      const response = await adminApi.post(`/users/${userId}/warning`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error sending warning to user ${userId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async restrictUser(userId: string, reason: string) {
    try {
      const response = await adminApi.post(`/users/${userId}/restrict`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error restricting user ${userId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Virtual Gifts Admin Methods
  async getVirtualGifts() {
    try {
      const response = await adminApi.get('/virtual-gifts');
      return response.data;
    } catch (error) {
      console.error('Error fetching virtual gifts:', error);
      if (import.meta.env.DEV) {
        return Array(10).fill(null).map((_, i) => ({
          id: `gift-${i + 1}`,
          name: `Gift ${i + 1}`,
          icon: ['heart', 'star', 'diamond', 'crown', 'flame'][i % 5],
          color: ['#FF5555', '#55AAFF', '#FFAA55', '#55FF55', '#AA55FF'][i % 5],
          price: (i + 1) * 50,
          value: (i + 1) * 10,
          image_url: i % 2 === 0 ? 'https://example.com/gift.png' : null,
          is_premium: i % 3 === 0,
          available: true,
          created_at: new Date().toISOString(),
          category: ['love', 'luxury', 'fun', 'support', 'special'][i % 5],
          has_sound: i % 2 === 0,
          // For compatibility with components
          description: `Description for Gift ${i + 1}`,
          imageUrl: i % 2 === 0 ? 'https://example.com/gift.png' : null,
          imageType: i % 3 === 0 ? 'animated' : 'static',
          hasSound: i % 2 === 0,
          soundUrl: i % 2 === 0 ? 'https://example.com/sound.mp3' : null,
          createdAt: new Date().toISOString()
        }));
      }
      throw error;
    }
  },
  
  async getGiftUsageStats() {
    try {
      const response = await adminApi.get('/virtual-gifts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching gift usage stats:', error);
      if (import.meta.env.DEV) {
        return {
          totalGifts: 5432,
          totalValue: 123450,
          popularGifts: [
            { name: 'Diamond', count: 1234, value: 61700 },
            { name: 'Heart', count: 2345, value: 23450 },
            { name: 'Star', count: 987, value: 19740 }
          ],
          dailyStats: Array(7).fill(null).map((_, i) => ({
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 500),
            value: Math.floor(Math.random() * 25000)
          }))
        };
      }
      throw error;
    }
  },
  
  async createVirtualGift(gift: Omit<VirtualGift, 'id' | 'created_at'>) {
    try {
      const response = await adminApi.post('/virtual-gifts', gift);
      return response.data;
    } catch (error) {
      console.error('Error creating virtual gift:', error);
      if (import.meta.env.DEV) {
        return { 
          ...gift, 
          id: `gift-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async updateVirtualGift(id: string, gift: Partial<VirtualGift>) {
    try {
      const response = await adminApi.patch(`/virtual-gifts/${id}`, gift);
      return response.data;
    } catch (error) {
      console.error(`Error updating virtual gift ${id}:`, error);
      if (import.meta.env.DEV) {
        return { ...gift, id };
      }
      throw error;
    }
  },
  
  async deleteVirtualGift(id: string) {
    try {
      const response = await adminApi.delete(`/virtual-gifts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting virtual gift ${id}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async toggleGiftAvailability(id: string, available: boolean) {
    try {
      const response = await adminApi.patch(`/virtual-gifts/${id}/availability`, { available });
      return response.data;
    } catch (error) {
      console.error(`Error toggling gift ${id} availability:`, error);
      if (import.meta.env.DEV) {
        return { id, available };
      }
      throw error;
    }
  },
  
  // Coupon methods
  async getCoupons() {
    try {
      const response = await adminApi.get('/coupons');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      if (import.meta.env.DEV) {
        return Array(8).fill(null).map((_, i) => ({
          id: `coupon-${i + 1}`,
          code: `CODE${i + 1}`,
          discount_percentage: Math.floor(Math.random() * 50) + 5,
          expiry_date: new Date(Date.now() + (i + 1) * 86400000 * 30).toISOString(),
          max_uses: (i + 1) * 50,
          current_uses: Math.floor(Math.random() * (i + 1) * 25),
          created_at: new Date(Date.now() - i * 86400000 * 10).toISOString(),
          updated_at: new Date(Date.now() - i * 86400000 * 5).toISOString(),
          status: ['active', 'active', 'expired', 'disabled'][i % 4],
          // For compatibility with components
          type: ['percentage', 'fixed', 'special'][i % 3],
          value: Math.floor(Math.random() * 50) + 5,
          minimum_purchase: i % 2 === 0 ? 20 : 0,
          usage_limit: (i + 1) * 50,
          usage_count: Math.floor(Math.random() * (i + 1) * 25),
          is_active: i % 4 !== 3, // active if not disabled
          applicable_products: i % 3 === 0 ? ['product-1', 'product-2'] : [],
          applicable_categories: i % 4 === 0 ? ['category-1', 'category-2'] : []
        }));
      }
      throw error;
    }
  },
  
  async getCouponAnalytics() {
    try {
      const response = await adminApi.get('/coupons/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      if (import.meta.env.DEV) {
        return {
          totalCoupons: 45,
          activeCoupons: 28,
          totalRedeemed: 1234,
          totalDiscount: 12340,
          popularCoupons: [
            { code: 'WELCOME20', uses: 345, discount: 3450 },
            { code: 'SUMMER30', uses: 234, discount: 4680 },
            { code: 'FLASH50', uses: 123, discount: 3690 }
          ]
        };
      }
      throw error;
    }
  },
  
  async createCoupon(coupon: Omit<AdminCoupon, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) {
    try {
      const response = await adminApi.post('/coupons', coupon);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      if (import.meta.env.DEV) {
        return {
          ...coupon,
          id: `coupon-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          current_uses: 0,
          usage_count: 0
        };
      }
      throw error;
    }
  },
  
  async updateCoupon(id: string, coupon: Partial<AdminCoupon>) {
    try {
      const response = await adminApi.patch(`/coupons/${id}`, coupon);
      return response.data;
    } catch (error) {
      console.error(`Error updating coupon ${id}:`, error);
      if (import.meta.env.DEV) {
        return { 
          ...coupon, 
          id,
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async deleteCoupon(id: string) {
    try {
      const response = await adminApi.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting coupon ${id}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Shipping methods
  async getShippingMethods() {
    try {
      const response = await adminApi.get('/shipping');
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      if (import.meta.env.DEV) {
        return Array(5).fill(null).map((_, i) => ({
          id: `shipping-${i + 1}`,
          name: ['Standard', 'Express', 'Next Day', 'Economy', 'International'][i],
          price: [5.99, 9.99, 14.99, 3.99, 19.99][i],
          delivery_time: ['3-5 days', '2-3 days', '1 day', '5-7 days', '7-14 days'][i],
          is_default: i === 0,
          created_at: new Date().toISOString(),
          // For compatibility with components
          description: [`Regular shipping with tracking`, `Faster delivery within 2-3 days`, `Next business day delivery`, `Budget-friendly option`, `International shipping with tracking`][i],
          estimated_days: ['3-5', '2-3', '1', '5-7', '7-14'][i],
          is_active: true
        }));
      }
      throw error;
    }
  },
  
  async createShippingMethod(method: Omit<AdminShippingMethod, 'id' | 'created_at'>) {
    try {
      const response = await adminApi.post('/shipping', method);
      return response.data;
    } catch (error) {
      console.error('Error creating shipping method:', error);
      if (import.meta.env.DEV) {
        return {
          ...method,
          id: `shipping-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async updateShippingMethod(id: string, method: Partial<AdminShippingMethod>) {
    try {
      const response = await adminApi.patch(`/shipping/${id}`, method);
      return response.data;
    } catch (error) {
      console.error(`Error updating shipping method ${id}:`, error);
      if (import.meta.env.DEV) {
        return { ...method, id };
      }
      throw error;
    }
  },
  
  async deleteShippingMethod(id: string) {
    try {
      const response = await adminApi.delete(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting shipping method ${id}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Product attributes
  async getProductAttributes() {
    try {
      const response = await adminApi.get('/product-attributes');
      return response.data;
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      if (import.meta.env.DEV) {
        return Array(5).fill(null).map((_, i) => ({
          id: `attr-${i + 1}`,
          name: ['Size', 'Color', 'Material', 'Style', 'Weight'][i],
          values: [
            ['S', 'M', 'L', 'XL', 'XXL'],
            ['Red', 'Blue', 'Green', 'Black', 'White'],
            ['Cotton', 'Polyester', 'Wool', 'Leather', 'Silk'],
            ['Casual', 'Formal', 'Sport', 'Vintage', 'Modern'],
            ['Light', 'Medium', 'Heavy']
          ][i],
          created_at: new Date().toISOString(),
          // For compatibility with components
          color: ['#f87171', '#60a5fa', '#4ade80', '#000000', '#f3f4f6'][i],
          status: 'active'
        }));
      }
      throw error;
    }
  },
  
  async createProductAttribute(attribute: Omit<ProductAttribute, 'id' | 'created_at'>) {
    try {
      const response = await adminApi.post('/product-attributes', attribute);
      return response.data;
    } catch (error) {
      console.error('Error creating product attribute:', error);
      if (import.meta.env.DEV) {
        return {
          ...attribute,
          id: `attr-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async updateProductAttribute(id: string, attribute: Partial<ProductAttribute>) {
    try {
      const response = await adminApi.patch(`/product-attributes/${id}`, attribute);
      return response.data;
    } catch (error) {
      console.error(`Error updating product attribute ${id}:`, error);
      if (import.meta.env.DEV) {
        return { ...attribute, id };
      }
      throw error;
    }
  },
  
  async deleteProductAttribute(id: string) {
    try {
      const response = await adminApi.delete(`/product-attributes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product attribute ${id}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Special offers
  async getOffers() {
    try {
      const response = await adminApi.get('/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      if (import.meta.env.DEV) {
        return Array(6).fill(null).map((_, i) => ({
          id: `offer-${i + 1}`,
          title: `Special Offer ${i + 1}`,
          discount_percentage: Math.floor(Math.random() * 40) + 10,
          start_date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
          end_date: new Date(Date.now() + (7 - i) * 86400000 * 3).toISOString(),
          product_id: `product-${i + 1}`,
          created_at: new Date(Date.now() - i * 86400000 * 5).toISOString(),
          product: {
            id: `product-${i + 1}`,
            name: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 100) + 20,
            image_url: 'https://example.com/product.jpg'
          },
          // For compatibility with components
          name: `Special Offer ${i + 1}`,
          description: `Limited time offer for Product ${i + 1}`,
          discount_type: ['percentage', 'fixed', 'special'][i % 3],
          discount_value: Math.floor(Math.random() * 40) + 10,
          min_purchase_amount: i % 2 === 0 ? 50 : 0,
          product_category: ['clothing', 'electronics', 'home', 'beauty', 'toys', 'sports'][i % 6],
          active: i < 4 // First 4 are active
        }));
      }
      throw error;
    }
  },
  
  async getOfferAnalytics() {
    try {
      const response = await adminApi.get('/offers/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      if (import.meta.env.DEV) {
        return {
          totalOffers: 24,
          activeOffers: 12,
          totalSales: 345,
          totalRevenue: 34500,
          bestPerforming: [
            { title: 'Summer Sale', sales: 120, revenue: 12000 },
            { title: 'Flash Deal', sales: 87, revenue: 8700 },
            { title: 'Weekend Special', sales: 65, revenue: 6500 }
          ]
        };
      }
      throw error;
    }
  },
  
  async createOffer(offer: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const response = await adminApi.post('/offers', offer);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      if (import.meta.env.DEV) {
        return {
          ...offer,
          id: `offer-${Math.floor(Math.random() * 1000)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async updateOffer(id: string, offer: Partial<AdminOffer>) {
    try {
      const response = await adminApi.patch(`/offers/${id}`, offer);
      return response.data;
    } catch (error) {
      console.error(`Error updating offer ${id}:`, error);
      if (import.meta.env.DEV) {
        return { 
          ...offer, 
          id,
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  
  async deleteOffer(id: string) {
    try {
      const response = await adminApi.delete(`/offers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting offer ${id}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Live streams
  async getLiveStreams() {
    try {
      const response = await adminApi.get('/live-streams');
      return response.data;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      if (import.meta.env.DEV) {
        return Array(5).fill(null).map((_, i) => ({
          id: `stream-${i + 1}`,
          title: `Live Stream ${i + 1}`,
          user_id: `user-${i + 1}`,
          started_at: new Date(Date.now() - i * 1800000).toISOString(),
          viewer_count: Math.floor(Math.random() * 500),
          username: `streamer${i + 1}`,
          avatar_url: `https://i.pravatar.cc/150?u=streamer${i + 1}`,
          // For compatibility with components
          user: {
            id: `user-${i + 1}`,
            username: `streamer${i + 1}`,
            avatar_url: `https://i.pravatar.cc/150?u=streamer${i + 1}`
          },
          durationMinutes: Math.floor(Math.random() * 60) + 15,
          currentViewers: Math.floor(Math.random() * 500),
          giftsReceived: Math.floor(Math.random() * 100),
          topGiftName: ['Diamond', 'Heart', 'Star'][i % 3],
          revenue: Math.floor(Math.random() * 1000),
          endedAt: i % 2 === 0 ? new Date(Date.now() - i * 900000).toISOString() : null,
          peakViewers: Math.floor(Math.random() * 800),
          scheduledFor: i >= 3 ? new Date(Date.now() + i * 3600000).toISOString() : null,
          plannedDurationMinutes: Math.floor(Math.random() * 90) + 30
        }));
      }
      throw error;
    }
  },
  
  async shutdownStream(streamId: string, reason: string) {
    try {
      const response = await adminApi.post(`/live-streams/${streamId}/shutdown`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error shutting down stream ${streamId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  async sendStreamMessage(streamId: string, message: string) {
    try {
      const response = await adminApi.post(`/live-streams/${streamId}/message`, { message });
      return response.data;
    } catch (error) {
      console.error(`Error sending message to stream ${streamId}:`, error);
      if (import.meta.env.DEV) {
        return { success: true };
      }
      throw error;
    }
  },
  
  // Reports
  async getUserGrowthData() {
    try {
      const response = await adminApi.get('/reports/user-growth');
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      if (import.meta.env.DEV) {
        const dates = Array(30).fill(null).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });
        
        return {
          totalUsers: 12543,
          newUsersThisMonth: 783,
          retentionRate: 78.5,
          growthRate: 6.7,
          dailySignups: dates.map(date => ({
            date,
            count: Math.floor(Math.random() * 50) + 10
          }))
        };
      }
      throw error;
    }
  },
  
  async getVideoEngagementData() {
    try {
      const response = await adminApi.get('/reports/video-engagement');
      return response.data;
    } catch (error) {
      console.error('Error fetching video engagement data:', error);
      if (import.meta.env.DEV) {
        return {
          totalVideos: 45280,
          totalViews: 12345678,
          totalLikes: 4567890,
          totalComments: 1234567,
          avgEngagementRate: 12.3,
          topCategories: [
            { name: 'Entertainment', count: 12500, views: 3456789 },
            { name: 'Fashion', count: 8700, views: 2345678 },
            { name: 'Music', count: 6500, views: 1987654 }
          ],
          dailyViews: Array(30).fill(null).map((_, i) => ({
            date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 100000) + 50000
          }))
        };
      }
      throw error;
    }
  },
  
  async getRevenueData() {
    try {
      const response = await adminApi.get('/reports/revenue');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      if (import.meta.env.DEV) {
        return {
          totalRevenue: 392150,
          monthlyRevenue: 42750,
          avgOrderValue: 45.23,
          revenueGrowth: 8.5,
          revenueSources: [
            { source: 'Product Sales', amount: 287500, percentage: 73.3 },
            { source: 'In-app Purchases', amount: 78430, percentage: 20.0 },
            { source: 'Subscriptions', amount: 26220, percentage: 6.7 }
          ],
          monthlyData: Array(12).fill(null).map((_, i) => ({
            month: new Date(Date.now() - (11 - i) * 30 * 86400000).toLocaleString('default', { month: 'short' }),
            revenue: Math.floor(Math.random() * 50000) + 20000
          }))
        };
      }
      throw error;
    }
  },
  
  async getProductSalesData(productId: string) {
    try {
      const response = await adminApi.get(`/reports/product-sales/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product sales data for ${productId}:`, error);
      if (import.meta.env.DEV) {
        return {
          product: {
            id: productId,
            name: 'Sample Product',
            price: 49.99,
            category: 'Electronics'
          },
          totalSales: 345,
          totalRevenue: 17246.55,
          avgRating: 4.3,
          monthlySales: Array(12).fill(null).map((_, i) => ({
            month: new Date(Date.now() - (11 - i) * 30 * 86400000).toLocaleString('default', { month: 'short' }),
            sales: Math.floor(Math.random() * 50) + 10,
            revenue: (Math.floor(Math.random() * 50) + 10) * 49.99
          }))
        };
      }
      throw error;
    }
  }
};

export type { Product, LimitedOffer, LiveSeller } from './shop.service';
export default AdminService;
