
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  coins: number;
  followers: number;
  following: number;
}

// For development mode - simulates successful authentication
const MOCK_USER: AppUser = {
  id: "mock-user-123",
  username: "demouser",
  email: "demo@example.com",
  avatar: "/placeholder.svg",
  coins: 500,
  followers: 120,
  following: 45
};

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

const mapUser = (user: User | null, profile?: any): AppUser | null => {
  if (!user) return null;

  return {
    id: user.id,
    username: profile?.username || user.email?.split('@')[0] || 'user',
    email: user.email || '',
    avatar: profile?.avatar_url || '/placeholder.svg',
    coins: profile?.coins || 0,
    followers: profile?.followers || 0,
    following: profile?.following || 0
  };
};

const AuthService = {
  async login(credentials: LoginCredentials) {
    try {
      // Try real login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      const mappedUser = mapUser(data.user, profileData);
      
      // Store user data in localStorage
      if (mappedUser) {
        localStorage.setItem('user', JSON.stringify(mappedUser));
      }

      return {
        user: mappedUser as AppUser,
        token: data.session?.access_token
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // In development, allow mock login if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock login for development. In production, this would fail.");
        const mockResponse = {
          token: "mock-token-for-development",
          user: MOCK_USER
        };
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        return mockResponse;
      }
      
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          }
        }
      });

      if (error) throw error;

      // Create profile entry if it doesn't exist
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user?.id,
          username: data.username,
          avatar_url: '/placeholder.svg',
          coins: 0
        })
        .select()
        .single();

      if (profileError) console.error('Profile creation error:', profileError);

      const mappedUser = mapUser(authData.user, profileData);
      
      // Store user data in localStorage
      if (mappedUser) {
        localStorage.setItem('user', JSON.stringify(mappedUser));
      }

      return {
        user: mappedUser as AppUser,
        token: authData.session?.access_token
      };
    } catch (error) {
      console.error('Register error:', error);
      
      // In development, allow mock registration if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock registration for development. In production, this would fail.");
        const mockUser = {
          ...MOCK_USER,
          username: data.username,
          email: data.email
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return {
          token: "mock-token-for-development",
          user: mockUser
        };
      }
      
      throw error;
    }
  },

  async logout() {
    try {
      // Logout from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  async getProfile() {
    try {
      const user = supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await user).data.user?.id)
        .single();

      if (error) throw error;

      return { 
        user: mapUser((await user).data.user, data) 
      };
    } catch (error) {
      console.error('Get profile error:', error);
      
      // In development, return mock profile if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock profile for development. In production, this would fail.");
        return { user: MOCK_USER };
      }
      
      throw error;
    }
  }
};

export default AuthService;
