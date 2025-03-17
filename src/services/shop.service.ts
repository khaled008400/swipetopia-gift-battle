
import { Product, ShopProfile } from '@/types/product.types';
import { LiveSeller, LimitedOffer } from '@/types/video.types';

// Export types that other components need to import
export type { Product, ShopProfile, LiveSeller, LimitedOffer };

// Mock limited offers
const mockLimitedOffers: LimitedOffer[] = [
  {
    id: '1',
    product: {
      id: '101',
      name: 'Limited Edition Headphones',
      description: 'Premium noise-cancelling headphones',
      price: 79.99,
      image_url: 'https://i.pravatar.cc/300?img=5',
      category: 'electronics',
      original_price: 129.99,
      seller_id: '1',
      created_at: '2023-01-05T00:00:00.000Z',
      updated_at: '2023-01-05T00:00:00.000Z'
    },
    discountPercentage: 40,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    product_id: '101'
  },
  {
    id: '2',
    product: {
      id: '102',
      name: 'Smart Watch',
      description: 'Track fitness and receive notifications',
      price: 59.99,
      image_url: 'https://i.pravatar.cc/300?img=6',
      category: 'electronics',
      original_price: 99.99,
      seller_id: '2',
      created_at: '2023-01-06T00:00:00.000Z',
      updated_at: '2023-01-06T00:00:00.000Z'
    },
    discountPercentage: 30,
    startDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    product_id: '102'
  }
];

// Mock live sellers
const mockLiveSellers: LiveSeller[] = [
  {
    id: '1',
    userId: '101',
    username: 'TechGadgets',
    avatar: 'https://i.pravatar.cc/300?img=7',
    title: 'Latest Electronics Showcase',
    thumbnailUrl: 'https://example.com/thumbnails/livestream1.jpg',
    isLive: true,
    viewerCount: 532
  },
  {
    id: '2',
    userId: '102',
    username: 'FashionTrends',
    avatar: 'https://i.pravatar.cc/300?img=8',
    title: 'Summer Collection Preview',
    thumbnailUrl: 'https://example.com/thumbnails/livestream2.jpg',
    isLive: true,
    viewerCount: 248
  }
];

// Export the ShopService with methods that other components expect
const ShopService = {
  getProducts: async (): Promise<Product[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock products
    const products: Product[] = [
      {
        id: '1',
        name: 'Premium Headphones',
        description: 'High-quality sound experience',
        price: 99.99,
        image_url: 'https://i.pravatar.cc/300?img=1',
        category: 'electronics',
        rating: 4.7,
        reviews_count: 253,
        in_stock: true,
        seller_id: '1',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: '2',
        name: 'Wireless Mouse',
        description: 'Ergonomic design for comfort',
        price: 29.99,
        image_url: 'https://i.pravatar.cc/300?img=2',
        category: 'electronics',
        rating: 4.5,
        reviews_count: 187,
        in_stock: true,
        seller_id: '1',
        created_at: '2023-01-02T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
        status: 'active'
      }
    ];
    
    return products;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock featured products
    const featuredProducts: Product[] = [
      {
        id: '3',
        name: 'Smart Speaker',
        description: 'Voice-controlled assistant',
        price: 79.99,
        image_url: 'https://i.pravatar.cc/300?img=3',
        category: 'electronics',
        rating: 4.8,
        reviews_count: 312,
        in_stock: true,
        seller_id: '2',
        created_at: '2023-01-03T00:00:00.000Z',
        updated_at: '2023-01-03T00:00:00.000Z',
        is_featured: true,
        status: 'active'
      },
      {
        id: '4',
        name: 'Fitness Tracker',
        description: 'Monitor your health and activities',
        price: 49.99,
        image_url: 'https://i.pravatar.cc/300?img=4',
        category: 'fitness',
        rating: 4.6,
        reviews_count: 214,
        in_stock: true,
        seller_id: '2',
        created_at: '2023-01-04T00:00:00.000Z',
        updated_at: '2023-01-04T00:00:00.000Z',
        is_featured: true,
        status: 'active'
      }
    ];
    
    return featuredProducts;
  },

  getLimitedOffers: async (): Promise<LimitedOffer[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLimitedOffers;
  },

  getLiveSellers: async (): Promise<LiveSeller[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLiveSellers;
  }
};

export default ShopService;
