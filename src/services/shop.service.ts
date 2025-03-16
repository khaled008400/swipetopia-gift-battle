
import api from './api';
import { supabase } from '@/lib/supabase';
import { User } from './auth.service';

// Interface for product type
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'unavailable';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  // Additional properties
  original_price?: number;
  specifications?: Record<string, string>;
  seller?: User;
}

// Interface for limited offer
export interface LimitedOffer {
  id: string;
  product_id: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// Interface for live seller
export interface LiveSeller {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string;
  started_at: string;
  viewers: number;
  is_live: boolean;
  stream_key?: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url: string;
  };
}

// Mock products for development
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Smartphone Stabilizer',
    price: 89.99,
    original_price: 129.99,
    description: 'Professional 3-axis gimbal for smooth video recording with your smartphone. Features advanced stabilization algorithms and long battery life.',
    image_url: 'https://i.imgur.com/FP5dIVV.jpg',
    category: 'Electronics',
    stock_quantity: 43,
    status: 'active',
    seller_id: 'seller-123',
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2023-06-15T10:30:00Z',
    is_featured: true,
    specifications: {
      'Weight': '400g',
      'Battery Life': '12 hours',
      'Compatibility': 'iOS, Android',
      'Connectivity': 'Bluetooth 5.0'
    },
    seller: {
      id: 'seller-123',
      username: 'TechGadgets',
      email: 'contact@techgadgets.com',
      avatar: 'https://i.pravatar.cc/150?u=techgadgets',
      coins: 0,
      followers: 1200,
      following: 145,
      roles: ['seller'],
      shop_name: 'Tech Gadgets Store'
    }
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Earbuds',
    price: 59.99,
    description: 'True wireless earbuds with noise cancellation and premium sound quality. Includes charging case with 24 hour battery life.',
    image_url: 'https://i.imgur.com/oFKvp7A.jpg',
    category: 'Electronics',
    stock_quantity: 78,
    status: 'active',
    seller_id: 'seller-123',
    created_at: '2023-06-18T14:45:00Z',
    updated_at: '2023-06-18T14:45:00Z',
    is_featured: true,
    specifications: {
      'Weight': '55g (with case)',
      'Battery Life': '6 hours (24 with case)',
      'Connectivity': 'Bluetooth 5.2',
      'Water Resistance': 'IPX5'
    },
    seller: {
      id: 'seller-123',
      username: 'TechGadgets',
      email: 'contact@techgadgets.com',
      avatar: 'https://i.pravatar.cc/150?u=techgadgets',
      coins: 0,
      followers: 1200,
      following: 145,
      roles: ['seller'],
      shop_name: 'Tech Gadgets Store'
    }
  },
  {
    id: '3',
    name: 'Streaming Webcam 4K',
    price: 129.99,
    original_price: 159.99,
    description: 'Professional 4K webcam ideal for streaming, with auto-focus, light correction, and dual microphones for crystal clear audio.',
    image_url: 'https://i.imgur.com/KxAKUHt.jpg',
    category: 'Streaming',
    stock_quantity: 22,
    status: 'active',
    seller_id: 'seller-456',
    created_at: '2023-07-10T09:15:00Z',
    updated_at: '2023-07-10T09:15:00Z',
    is_featured: false,
    specifications: {
      'Resolution': '4K Ultra HD',
      'Frame Rate': '60 FPS',
      'Field of View': '78°',
      'Connection': 'USB-C'
    },
    seller: {
      id: 'seller-456',
      username: 'StreamerGear',
      email: 'support@streamergear.com',
      avatar: 'https://i.pravatar.cc/150?u=streamergear',
      coins: 0,
      followers: 850,
      following: 120,
      roles: ['seller'],
      shop_name: 'Streamer Gear Shop'
    }
  },
  // ... more mock products could be added here
];

// Mock limited offers for development
const MOCK_LIMITED_OFFERS: LimitedOffer[] = [
  {
    id: '1',
    product_id: '1',
    discount_percentage: 30,
    start_date: '2023-08-01T00:00:00Z',
    end_date: '2023-08-15T23:59:59Z',
    created_at: '2023-07-25T14:30:00Z',
    updated_at: '2023-07-25T14:30:00Z',
    product: MOCK_PRODUCTS[0]
  },
  {
    id: '2',
    product_id: '3',
    discount_percentage: 20,
    start_date: '2023-08-05T00:00:00Z',
    end_date: '2023-08-12T23:59:59Z',
    created_at: '2023-07-28T11:15:00Z',
    updated_at: '2023-07-28T11:15:00Z',
    product: MOCK_PRODUCTS[2]
  }
];

// Mock live sellers for development
const MOCK_LIVE_SELLERS: LiveSeller[] = [
  {
    id: '1',
    user_id: 'seller-123',
    title: 'Tech Showcase: Latest Gadgets!',
    thumbnail_url: 'https://i.imgur.com/JkGzJVZ.jpg',
    started_at: new Date(Date.now() - 35 * 60000).toISOString(), // Started 35 min ago
    viewers: 245,
    is_live: true,
    updated_at: new Date().toISOString(),
    user: {
      username: 'TechGadgets',
      avatar_url: 'https://i.pravatar.cc/150?u=techgadgets'
    }
  },
  {
    id: '2',
    user_id: 'seller-456',
    title: 'Streaming Setup Guide & Product Review',
    thumbnail_url: 'https://i.imgur.com/lxgqF5R.jpg',
    started_at: new Date(Date.now() - 15 * 60000).toISOString(), // Started 15 min ago
    viewers: 178,
    is_live: true,
    updated_at: new Date().toISOString(),
    user: {
      username: 'StreamerGear',
      avatar_url: 'https://i.pravatar.cc/150?u=streamergear'
    }
  }
];

const isDevelopment = import.meta.env.DEV;

const ShopService = {
  async getProducts(category = '', page = 1, filter = '') {
    try {
      if (isDevelopment) {
        // Return mock data filtered by category if specified
        let filtered = [...MOCK_PRODUCTS];
        
        if (category && category !== 'ALL') {
          filtered = filtered.filter(p => p.category === category);
        }
        
        if (filter) {
          const lowerFilter = filter.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowerFilter) ||
            p.description.toLowerCase().includes(lowerFilter)
          );
        }
        
        return filtered;
      }
      
      // In production, use Supabase to fetch products
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles!products_seller_id_fkey (
            username,
            avatar_url
          )
        `);
      
      // Add category filter if provided and not 'ALL'
      if (category && category !== 'ALL') {
        query = query.eq('category', category);
      }
      
      // Add text search if filter provided
      if (filter) {
        query = query.or(`name.ilike.%${filter}%,description.ilike.%${filter}%`);
      }
      
      // Paginate results for performance
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1);
      
      if (error) throw error;
      
      // Map data to include user details
      return data.map(item => ({
        ...item,
        seller: item.profiles ? {
          id: item.seller_id,
          username: item.profiles.username,
          avatar: item.profiles.avatar_url,
          email: '',
          coins: 0,
          followers: 0,
          following: 0
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return MOCK_PRODUCTS;
    }
  },
  
  async getLimitedOffers() {
    try {
      if (isDevelopment) {
        return MOCK_LIMITED_OFFERS;
      }
      
      const { data, error } = await supabase
        .from('limited_offers')
        .select(`
          *,
          products (*)
        `)
        .gte('end_date', new Date().toISOString())
        .order('end_date');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching limited offers:', error);
      return MOCK_LIMITED_OFFERS;
    }
  },
  
  async getLiveSellers() {
    try {
      if (isDevelopment) {
        return MOCK_LIVE_SELLERS;
      }
      
      const { data, error } = await supabase
        .from('live_sellers')
        .select(`
          *,
          profiles!live_sellers_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('is_live', true)
        .order('viewers', { ascending: false });
      
      if (error) throw error;
      
      return data.map(seller => ({
        ...seller,
        user: {
          username: seller.profiles.username,
          avatar_url: seller.profiles.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching live sellers:', error);
      return MOCK_LIVE_SELLERS;
    }
  },
  
  async getProductById(id: string) {
    try {
      if (isDevelopment) {
        const product = MOCK_PRODUCTS.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_seller_id_fkey (
            username,
            avatar_url,
            id
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map the seller data
      return {
        ...data,
        seller: data.profiles ? {
          id: data.seller_id,
          username: data.profiles.username,
          avatar: data.profiles.avatar_url,
          email: '',
          coins: 0,
          followers: 0,
          following: 0
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
      const mockProduct = MOCK_PRODUCTS.find(p => p.id === id);
      if (!mockProduct) throw new Error('Product not found');
      return mockProduct;
    }
  },
  
  async searchProducts(query: string) {
    try {
      if (isDevelopment) {
        const lowerQuery = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        );
      }
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles!products_seller_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        seller: item.profiles ? {
          id: item.seller_id,
          username: item.profiles.username,
          avatar: item.profiles.avatar_url,
          email: '',
          coins: 0,
          followers: 0,
          following: 0
        } : undefined
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
  
  // User liked products methods
  async getUserLikedProductIds() {
    try {
      if (isDevelopment) {
        // For development, use local storage to simulate liked products
        const liked = localStorage.getItem('liked_products');
        return liked ? JSON.parse(liked) : [];
      }
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];
      
      const { data, error } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
      
      return data.map(item => item.product_id);
    } catch (error) {
      console.error('Error fetching liked products:', error);
      return [];
    }
  },
  
  async toggleProductLike(productId: string) {
    try {
      if (isDevelopment) {
        // For development, use local storage to simulate liked products
        const liked = localStorage.getItem('liked_products');
        let likedProducts = liked ? JSON.parse(liked) : [];
        
        const isLiked = likedProducts.includes(productId);
        
        if (isLiked) {
          likedProducts = likedProducts.filter((id: string) => id !== productId);
        } else {
          likedProducts.push(productId);
        }
        
        localStorage.setItem('liked_products', JSON.stringify(likedProducts));
        
        return { liked: !isLiked };
      }
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      
      // Check if product is already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('product_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not the "not found" error
        throw checkError;
      }
      
      if (existingLike) {
        // Unlike the product
        const { error: unlikeError } = await supabase
          .from('product_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (unlikeError) throw unlikeError;
        
        return { liked: false };
      } else {
        // Like the product
        const { error: likeError } = await supabase
          .from('product_likes')
          .insert({
            user_id: userId,
            product_id: productId
          });
        
        if (likeError) throw likeError;
        
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling product like:', error);
      throw error;
    }
  }
};

export default ShopService;

// Export types for use in other components
export { Product, LimitedOffer, LiveSeller };
