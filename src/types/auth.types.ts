
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role?: string;
  tokens?: string[];
}

export type UserRole = 
  | "user" 
  | "admin" 
  | "seller" 
  | "moderator" 
  | "creator" 
  | "streamer";

export interface NotificationPreferences {
  battles: boolean;
  orders: boolean;
  messages: boolean;
  followers: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "paypal" | "wallet";
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  roles: UserRole[];
  coins: number;
  followers: number;
  following: number;
  interests?: string[];
  stream_key?: string;
  shop_name?: string;
  payment_methods: PaymentMethod[];
  notification_preferences: NotificationPreferences;
}

export interface AuthContextType {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, username: string, password: string, role?: UserRole) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  addPaymentMethod: (method: any) => Promise<boolean>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  requiresAuth: (action: () => void, redirectUrl?: string) => void;
  session: any;
  isAdmin: () => boolean;
  hasRole: (role: UserRole | string) => boolean;
}
