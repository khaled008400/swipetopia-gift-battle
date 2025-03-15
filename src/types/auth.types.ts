
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
  payment_methods?: PaymentMethod[];
  notification_preferences?: NotificationPreferences;
}

export type UserRole = 'user' | 'admin' | 'streamer' | 'seller' | 'moderator' | 'viewer';

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
  
  // Added missing methods/properties
  isAuthenticated?: boolean;
  isLoading?: boolean;
  login?: (email: string, password: string) => Promise<any>;
  signup?: (email: string, username: string, password: string, roles?: UserRole[]) => Promise<void>;
  logout?: () => Promise<void>;
  isAdmin?: () => boolean;
  hasRole?: (role: UserRole) => boolean;
  requiresAuth?: (action: () => void, redirectUrl?: string) => void;
  session?: any;
}
