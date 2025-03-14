
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  coins: number;
  role?: string;
  followers?: number;
  following?: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>; // Updated return type from void to any
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}
