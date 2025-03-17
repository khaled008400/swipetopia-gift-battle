
import { Product } from '@/types/product.types';

// Simple product service to fetch products
const productService = {
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    // In a real app, this would fetch from an API
    // Mock implementation for now
    return [
      {
        id: '1',
        name: 'Product 1',
        price: 99.99,
        image_url: 'https://placehold.co/300x300',
        category: category,
        description: 'Sample product description',
        stock_quantity: 10,
        status: 'active',
        seller_id: 'seller1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: true
      },
      {
        id: '2',
        name: 'Product 2',
        price: 49.99,
        image_url: 'https://placehold.co/300x300',
        category: category,
        description: 'Another sample product',
        stock_quantity: 5,
        status: 'active',
        seller_id: 'seller1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false
      }
    ];
  }
};

export default productService;
