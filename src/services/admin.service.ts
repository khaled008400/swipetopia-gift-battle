
import { supabase } from "@/lib/supabase";
import {
  AdminStats,
  AdminOrder,
  AdminCoupon,
  AdminOffer,
  AdminVideo,
  AdminShippingMethod,
  VirtualGift,
  ProductAttribute,
  LiveStream,
  AdminUser,
} from "@/services/streaming/stream.types";

// Re-export types for use in components
export type {
  AdminStats,
  AdminOrder,
  AdminCoupon,
  AdminOffer,
  AdminVideo,
  AdminShippingMethod,
  VirtualGift,
  ProductAttribute,
  LiveStream,
  AdminUser,
};

// Base admin service
class AdminService {
  // Stats methods
  async getDashboardStats(): Promise<AdminStats> {
    // Mock implementation for now
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
  
  // Coupon methods
  async getCoupons(): Promise<AdminCoupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getCouponAnalytics(): Promise<any> {
    // Placeholder for real implementation
    return {
      usage_over_time: [
        { date: '2023-01-01', count: 5 },
        { date: '2023-02-01', count: 12 },
        { date: '2023-03-01', count: 8 },
        { date: '2023-04-01', count: 15 },
      ],
      most_used_coupons: [
        { code: 'SUMMER25', usage_count: 89 },
        { code: 'WELCOME10', usage_count: 64 },
        { code: 'FLASH50', usage_count: 32 },
        { code: 'HOLIDAY20', usage_count: 28 },
        { code: 'APP15', usage_count: 17 },
      ]
    };
  }

  async createCoupon(coupon: Omit<AdminCoupon, "id" | "usage_count" | "created_at" | "updated_at">): Promise<AdminCoupon> {
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minimum_purchase: coupon.minimum_purchase,
        expiry_date: coupon.expiry_date,
        usage_limit: coupon.usage_limit,
        is_active: coupon.is_active,
        applicable_products: coupon.applicable_products,
        applicable_categories: coupon.applicable_categories,
        status: coupon.status,
        current_uses: coupon.current_uses,
        discount_percentage: coupon.discount_percentage,
        max_uses: coupon.max_uses
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCoupon(id: string, data: Partial<Omit<AdminCoupon, "id" | "usage_count" | "created_at" | "updated_at">>): Promise<AdminCoupon> {
    const { data: updatedCoupon, error } = await supabase
      .from('coupons')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedCoupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Order methods
  async getOrders(page: number = 1, status?: string): Promise<{ data: AdminOrder[], pagination: any }> {
    let query = supabase
      .from('orders')
      .select('*, user:user_id(id, username, email)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);
    
    if (error) throw error;
    
    // Prepare data with pagination
    const result = data?.map(order => ({
      id: order.id,
      user: order.user,
      status: order.status,
      created_at: order.created_at,
      total: order.total_amount,
      products: order.products || []
    })) || [];
    
    return {
      data: result,
      pagination: {
        current_page: page,
        last_page: 5,
        per_page: 10,
        total: 50
      }
    };
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<AdminOrder> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // LiveStream methods
  async getLiveStreams(): Promise<LiveStream[]> {
    const { data, error } = await supabase
      .from('streams')
      .select('*, profiles:user_id(username, avatar_url)')
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async shutdownStream(streamId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('streams')
      .update({ 
        status: 'offline',
        ended_at: new Date().toISOString()
      })
      .eq('id', streamId);
    
    if (error) throw error;
    
    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_action_type: 'stream_shutdown',
      p_target_id: streamId,
      p_reason: reason
    });
  }

  async sendStreamMessage(streamId: string, message: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        stream_id: streamId,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        message: message
      });
    
    if (error) throw error;
  }

  // Video methods
  async getVideos(options: { 
    page?: number, 
    status?: string, 
    userId?: string, 
    query?: string, 
    sortBy?: string, 
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{ data: AdminVideo[], pagination: any }> {
    const { page = 1, status, userId, query, sortBy, sortOrder } = options;
    
    let dbQuery = supabase
      .from('videos')
      .select('*, user:user_id(id, username, avatar_url)');
    
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }
    
    if (userId) {
      dbQuery = dbQuery.eq('user_id', userId);
    }
    
    if (query) {
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }
    
    // Apply sorting
    if (sortBy) {
      dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }
    
    const { data, error } = await dbQuery
      .range((page - 1) * 10, page * 10 - 1);
    
    if (error) throw error;
    
    return {
      data: data || [],
      pagination: {
        current_page: page,
        last_page: 5,
        per_page: 10,
        total: 50
      }
    };
  }

  // Alias for backward compatibility
  getVideosList(page: number = 1, limit: number = 10, status?: string, query?: string, userId?: string, date?: string): Promise<{ data: AdminVideo[], pagination: any }> {
    return this.getVideos({
      page,
      status,
      userId,
      query,
      sortBy: date ? 'created_at' : undefined
    });
  }

  async updateVideoStatus(videoId: string, status: string): Promise<AdminVideo> {
    const { data, error } = await supabase
      .from('videos')
      .update({ status })
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteVideo(videoId: string): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) throw error;
  }

  async sendUserWarning(userId: string, reason: string, videoId?: string): Promise<void> {
    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_action_type: 'user_warning',
      p_target_id: userId,
      p_reason: reason
    });
    
    // In a real implementation, this might send an email or notification
  }

  async restrictUser(userId: string, reason: string): Promise<void> {
    // Update user status in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        restricted: true,
        restriction_reason: reason
      })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_action_type: 'user_restriction',
      p_target_id: userId,
      p_reason: reason
    });
  }

  // User methods
  async getUsers(page: number = 1, query?: string): Promise<{ data: AdminUser[], pagination: any }> {
    let dbQuery = supabase.from('profiles').select('*');
    
    if (query) {
      dbQuery = dbQuery
        .or(`username.ilike.%${query}%, email.ilike.%${query}%`);
    }
    
    const { data, error } = await dbQuery
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);
    
    if (error) throw error;
    
    const users = data?.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status || 'active',
      role: user.role || 'user',
      createdAt: user.created_at,
      videosCount: 0, // Would be filled in real implementation
      ordersCount: 0  // Would be filled in real implementation
    })) || [];
    
    return {
      data: users,
      pagination: {
        current_page: page,
        last_page: 5,
        per_page: 10,
        total: 50
      }
    };
  }

  async getUser(userId: string): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      status: data.status || 'active',
      role: data.role || 'user',
      createdAt: data.created_at,
      videosCount: 0, // Would be filled in real implementation
      ordersCount: 0  // Would be filled in real implementation
    };
  }

  async updateUserStatus(userId: string, status: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics and report methods
  async getUserGrowthData(period?: string): Promise<any> {
    // Placeholder implementation with updated structure
    return {
      daily: [
        { date: '2023-05-01', count: 12 },
        { date: '2023-05-02', count: 18 },
        { date: '2023-05-03', count: 15 },
        { date: '2023-05-04', count: 21 },
        { date: '2023-05-05', count: 25 },
      ],
      monthly: [
        { date: '2023-01', count: 120 },
        { date: '2023-02', count: 180 },
        { date: '2023-03', count: 210 },
        { date: '2023-04', count: 250 },
        { date: '2023-05', count: 310 },
      ],
      newUsers: [
        { date: '2023-05-01', count: 5 },
        { date: '2023-05-02', count: 8 },
        { date: '2023-05-03', count: 6 },
        { date: '2023-05-04', count: 10 },
        { date: '2023-05-05', count: 12 },
      ],
      activeUsers: [
        { date: '2023-05-01', count: 340 },
        { date: '2023-05-02', count: 380 },
        { date: '2023-05-03', count: 410 },
        { date: '2023-05-04', count: 450 },
        { date: '2023-05-05', count: 500 },
      ]
    };
  }

  async getVideoEngagementData(period?: string): Promise<any> {
    // Placeholder implementation with updated structure
    return {
      views: [
        { date: '2023-05-01', count: 1200 },
        { date: '2023-05-02', count: 1500 },
        { date: '2023-05-03', count: 1350 },
        { date: '2023-05-04', count: 1800 },
        { date: '2023-05-05', count: 2100 },
      ],
      likes: [
        { date: '2023-05-01', count: 450 },
        { date: '2023-05-02', count: 520 },
        { date: '2023-05-03', count: 480 },
        { date: '2023-05-04', count: 650 },
        { date: '2023-05-05', count: 780 },
      ],
      comments: [
        { date: '2023-05-01', count: 120 },
        { date: '2023-05-02', count: 180 },
        { date: '2023-05-03', count: 150 },
        { date: '2023-05-04', count: 210 },
        { date: '2023-05-05', count: 250 },
      ],
      interactions: [
        { date: '2023-05-01', count: 570 },
        { date: '2023-05-02', count: 700 },
        { date: '2023-05-03', count: 630 },
        { date: '2023-05-04', count: 860 },
        { date: '2023-05-05', count: 1030 },
      ],
      uploads: [
        { date: '2023-05-01', count: 35 },
        { date: '2023-05-02', count: 42 },
        { date: '2023-05-03', count: 38 },
        { date: '2023-05-04', count: 47 },
        { date: '2023-05-05', count: 55 },
      ]
    };
  }

  async getRevenueData(period?: string): Promise<any> {
    // Placeholder implementation with updated structure
    return {
      daily: [
        { date: '2023-05-01', amount: 1250 },
        { date: '2023-05-02', amount: 1800 },
        { date: '2023-05-03', amount: 1500 },
        { date: '2023-05-04', amount: 2100 },
        { date: '2023-05-05', amount: 2500 },
      ],
      monthly: [
        { date: '2023-01', amount: 12000 },
        { date: '2023-02', amount: 18500 },
        { date: '2023-03', amount: 21000 },
        { date: '2023-04', amount: 25500 },
        { date: '2023-05', amount: 31000 },
      ],
      total: {
        amount: 108000,
        growth: 18.5
      },
      byCategory: [
        { category: 'Electronics', amount: 45000 },
        { category: 'Fashion', amount: 28000 },
        { category: 'Home', amount: 18000 },
        { category: 'Beauty', amount: 12000 },
        { category: 'Other', amount: 5000 },
      ],
      orders: [
        { date: '2023-05-01', count: 35 },
        { date: '2023-05-02', count: 48 },
        { date: '2023-05-03', count: 42 },
        { date: '2023-05-04', count: 56 },
        { date: '2023-05-05', count: 63 },
      ],
      aov: [
        { date: '2023-05-01', amount: 35.7 },
        { date: '2023-05-02', amount: 37.5 },
        { date: '2023-05-03', amount: 36.2 },
        { date: '2023-05-04', amount: 38.4 },
        { date: '2023-05-05', amount: 39.7 },
      ]
    };
  }

  // Shipping methods
  async getShippingMethods(): Promise<AdminShippingMethod[]> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createShippingMethod(method: Omit<AdminShippingMethod, "id">): Promise<AdminShippingMethod> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .insert({
        name: method.name,
        description: method.description,
        price: method.price,
        estimated_days: method.estimated_days,
        is_active: method.is_active,
        delivery_time: method.delivery_time,
        is_default: method.is_default,
        created_at: method.created_at
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateShippingMethod(id: string, data: Partial<Omit<AdminShippingMethod, "id">>): Promise<AdminShippingMethod> {
    const { data: updatedMethod, error } = await supabase
      .from('shipping_methods')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedMethod;
  }

  async deleteShippingMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from('shipping_methods')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Offers methods
  async getOffers(): Promise<AdminOffer[]> {
    const { data, error } = await supabase
      .from('admin_offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getOfferAnalytics(period?: string): Promise<any> {
    // Placeholder implementation
    return {
      totalRevenue: 24580,
      conversionRate: 3.2,
      averageOrderValue: 75.50,
      topOffers: [
        { id: '1', name: 'Summer Sale', orders: 156, revenue: 8745.20, conversionRate: 4.8 },
        { id: '2', name: 'Black Friday', orders: 243, revenue: 12340.75, conversionRate: 7.2 },
        { id: '3', name: 'Welcome Discount', orders: 98, revenue: 3495.50, conversionRate: 2.1 }
      ]
    };
  }

  async createOffer(offer: Omit<AdminOffer, "id" | "created_at" | "updated_at">): Promise<AdminOffer> {
    const { data, error } = await supabase
      .from('admin_offers')
      .insert({
        title: offer.title,
        product_id: offer.product_id,
        name: offer.name,
        description: offer.description,
        discount_type: offer.discount_type,
        discount_value: offer.discount_value,
        discount_percentage: offer.discount_percentage,
        start_date: offer.start_date,
        end_date: offer.end_date,
        min_purchase_amount: offer.min_purchase_amount,
        product_category: offer.product_category,
        active: offer.active
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOffer(id: string, data: Partial<Omit<AdminOffer, "id" | "created_at" | "updated_at">>): Promise<AdminOffer> {
    const { data: updatedOffer, error } = await supabase
      .from('admin_offers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedOffer;
  }

  async deleteOffer(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Virtual gifts methods
  async getVirtualGifts(page: number = 1, limit: number = 20, category?: string): Promise<{ data: VirtualGift[] }> {
    let query = supabase
      .from('virtual_gifts')
      .select('*');
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('price', { ascending: true });
    
    if (error) throw error;
    return { data: data || [] };
  }

  async getGiftUsageStats(period?: string): Promise<any> {
    // Placeholder implementation
    return {
      totalSent: 4500,
      totalRevenue: 16500,
      mostPopular: { name: 'Heart', count: 1250 },
      popularGifts: [
        { name: 'Heart', count: 1250, revenue: 2500 },
        { name: 'Star', count: 980, revenue: 1960 },
        { name: 'Diamond', count: 520, revenue: 5200 },
        { name: 'Crown', count: 320, revenue: 3200 },
        { name: 'Rocket', count: 280, revenue: 2800 },
      ],
      topStreamers: [
        { username: 'StreamerA', giftsReceived: 850, totalValue: 4250, topGift: 'Diamond' },
        { username: 'StreamerB', giftsReceived: 720, totalValue: 3600, topGift: 'Heart' },
        { username: 'StreamerC', giftsReceived: 540, totalValue: 2700, topGift: 'Star' }
      ]
    };
  }

  async createVirtualGift(gift: Omit<VirtualGift, "id" | "created_at">): Promise<VirtualGift> {
    const { data, error } = await supabase
      .from('virtual_gifts')
      .insert({
        name: gift.name,
        description: gift.description,
        price: gift.price,
        value: gift.value || gift.price,
        imageUrl: gift.imageUrl,
        imageType: gift.imageType,
        hasSound: gift.hasSound,
        soundUrl: gift.soundUrl,
        category: gift.category,
        available: gift.available,
        color: gift.color || '#FFFFFF',
        icon: gift.icon || 'gift',
        is_premium: gift.is_premium || false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateVirtualGift(id: string, data: Partial<Omit<VirtualGift, "id" | "created_at">>): Promise<VirtualGift> {
    const { data: updatedGift, error } = await supabase
      .from('virtual_gifts')
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        value: data.value,
        imageUrl: data.imageUrl,
        imageType: data.imageType,
        hasSound: data.hasSound,
        soundUrl: data.soundUrl,
        category: data.category,
        available: data.available,
        color: data.color,
        icon: data.icon,
        is_premium: data.is_premium
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedGift;
  }

  async deleteVirtualGift(id: string): Promise<void> {
    const { error } = await supabase
      .from('virtual_gifts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async toggleGiftAvailability(id: string, available: boolean): Promise<VirtualGift> {
    const { data, error } = await supabase
      .from('virtual_gifts')
      .update({ available })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Product attributes methods
  async getProductAttributes(page: number = 1): Promise<{ data: ProductAttribute[], pagination: any }> {
    const { data, error } = await supabase
      .from('product_attributes')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return {
      data: data || [],
      pagination: {
        current_page: page,
        last_page: 5,
        per_page: 10,
        total: 50
      }
    };
  }

  async createAttribute(attribute: Omit<ProductAttribute, "id" | "created_at">): Promise<ProductAttribute> {
    const attribWithCreatedAt = {
      ...attribute,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('product_attributes')
      .insert(attribWithCreatedAt)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Alias for backward compatibility
  createProductAttribute = this.createAttribute;

  async updateAttribute(id: string, data: Partial<Omit<ProductAttribute, "id" | "created_at">>): Promise<ProductAttribute> {
    const { data: updatedAttribute, error } = await supabase
      .from('product_attributes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedAttribute;
  }

  // Alias for backward compatibility
  updateProductAttribute = this.updateAttribute;

  async deleteAttribute(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_attributes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Alias for backward compatibility
  deleteProductAttribute = this.deleteAttribute;

  // Product analytics
  async getProductSalesData(productId?: string, period?: string): Promise<any> {
    // Placeholder implementation
    return {
      sales: [
        { date: '2023-01', count: 120, revenue: 12000 },
        { date: '2023-02', count: 150, revenue: 15000 },
        { date: '2023-03', count: 180, revenue: 18000 },
        { date: '2023-04', count: 220, revenue: 22000 },
        { date: '2023-05', count: 250, revenue: 25000 },
      ],
      topProducts: [
        { name: 'Premium Headphones', count: 350, revenue: 35000 },
        { name: 'Wireless Earbuds', count: 310, revenue: 15500 },
        { name: 'Smart Watch', count: 280, revenue: 42000 },
        { name: 'Bluetooth Speaker', count: 250, revenue: 15000 },
        { name: 'Power Bank', count: 220, revenue: 11000 },
      ],
      categorySales: [
        { category: 'Electronics', count: 1200, revenue: 120000 },
        { category: 'Fashion', count: 850, revenue: 85000 },
        { category: 'Home', count: 680, revenue: 68000 },
        { category: 'Beauty', count: 520, revenue: 52000 },
        { category: 'Sports', count: 380, revenue: 38000 },
      ]
    };
  }
}

export default new AdminService();
