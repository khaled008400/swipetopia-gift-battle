
export type UserRole = 'admin' | 'user' | 'seller' | 'streamer' | 'moderator';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  roles?: UserRole[];
  role?: string;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
  coins?: number;
  stream_key?: string;
  verified?: boolean;
  payment_methods?: any[];
}

export interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, username: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  addPaymentMethod: (method: any) => Promise<boolean>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  requiresAuth: (action: () => void, redirectUrl?: string) => void;
}
