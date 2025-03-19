import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          await fetchUserProfile(currentSession.user.id);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (profile) {
        console.log("Profile fetched:", profile);
        setUser(profile as UserProfile);
      } else {
        console.log("No profile found for user:", userId);
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log(`Attempting to login with: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }
      
      console.log("Login successful:", data);
      setIsAuthenticated(true);
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      
      return { error: null };
    } catch (err: any) {
      console.error("Login error:", err);
      setError(new Error(err.message));
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      // First check if username already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
      
      if (checkError) throw new Error(checkError.message);
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username is already taken");
      }
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            roles: [role]
          }
        }
      });

      if (error) throw new Error(error.message);

      // Create profile
      if (data.user) {
        await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              username, 
              email, 
              roles: [role],
              coins: 1000,
              followers: 0,
              following: 0
            }
          ]);
      }

      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Registration error:", err);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Logout error:", err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
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
    if (!user) return false;
    
    try {
      // Clone the current payment methods array
      const updatedPaymentMethods = [...user.payment_methods, method];
      
      // Update the profile with the new payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        payment_methods: updatedPaymentMethods
      } : null);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const removePaymentMethod = async (id: string) => {
    if (!user) return false;
    
    try {
      // Filter out the payment method to be removed
      const updatedPaymentMethods = user.payment_methods.filter(method => method.id !== id);
      
      // Update the profile with the filtered payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        payment_methods: updatedPaymentMethods
      } : null);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn: login,
    signUp: register,
    signOut: logout,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    requiresAuth: () => {},
    isAdmin: () => user?.roles?.includes('admin') || false,
    hasRole: (role) => user?.roles?.includes(role as UserRole) || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
