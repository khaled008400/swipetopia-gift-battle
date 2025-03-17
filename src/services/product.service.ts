
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
  },
  {
    id: '4',
    name: 'Skincare Set',
    description: 'Complete skincare routine in one package',
    price: 89.99,
    image_url: 'https://i.pravatar.cc/300?img=4',
    category: 'beauty',
    rating: 4.7,
    reviews_count: 180,
    in_stock: true,
    seller_id: '3',
    created_at: '2023-01-04T00:00:00.000Z',
    updated_at: '2023-01-04T00:00:00.000Z'
  }
];

const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  },

  getProductById: async (id: string): Promise<Product | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.find(product => product.id === id) || null;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.slice(0, 2);
  }
};

export default productService;
