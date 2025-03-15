
export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  roles?: string[];
  shop_name?: string;
  stream_key?: string;
  coins?: number;
  followers?: number;
  following?: number;
  email?: string;
}

export type UserRole = 'user' | 'admin' | 'streamer' | 'seller' | 'moderator';

export interface NotificationPreferences {
  battles: boolean;
  orders: boolean;
  messages: boolean;
  followers: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  name?: string;
  isDefault: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
