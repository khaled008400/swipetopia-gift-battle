
import { Product } from '@/types/product.types';

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Trendy Hoodie',
    description: 'A comfortable hoodie for everyday wear',
    price: 49.99,
    image_url: 'https://i.pravatar.cc/300?img=1',
    category: 'clothing',
    rating: 4.5,
    reviews_count: 120,
    in_stock: true,
    seller_id: '1',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    description: 'High-quality sound with noise cancellation',
    price: 129.99,
    image_url: 'https://i.pravatar.cc/300?img=2',
    category: 'electronics',
    rating: 4.8,
    reviews_count: 350,
    in_stock: true,
    seller_id: '2',
    created_at: '2023-01-02T00:00:00.000Z',
    updated_at: '2023-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Fitness Tracker',
    description: 'Track your workouts and health metrics',
    price: 79.99,
    image_url: 'https://i.pravatar.cc/300?img=3',
    category: 'fitness',
    rating: 4.2,
    reviews_count: 210,
    in_stock: true,
    seller_id: '1',
    created_at: '2023-01-03T00:00:00.000Z',
    updated_at: '2023-01-03T00:00:00.000Z'
  }
];

interface ShopData {
  products: Product[];
  categories: string[];
}

class ShopService {
  async getProducts(): Promise<Product[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 500);
    });
  }

  async getShop(): Promise<ShopData> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [...new Set(mockProducts.map(product => product.category))];
        resolve({
          products: mockProducts,
          categories
        });
      }, 500);
    });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = mockProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
        resolve(filteredProducts);
      }, 500);
    });
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = mockProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(filteredProducts);
      }, 500);
    });
  }
}

export default new ShopService();
