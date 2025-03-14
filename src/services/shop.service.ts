
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
}

export interface Order {
  id: string;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  total: number;
  status: string;
  created_at: string;
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

  async createOrder(products: Array<{id: string, quantity: number}>) {
    const response = await api.post('/shop/orders', { products });
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/shop/orders');
    return response.data;
  }
};

export default ShopService;
