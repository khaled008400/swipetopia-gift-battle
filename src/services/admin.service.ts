
import { UserRole, User } from '@/types/auth.types';
import { Video } from "@/types/video.types";
import { LiveStream } from "@/types/video.types";

// Define AdminUser here but don't import it
export interface AdminUser {
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
  phone?: string;
  avatar_url?: string;
  tokens?: any[];
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

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  inventory_count: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  discount?: number;
  rating?: number;
  reviews_count?: number;
}

class AdminService {
  private baseUrl = '/api/admin';

  async getUsers(page = 1, perPage = 10, filter = ''): Promise<{ data: AdminUser[], pagination: any }> {
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

  async getVideosList(
    page = 1, 
    perPage = 10, 
    status = '', 
    search = '', 
    user = '', 
    date = ''
  ): Promise<{ data: AdminVideo[], pagination: any }> {
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
    console.log(`Video ${videoId} deleted`);
  }

  async sendUserWarning(userId: string, message: string, videoId?: string): Promise<void> {
    console.log(`Warning sent to user ${userId} regarding video ${videoId}: ${message}`);
  }

  async restrictUser(userId: string, reason: string): Promise<void> {
    console.log(`User ${userId} restricted for reason: ${reason}`);
  }

  async banUser(userId: string, reason: string): Promise<void> {
    console.log(`User ${userId} banned for reason: ${reason}`);
  }

  async getOrders(page = 1, statusFilter = ''): Promise<{ data: AdminOrder[], pagination: any }> {
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
    console.log(`Order ${orderId} status updated to ${status}`);
  }

  async getShippingMethods(): Promise<AdminShippingMethod[]> {
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
    return {
      id: `shipping-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString()
    };
  }

  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, 'id'>>): Promise<AdminShippingMethod> {
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
    console.log(`Shipping method ${id} deleted`);
  }

  async getDashboardStats(): Promise<AdminStats> {
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
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    return Array(5).fill(null).map((_, i) => ({
      id: `stream-${i + 1}`,
      title: `Live Stream ${i + 1}`,
      user_id: `user-${i + 1}`,
      started_at: new Date(Date.now() - i * 3600000).toISOString(),
      viewer_count: Math.floor(Math.random() * 100) + 10,
      currentViewers: Math.floor(Math.random() * 100) + 10,
      username: `user${i + 1}`,
      avatar_url: `https://i.pravatar.cc/150?img=${i + 1}`,
      status: 'live',
      user: {
        username: `user${i + 1}`,
        avatar_url: `https://i.pravatar.cc/150?img=${i + 1}`
      }
    }));
  }

  async shutdownStream(streamId: string, reason: string): Promise<void> {
    console.log(`Stream ${streamId} shutdown for reason: ${reason}`);
  }

  async sendStreamMessage(streamId: string, message: string): Promise<void> {
    console.log(`Message sent to stream ${streamId}: ${message}`);
  }

  async getCoupons(): Promise<AdminCoupon[]> {
    return Array(3).fill(null).map((_, i) => ({
      id: `coupon-${i + 1}`,
      code: `COUPON${i + 1}`,
      type: i % 2 === 0 ? 'percentage' : 'fixed' as 'percentage' | 'fixed',
      value: i % 2 === 0 ? 15 + i * 5 : 10 + i * 5,
      status: 'active' as 'active' | 'expired' | 'disabled',
      minimum_purchase: i * 50,
      expiry_date: new Date(Date.now() + 30 * 86400000).toISOString(),
      usage_limit: 100,
      usage_count: Math.floor(Math.random() * 50),
      current_uses: Math.floor(Math.random() * 50),
      is_active: true,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 43200000).toISOString(),
      applicable_products: [],
      applicable_categories: [],
      discount_percentage: i % 2 === 0 ? 15 + i * 5 : 0,
      max_uses: 100
    }));
  }

  async getCouponAnalytics(): Promise<any> {
    return {
      usage_over_time: Array(10).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 30) + 5
      })),
      most_used_coupons: Array(5).fill(null).map((_, i) => ({
        code: `COUPON${i + 1}`,
        usage_count: Math.floor(Math.random() * 100) + 20
      }))
    };
  }

  async createCoupon(data: Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>): Promise<AdminCoupon> {
    return {
      id: `coupon-${Date.now()}`,
      ...data,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async updateCoupon(id: string, data: Partial<Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>>): Promise<AdminCoupon> {
    const existingCoupon = (await this.getCoupons()).find(coupon => coupon.id === id);
    if (!existingCoupon) throw new Error('Coupon not found');
    
    return {
      id,
      code: data.code || 'UPDATED',
      type: data.type || 'percentage',
      value: data.value !== undefined ? data.value : 10,
      status: data.status || 'active',
      minimum_purchase: data.minimum_purchase || 0,
      expiry_date: data.expiry_date || new Date(Date.now() + 30 * 86400000).toISOString(),
      usage_limit: data.usage_limit || 100,
      usage_count: 0,
      current_uses: 0,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      applicable_products: data.applicable_products || [],
      applicable_categories: data.applicable_categories || [],
      discount_percentage: data.type === 'percentage' ? data.value : 0,
      max_uses: data.usage_limit || 100
    };
  }

  async deleteCoupon(id: string): Promise<void> {
    console.log(`Coupon ${id} deleted`);
  }

  async getOffers(): Promise<AdminOffer[]> {
    return Array(3).fill(null).map((_, i) => ({
      id: `offer-${i + 1}`,
      title: `Offer ${i + 1}`,
      name: `Offer ${i + 1}`,
      description: `Description for offer ${i + 1}`,
      discount_type: i % 3 === 0 ? 'fixed' : i % 3 === 1 ? 'percentage' : 'special' as 'fixed' | 'percentage' | 'special',
      discount_percentage: i % 3 === 1 ? 15 + i * 5 : 0,
      discount_value: i % 3 === 0 ? 10 + i * 5 : i % 3 === 1 ? 0 : 1,
      start_date: new Date(Date.now() - i * 86400000).toISOString(),
      end_date: new Date(Date.now() + (30 - i) * 86400000).toISOString(),
      min_purchase_amount: i * 50,
      product_category: i % 2 === 0 ? 'electronics' : 'clothing',
      product_id: `product-${i + 1}`,
      active: true,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      updated_at: new Date(Date.now() - i * 43200000).toISOString()
    }));
  }

  async getOfferAnalytics(): Promise<any> {
    return {
      totalRevenue: 12540.75,
      conversionRate: 23.5,
      averageOrderValue: 87.65,
      topOffers: Array(3).fill(null).map((_, i) => ({
        id: `offer-${i + 1}`,
        name: `Offer ${i + 1}`,
        orders: Math.floor(Math.random() * 100) + 20,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        conversionRate: Math.floor(Math.random() * 30) + 10
      }))
    };
  }

  async createOffer(offerData: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>): Promise<AdminOffer> {
    return {
      id: `offer-${Date.now()}`,
      ...offerData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async updateOffer(id: string, data: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>>): Promise<AdminOffer> {
    const existingOffer = (await this.getOffers()).find(offer => offer.id === id);
    if (!existingOffer) throw new Error('Offer not found');
    
    return {
      ...existingOffer,
      ...data,
      updated_at: new Date().toISOString()
    };
  }

  async deleteOffer(id: string): Promise<void> {
    console.log(`Offer ${id} deleted`);
  }

  async getVirtualGifts(): Promise<VirtualGift[]> {
    return Array(5).fill(null).map((_, i) => ({
      id: `gift-${i + 1}`,
      name: `Gift ${i + 1}`,
      description: `Description for gift ${i + 1}`,
      price: 10 + i * 5,
      value: 50 + i * 25,
      imageUrl: `https://example.com/gifts/${i + 1}.png`,
      imageType: i % 2 === 0 ? 'svg' : 'gif' as 'svg' | 'gif',
      hasSound: i % 3 === 0,
      soundUrl: i % 3 === 0 ? `https://example.com/sounds/${i + 1}.mp3` : '',
      category: i % 2 === 0 ? 'premium' : 'standard',
      available: true,
      color: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'][i],
      icon: ['gift', 'heart', 'star', 'diamond', 'crown'][i],
      is_premium: i % 2 === 0,
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
  }

  async getGiftUsageStats(): Promise<any> {
    return {
      totalUsage: 12540,
      byGift: Array(5).fill(null).map((_, i) => ({
        id: `gift-${i + 1}`,
        name: `Gift ${i + 1}`,
        usageCount: Math.floor(Math.random() * 5000) + 1000,
        revenue: Math.floor(Math.random() * 10000) + 2000
      })),
      byDay: Array(7).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 500) + 100
      }))
    };
  }

  async createVirtualGift(giftData: any): Promise<VirtualGift> {
    return {
      id: `gift-${Date.now()}`,
      ...giftData,
      created_at: new Date().toISOString()
    };
  }

  async updateVirtualGift(id: string, data: any): Promise<VirtualGift> {
    return {
      id,
      ...data,
      created_at: new Date().toISOString()
    };
  }

  async deleteVirtualGift(id: string): Promise<void> {
    console.log(`Virtual gift ${id} deleted`);
  }

  async toggleGiftAvailability(id: string, available: boolean): Promise<VirtualGift> {
    const gifts = await this.getVirtualGifts();
    const gift = gifts.find(g => g.id === id);
    if (!gift) throw new Error('Gift not found');
    
    return {
      ...gift,
      available
    };
  }

  async getProductAttributes(): Promise<ProductAttribute[]> {
    return Array(3).fill(null).map((_, i) => ({
      id: `attr-${i + 1}`,
      name: ['Color', 'Size', 'Material'][i],
      values: i === 0 
        ? ['Red', 'Blue', 'Green', 'Black', 'White'] 
        : i === 1 
        ? ['XS', 'S', 'M', 'L', 'XL'] 
        : ['Cotton', 'Polyester', 'Wool', 'Silk'],
      color: i === 0 ? '#FF5733' : i === 1 ? '#33FF57' : '#3357FF',
      status: 'active' as 'active' | 'inactive',
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
  }

  async createProductAttribute(attributeData: Omit<ProductAttribute, 'id'> & { created_at: string }): Promise<ProductAttribute> {
    return {
      id: `attr-${Date.now()}`,
      ...attributeData
    };
  }

  async updateProductAttribute(id: string, data: Partial<ProductAttribute>): Promise<ProductAttribute> {
    const attributes = await this.getProductAttributes();
    const attribute = attributes.find(a => a.id === id);
    if (!attribute) throw new Error('Attribute not found');
    
    return {
      ...attribute,
      ...data
    };
  }

  async deleteProductAttribute(id: string): Promise<void> {
    console.log(`Product attribute ${id} deleted`);
  }

  async getProductSalesData(): Promise<any> {
    return {
      salesByProduct: Array(5).fill(null).map((_, i) => ({
        id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        sales: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 10000) + 2000
      })),
      salesByCategory: Array(4).fill(null).map((_, i) => ({
        category: ['Electronics', 'Clothing', 'Home & Garden', 'Beauty'][i],
        sales: Math.floor(Math.random() * 1000) + 200,
        revenue: Math.floor(Math.random() * 20000) + 5000
      })),
      salesByDay: Array(7).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: Math.floor(Math.random() * 5000) + 1000
      }))
    };
  }
}

export default new AdminService();
