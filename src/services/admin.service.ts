
import { adminApi } from './api';

// User related interfaces
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'suspended';
  role: UserRole;
  createdAt: string;
  lastActive: string;
  videoCount: number;
  followerCount: number;
}

export type UserRole = 'user' | 'moderator' | 'admin';

// Video related interfaces
export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  status: 'active' | 'under_review' | 'removed';
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

// Product related interfaces
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inventory: number;
  category: string;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
}

// Order related interfaces
export interface AdminOrder {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

// Shipping related interfaces
export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  is_active?: boolean;
}

// Coupon related interfaces
export interface AdminCoupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_uses?: number;
  times_used: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

// Offer related interfaces
export interface AdminOffer {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'special';
  discount_value: number;
  min_purchase_amount?: number;
  product_category?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

// Virtual Gift related interfaces
export interface VirtualGift {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  imageType: 'gif' | 'svg';
  hasSound: boolean;
  soundUrl?: string;
  category: string;
  available: boolean;
  createdAt: string;
}

// Product Attribute related interfaces
export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
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

export interface LiveStream {
  id: string;
  title: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  durationMinutes: number;
  currentViewers: number;
  giftsReceived: number;
  topGiftName: string;
  revenue: number;
  peakViewers: number;
  endedAt: string;
  scheduledFor: string;
  plannedDurationMinutes: number;
}

export interface StreamAPISettings {
  appID: string;
  serverSecret: string;
}

class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await adminApi.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      
      // Return mock data for development/demo
      return {
        totalUsers: 1250,
        newUsersToday: 25,
        totalVideos: 3500,
        videoUploadsToday: 120,
        totalOrders: 850,
        ordersToday: 32,
        revenueTotal: 24500,
        revenueToday: 1250
      };
    }
  }

  // User related methods
  async getUsersList(page: number = 1, limit: number = 10, search: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/users?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users list:', error);
      // Return mock data
      return {
        data: Array(10).fill(null).map((_, i) => ({
          id: `user-${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
          status: i % 5 === 0 ? 'suspended' : 'active',
          role: i % 7 === 0 ? 'admin' : i % 3 === 0 ? 'moderator' : 'user',
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          lastActive: new Date(Date.now() - Math.random() * 1000000).toISOString(),
          videoCount: Math.floor(Math.random() * 50),
          followerCount: Math.floor(Math.random() * 10000)
        })),
        pagination: {
          total: 100,
          per_page: limit,
          current_page: page,
          last_page: 10
        }
      };
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    try {
      await adminApi.patch(`/users/${userId}/status`, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      await adminApi.patch(`/users/${userId}/role`, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<AdminUser> {
    try {
      const response = await adminApi.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Return mock data
      return {
        id: userId,
        username: `user${userId}`,
        email: `user${userId}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        status: 'active',
        role: 'user',
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 1000000).toISOString(),
        videoCount: Math.floor(Math.random() * 50),
        followerCount: Math.floor(Math.random() * 10000)
      };
    }
  }

  // Video related methods
  async getVideosList(page: number = 1, filter: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/videos?page=${page}&filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos list:', error);
      // Return mock data
      return {
        data: Array(10).fill(null).map((_, i) => ({
          id: `video-${i + 1}`,
          title: `Video Title ${i + 1}`,
          description: `Description for video ${i + 1}. This is a sample video description.`,
          thumbnailUrl: `https://picsum.photos/seed/${i + 1}/300/200`,
          videoUrl: 'https://example.com/video.mp4',
          duration: Math.floor(Math.random() * 180) + 10,
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          status: i % 5 === 0 ? 'under_review' : i % 7 === 0 ? 'removed' : 'active',
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          user: {
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`
          }
        })),
        pagination: {
          total: 100,
          per_page: 10,
          current_page: page,
          last_page: 10
        }
      };
    }
  }

  async updateVideoStatus(videoId: string, status: 'active' | 'under_review' | 'removed'): Promise<void> {
    try {
      await adminApi.patch(`/videos/${videoId}/status`, { status });
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    try {
      await adminApi.delete(`/videos/${videoId}`);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  async sendUserWarning(userId: string, message: string, videoId?: string): Promise<void> {
    try {
      await adminApi.post(`/users/${userId}/warnings`, { message, videoId });
    } catch (error) {
      console.error('Error sending user warning:', error);
      throw error;
    }
  }

  async restrictUser(userId: string, duration: number, reason: string): Promise<void> {
    try {
      await adminApi.post(`/users/${userId}/restrict`, { duration, reason });
    } catch (error) {
      console.error('Error restricting user:', error);
      throw error;
    }
  }

  // Live stream related methods
  async getLiveStreams(type: string = 'current', query: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/live-streams?type=${type}&query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      
      // Return mock data for development/demo
      return {
        data: Array(5).fill(null).map((_, i) => ({
          id: `stream-${i + 1}`,
          title: `Live Stream ${i + 1}`,
          user: {
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`
          },
          durationMinutes: Math.floor(Math.random() * 120) + 10,
          currentViewers: Math.floor(Math.random() * 500) + 50,
          giftsReceived: Math.floor(Math.random() * 200),
          topGiftName: ['Diamond', 'Crown', 'Heart', 'Star', 'Rocket'][Math.floor(Math.random() * 5)],
          revenue: Math.random() * 500 + 50,
          peakViewers: Math.floor(Math.random() * 1000) + 100,
          endedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          scheduledFor: new Date(Date.now() + Math.random() * 86400000 * 7).toISOString(),
          plannedDurationMinutes: Math.floor(Math.random() * 120) + 30
        })),
        stats: {
          activeCount: 5,
          totalViewers: 1250,
          totalGiftRevenue: 850.75
        }
      };
    }
  }
  
  async shutdownStream(streamId: string, reason: string): Promise<void> {
    try {
      await adminApi.post(`/live-streams/${streamId}/shutdown`, { reason });
    } catch (error) {
      console.error('Error shutting down stream:', error);
      throw error;
    }
  }
  
  async sendStreamMessage(streamId: string, message: string): Promise<void> {
    try {
      await adminApi.post(`/live-streams/${streamId}/message`, { message });
    } catch (error) {
      console.error('Error sending stream message:', error);
      throw error;
    }
  }

  async getStreamAPISettings(): Promise<StreamAPISettings> {
    try {
      const response = await adminApi.get('/stream-api/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching stream API settings:', error);
      // Return empty settings if not found
      return { appID: '', serverSecret: '' };
    }
  }

  async saveStreamAPISettings(appID: string, serverSecret: string): Promise<void> {
    try {
      await adminApi.post('/stream-api/settings', { appID, serverSecret });
    } catch (error) {
      console.error('Error saving stream API settings:', error);
      throw error;
    }
  }

  async testStreamAPIConnection(appID: string, serverSecret: string): Promise<boolean> {
    try {
      const response = await adminApi.post('/stream-api/test-connection', { appID, serverSecret });
      return response.data.success;
    } catch (error) {
      console.error('Error testing stream API connection:', error);
      throw error;
    }
  }

  // Products related methods
  async getProducts(page: number = 1, categoryFilter: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/products?page=${page}&category=${categoryFilter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data
      return {
        data: Array(10).fill(null).map((_, i) => ({
          id: `product-${i + 1}`,
          name: `Product ${i + 1}`,
          description: `Description for product ${i + 1}`,
          price: Math.floor(Math.random() * 100) + 10,
          image: `https://picsum.photos/seed/product${i}/300/300`,
          inventory: Math.floor(Math.random() * 100),
          category: ['clothing', 'accessories', 'digital'][Math.floor(Math.random() * 3)],
          status: ['active', 'draft', 'out_of_stock'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 1000000).toISOString()
        })),
        pagination: {
          total: 100,
          per_page: 10,
          current_page: page,
          last_page: 10
        }
      };
    }
  }

  async createProduct(productData: Omit<AdminProduct, 'id'>): Promise<AdminProduct> {
    try {
      const response = await adminApi.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      // Return mock created product
      return {
        id: `product-${Date.now()}`,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  async updateProduct(productId: string, productData: Partial<AdminProduct>): Promise<AdminProduct> {
    try {
      const response = await adminApi.patch(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await adminApi.delete(`/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getProductSalesData(productId: string, period: string): Promise<any> {
    try {
      const response = await adminApi.get(`/products/${productId}/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product sales data:', error);
      // Return mock data
      const dates = Array(period === 'week' ? 7 : period === 'month' ? 30 : 12)
        .fill(null)
        .map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return period === 'year' 
            ? date.toLocaleString('default', { month: 'short' }) 
            : date.toLocaleDateString();
        })
        .reverse();

      return {
        salesData: dates.map(date => ({
          date,
          units: Math.floor(Math.random() * 50) + 1,
        })),
        revenueData: dates.map(date => ({
          date,
          amount: Math.floor(Math.random() * 1000) + 100,
        })),
        conversionData: dates.map(date => ({
          date,
          rate: Math.floor(Math.random() * 30) + 5,
        })),
        channelData: [
          { name: 'Website', value: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'App', value: Math.floor(Math.random() * 3000) + 500 },
          { name: 'Live Stream', value: Math.floor(Math.random() * 2000) + 300 },
        ],
        customerData: dates.map(date => ({
          date,
          new: Math.floor(Math.random() * 20) + 1,
          returning: Math.floor(Math.random() * 30) + 5,
        })),
      };
    }
  }

  // Product attributes
  async getProductAttributes(): Promise<ProductAttribute[]> {
    try {
      const response = await adminApi.get('/product-attributes');
      return response.data;
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      // Return mock data
      return [
        { id: 'attr-1', name: 'Size', values: ['Small', 'Medium', 'Large', 'X-Large'] },
        { id: 'attr-2', name: 'Color', values: ['Red', 'Blue', 'Green', 'Black', 'White'] },
        { id: 'attr-3', name: 'Material', values: ['Cotton', 'Polyester', 'Wool', 'Silk'] }
      ];
    }
  }

  async createProductAttribute(data: Omit<ProductAttribute, 'id'>): Promise<ProductAttribute> {
    try {
      const response = await adminApi.post('/product-attributes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product attribute:', error);
      // Return mock created attribute
      return {
        id: `attr-${Date.now()}`,
        ...data
      };
    }
  }

  async updateProductAttribute(id: string, data: Partial<Omit<ProductAttribute, 'id'>>): Promise<ProductAttribute> {
    try {
      const response = await adminApi.patch(`/product-attributes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product attribute:', error);
      throw error;
    }
  }

  async deleteProductAttribute(id: string): Promise<void> {
    try {
      await adminApi.delete(`/product-attributes/${id}`);
    } catch (error) {
      console.error('Error deleting product attribute:', error);
      throw error;
    }
  }

  // Orders related methods
  async getOrders(page: number = 1, statusFilter: string = ''): Promise<any> {
    try {
      const response = await adminApi.get(`/orders?page=${page}&status=${statusFilter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return mock data
      return {
        data: Array(10).fill(null).map((_, i) => ({
          id: `order-${i + 1}`,
          user: {
            id: `user-${i + 1}`,
            username: `user${i + 1}`,
            email: `user${i + 1}@example.com`
          },
          products: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, j) => ({
            id: `product-${j + 1}`,
            name: `Product ${j + 1}`,
            price: Math.floor(Math.random() * 100) + 10,
            quantity: Math.floor(Math.random() * 3) + 1
          })),
          total: Math.floor(Math.random() * 300) + 20,
          status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        })),
        pagination: {
          total: 100,
          per_page: 10,
          current_page: page,
          last_page: 10
        }
      };
    }
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    try {
      await adminApi.patch(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Shipping methods
  async getShippingMethods(): Promise<AdminShippingMethod[]> {
    try {
      const response = await adminApi.get('/shipping-methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      // Return mock data
      return [
        { id: '1', name: 'Standard Shipping', description: 'Regular mail delivery', price: 4.99, estimated_days: '3-5 business days', is_active: true },
        { id: '2', name: 'Express Shipping', description: 'Expedited delivery', price: 12.99, estimated_days: '1-2 business days', is_active: true },
        { id: '3', name: 'Same-day Delivery', description: 'Delivery within 24 hours', price: 19.99, estimated_days: 'Same day', is_active: false }
      ];
    }
  }

  async createShippingMethod(data: Omit<AdminShippingMethod, 'id'>): Promise<AdminShippingMethod> {
    try {
      const response = await adminApi.post('/shipping-methods', data);
      return response.data;
    } catch (error) {
      console.error('Error creating shipping method:', error);
      // Return mock created shipping method
      return {
        id: `ship-${Date.now()}`,
        ...data
      };
    }
  }

  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, 'id'>>): Promise<AdminShippingMethod> {
    try {
      const response = await adminApi.patch(`/shipping-methods/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating shipping method:', error);
      throw error;
    }
  }

  async deleteShippingMethod(id: string): Promise<void> {
    try {
      await adminApi.delete(`/shipping-methods/${id}`);
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      throw error;
    }
  }

  // Coupons related methods
  async getCoupons(): Promise<AdminCoupon[]> {
    try {
      const response = await adminApi.get('/coupons');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      // Return mock data
      return Array(5).fill(null).map((_, i) => ({
        id: `coupon-${i + 1}`,
        code: `SAVE${i + 1}${i + 5}`,
        description: `${i + 10}% off your order`,
        discount_type: i % 2 === 0 ? 'percentage' : 'fixed',
        discount_value: i % 2 === 0 ? 10 + i * 5 : 5 + i * 2,
        min_purchase_amount: i % 3 === 0 ? 50 : 0,
        max_uses: i % 2 === 0 ? 100 : null,
        times_used: Math.floor(Math.random() * 50),
        start_date: new Date(Date.now() - 86400000 * 10).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 20).toISOString(),
        active: i !== 2
      }));
    }
  }

  async getCouponAnalytics(): Promise<any> {
    try {
      const response = await adminApi.get('/coupons/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon analytics:', error);
      // Return mock data
      return {
        totalUsageCount: 875,
        totalRevenueImpact: 4350.25,
        averageOrderValue: 78.50,
        topCoupons: [
          { id: 'coupon-1', code: 'SAVE25', uses: 125, revenue: 1875.50 },
          { id: 'coupon-2', code: 'FREESHIP', uses: 98, revenue: 980.25 },
          { id: 'coupon-3', code: 'WELCOME15', uses: 87, revenue: 652.75 }
        ]
      };
    }
  }

  async createCoupon(data: Omit<AdminCoupon, 'id' | 'times_used'>): Promise<AdminCoupon> {
    try {
      const response = await adminApi.post('/coupons', data);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      // Return mock created coupon
      return {
        id: `coupon-${Date.now()}`,
        ...data,
        times_used: 0
      };
    }
  }

  async updateCoupon(id: string, data: Partial<Omit<AdminCoupon, 'id' | 'times_used'>>): Promise<AdminCoupon> {
    try {
      const response = await adminApi.patch(`/coupons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  async deleteCoupon(id: string): Promise<void> {
    try {
      await adminApi.delete(`/coupons/${id}`);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  // Offers related methods
  async getOffers(): Promise<AdminOffer[]> {
    try {
      const response = await adminApi.get('/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Return mock data
      return Array(5).fill(null).map((_, i) => ({
        id: `offer-${i + 1}`,
        name: `${['Summer', 'Winter', 'Spring', 'Holiday', 'Flash'][i]} Sale`,
        description: `Special offer for ${['summer', 'winter', 'spring', 'holiday', 'limited time'][i]}`,
        discount_type: ['percentage', 'fixed', 'special'][i % 3],
        discount_value: 10 + i * 5,
        min_purchase_amount: i % 2 === 0 ? 50 : undefined,
        product_category: i % 3 === 0 ? 'clothing' : undefined,
        start_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 25).toISOString(),
        active: i !== 3
      }));
    }
  }

  async getOfferAnalytics(): Promise<any> {
    try {
      const response = await adminApi.get('/offers/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching offer analytics:', error);
      // Return mock data
      return {
        totalRevenue: 8750.50,
        conversionRate: 23.5,
        averageOrderValue: 92.75,
        topOffers: [
          { id: 'offer-1', name: 'Summer Sale', orders: 145, revenue: 3625.50, conversionRate: 28.7 },
          { id: 'offer-2', name: 'Holiday Special', orders: 98, revenue: 2450.25, conversionRate: 22.3 },
          { id: 'offer-3', name: 'Flash Sale', orders: 67, revenue: 1675.75, conversionRate: 19.5 }
        ]
      };
    }
  }

  async createOffer(data: Omit<AdminOffer, 'id'>): Promise<AdminOffer> {
    try {
      const response = await adminApi.post('/offers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      // Return mock created offer
      return {
        id: `offer-${Date.now()}`,
        ...data
      };
    }
  }

  async updateOffer(id: string, data: Partial<Omit<AdminOffer, 'id'>>): Promise<AdminOffer> {
    try {
      const response = await adminApi.patch(`/offers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }

  async deleteOffer(id: string): Promise<void> {
    try {
      await adminApi.delete(`/offers/${id}`);
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }

  // Virtual gifts
  async getVirtualGifts(): Promise<VirtualGift[]> {
    try {
      const response = await adminApi.get('/virtual-gifts');
      return response.data;
    } catch (error) {
      console.error('Error fetching virtual gifts:', error);
      // Return mock data
      return Array(8).fill(null).map((_, i) => ({
        id: `gift-${i + 1}`,
        name: ['Diamond', 'Crown', 'Heart', 'Star', 'Rocket', 'Rose', 'Trophy', 'Cake'][i],
        description: `A beautiful virtual ${['Diamond', 'Crown', 'Heart', 'Star', 'Rocket', 'Rose', 'Trophy', 'Cake'][i]} gift`,
        price: [100, 500, 50, 75, 200, 30, 300, 150][i],
        imageUrl: `https://example.com/gifts/${['diamond', 'crown', 'heart', 'star', 'rocket', 'rose', 'trophy', 'cake'][i]}.${i % 2 === 0 ? 'gif' : 'svg'}`,
        imageType: i % 2 === 0 ? 'gif' : 'svg',
        hasSound: i % 3 === 0,
        soundUrl: i % 3 === 0 ? `https://example.com/sounds/${['diamond', 'crown', 'heart', 'star', 'rocket', 'rose', 'trophy', 'cake'][i]}.mp3` : undefined,
        category: ['luxury', 'luxury', 'general', 'celebration', 'celebration', 'cute', 'luxury', 'celebration'][i],
        available: i !== 2,
        createdAt: new Date(Date.now() - 86400000 * (10 + i)).toISOString()
      }));
    }
  }

  async createVirtualGift(data: Omit<VirtualGift, 'id' | 'createdAt'>): Promise<VirtualGift> {
    try {
      const response = await adminApi.post('/virtual-gifts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating virtual gift:', error);
      // Return mock created gift
      return {
        id: `gift-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
    }
  }

  async updateVirtualGift(id: string, data: Partial<Omit<VirtualGift, 'id' | 'createdAt'>>): Promise<VirtualGift> {
    try {
      const response = await adminApi.patch(`/virtual-gifts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating virtual gift:', error);
      throw error;
    }
  }

  async deleteVirtualGift(id: string): Promise<void> {
    try {
      await adminApi.delete(`/virtual-gifts/${id}`);
    } catch (error) {
      console.error('Error deleting virtual gift:', error);
      throw error;
    }
  }

  async toggleGiftAvailability(id: string, available: boolean): Promise<VirtualGift> {
    try {
      const response = await adminApi.patch(`/virtual-gifts/${id}/toggle-availability`, { available });
      return response.data;
    } catch (error) {
      console.error('Error toggling gift availability:', error);
      throw error;
    }
  }

  // Analytics data
  async getUserGrowthData(period: 'week' | 'month' | 'year'): Promise<any> {
    try {
      const response = await adminApi.get(`/analytics/user-growth?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      
      // Mock data based on period
      const numPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
      const format = period === 'year' ? (d: Date) => d.toLocaleString('default', { month: 'short' }) : (d: Date) => d.toLocaleDateString();
      
      const dates = Array(numPoints).fill(null).map((_, i) => {
        const date = new Date();
        if (period === 'year') {
          date.setMonth(date.getMonth() - (numPoints - 1 - i));
        } else {
          date.setDate(date.getDate() - (numPoints - 1 - i));
        }
        return format(date);
      });
      
      return {
        newUsers: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 100) + 10
        })),
        activeUsers: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 500) + 100
        }))
      };
    }
  }

  async getVideoEngagementData(period: 'week' | 'month' | 'year'): Promise<any> {
    try {
      const response = await adminApi.get(`/analytics/video-engagement?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video engagement data:', error);
      
      // Mock data based on period
      const numPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
      const format = period === 'year' ? (d: Date) => d.toLocaleString('default', { month: 'short' }) : (d: Date) => d.toLocaleDateString();
      
      const dates = Array(numPoints).fill(null).map((_, i) => {
        const date = new Date();
        if (period === 'year') {
          date.setMonth(date.getMonth() - (numPoints - 1 - i));
        } else {
          date.setDate(date.getDate() - (numPoints - 1 - i));
        }
        return format(date);
      });
      
      return {
        views: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 10000) + 1000
        })),
        interactions: dates.map(date => ({
          date,
          likes: Math.floor(Math.random() * 5000) + 500,
          comments: Math.floor(Math.random() * 1000) + 100
        })),
        uploads: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 200) + 20
        }))
      };
    }
  }

  async getRevenueData(period: 'week' | 'month' | 'year'): Promise<any> {
    try {
      const response = await adminApi.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      
      // Mock data based on period
      const numPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
      const format = period === 'year' ? (d: Date) => d.toLocaleString('default', { month: 'short' }) : (d: Date) => d.toLocaleDateString();
      
      const dates = Array(numPoints).fill(null).map((_, i) => {
        const date = new Date();
        if (period === 'year') {
          date.setMonth(date.getMonth() - (numPoints - 1 - i));
        } else {
          date.setDate(date.getDate() - (numPoints - 1 - i));
        }
        return format(date);
      });
      
      return {
        total: dates.map(date => ({
          date,
          amount: Math.floor(Math.random() * 5000) + 500
        })),
        byCategory: [
          { category: 'Clothing', amount: Math.floor(Math.random() * 8000) + 1000 },
          { category: 'Accessories', amount: Math.floor(Math.random() * 6000) + 800 },
          { category: 'Digital', amount: Math.floor(Math.random() * 4000) + 600 },
          { category: 'Gifts', amount: Math.floor(Math.random() * 3000) + 400 }
        ],
        orders: dates.map(date => ({
          date,
          count: Math.floor(Math.random() * 50) + 5
        })),
        aov: dates.map(date => ({
          date,
          value: Math.floor(Math.random() * 100) + 50
        }))
      };
    }
  }
}

export default new AdminService();
