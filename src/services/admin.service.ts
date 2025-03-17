
import { supabase } from "@/integrations/supabase/client";
import { 
  AdminOrder, 
  AdminCoupon, 
  AdminOffer, 
  AdminVideo, 
  AdminShippingMethod,
  VirtualGift,
  ProductAttribute,
  LiveStream 
} from "@/services/streaming/stream.types";

// Base admin service
class AdminService {
  // Coupon methods
  async getCoupons(): Promise<AdminCoupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getCouponAnalytics() {
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
    
    // Mock pagination for now
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
  async getVideos({ page = 1, status, userId, query, sortBy, sortOrder }): Promise<{ data: AdminVideo[], pagination: any }> {
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
  async getUsers(page: number = 1, query?: string): Promise<any> {
    let dbQuery = supabase.from('profiles').select('*');
    
    if (query) {
      dbQuery = dbQuery
        .or(`username.ilike.%${query}%, email.ilike.%${query}%`);
    }
    
    const { data, error } = await dbQuery
      .order('created_at', { ascending: false })
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
  async getUserGrowthData() {
    // Placeholder implementation
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
      ]
    };
  }

  async getVideoEngagementData() {
    // Placeholder implementation
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
      ]
    };
  }

  async getRevenueData() {
    // Placeholder implementation
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

  // Virtual gifts methods
  async getVirtualGifts(category?: string, isActive?: boolean): Promise<VirtualGift[]> {
    let query = supabase
      .from('virtual_gifts')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (isActive !== undefined) {
      query = query.eq('available', isActive);
    }
    
    const { data, error } = await query.order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createVirtualGift(gift: Omit<VirtualGift, "id" | "createdAt" | "updatedAt">): Promise<VirtualGift> {
    const { data, error } = await supabase
      .from('virtual_gifts')
      .insert({
        name: gift.name,
        description: gift.description,
        price: gift.price,
        value: gift.value,
        image_url: gift.imageUrl,
        image_type: gift.imageType,
        has_sound: gift.hasSound,
        sound_url: gift.soundUrl,
        category: gift.category,
        available: gift.available,
        color: gift.color,
        icon: gift.icon,
        is_premium: gift.is_premium
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateVirtualGift(id: string, data: Partial<Omit<VirtualGift, "id" | "createdAt" | "updatedAt">>): Promise<VirtualGift> {
    const { data: updatedGift, error } = await supabase
      .from('virtual_gifts')
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        value: data.value,
        image_url: data.imageUrl,
        image_type: data.imageType,
        has_sound: data.hasSound,
        sound_url: data.soundUrl,
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

  async getGiftUsageStats(): Promise<any> {
    // Placeholder implementation
    return {
      popularGifts: [
        { name: 'Heart', count: 1250, revenue: 2500 },
        { name: 'Star', count: 980, revenue: 1960 },
        { name: 'Diamond', count: 520, revenue: 5200 },
        { name: 'Crown', count: 320, revenue: 3200 },
        { name: 'Rocket', count: 280, revenue: 2800 },
      ],
      usageByCategory: [
        { category: 'Basic', count: 3500, revenue: 7000 },
        { category: 'Premium', count: 1200, revenue: 12000 },
        { category: 'Luxury', count: 450, revenue: 9000 },
        { category: 'Special', count: 300, revenue: 6000 },
      ],
      trends: [
        { date: '2023-01', count: 1200, revenue: 2400 },
        { date: '2023-02', count: 1500, revenue: 3000 },
        { date: '2023-03', count: 1800, revenue: 3600 },
        { date: '2023-04', count: 2200, revenue: 4400 },
        { date: '2023-05', count: 2500, revenue: 5000 },
      ]
    };
  }

  // Product attributes methods
  async getProductAttributes(page: number = 1): Promise<ProductAttribute[]> {
    const { data, error } = await supabase
      .from('product_attributes')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createAttribute(attribute: Omit<ProductAttribute, "id">): Promise<ProductAttribute> {
    const { data, error } = await supabase
      .from('product_attributes')
      .insert(attribute)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAttribute(id: string, data: Partial<Omit<ProductAttribute, "id">>): Promise<ProductAttribute> {
    const { data: updatedAttribute, error } = await supabase
      .from('product_attributes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedAttribute;
  }

  async deleteAttribute(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_attributes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

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

  // Additional methods can be added here as needed
}

export default new AdminService();
