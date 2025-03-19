
import { Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'seller' | 'moderator';

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  name?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  roles: UserRole[];
  created_at?: string;
  updated_at?: string;
  followers: number;
  following: number;
  coins: number;
  payment_methods: PaymentMethod[];
  is_verified?: boolean;
  seller_info?: {
    shop_name?: string;
    shop_description?: string;
    shipping_address?: string;
    tax_id?: string;
  };
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: Error | null;
  
  // Login methods
  signIn: (email: string, password: string) => Promise<{ error: any; }>;
  signUp: (email: string, username: string, password: string, role?: UserRole) => Promise<{ error: any; }>;
  signOut: () => Promise<void>;
  
  // Renamed to be more consistent
  login: (email: string, password: string) => Promise<{ data: any; error: any; }>;
  register: (email: string, username: string, password: string, role?: UserRole) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  addPaymentMethod: (method: any) => Promise<boolean>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  
  // Auth helpers
  requiresAuth: () => void;
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
}
