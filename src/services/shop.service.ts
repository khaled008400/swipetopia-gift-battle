import { Product } from '@/types/product.types';
import { LiveSeller, LimitedOffer } from '@/types/video.types';

class ShopService {
  getProducts = async (): Promise<Product[]> => {
    // Mock data for testing purposes
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Designer T-Shirt',
        description: 'High-quality designer t-shirt with unique patterns',
        price: 29.99,
        image_url: 'https://example.com/tshirt.jpg',
        category: 'Clothing',
        rating: 4.5,
        reviews_count: 120,
        in_stock: true,
        seller_id: 'seller1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 50,
        status: 'active',
        is_featured: true
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        description: 'Over-ear wireless headphones with noise cancellation',
        price: 149.99,
        image_url: 'https://example.com/headphones.jpg',
        category: 'Electronics',
        rating: 4.8,
        reviews_count: 250,
        in_stock: true,
        seller_id: 'seller2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 30,
        status: 'active',
        is_featured: true
      },
      {
        id: '3',
        name: 'Organic Face Cream',
        description: 'All-natural face cream with organic ingredients',
        price: 39.50,
        image_url: 'https://example.com/facecream.jpg',
        category: 'Beauty',
        rating: 4.2,
        reviews_count: 80,
        in_stock: true,
        seller_id: 'seller3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 40,
        status: 'active',
        is_featured: false
      },
      {
        id: '4',
        name: 'Ergonomic Office Chair',
        description: 'Adjustable ergonomic office chair for maximum comfort',
        price: 229.00,
        image_url: 'https://example.com/officechair.jpg',
        category: 'Home',
        rating: 4.6,
        reviews_count: 150,
        in_stock: true,
        seller_id: 'seller4',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 20,
        status: 'active',
        is_featured: true
      },
      {
        id: '5',
        name: 'Basketball',
        description: 'Official size and weight basketball for indoor/outdoor use',
        price: 19.99,
        image_url: 'https://example.com/basketball.jpg',
        category: 'Sports',
        rating: 4.0,
        reviews_count: 60,
        in_stock: true,
        seller_id: 'seller5',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 60,
        status: 'active',
        is_featured: false
      },
      {
        id: '6',
        name: 'Building Blocks Set',
        description: 'Set of colorful building blocks for creative play',
        price: 24.75,
        image_url: 'https://example.com/buildingblocks.jpg',
        category: 'Toys',
        rating: 4.3,
        reviews_count: 90,
        in_stock: true,
        seller_id: 'seller6',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stock_quantity: 55,
        status: 'active',
        is_featured: false
      }
    ];
    
    return mockProducts;
  };

  // Add missing methods for the shop service
  getProductById = async (id: string): Promise<Product> => {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  };

  getCategories = async (): Promise<string[]> => {
    return ['Clothing', 'Electronics', 'Beauty', 'Home', 'Sports', 'Toys'];
  };

  getFeaturedProducts = async (): Promise<Product[]> => {
    const products = await this.getProducts();
    return products.filter(p => p.is_featured);
  };

  getLimitedOffers = async (): Promise<LimitedOffer[]> => {
    const products = await this.getProducts();
    
    return [
      {
        id: 'offer1',
        product: products[0],
        discountPercentage: 25,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'offer2',
        product: products[1],
        discountPercentage: 30,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  getLiveSellers = async (): Promise<LiveSeller[]> => {
    return [
      {
        id: 'ls1',
        userId: 'seller1',
        username: 'FashionExpert',
        avatar: 'https://example.com/avatar1.jpg',
        title: 'New Summer Collection Reveal!',
        thumbnailUrl: 'https://example.com/thumbnail1.jpg',
        isLive: true,
        viewerCount: 245
      },
      {
        id: 'ls2',
        userId: 'seller2',
        username: 'TechGadgets',
        avatar: 'https://example.com/avatar2.jpg',
        title: 'Latest Smartphone Unboxing',
        thumbnailUrl: 'https://example.com/thumbnail2.jpg',
        isLive: true,
        viewerCount: 189
      }
    ];
  };
}

export default new ShopService();
