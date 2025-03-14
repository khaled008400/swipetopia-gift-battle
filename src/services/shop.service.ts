
import api from './api';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  rating: number;
  inventory?: number;
  category?: string;
  original_price?: number;
  discount_percentage?: number;
  attributes?: Record<string, string[]>;
}

export interface Order {
  id: string;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  tax_amount: number;
  additional_fees: number;
  shipping_method: {
    id: string;
    name: string;
  };
  coupon_codes?: string[];
  applied_offers?: Array<{
    id: string;
    name: string;
  }>;
  status: string;
  created_at: string;
  shipping_address?: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_purchase?: number;
  expiry_date: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  discount_value: number;
  discount_type: 'percentage' | 'fixed' | 'special';
}

const ShopService = {
  async getProducts(category?: string) {
    const params = category ? { category } : {};
    const response = await api.get('/shop/products', { params });
    return response.data;
  },

  async getFeaturedProducts() {
    const response = await api.get('/shop/products/featured');
    return response.data;
  },

  async getNewArrivals() {
    const response = await api.get('/shop/products/new');
    return response.data;
  },

  async getProductDetails(productId: string) {
    const response = await api.get(`/shop/products/${productId}`);
    return response.data;
  },

  async toggleFavorite(productId: string) {
    const response = await api.post(`/shop/products/${productId}/favorite`);
    return response.data;
  },

  async getFavorites() {
    const response = await api.get('/shop/favorites');
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/shop/orders');
    return response.data;
  },

  async getProductsWithPricing(category?: string, withDiscounts = true) {
    const params = { 
      category, 
      with_discounts: withDiscounts 
    };
    const response = await api.get('/shop/products/with-pricing', { params });
    return response.data;
  },

  async getActiveOffers() {
    const response = await api.get('/shop/offers/active');
    return response.data;
  },

  async getAvailableCoupons() {
    const response = await api.get('/shop/coupons/available');
    return response.data;
  },

  async validateCoupon(code: string) {
    try {
      const response = await api.get(`/shop/coupons/validate/${code}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getShippingMethods(orderValue: number, region?: string) {
    const params = { order_value: orderValue };
    if (region) params['region'] = region;
    
    const response = await api.get('/shop/shipping/methods', { params });
    return response.data;
  },

  async calculatePrice(
    items: Array<{id: string, quantity: number}>,
    couponCodes?: string[],
    shippingMethodId?: string,
    region?: string
  ) {
    const payload = {
      items,
      coupon_codes: couponCodes || [],
      shipping_method_id: shippingMethodId,
      region
    };
    
    const response = await api.post('/shop/calculate-price', payload);
    return response.data;
  },

  async createOrder(orderData: {
    products: Array<{id: string, quantity: number}>;
    shipping_method_id: string;
    coupon_codes?: string[];
    shipping_address: {
      full_name: string;
      address: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    payment_method: {
      type: string;
      details: any;
    };
  }) {
    const response = await api.post('/shop/orders', orderData);
    return response.data;
  }
};

export default ShopService;
