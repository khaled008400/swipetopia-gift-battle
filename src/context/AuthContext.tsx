import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  loading: false,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => null,
  register: async () => ({}),
  logout: async () => {},
  updateProfile: async () => false,
  addPaymentMethod: async () => false,
  removePaymentMethod: async () => false,
  requiresAuth: () => {},
  session: null,
  isAdmin: () => false,
  hasRole: () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  supabaseClient: any;
  session: Session | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  supabaseClient,
  session,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!session);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            setError(new Error(profileError.message));
          }

          setUser(profile || null);
        } catch (err: any) {
          console.error("Unexpected error fetching profile:", err);
          setError(new Error(err.message || "Failed to load user profile"));
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, supabaseClient]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(new Error(error.message));
        return { error };
      }
      setUser(data.user as any);
      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) {
        setError(new Error(error.message));
        return { error };
      }
      setUser(data.user as any);
      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(new Error(err.message));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      setUser(data.user as any);
      setIsAuthenticated(true);
      return data;
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            roles: ['user'] as UserRole[]
          }
        }
      });

      if (error) throw new Error(error.message);

      await supabaseClient
        .from('profiles')
        .insert([
          { id: data.user?.id, username, email: data.user?.email, roles: ['user'] as UserRole[] }
        ]);

      setUser(data.user as any);
      setIsAuthenticated(true);
      return data;
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Registration error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const addPaymentMethod = async (method: any) => {
    return true;
  };

  const removePaymentMethod = async (id: string) => {
    return true;
  };

  const isAdmin = () => {
    if (!user) {
      // If no user is authenticated, check localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.roles && 
             (parsedUser.roles.includes('admin') || parsedUser.roles.includes('owner'))) {
            console.log("Admin detected from localStorage", parsedUser.roles);
            return true;
          }
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
      return false;
    }
    
    // Check if user has admin role directly in the user object
    const hasAdminRole = 
      (user.roles && (user.roles.includes('admin') || user.roles.includes('owner'))) || 
      user.role === 'admin' || 
      user.role === 'owner';
    
    console.log("Checking admin status from user object:", hasAdminRole, user.roles);
    
    return hasAdminRole;
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    return user.roles?.includes(role) || user.role === role;
  };

  const requiresAuth = (action: () => void, redirectUrl?: string) => {
    if (user) {
      action();
    } else {
      console.log('Authentication required, redirecting to', redirectUrl || '/login');
    }
  };

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(new Error(err.message));
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    requiresAuth,
    isAdmin,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
