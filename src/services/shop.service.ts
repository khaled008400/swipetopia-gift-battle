
import { Product } from '@/types/product.types';

// Define missing types
export interface LiveSeller {
  id: string;
  username: string;
  avatar_url: string;
  viewers: number;
}

export interface LimitedOffer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product?: Product & { original_price?: number };
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Trendy Hoodie',
    description: 'A comfortable hoodie for everyday wear',
    price: 49.99,
    image_url: 'https://i.pravatar.cc/300?img=1',
    category: 'clothing',
    rating: 4.5, // Now valid with updated type
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
    rating: 4.8, // Now valid with updated type
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
    rating: 4.2, // Now valid with updated type
    reviews_count: 210,
    in_stock: true,
    seller_id: '1',
    created_at: '2023-01-03T00:00:00.000Z',
    updated_at: '2023-01-03T00:00:00.000Z'
  }
];

// Mock categories
const categories = ['clothing', 'electronics', 'fitness', 'beauty', 'home'];

// Mock live sellers
const liveSellers: LiveSeller[] = [
  {
    id: '1',
    username: 'FashionQueen',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    viewers: 1250
  },
  {
    id: '2',
    username: 'TechGuru',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
    viewers: 984
  },
  {
    id: '3',
    username: 'FitnessCoach',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    viewers: 2105
  },
  {
    id: '4',
    username: 'BeautyExpert',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
    viewers: 752
  }
];

// Mock limited offers
const limitedOffers: LimitedOffer[] = [
  {
    id: '1',
    product_id: '1',
    discount_percentage: 25,
    start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      ...mockProducts[0],
      original_price: mockProducts[0].price * 1.25
    }
  },
  {
    id: '2',
    product_id: '2',
    discount_percentage: 30,
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      ...mockProducts[1],
      original_price: mockProducts[1].price * 1.3
    }
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

  // Add missing methods
  async getCategories(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 300);
    });
  }

  async getLiveSellers(): Promise<LiveSeller[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(liveSellers);
      }, 500);
    });
  }

  async getLimitedOffers(): Promise<LimitedOffer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(limitedOffers);
      }, 500);
    });
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a subset of products as featured
        resolve(mockProducts.slice(0, 2));
      }, 500);
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id) || null;
        resolve(product);
      }, 300);
    });
  }
}

export default new ShopService();
