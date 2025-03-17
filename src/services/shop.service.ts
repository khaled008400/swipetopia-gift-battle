import { Product } from '@/types/product.types';
import { LimitedOffer, LiveSeller } from '@/types/video.types';

class ShopService {
  async getProducts(): Promise<Product[]> {
    // Mocked products data
    return [
      {
        id: "1",
        name: "Wireless Earbuds",
        description: "High-quality sound with noise cancellation",
        price: 79.99,
        image_url: "https://example.com/earbuds.jpg",
        category: "Electronics",
        rating: 4.7,
        reviews_count: 152,
        in_stock: true,
        seller_id: "seller123",
        created_at: "2023-04-15T10:30:00Z",
        updated_at: "2023-04-15T10:30:00Z"
      },
      // Additional products would be here
    ];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Mocked featured products
    return [
      {
        id: "3",
        name: "Smart Watch",
        description: "Track your fitness and receive notifications",
        price: 129.99,
        image_url: "https://example.com/smartwatch.jpg",
        category: "Electronics",
        rating: 4.5,
        reviews_count: 89,
        in_stock: true,
        seller_id: "seller456",
        created_at: "2023-03-20T14:15:00Z",
        updated_at: "2023-03-20T14:15:00Z",
        is_featured: true
      },
      // Additional featured products would be here
    ];
  }

  async getCategories(): Promise<string[]> {
    // Mocked categories
    return [
      "Electronics",
      "Fashion",
      "Home & Kitchen",
      "Beauty & Personal Care",
      "Sports & Outdoors"
    ];
  }

  async getLimitedOffers(): Promise<LimitedOffer[]> {
    // Mocked limited offers
    const products = await this.getProducts();
    
    return [
      {
        id: "offer1",
        product: products[0],
        discountPercentage: 20,
        startDate: "2023-09-01T00:00:00Z",
        endDate: "2023-09-15T23:59:59Z"
      },
      // Additional offers would be here
    ];
  }
  
  async getLiveSellers(): Promise<LiveSeller[]> {
    // Mocked live sellers
    return [
      {
        id: "seller1",
        userId: "user123",
        username: "FashionTrends",
        avatar: "https://example.com/avatar1.jpg",
        title: "New Summer Collection",
        thumbnailUrl: "https://example.com/thumbnail1.jpg",
        isLive: true,
        viewerCount: 245,
        viewers: 245
      },
      // Additional live sellers would be here
    ];
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    // Mocked search functionality
    const allProducts = await this.getProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  async getProductById(id: string): Promise<Product | null> {
    const allProducts = await this.getProducts();
    return allProducts.find(product => product.id === id) || null;
  }
}

export default new ShopService();
