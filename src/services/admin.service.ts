
import { User } from "@/types/auth.types";
import { Video } from "@/types/video.types";

export interface AdminUser extends User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  videosCount: number;
  ordersCount: number;
  reportsCount?: number;
  lastLogin?: string;
  isVerified?: boolean;
}

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  status: 'active' | 'flagged' | 'removed';
  view_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  reports_count: number;
  created_at: string;
  duration: number;
  category: string;
  hashtags: string[];
  user: {
    id: string;
    username: string;
    avatar_url: string;
    email: string;
    status: string;
  };
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: string;
  shipping_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  products: AdminOrderProduct[];
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface AdminOrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product_id: string;
  image_url: string;
}

export interface AdminShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
  is_active: boolean;
  is_default?: boolean;
  created_at: string;
  delivery_time?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  status: 'active' | 'expired' | 'disabled';
  minimum_purchase: number;
  expiry_date: string;
  usage_limit: number;
  usage_count: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  applicable_products: string[];
  applicable_categories: string[];
  discount_percentage: number;
  max_uses: number;
}

export interface AdminOffer {
  id: string;
  title: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage' | 'special';
  discount_percentage: number;
  discount_value: number;
  start_date: string;
  end_date: string;
  min_purchase_amount: number;
  product_category: string;
  product_id: string;
  active: boolean;
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
  imageUrl: string;
  imageType: 'svg' | 'gif';
  hasSound: boolean;
  soundUrl: string;
  category: string;
  available: boolean;
  color: string;
  icon: string;
  is_premium: boolean;
  created_at: string;
}

class AdminService {
  private baseUrl = '/api/admin';

  // User management
  async getUsers(page = 1, perPage = 10, filter = ''): Promise<{ data: AdminUser[], pagination: any }> {
    // Mock implementation - to be replaced with actual API
    return {
      data: Array(10).fill(null).map((_, i) => ({
        id: `user-${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 4 === 0 ? 'admin' : i % 3 === 0 ? 'seller' : 'user',
        status: i % 5 === 0 ? 'suspended' : 'active',
        created_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
        videosCount: Math.floor(Math.random() * 20),
        ordersCount: Math.floor(Math.random() * 10),
        reportsCount: i % 5 === 0 ? Math.floor(Math.random() * 5) : 0,
        lastLogin: new Date(Date.now() - i * 86400000).toISOString(),
        isVerified: i % 3 !== 0,
        phone: `+1234567890${i}`,
        avatar_url: `https://i.pravatar.cc/150?img=${i + 1}`,
        tokens: []
      })),
      pagination: {
        page,
        per_page: perPage,
        total: 95,
        last_page: 10
      }
    };
  }

  async getUser(userId: string): Promise<AdminUser> {
    // Mock implementation
    return {
      id: userId,
      username: `user${userId.split('-')[1]}`,
      email: `user${userId.split('-')[1]}@example.com`,
      role: 'user',
      status: 'active',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      videosCount: Math.floor(Math.random() * 20),
      ordersCount: Math.floor(Math.random() * 10),
      phone: '+1234567890',
      avatar_url: `https://i.pravatar.cc/150?img=${userId.split('-')[1]}`,
      tokens: []
    };
  }

  // Video management
  async getVideosList(
    page = 1, 
    perPage = 10, 
    status = '', 
    search = '', 
    user = '', 
    date = ''
  ): Promise<{ data: AdminVideo[], pagination: any }> {
    // Mock implementation
    return {
      data: Array(10).fill(null).map((_, i) => ({
        id: `video-${i + 1}`,
        title: `Video Title ${i + 1}`,
        description: `This is video description ${i + 1}. #trending #viral`,
        video_url: `https://example.com/videos/${i + 1}.mp4`,
        thumbnail_url: `https://example.com/thumbnails/${i + 1}.jpg`,
        user_id: `user-${(i % 4) + 1}`,
        status: i % 5 === 0 ? 'flagged' : i % 7 === 0 ? 'removed' : 'active',
        view_count: Math.floor(Math.random() * 10000),
        likes_count: Math.floor(Math.random() * 500),
        comments_count: Math.floor(Math.random() * 100),
        shares_count: Math.floor(Math.random() * 50),
        reports_count: i % 5 === 0 ? Math.floor(Math.random() * 10) : 0,
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        duration: Math.floor(Math.random() * 60) + 10,
        category: ['dance', 'comedy', 'food', 'sports', 'music'][i % 5],
        hashtags: ['trending', 'viral', 'fyp'],
        user: {
          id: `user-${(i % 4) + 1}`,
          username: `user${(i % 4) + 1}`,
          avatar_url: `https://i.pravatar.cc/150?img=${(i % 4) + 1}`,
          email: `user${(i % 4) + 1}@example.com`,
          status: 'active'
        }
      })),
      pagination: {
        page,
        per_page: perPage,
        total: 84,
        last_page: 9
      }
    };
  }

  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed'): Promise<AdminVideo> {
    // Mock implementation
    return {
      id: videoId,
      title: `Video Title ${videoId.split('-')[1]}`,
      description: 'This is a sample description',
      video_url: `https://example.com/videos/${videoId.split('-')[1]}.mp4`,
      thumbnail_url: `https://example.com/thumbnails/${videoId.split('-')[1]}.jpg`,
      user_id: 'user-1',
      status,
      view_count: 1000,
      likes_count: 500,
      comments_count: 100,
      shares_count: 50,
      reports_count: 0,
      created_at: new Date().toISOString(),
      duration: 30,
      category: 'dance',
      hashtags: ['trending', 'viral'],
      user: {
        id: 'user-1',
        username: 'user1',
        avatar_url: 'https://i.pravatar.cc/150?img=1',
        email: 'user1@example.com',
        status: 'active'
      }
    };
  }

  async deleteVideo(videoId: string): Promise<void> {
    // Mock implementation
    console.log(`Video ${videoId} deleted`);
  }

  async sendUserWarning(userId: string, message: string, videoId?: string): Promise<void> {
    // Mock implementation
    console.log(`Warning sent to user ${userId} regarding video ${videoId}: ${message}`);
  }

  async restrictUser(userId: string, reason: string): Promise<void> {
    // Mock implementation
    console.log(`User ${userId} restricted for reason: ${reason}`);
  }

  // Order management
  async getOrders(page = 1, statusFilter = ''): Promise<AdminOrder[]> {
    // Mock implementation
    return {
      data: Array(10).fill(null).map((_, i) => ({
        id: `order-${i + 1}`,
        user_id: `user-${(i % 4) + 1}`,
        status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5] as any,
        total: Math.floor(Math.random() * 200) + 20,
        shipping_address: '123 Main St, City, Country',
        shipping_method: 'Standard Shipping',
        tracking_number: i % 3 === 0 ? `TRK${100000 + i}` : undefined,
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        updated_at: new Date(Date.now() - i * 43200000).toISOString(),
        products: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, j) => ({
          id: `product-${j + 1}`,
          name: `Product ${j + 1}`,
          price: Math.floor(Math.random() * 50) + 10,
          quantity: Math.floor(Math.random() * 3) + 1,
          product_id: `prod-${j + 1}`,
          image_url: `https://picsum.photos/200/300?random=${i * 3 + j}`
        })),
        user: {
          id: `user-${(i % 4) + 1}`,
          username: `user${(i % 4) + 1}`,
          email: `user${(i % 4) + 1}@example.com`
        }
      })),
      pagination: {
        page,
        per_page: 10,
        total: 58,
        last_page: 6
      }
    };
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<void> {
    // Mock implementation
    console.log(`Order ${orderId} status updated to ${status}`);
  }

  // Shipping methods
  async getShippingMethods(): Promise<AdminShippingMethod[]> {
    // Mock implementation
    return [
      {
        id: 'shipping-1',
        name: 'Standard Shipping',
        description: 'Regular mail delivery',
        price: 5.99,
        estimated_days: '3-5 business days',
        is_active: true,
        is_default: true,
        created_at: new Date().toISOString(),
        delivery_time: '3-5 days'
      },
      {
        id: 'shipping-2',
        name: 'Express Shipping',
        description: 'Fast delivery',
        price: 14.99,
        estimated_days: '1-2 business days',
        is_active: true,
        created_at: new Date().toISOString(),
        delivery_time: '1-2 days'
      },
      {
        id: 'shipping-3',
        name: 'Same Day Delivery',
        description: 'Delivered on the same day',
        price: 24.99,
        estimated_days: 'Same day',
        is_active: false,
        created_at: new Date().toISOString(),
        delivery_time: 'Same day'
      }
    ];
  }

  async createShippingMethod(data: Omit<AdminShippingMethod, 'id'>): Promise<AdminShippingMethod> {
    // Mock implementation
    return {
      id: `shipping-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString()
    };
  }

  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, 'id'>>): Promise<AdminShippingMethod> {
    // Mock implementation
    return {
      id,
      name: data.name || 'Updated Shipping Method',
      description: data.description || 'Updated description',
      price: data.price || 9.99,
      estimated_days: data.estimated_days || '3-5 business days',
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString(),
      delivery_time: data.delivery_time || '3-5 days',
      is_default: data.is_default || false
    };
  }

  async deleteShippingMethod(id: string): Promise<void> {
    // Mock implementation
    console.log(`Shipping method ${id} deleted`);
  }

  // Analytics data 
  async getUserGrowthData(period: 'week' | 'month' | 'year'): Promise<any> {
    // Mock implementation
    const dataPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    
    return {
      newUsers: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 20
      })),
      activeUsers: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 1000) + 200
      }))
    };
  }

  async getVideoEngagementData(period: 'week' | 'month' | 'year'): Promise<any> {
    // Mock implementation
    const dataPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    
    return {
      views: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5000) + 1000
      })),
      interactions: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        likes: Math.floor(Math.random() * 2000) + 500,
        comments: Math.floor(Math.random() * 500) + 100
      })),
      uploads: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      }))
    };
  }

  async getRevenueData(period: 'week' | 'month' | 'year'): Promise<any> {
    // Mock implementation
    const dataPoints = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    
    return {
      total: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 10000) + 2000
      })),
      byCategory: [
        { category: 'Electronics', amount: Math.floor(Math.random() * 5000) + 1000 },
        { category: 'Clothing', amount: Math.floor(Math.random() * 4000) + 800 },
        { category: 'Home & Garden', amount: Math.floor(Math.random() * 3000) + 600 },
        { category: 'Beauty', amount: Math.floor(Math.random() * 2500) + 500 },
        { category: 'Sports', amount: Math.floor(Math.random() * 2000) + 400 }
      ],
      orders: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 20
      })),
      aov: Array(dataPoints).fill(null).map((_, i) => ({
        date: period === 'year' 
          ? `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`
          : new Date(Date.now() - (dataPoints - i) * 86400000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50
      }))
    };
  }
}

export default new AdminService();
