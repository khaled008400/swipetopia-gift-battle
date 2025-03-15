
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth.types";

// Interface definitions for AdminService
export interface AdminStats {
  users: number;
  videos: number;
  orders: number;
  streamers: number;
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  videoUploadsToday: number;
  totalOrders: number;
  ordersToday: number;
  revenueTotal: number;
  revenueToday: number;
}

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  status: 'active' | 'flagged' | 'removed';
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  image?: string;
  inventory?: number;
  // For seller display
  seller?: {
    username: string;
    avatar_url: string;
  };
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  products: Array<{
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
  }>;
  user: {
    username: string;
    email: string;
  };
}

export interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'ended' | 'scheduled';
  start_time: string;
  end_time?: string;
  ended_at?: string;
  thumbnail_url?: string;
  viewer_count: number;
  max_viewers: number;
  created_at: string;
  updated_at: string;
  channel_name: string;
  user: {
    username: string;
    avatar_url: string;
  };
  stats: {
    currentViewers: number;
    peakViewers: number;
    durationMinutes: number;
    giftsReceived: number;
    topGiftName: string;
    revenue: number;
  };
  durationMinutes: number;
  currentViewers: number;
  giftsReceived: number;
  topGiftName?: string;
  revenue: number;
  peakViewers: number;
  scheduledFor?: string;
  plannedDurationMinutes?: number;
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

export interface AdminCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
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
  type?: 'percentage' | 'fixed';
  value?: number;
}

export interface AdminOffer {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'expired' | 'scheduled';
  products: string[];
  created_at: string;
  updated_at: string;
  min_purchase_amount?: number;
  product_category?: string;
  active?: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value_options: string[];
  color?: string;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  values?: string[];
}

export interface VirtualGift {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  image_type: 'gif' | 'svg';
  has_sound: boolean;
  sound_url?: string;
  category: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  imageUrl?: string;
  imageType?: 'gif' | 'svg';
  hasSound?: boolean;
  soundUrl?: string;
  createdAt?: string;
}

class AdminService {
  // Videos management
  async getVideosList(page = 1, perPage = 10, status = '', search = '', userId = '', date = '') {
    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url, id)
        `)
        .order('created_at', { ascending: false });

      // Add filters
      if (status) query = query.eq('status', status);
      if (userId) query = query.eq('user_id', userId);
      if (search) query = query.ilike('title', `%${search}%`);
      if (date) {
        const dateObj = new Date(date);
        const nextDay = new Date(dateObj);
        nextDay.setDate(dateObj.getDate() + 1);
        
        query = query
          .gte('created_at', dateObj.toISOString())
          .lt('created_at', nextDay.toISOString());
      }

      // Calculate pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      
      // Get the total count
      const { count } = await supabase
        .from('videos')
        .select('id', { count: 'exact', head: true });
        
      // Get the paginated data
      const { data, error } = await query
        .range(from, to);

      if (error) throw error;

      // Transform data to match AdminVideo interface
      const formattedVideos = data.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.video_url,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
        status: video.status || 'active',
        likes: video.likes_count || 0,
        comments: video.comments_count || 0,
        shares: video.shares_count || 0,
        createdAt: video.created_at,
        created_at: video.created_at,
        user: {
          id: video.user_id,
          username: video.profiles?.username || 'Unknown User',
          avatar_url: video.profiles?.avatar_url || '/default-avatar.png'
        }
      }));

      return {
        data: formattedVideos,
        pagination: {
          total: count || 0,
          last_page: Math.ceil((count || 0) / perPage),
          current_page: page
        }
      };
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }

  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed') {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', videoId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error updating video status:", error);
      throw error;
    }
  }

  // Mock implementation of admin functions
  async getDashboardStats() {
    return {
      totalUsers: 1250,
      newUsersToday: 26,
      totalVideos: 4320,
      videoUploadsToday: 78,
      totalOrders: 532,
      ordersToday: 12,
      revenueTotal: 15432.65,
      revenueToday: 422.10,
      users: 1250,
      videos: 4320,
      orders: 532,
      streamers: 143
    };
  }

  async getUserGrowthData() {
    return {
      userGrowth: [
        { date: '2023-01', count: 120 },
        { date: '2023-02', count: 145 },
        { date: '2023-03', count: 210 },
      ],
      demographics: [
        { age: '18-24', count: 320 },
        { age: '25-34', count: 480 },
        { age: '35-44', count: 260 },
      ],
      retention: 72,
      newUsers: 420,
      activeUsers: 950
    };
  }

  async getVideoEngagementData() {
    return {
      viewsByDay: [
        { date: '2023-01-01', count: 1200 },
        { date: '2023-01-02', count: 1350 },
        { date: '2023-01-03', count: 980 },
      ],
      commentsByDay: [
        { date: '2023-01-01', count: 85 },
        { date: '2023-01-02', count: 92 },
        { date: '2023-01-03', count: 78 },
      ],
      likesByDay: [
        { date: '2023-01-01', count: 450 },
        { date: '2023-01-02', count: 510 },
        { date: '2023-01-03', count: 390 },
      ],
      views: 15000,
      interactions: 4200,
      uploads: 320
    };
  }

  async getRevenueData() {
    return {
      revenueByMonth: [
        { month: 'Jan', amount: 4200 },
        { month: 'Feb', amount: 5100 },
        { month: 'Mar', amount: 4800 },
      ],
      revenueByCategory: [
        { category: 'Virtual Gifts', amount: 3200 },
        { category: 'Premium Content', amount: 2800 },
        { category: 'Merchandise', amount: 1900 },
      ],
      projections: [
        { month: 'Apr', amount: 5200 },
        { month: 'May', amount: 5400 },
        { month: 'Jun', amount: 5600 },
      ],
      total: 12500,
      byCategory: [
        { name: 'Virtual Gifts', value: 45 },
        { name: 'Premium Content', value: 30 },
        { name: 'Merchandise', value: 25 },
      ],
      orders: 320,
      aov: 42.5
    };
  }

  async getProductSalesData(timeframe = 'month', category = '') {
    return {
      salesByCategory: [
        { name: 'Electronics', value: 42 },
        { name: 'Clothing', value: 28 },
        { name: 'Home Goods', value: 18 },
        { name: 'Other', value: 12 },
      ],
      topProducts: [
        { id: '1', name: 'Wireless Earbuds', sales: 24, revenue: 1200 },
        { id: '2', name: 'Phone Case', sales: 18, revenue: 450 },
        { id: '3', name: 'Smart Watch', sales: 12, revenue: 2400 },
      ],
      salesTrend: [
        { date: '2023-01-01', sales: 12 },
        { date: '2023-01-02', sales: 8 },
        { date: '2023-01-03', sales: 15 },
      ],
      salesData: [
        { name: 'Jan', value: 42 },
        { name: 'Feb', value: 56 },
        { name: 'Mar', value: 48 },
      ],
      conversionData: [
        { name: 'Views', value: 3200 },
        { name: 'Adds to Cart', value: 520 },
        { name: 'Purchases', value: 180 },
      ],
      revenueData: [
        { name: 'Jan', value: 4200 },
        { name: 'Feb', value: 5600 },
        { name: 'Mar', value: 4800 },
      ],
      channelData: [
        { name: 'Direct', value: 45 },
        { name: 'Social', value: 32 },
        { name: 'Email', value: 18 },
        { name: 'Affiliate', value: 5 },
      ],
      customerData: [
        { name: 'New', value: 65 },
        { name: 'Returning', value: 35 },
      ]
    };
  }

  async getLiveStreams(page = 1, perPage = 10) {
    // Mock implementation
    const streams = [
      {
        id: '1',
        user_id: 'user1',
        title: 'Gaming Stream',
        description: 'Playing the latest games',
        status: 'active',
        start_time: '2023-01-01T12:00:00Z',
        viewer_count: 120,
        max_viewers: 150,
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-01-01T14:00:00Z',
        channel_name: 'gamer123',
        user: {
          username: 'GamerPro',
          avatar_url: 'https://i.pravatar.cc/150?img=1',
        },
        stats: {
          currentViewers: 120,
          peakViewers: 150,
          durationMinutes: 120,
          giftsReceived: 45,
          topGiftName: 'Super Star',
          revenue: 350.5,
        },
        durationMinutes: 120,
        currentViewers: 120,
        giftsReceived: 45,
        topGiftName: 'Super Star',
        revenue: 350.5,
        peakViewers: 150,
        ended_at: null,
        scheduledFor: '2023-01-01T12:00:00Z',
        plannedDurationMinutes: 120
      },
      // ... additional mock data
    ];

    return {
      data: streams,
      pagination: {
        total: streams.length,
        last_page: 1,
        current_page: 1
      }
    };
  }

  async shutdownStream(streamId: string, reason: string) {
    console.log(`Shutting down stream ${streamId} for reason: ${reason}`);
    return { success: true };
  }

  async sendStreamMessage(streamId: string, message: string) {
    console.log(`Sending message to stream ${streamId}: ${message}`);
    return { success: true };
  }

  async getCoupons() {
    // Mock implementation
    const coupons = [
      {
        id: '1',
        code: 'SUMMER25',
        discount_type: 'percentage',
        discount_value: 25,
        minimum_purchase: 50,
        expiry_date: '2023-12-31T23:59:59Z',
        usage_limit: 1000,
        usage_count: 432,
        is_active: true,
        applicable_products: ['prod1', 'prod2'],
        applicable_categories: ['category1'],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      // ... add more mock coupons
    ];

    return {
      data: coupons,
      pagination: {
        total: coupons.length,
        last_page: 1,
        current_page: 1
      }
    };
  }

  async getCouponAnalytics() {
    return {
      usageByDay: [
        { date: '2023-01-01', count: 12 },
        { date: '2023-01-02', count: 8 },
        { date: '2023-01-03', count: 15 },
      ],
      topCoupons: [
        { code: 'SUMMER25', usage_count: 432 },
        { code: 'WELCOME10', usage_count: 328 },
        { code: 'FLASH50', usage_count: 156 },
      ],
      conversionRate: 24.5,
      usage_over_time: [
        { date: '2023-01-01', count: 12 },
        { date: '2023-01-02', count: 8 },
        { date: '2023-01-03', count: 15 },
      ],
      most_used_coupons: [
        { code: 'SUMMER25', usage_count: 432 },
        { code: 'WELCOME10', usage_count: 328 },
        { code: 'FLASH50', usage_count: 156 },
      ],
    };
  }

  async createCoupon(couponData: Omit<AdminCoupon, 'id'>) {
    console.log('Creating coupon with data:', couponData);
    return {
      ...couponData,
      id: 'new-coupon-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateCoupon(id: string, couponData: Partial<Omit<AdminCoupon, 'id'>>) {
    console.log(`Updating coupon ${id} with data:`, couponData);
    return { success: true };
  }

  async deleteCoupon(id: string) {
    console.log(`Deleting coupon ${id}`);
    return { success: true };
  }

  async getOffers() {
    // Mock implementation
    const offers = [
      {
        id: '1',
        name: 'Summer Sale',
        description: 'Get 20% off on summer items',
        discount_type: 'percentage',
        discount_value: 20,
        start_date: '2023-06-01T00:00:00Z',
        end_date: '2023-08-31T23:59:59Z',
        status: 'active',
        products: ['prod1', 'prod2'],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        min_purchase_amount: 50,
        product_category: 'clothing',
        active: true
      },
      // ... add more mock offers
    ];

    return {
      data: offers,
      pagination: {
        total: offers.length,
        last_page: 1,
        current_page: 1
      }
    };
  }

  async getOfferAnalytics() {
    return {
      salesByOffer: [
        { offer: 'Summer Sale', sales: 120, revenue: 3600 },
        { offer: 'Back to School', sales: 85, revenue: 2550 },
        { offer: 'Flash Sale', sales: 45, revenue: 1350 },
      ],
      conversionRate: 22.5,
      totalRevenue: 7500,
      averageOrderValue: 85.5,
      topOffers: [
        { id: '1', name: 'Summer Sale', orders: 120, revenue: 3600, conversionRate: 24.5 },
        { id: '2', name: 'Back to School', orders: 85, revenue: 2550, conversionRate: 18.3 },
        { id: '3', name: 'Flash Sale', orders: 45, revenue: 1350, conversionRate: 12.8 },
      ],
    };
  }

  async createOffer(offerData: Omit<AdminOffer, 'created_at' | 'id' | 'updated_at'>) {
    console.log('Creating offer with data:', offerData);
    return {
      ...offerData,
      id: 'new-offer-id',
      status: 'active',
      products: offerData.products || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateOffer(id: string, offerData: Partial<Omit<AdminOffer, 'created_at' | 'id' | 'updated_at'>>) {
    console.log(`Updating offer ${id} with data:`, offerData);
    return { success: true };
  }

  async deleteOffer(id: string) {
    console.log(`Deleting offer ${id}`);
    return { success: true };
  }

  async getShippingMethods() {
    // Mock implementation
    const methods = [
      {
        id: '1',
        name: 'Standard Shipping',
        description: 'Delivery in 3-5 business days',
        price: 5.99,
        estimated_days: 4,
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      // ... add more mock shipping methods
    ];

    return {
      data: methods,
      pagination: {
        total: methods.length,
        last_page: 1,
        current_page: 1
      }
    };
  }

  async createShippingMethod(methodData: Omit<AdminShippingMethod, 'id'>) {
    console.log('Creating shipping method with data:', methodData);
    return {
      ...methodData,
      id: 'new-method-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateShippingMethod(id: string, methodData: Partial<Omit<AdminShippingMethod, 'id'>>) {
    console.log(`Updating shipping method ${id} with data:`, methodData);
    return { success: true };
  }

  async deleteShippingMethod(id: string) {
    console.log(`Deleting shipping method ${id}`);
    return { success: true };
  }

  async getProductAttributes(category = 'all') {
    // Mock implementation
    const attributes = [
      {
        id: '1',
        name: 'Size',
        value_options: ['Small', 'Medium', 'Large', 'X-Large'],
        color: '#4CAF50',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        values: ['Small', 'Medium', 'Large', 'X-Large'],
      },
      // ... add more mock attributes
    ];

    return {
      data: attributes,
      pagination: {
        total: attributes.length,
        last_page: 1,
        current_page: 1,
        per_page: 10
      }
    };
  }

  async createProductAttribute(attributeData: Omit<ProductAttribute, 'id'>) {
    console.log('Creating product attribute with data:', attributeData);
    return {
      ...attributeData,
      id: 'new-attribute-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateProductAttribute(id: string, attributeData: Partial<ProductAttribute>) {
    console.log(`Updating product attribute ${id} with data:`, attributeData);
    return { success: true };
  }

  async deleteProductAttribute(id: string) {
    console.log(`Deleting product attribute ${id}`);
    return { success: true };
  }

  async getVirtualGifts(page = 1, perPage = 10, category = '') {
    // Mock implementation
    const gifts = [
      {
        id: '1',
        name: 'Super Star',
        description: 'A sparkling super star gift',
        price: 500,
        image_url: 'https://example.com/gifts/star.gif',
        image_type: 'gif',
        has_sound: true,
        sound_url: 'https://example.com/gifts/star.mp3',
        category: 'premium',
        available: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        imageUrl: 'https://example.com/gifts/star.gif',
        imageType: 'gif',
        hasSound: true,
        soundUrl: 'https://example.com/gifts/star.mp3',
        createdAt: '2023-01-01T00:00:00Z'
      },
      // ... add more mock gifts
    ];

    return {
      data: gifts,
      pagination: {
        total: gifts.length,
        last_page: 1,
        current_page: 1
      }
    };
  }

  async getGiftUsageStats(timeframe = 'month') {
    return {
      totalSent: 1250,
      totalRevenue: 45000,
      mostPopular: {
        id: '1',
        name: 'Super Star',
        count: 320
      },
      topStreamers: [
        { username: 'TopStreamer1', giftsReceived: 420, totalValue: 12500, topGift: 'Super Star' },
        { username: 'TopStreamer2', giftsReceived: 350, totalValue: 9800, topGift: 'Diamond' },
        { username: 'TopStreamer3', giftsReceived: 280, totalValue: 7200, topGift: 'Heart' },
      ]
    };
  }

  async createVirtualGift(giftData: Omit<VirtualGift, 'id' | 'created_at' | 'updated_at'>) {
    const formattedData = {
      name: giftData.name,
      description: giftData.description,
      price: giftData.price,
      image_url: giftData.image_url || giftData.imageUrl,
      image_type: giftData.image_type || giftData.imageType,
      has_sound: giftData.has_sound || giftData.hasSound,
      sound_url: giftData.sound_url || giftData.soundUrl,
      category: giftData.category,
      available: giftData.available
    };
    
    console.log('Creating virtual gift with data:', formattedData);
    return {
      ...formattedData,
      id: 'new-gift-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateVirtualGift(id: string, giftData: Partial<VirtualGift>) {
    const formattedData = {
      ...(giftData.name && { name: giftData.name }),
      ...(giftData.description && { description: giftData.description }),
      ...(giftData.price && { price: giftData.price }),
      ...(giftData.image_url || giftData.imageUrl) && { image_url: giftData.image_url || giftData.imageUrl },
      ...(giftData.image_type || giftData.imageType) && { image_type: giftData.image_type || giftData.imageType },
      ...(giftData.has_sound !== undefined || giftData.hasSound !== undefined) && { has_sound: giftData.has_sound || giftData.hasSound },
      ...(giftData.sound_url || giftData.soundUrl) && { sound_url: giftData.sound_url || giftData.soundUrl },
      ...(giftData.category && { category: giftData.category }),
      ...(giftData.available !== undefined && { available: giftData.available })
    };
    
    console.log(`Updating virtual gift ${id} with data:`, formattedData);
    return { success: true };
  }

  async deleteVirtualGift(id: string) {
    console.log(`Deleting virtual gift ${id}`);
    return { success: true };
  }

  async toggleGiftAvailability(id: string, available: boolean) {
    console.log(`Setting virtual gift ${id} availability to ${available}`);
    return { success: true };
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'restricted', reason?: string) {
    console.log(`Updating user ${userId} status to ${status}. Reason: ${reason || 'None'}`);
    return { success: true };
  }

  async sendUserWarning(userId: string, message: string) {
    console.log(`Sending warning to user ${userId}: ${message}`);
    return { success: true };
  }

  async restrictUser(userId: string, restrictions: string[], expiration?: string) {
    console.log(`Restricting user ${userId}. Restrictions: ${restrictions.join(', ')}. Expiration: ${expiration || 'None'}`);
    return { success: true };
  }
}

// Create singleton instance
const adminService = new AdminService();
export default adminService;
