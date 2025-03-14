
import api from './api';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_purchase?: number;
  expiry_date: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  applicable_products?: string[]; // Product IDs the coupon applies to
  applicable_categories?: string[]; // Category IDs the coupon applies to
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'bundle';
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_products?: string[]; // Product IDs the offer applies to
  applicable_categories?: string[]; // Category IDs the offer applies to
  rules?: {
    buy_quantity?: number;
    get_quantity?: number;
    bundle_products?: string[];
    bundle_price?: number;
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string; // e.g., "3-5 days"
  is_active: boolean;
  conditions?: {
    min_order_value?: number;
    max_order_value?: number;
    applicable_regions?: string[];
  };
}

export interface PricingRules {
  id: string;
  name: string;
  description?: string;
  type: 'tax' | 'fee' | 'discount';
  value: number;
  value_type: 'percentage' | 'fixed';
  applies_to: 'all' | 'category' | 'product';
  target_ids?: string[]; // Product or category IDs
  is_active: boolean;
}

export interface PriceCalculationResult {
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  tax_amount: number;
  additional_fees: number;
  total: number;
  applied_coupons: Coupon[];
  applied_offers: Offer[];
  selected_shipping: ShippingMethod;
}

const PricingService = {
  // Coupon methods
  async validateCoupon(code: string): Promise<Coupon | null> {
    try {
      const response = await api.get(`/shop/coupons/validate/${code}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getAvailableCoupons(): Promise<Coupon[]> {
    const response = await api.get('/shop/coupons/available');
    return response.data;
  },

  // Offers methods
  async getActiveOffers(categoryId?: string, productId?: string): Promise<Offer[]> {
    const params = {};
    if (categoryId) params['category_id'] = categoryId;
    if (productId) params['product_id'] = productId;
    
    const response = await api.get('/shop/offers/active', { params });
    return response.data;
  },

  // Shipping methods
  async getShippingMethods(orderValue: number, region?: string): Promise<ShippingMethod[]> {
    const params = { order_value: orderValue };
    if (region) params['region'] = region;
    
    const response = await api.get('/shop/shipping/methods', { params });
    return response.data;
  },

  // Price calculation
  async calculatePrice(
    items: Array<{id: string, quantity: number}>,
    couponCodes?: string[],
    shippingMethodId?: string,
    region?: string
  ): Promise<PriceCalculationResult> {
    const payload = {
      items,
      coupon_codes: couponCodes || [],
      shipping_method_id: shippingMethodId,
      region
    };
    
    const response = await api.post('/shop/calculate-price', payload);
    return response.data;
  }
};

export default PricingService;
