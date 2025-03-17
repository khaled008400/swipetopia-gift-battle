
export interface Video {
  id: string;
  title?: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id?: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  created_at?: string;
  updated_at?: string;
  hashtags?: string[];
  is_live?: boolean;
  is_private?: boolean;
  isPublic?: boolean;
  duration?: number;
  category?: string;
  url?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLike?: boolean;
  isSaved?: boolean;
  user?: {
    username?: string;
    avatar_url?: string;
    avatar?: string;
    id?: string;
    isFollowing?: boolean;
  };
  profiles?: {
    username?: string;
    avatar_url?: string;
    id?: string;
  };
  creator?: {
    username?: string;
    avatar_url?: string;
    avatar?: string;
    id?: string;
  };
}

// Make sure to export BattleVideo interface
export interface BattleVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  votes: number;
  isLive: boolean;
  viewerCount: number;
  url?: string;
  description?: string;
}

// Adding Product type reference from product.types.ts
import { Product } from './product.types';

// New interfaces to support shop components
export interface LimitedOffer {
  id: string;
  product: Product;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface LiveSeller {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  avatar_url?: string;
  title: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  viewers?: number;
}

// Interfaces for payment methods and shop profile
export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface ShopProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  categories: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  policies: {
    returns: string;
    shipping: string;
    privacy: string;
  };
}

export interface SellerWallet {
  id: string;
  balance: number;
  pendingAmount: number;
  currency: string;
  transactions: {
    id: string;
    amount: number;
    type: string;
    status: string;
    date: string;
    description: string;
  }[];
}
