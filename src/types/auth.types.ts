
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
