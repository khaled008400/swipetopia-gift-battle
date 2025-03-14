
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "user" | "seller" | "streamer" | "admin";

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  name: string;
  last4?: string;
  isDefault?: boolean;
}

export interface NotificationPreferences {
  battles: boolean;
  orders: boolean;
  messages: boolean;
  followers: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  coins: number;
  roles: UserRole[];
  bio?: string;
  location?: string;
  followers?: number;
  following?: number;
  interests?: string[];
  shop_name?: string;
  stream_key?: string;
  payment_methods?: PaymentMethod[];
  notification_preferences?: NotificationPreferences;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, roles?: UserRole[]) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  hasRole: (role: UserRole) => boolean;
}
